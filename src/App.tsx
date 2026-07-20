import { useState, useMemo, useEffect } from 'react';
import { Network, Sparkles, HelpCircle } from 'lucide-react';
import { PRESET_NETWORKS } from './data/presets';
import { LayoutType, PersonNode, RelationshipEdge, GraphMetrics } from './types';
import GraphControls from './components/GraphControls';
import Sidebar from './components/Sidebar';
import NetworkGraph from './components/NetworkGraph';

export default function App() {
  // Preset selector
  const [currentPresetId, setCurrentPresetId] = useState('chang-wan-chuan-network');
  
  // Graph elements states
  const [nodes, setNodes] = useState<PersonNode[]>([]);
  const [edges, setEdges] = useState<RelationshipEdge[]>([]);
  
  // Layout states
  const [layoutType, setLayoutType] = useState<LayoutType>('cose');
  
  // Active selection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shortest path states
  const [pathNodeIds, setPathNodeIds] = useState<string[]>([]);
  const [pathEdgeIds, setPathEdgeIds] = useState<string[]>([]);
  
  // Custom interactive tutorial status overlay
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Custom visual toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Populate initial dataset
  useEffect(() => {
    const defaultPreset = PRESET_NETWORKS.find((p) => p.id === 'chang-wan-chuan-network');
    if (defaultPreset) {
      setNodes(defaultPreset.nodes);
      setEdges(defaultPreset.edges);
    }
  }, []);

  // Sync preset changes
  const handleSelectPreset = (presetId: string) => {
    const selected = PRESET_NETWORKS.find((p) => p.id === presetId);
    if (selected) {
      setCurrentPresetId(presetId);
      setNodes(selected.nodes);
      setEdges(selected.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setPathNodeIds([]);
      setPathEdgeIds([]);
      triggerToast(`Loaded the ${selected.name} template.`);
    }
  };

  // Reset to original preset state
  const handleResetToPreset = () => {
    const original = PRESET_NETWORKS.find((p) => p.id === currentPresetId);
    if (original) {
      setNodes(original.nodes);
      setEdges(original.edges);
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setPathNodeIds([]);
      setPathEdgeIds([]);
      triggerToast(`Reset back to default ${original.name} network.`);
    }
  };

  // Export elements payload
  const handleExportJSON = () => {
    const payload = { nodes, edges };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    triggerToast("Graph configuration copied to clipboard!");
  };

  // Selection handlers
  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  };

  const handleSelectEdge = (edgeId: string) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
  };

  const handleClearSelection = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  // Elements operations: Add, Edit, Delete
  const handleAddNode = (newNode: Omit<PersonNode, 'id'>) => {
    const id = `node-custom-${Date.now()}`;
    const nodeObj: PersonNode = { ...newNode, id };
    setNodes((prev) => [...prev, nodeObj]);
    triggerToast(`Added ${newNode.label} to the network.`);
  };

  const handleAddEdge = (newEdge: Omit<RelationshipEdge, 'id'>) => {
    // Prevent duplicate edges between the same source and target
    const duplicate = edges.some(
      (e) =>
        (e.source === newEdge.source && e.target === newEdge.target) ||
        (e.source === newEdge.target && e.target === newEdge.source)
    );
    if (duplicate) {
      triggerToast("A connection already exists between these individuals.");
      return;
    }

    const id = `edge-custom-${Date.now()}`;
    const edgeObj: RelationshipEdge = { ...newEdge, id };
    setEdges((prev) => [...prev, edgeObj]);
    triggerToast(`Established link: ${newEdge.label}.`);
  };

  const handleUpdateNode = (id: string, updatedFields: Partial<PersonNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updatedFields } : n)));
    triggerToast("Person profile updated successfully.");
  };

  const handleUpdateEdge = (id: string, updatedFields: Partial<RelationshipEdge>) => {
    setEdges((prev) => prev.map((e) => (e.id === id ? { ...e, ...updatedFields } : e)));
    triggerToast("Relationship connection line updated.");
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    // Cascade delete any edges connected to this deleted node
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    setSelectedNodeId(null);
    
    // Clear path if it involved this deleted node
    if (pathNodeIds.includes(id)) {
      setPathNodeIds([]);
      setPathEdgeIds([]);
    }
    triggerToast("Person profile and associated links removed.");
  };

  const handleDeleteEdge = (id: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== id));
    setSelectedEdgeId(null);

    // Clear path if it involved this deleted edge
    if (pathEdgeIds.includes(id)) {
      setPathNodeIds([]);
      setPathEdgeIds([]);
    }
    triggerToast("Relationship link severed.");
  };

  // Search filter node IDs
  const { highlightedNodeIds, highlightedEdgeIds } = useMemo(() => {
    if (!searchQuery.trim()) return { highlightedNodeIds: [], highlightedEdgeIds: [] };

    const query = searchQuery.toLowerCase();
    const nodeIds = nodes
      .filter(
        (n) =>
          n.label.toLowerCase().includes(query) ||
          n.role.toLowerCase().includes(query) ||
          n.company.toLowerCase().includes(query)
      )
      .map((n) => n.id);

    // Also highlight edges connected to highlighted nodes
    const edgeIds = edges
      .filter((e) => nodeIds.includes(e.source) || nodeIds.includes(e.target))
      .map((e) => e.id);

    return { highlightedNodeIds: nodeIds, highlightedEdgeIds: edgeIds };
  }, [searchQuery, nodes, edges]);

  // Shortest Path Finder BFS Algorithm
  const handleFindPath = (startId: string, endId: string) => {
    if (startId === endId) {
      triggerToast("Cannot find path: Start and target are the same person.");
      return;
    }

    // Build adjacency list (treating edges as undirected for social traversal)
    const adj: Record<string, { nodeId: string; edgeId: string }[]> = {};
    nodes.forEach((n) => (adj[n.id] = []));
    
    edges.forEach((e) => {
      if (adj[e.source]) adj[e.source].push({ nodeId: e.target, edgeId: e.id });
      if (adj[e.target]) adj[e.target].push({ nodeId: e.source, edgeId: e.id });
    });

    const queue: string[] = [startId];
    const visited = new Set<string>([startId]);
    const parent: Record<string, { nodeId: string; edgeId: string } | null> = { [startId]: null };

    let found = false;
    while (queue.length > 0) {
      const current = queue.shift()!;
      if (current === endId) {
        found = true;
        break;
      }

      const neighbors = adj[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.nodeId)) {
          visited.add(neighbor.nodeId);
          parent[neighbor.nodeId] = { nodeId: current, edgeId: neighbor.edgeId };
          queue.push(neighbor.nodeId);
        }
      }
    }

    if (!found) {
      triggerToast("No connected path could be found between these individuals.");
      setPathNodeIds([]);
      setPathEdgeIds([]);
      return;
    }

    // Trace path
    const pathNodes: string[] = [];
    const pathEdges: string[] = [];
    let curr = endId;
    pathNodes.push(curr);

    while (parent[curr] !== null) {
      const p = parent[curr]!;
      pathEdges.push(p.edgeId);
      pathNodes.push(p.nodeId);
      curr = p.nodeId;
    }

    setPathNodeIds(pathNodes.reverse());
    setPathEdgeIds(pathEdges.reverse());
    triggerToast("Trace complete: Connected path highlighted!");
  };

  const handleClearPath = () => {
    setPathNodeIds([]);
    setPathEdgeIds([]);
  };

  // Network Analytics calculation
  const metrics: GraphMetrics = useMemo(() => {
    const nodeCount = nodes.length;
    const edgeCount = edges.length;
    const avgDegree = nodeCount > 0 ? (2 * edgeCount) / nodeCount : 0;
    const density = nodeCount > 1 ? (2 * edgeCount) / (nodeCount * (nodeCount - 1)) : 0;

    return {
      nodeCount,
      edgeCount,
      avgDegree,
      density,
    };
  }, [nodes, edges]);

  return (
    <div className="flex flex-col h-screen bg-[#F0F2F5] font-sans text-slate-800 antialiased p-4 gap-4 overflow-hidden" id="main-app-container">
      
      {/* Dynamic Header Navbar 
      <header className="bg-white border border-slate-200/50 px-6 py-3.5 flex items-center justify-between shadow-md shadow-slate-200/20 rounded-2xl shrink-0" id="header-bar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Network className="h-5.5 w-5.5" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-2">
              People Social Network Graph
              <span className="text-[10px] bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-600 font-extrabold uppercase tracking-wider hidden sm:inline-block">
                Interactive
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Explore, trace, and expand social connection maps</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 text-slate-600 rounded-xl flex items-center gap-1.5 text-xs font-bold cursor-pointer transition-colors"
            id="btn-help-modal"
          >
            <HelpCircle className="h-4 w-4 text-indigo-500" />
            <span className="hidden sm:inline">Guide</span>
          </button>
        </div>
      </header>
      */}

      {/* Control center & Metrics dashboard */}
      <GraphControls
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
        layoutType={layoutType}
        onChangeLayout={setLayoutType}
        metrics={metrics}
        onResetToPreset={handleResetToPreset}
        onExportJSON={handleExportJSON}
      />

      {/* Main Canvas + Sidebar Split Frame */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative gap-4" id="split-view-container">
        
        {/* Network stage (Graph Canvas) */}
        <div className="flex-1 h-full min-h-[300px] relative bg-white border border-slate-200/50 rounded-2xl shadow-md shadow-slate-200/20 overflow-hidden">
          <NetworkGraph
            nodes={nodes}
            edges={edges}
            layoutType={layoutType}
            selectedNodeId={selectedNodeId}
            selectedEdgeId={selectedEdgeId}
            highlightedNodeIds={highlightedNodeIds}
            highlightedEdgeIds={highlightedEdgeIds}
            pathNodeIds={pathNodeIds}
            pathEdgeIds={pathEdgeIds}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
            onClearSelection={handleClearSelection}
          />
        </div>

        {/* Action Sidebar */}
        <Sidebar
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onAddNode={handleAddNode}
          onAddEdge={handleAddEdge}
          onUpdateNode={handleUpdateNode}
          onUpdateEdge={handleUpdateEdge}
          onDeleteNode={handleDeleteNode}
          onDeleteEdge={handleDeleteEdge}
          onSelectNode={handleSelectNode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onFindPath={handleFindPath}
          onClearPath={handleClearPath}
          pathNodeIds={pathNodeIds}
        />
      </main>

      {/* Toast Feedback notifications banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Quick Guide Modal Overlay */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Network className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">Network Visualizer Guide</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Welcome to the <strong>People Social Network Graph Visualizer</strong>! This application utilizes Cytoscape.js and React to let you trace and interact with relationship maps.
              </p>

              <div className="space-y-2 border-t border-b border-slate-100 py-3 my-2">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <p><strong>Interactive Selection:</strong> Click on individuals (nodes) or connection lines (edges) to reveal their profile, edit their specifications, view connected peers, or sever connections.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <p><strong>Custom Nodes & Edges:</strong> Navigate to the <em>Add Element</em> tab to grow your community. Input custom roles, company labels, size, and connect them with custom relationship lines.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <p><strong>Trace Shortest Paths:</strong> Open the <em>Path Finder</em> tab to select two people. Our BFS pathfinding algorithm will trace and highlight their exact path of connection.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <p><strong>Layout Algorithms:</strong> Try switching layouts using the algorithm dropdown (e.g. Physics Force, Circular Rings, Orthogonal Tree) to see automatic spatial reorganization.</p>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Built with React, Vite, Tailwind CSS and Cytoscape.js.
              </p>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
