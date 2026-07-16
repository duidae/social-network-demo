import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import { PersonNode, RelationshipEdge, LayoutType } from '../types';

interface NetworkGraphProps {
  nodes: PersonNode[];
  edges: RelationshipEdge[];
  layoutType: LayoutType;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  highlightedNodeIds: string[];
  highlightedEdgeIds: string[];
  pathNodeIds: string[];
  pathEdgeIds: string[];
  onSelectNode: (id: string) => void;
  onSelectEdge: (id: string) => void;
  onClearSelection: () => void;
}

export default function NetworkGraph({
  nodes,
  edges,
  layoutType,
  selectedNodeId,
  selectedEdgeId,
  highlightedNodeIds,
  highlightedEdgeIds,
  pathNodeIds,
  pathEdgeIds,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
}: NetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'width': 'data(size)',
            'height': 'data(size)',
            'background-color': 'data(color)',
            'color': '#111827', // dark slate
            'font-family': '"Inter", ui-sans-serif, system-ui, sans-serif',
            'font-size': '11px',
            'font-weight': 'bold',
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'border-width': '2.5px',
            'border-color': '#ffffff',
            'transition-property': 'background-color, border-color, border-width, width, height, opacity',
            'transition-duration': 0.25,
          },
        },
        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'width': 'data(weight)',
            'line-color': 'data(color)',
            'target-arrow-color': 'data(color)',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'font-family': '"Inter", ui-sans-serif, system-ui, sans-serif',
            'font-size': '9px',
            'font-weight': 'normal',
            'color': '#4b5563', // gray-600
            'text-background-opacity': 1,
            'text-background-color': '#ffffff',
            'text-background-padding': '3px',
            'text-background-shape': 'roundrectangle',
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.25,
          },
        },
        // Selected States
        {
          selector: 'node:selected',
          style: {
            'border-width': '4px',
            'border-color': '#000000',
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'width': '6px',
            'line-color': '#111827',
          },
        },
        // Dynamic classes added programmatically
        {
          selector: '.highlighted-node',
          style: {
            'border-color': '#0EA5E9', // sky-500
            'border-width': '5px',
            'width': 'data(size)',
            'height': 'data(size)',
            'opacity': 1,
          },
        },
        {
          selector: '.highlighted-edge',
          style: {
            'line-color': '#0EA5E9',
            'width': '5px',
            'opacity': 1,
          },
        },
        {
          selector: '.path-node',
          style: {
            'border-color': '#10B981', // emerald-500
            'border-width': '5px',
            'background-color': '#10B981',
            'color': '#047857', // emerald-700
            'opacity': 1,
          },
        },
        {
          selector: '.path-edge',
          style: {
            'line-color': '#10B981',
            'width': '6px',
            'opacity': 1,
          },
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.25,
          },
        },
      ],
      layout: { name: 'cose' },
    });

    // Event handlers
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      onSelectNode(node.id());
    });

    cy.on('tap', 'edge', (evt) => {
      const edge = evt.target;
      onSelectEdge(edge.id());
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        onClearSelection();
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, []);

  // Sync elements when nodes or edges change
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Map your custom state to Cytoscape format
    const cytoscapeElements = [
      ...nodes.map((node) => ({
        group: 'nodes' as const,
        data: {
          id: node.id,
          label: node.label,
          role: node.role,
          company: node.company,
          color: node.color,
          size: node.size,
        },
      })),
      ...edges.map((edge) => ({
        group: 'edges' as const,
        data: {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          weight: Math.max(1, Math.min(5, edge.weight)) * 1.5, // slightly scale weight for visibility
          color: edge.color,
        },
      })),
    ];

    // Core element replacement and smooth anim
    cy.elements().remove();
    cy.add(cytoscapeElements);

    // Apply layout
    applyLayout();
  }, [nodes, edges]);

  // Handle selected state updates in cytoscape instance
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.elements().unselect();

    if (selectedNodeId) {
      const el = cy.getElementById(selectedNodeId);
      if (el.length > 0) {
        el.select();
      }
    } else if (selectedEdgeId) {
      const el = cy.getElementById(selectedEdgeId);
      if (el.length > 0) {
        el.select();
      }
    }
  }, [selectedNodeId, selectedEdgeId]);

  // Apply classes for Search Highlight and Shortest Path finding
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    // Reset classes
    cy.elements().removeClass('highlighted-node');
    cy.elements().removeClass('highlighted-edge');
    cy.elements().removeClass('path-node');
    cy.elements().removeClass('path-edge');
    cy.elements().removeClass('dimmed');

    const hasHighlights = highlightedNodeIds.length > 0 || highlightedEdgeIds.length > 0;
    const hasPath = pathNodeIds.length > 0 || pathEdgeIds.length > 0;

    if (hasPath) {
      // Shortest path takes styling precedence
      cy.elements().addClass('dimmed');

      pathNodeIds.forEach((id) => {
        const el = cy.getElementById(id);
        el.removeClass('dimmed');
        el.addClass('path-node');
      });

      pathEdgeIds.forEach((id) => {
        const el = cy.getElementById(id);
        el.removeClass('dimmed');
        el.addClass('path-edge');
      });
    } else if (hasHighlights) {
      // Search highlight styling
      cy.elements().addClass('dimmed');

      highlightedNodeIds.forEach((id) => {
        const el = cy.getElementById(id);
        el.removeClass('dimmed');
        el.addClass('highlighted-node');
      });

      highlightedEdgeIds.forEach((id) => {
        const el = cy.getElementById(id);
        el.removeClass('dimmed');
        el.addClass('highlighted-edge');
      });
    }
  }, [highlightedNodeIds, highlightedEdgeIds, pathNodeIds, pathEdgeIds]);

  // Run layout animation
  const applyLayout = () => {
    const cy = cyRef.current;
    if (!cy) return;

    let layoutConfig: cytoscape.LayoutOptions;

    switch (layoutType) {
      case 'grid':
        layoutConfig = { name: 'grid', animate: true, animationDuration: 500 };
        break;
      case 'circular':
        layoutConfig = { name: 'circle', animate: true, animationDuration: 500 };
        break;
      case 'concentric':
        layoutConfig = { name: 'concentric', animate: true, animationDuration: 500 };
        break;
      case 'breadthfirst':
        layoutConfig = { name: 'breadthfirst', animate: true, animationDuration: 500 };
        break;
      case 'random':
        layoutConfig = { name: 'random', animate: true, animationDuration: 500 };
        break;
      case 'cose':
      default:
        layoutConfig = {
          name: 'cose',
          animate: true,
          animationDuration: 600,
          refresh: 20,
          fit: true,
          padding: 50,
          randomize: false,
          nodeRepulsion: () => 4500,
          idealEdgeLength: () => 100,
          edgeElasticity: () => 100,
          nestingFactor: 1.2,
          gravity: 1,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0,
        } as cytoscape.CoseLayoutOptions;
        break;
    }

    try {
      const layout = cy.layout(layoutConfig);
      layout.run();
    } catch (e) {
      console.error("Layout failed to run:", e);
    }
  };

  // Trigger layout when layoutType changes
  useEffect(() => {
    applyLayout();
  }, [layoutType]);

  // Zoom controls helper functions
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() + 0.15);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() - 0.15);
  const handleFit = () => cyRef.current?.fit(undefined, 50);

  return (
    <div className="relative w-full h-full bg-white vibrant-grid-bg overflow-hidden" id="graph-stage-container">
      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full" id="cytoscape-canvas" />

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200/85 shadow-lg shadow-slate-100/50">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
          id="btn-zoom-in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
          id="btn-zoom-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </button>
        <div className="w-px h-4 bg-slate-200 mx-1" />
        <button
          onClick={handleFit}
          title="Fit Graph"
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
          id="btn-zoom-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          Fit View
        </button>
      </div>

      {/* Floating Network Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200/85 shadow-lg shadow-slate-100/50 text-xs space-y-2 pointer-events-none md:block hidden">
        <div className="font-extrabold text-slate-800 mb-1.5 uppercase tracking-wider text-[10px] text-indigo-500">Visual Legend</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
          <span className="text-slate-600 font-semibold">Executive / Leader</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block shadow-sm" />
          <span className="text-slate-600 font-semibold">Engineer / Specialist</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block shadow-sm" />
          <span className="text-slate-600 font-semibold">Frontend / Creative</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block shadow-sm" />
          <span className="text-slate-600 font-semibold">Design / Product</span>
        </div>
        <div className="w-full h-px bg-slate-100 my-1" />
        <div className="flex items-center gap-2">
          <span className="w-6 h-0.5 bg-slate-300 border-t border-dashed inline-block" />
          <span className="text-slate-500 font-medium">Thickness = Connection strength</span>
        </div>
      </div>
    </div>
  );
}
