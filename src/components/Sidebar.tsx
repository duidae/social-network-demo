import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  Link2,
  Trash2,
  Edit3,
  Search,
  Compass,
  Users,
  Check,
  ChevronRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { PersonNode, RelationshipEdge } from '../types';

interface SidebarProps {
  nodes: PersonNode[];
  edges: RelationshipEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onAddNode: (node: Omit<PersonNode, 'id'>) => void;
  onAddEdge: (edge: Omit<RelationshipEdge, 'id'>) => void;
  onUpdateNode: (id: string, updated: Partial<PersonNode>) => void;
  onUpdateEdge: (id: string, updated: Partial<RelationshipEdge>) => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
  onSelectNode: (id: string) => void;
  // Search query support
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Shortest path props
  onFindPath: (startId: string, endId: string) => void;
  onClearPath: () => void;
  pathNodeIds: string[];
}

export default function Sidebar({
  nodes,
  edges,
  selectedNodeId,
  selectedEdgeId,
  onAddNode,
  onAddEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onSelectNode,
  searchQuery,
  setSearchQuery,
  onFindPath,
  onClearPath,
  pathNodeIds,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'add' | 'path'>('details');

  // Node editing state
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [editNodeName, setEditNodeName] = useState('');
  const [editNodeRole, setEditNodeRole] = useState('');
  const [editNodeCompany, setEditNodeCompany] = useState('');
  const [editNodeBio, setEditNodeBio] = useState('');
  const [editNodeColor, setEditNodeColor] = useState('');
  const [editNodeSize, setEditNodeSize] = useState(40);

  // Edge editing state
  const [isEditingEdge, setIsEditingEdge] = useState(false);
  const [editEdgeLabel, setEditEdgeLabel] = useState('');
  const [editEdgeWeight, setEditEdgeWeight] = useState(3);

  // Add Node state
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeRole, setNewNodeRole] = useState('');
  const [newNodeCompany, setNewNodeCompany] = useState('');
  const [newNodeBio, setNewNodeBio] = useState('');
  const [newNodeGender, setNewNodeGender] = useState<'male' | 'female' | 'other'>('male');
  const [newNodeColor, setNewNodeColor] = useState('#2563EB'); // Default blue-600
  const [newNodeSize, setNewNodeSize] = useState(40);

  // Add Edge state
  const [newEdgeSource, setNewEdgeSource] = useState('');
  const [newEdgeTarget, setNewEdgeTarget] = useState('');
  const [newEdgeLabel, setNewEdgeLabel] = useState('Friend');
  const [newEdgeWeight, setNewEdgeWeight] = useState(3);

  // Pathfinding state
  const [pathStartId, setPathStartId] = useState('');
  const [pathEndId, setPathEndId] = useState('');

  // Selected item calculations
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  // Get current node connections
  const connectedEdges = selectedNodeId
    ? edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
    : [];

  const connections = connectedEdges.map((edge) => {
    const isSource = edge.source === selectedNodeId;
    const connectedNodeId = isSource ? edge.target : edge.source;
    const connectedNode = nodes.find((n) => n.id === connectedNodeId);
    return {
      node: connectedNode,
      relationship: edge.label,
      edgeId: edge.id,
    };
  }).filter((conn) => conn.node !== undefined) as { node: PersonNode; relationship: string; edgeId: string }[];

  // Sync edit forms when selection changes
  useEffect(() => {
    if (selectedNode) {
      setEditNodeName(selectedNode.label);
      setEditNodeRole(selectedNode.role);
      setEditNodeCompany(selectedNode.company);
      setEditNodeBio(selectedNode.bio);
      setEditNodeColor(selectedNode.color);
      setEditNodeSize(selectedNode.size);
      setIsEditingNode(false);
      setActiveTab('details');
    }
  }, [selectedNodeId]);

  useEffect(() => {
    if (selectedEdge) {
      setEditEdgeLabel(selectedEdge.label);
      setEditEdgeWeight(selectedEdge.weight);
      setIsEditingEdge(false);
      setActiveTab('details');
    }
  }, [selectedEdgeId]);

  // Handle Add Node submit
  const handleAddNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    onAddNode({
      label: newNodeName,
      role: newNodeRole || 'Individual',
      company: newNodeCompany || 'Independent',
      bio: newNodeBio || 'No biography details provided.',
      gender: newNodeGender,
      color: newNodeColor,
      size: newNodeSize,
      avatarSeed: newNodeName.toLowerCase().replace(/\s+/g, '-'),
    });

    // Reset fields
    setNewNodeName('');
    setNewNodeRole('');
    setNewNodeCompany('');
    setNewNodeBio('');
    setNewNodeSize(40);
    setActiveTab('details');
  };

  // Handle Add Edge submit
  const handleAddEdgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEdgeSource || !newEdgeTarget || newEdgeSource === newEdgeTarget) return;

    // Pick source node's theme color or default
    const sourceNode = nodes.find(n => n.id === newEdgeSource);
    const edgeColor = sourceNode ? sourceNode.color : '#64748b';

    onAddEdge({
      source: newEdgeSource,
      target: newEdgeTarget,
      label: newEdgeLabel,
      weight: newEdgeWeight,
      color: edgeColor,
    });

    // Reset
    setNewEdgeSource('');
    setNewEdgeTarget('');
    setNewEdgeLabel('Friend');
    setNewEdgeWeight(3);
    setActiveTab('details');
  };

  // Handle Update Node submit
  const handleUpdateNodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId || !editNodeName.trim()) return;

    onUpdateNode(selectedNodeId, {
      label: editNodeName,
      role: editNodeRole,
      company: editNodeCompany,
      bio: editNodeBio,
      color: editNodeColor,
      size: editNodeSize,
    });
    setIsEditingNode(false);
  };

  // Handle Update Edge submit
  const handleUpdateEdgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEdgeId || !editEdgeLabel.trim()) return;

    onUpdateEdge(selectedEdgeId, {
      label: editEdgeLabel,
      weight: editEdgeWeight,
    });
    setIsEditingEdge(false);
  };

  // Quick Preset colors for node designer
  const THEME_COLORS = [
    { value: '#E11D48', name: 'Rose' },
    { value: '#2563EB', name: 'Blue' },
    { value: '#16A34A', name: 'Green' },
    { value: '#7C3AED', name: 'Violet' },
    { value: '#EA580C', name: 'Orange' },
    { value: '#0D9488', name: 'Teal' },
    { value: '#CA8A04', name: 'Gold' },
    { value: '#4F46E5', name: 'Indigo' },
  ];

  return (
    <div className="w-full lg:w-[380px] bg-white rounded-2xl border border-slate-200/50 shadow-md shadow-slate-200/20 flex flex-col h-full overflow-hidden" id="sidebar-container">
      {/* Search Input Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-col gap-2" id="search-bar-container">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Network</label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search person or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all bg-slate-50/60"
            id="input-network-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs font-medium text-slate-400 hover:text-indigo-600 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl m-3 mb-1" id="sidebar-tabs-container">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'details'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          id="tab-details"
        >
          <Info className="h-3.5 w-3.5" />
          Selection
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'add'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          id="tab-add"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Element
        </button>
        <button
          onClick={() => setActiveTab('path')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'path'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-800'
          }`}
          id="tab-path"
        >
          <Compass className="h-3.5 w-3.5" />
          Path Finder
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="sidebar-tab-content">
        {/* TAB 1: DETAILS */}
        {activeTab === 'details' && (
          <div className="space-y-4" id="panel-details">
            {selectedNode ? (
              <div className="space-y-4" id="selected-node-details">
                {/* Header Profile Summary */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center text-center relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 w-full h-1.5"
                    style={{ backgroundColor: selectedNode.color }}
                  />
                  {/* Custom Initial Avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white mb-3"
                    style={{ backgroundColor: selectedNode.color }}
                  >
                    {selectedNode.label.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedNode.label}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">{selectedNode.role}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedNode.company}</p>
                </div>

                {/* Edit Toggle & Display */}
                {!isEditingNode ? (
                  <div className="space-y-3">
                    {/* Biography */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biography</h4>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {selectedNode.bio}
                      </p>
                    </div>

                    {/* Meta Specifications */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Gender Accent</span>
                        <span className="text-xs font-semibold text-slate-700 capitalize">{selectedNode.gender}</span>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Visual Size</span>
                        <span className="text-xs font-semibold text-slate-700">{selectedNode.size}px</span>
                      </div>
                    </div>

                    {/* Immediate Connections Trail */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Immediate Connections ({connections.length})
                      </h4>
                      {connections.length > 0 ? (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {connections.map((conn) => (
                            <button
                              key={conn.edgeId}
                              onClick={() => onSelectNode(conn.node.id)}
                              className="w-full flex items-center justify-between p-2 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all text-left text-xs cursor-pointer group"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-2.5 h-2.5 rounded-full block flex-shrink-0"
                                  style={{ backgroundColor: conn.node.color }}
                                />
                                <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                                  {conn.node.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-500 font-medium">
                                <span>{conn.relationship}</span>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic bg-slate-50/50 p-3 rounded-xl text-center border border-dashed border-slate-200">
                          This person has no connected social relationships yet.
                        </p>
                      )}
                    </div>

                    {/* Node Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setIsEditingNode(true)}
                        className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        Edit Profile
                      </button>
                      <button
                        onClick={() => onDeleteNode(selectedNode.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit Node Form
                  <form onSubmit={handleUpdateNodeSubmit} className="space-y-3 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Edit Profile Specs</h4>
                      <button
                        type="button"
                        onClick={() => setIsEditingNode(false)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editNodeName}
                        onChange={(e) => setEditNodeName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Role / Job Title</label>
                      <input
                        type="text"
                        value={editNodeRole}
                        onChange={(e) => setEditNodeRole(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Company / Group</label>
                      <input
                        type="text"
                        value={editNodeCompany}
                        onChange={(e) => setEditNodeCompany(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Short Bio</label>
                      <textarea
                        value={editNodeBio}
                        onChange={(e) => setEditNodeBio(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white h-20 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Node Size ({editNodeSize}px)</label>
                        <input
                          type="range"
                          min="30"
                          max="60"
                          value={editNodeSize}
                          onChange={(e) => setEditNodeSize(Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1 font-sans">Profile Accent</label>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {THEME_COLORS.map((c) => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => setEditNodeColor(c.value)}
                              className={`w-4 h-4 rounded-full border border-white cursor-pointer ${
                                editNodeColor === c.value ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-85 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c.value }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                )}
              </div>
            ) : selectedEdge ? (
              <div className="space-y-4" id="selected-edge-details">
                {/* Edge Header Relationship Details */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 relative overflow-hidden text-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Social Relationship Connection
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-xs font-bold text-slate-800">
                      {nodes.find((n) => n.id === selectedEdge.source)?.label || 'Person A'}
                    </div>
                    <div className="flex flex-col items-center px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold border border-indigo-100">
                      {selectedEdge.label}
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {nodes.find((n) => n.id === selectedEdge.target)?.label || 'Person B'}
                    </div>
                  </div>
                </div>

                {!isEditingEdge ? (
                  <div className="space-y-3">
                    {/* Statistics */}
                    <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Relationship Type</span>
                        <span className="font-bold text-slate-700">{selectedEdge.label}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Connection Strength</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full inline-block ${
                                i < selectedEdge.weight ? 'bg-indigo-500' : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Edge Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setIsEditingEdge(true)}
                        className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                        Modify Link
                      </button>
                      <button
                        onClick={() => onDeleteEdge(selectedEdge.id)}
                        className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove Connection
                      </button>
                    </div>
                  </div>
                ) : (
                  // Edit Edge Form
                  <form onSubmit={handleUpdateEdgeSubmit} className="space-y-3 bg-slate-50/50 border border-slate-100 p-3.5 rounded-2xl">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Edit Link Details</h4>
                      <button
                        type="button"
                        onClick={() => setIsEditingEdge(false)}
                        className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Relationship Type</label>
                      <select
                        value={editEdgeLabel}
                        onChange={(e) => setEditEdgeLabel(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Family">Family</option>
                        <option value="Partner">Partner</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Classmate">Classmate</option>
                        <option value="Co-Organizer">Co-Organizer</option>
                        <option value="Advises">Advises</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Link Weight / Strength ({editEdgeWeight} of 5)
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={editEdgeWeight}
                        onChange={(e) => setEditEdgeWeight(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 leading-none">Controls the visual thickness of connection lines.</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Update Connection Line
                    </button>
                  </form>
                )}
              </div>
            ) : (
              // Empty State (No selection)
              <div className="text-center py-12 px-4 space-y-4" id="empty-details-state">
                <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-800 text-sm">No Active Selection</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Click any person (node) or connection line (edge) on the graph canvas to view details, modify attributes, or delete them.
                  </p>
                </div>
                <div className="border border-slate-100 bg-slate-50/50 p-3.5 rounded-2xl text-left text-xs space-y-1.5">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                    How to interact?
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500">
                    <li><strong className="text-slate-600">Left-Click & Drag:</strong> Move people around.</li>
                    <li><strong className="text-slate-600">Scroll:</strong> Zoom in and out.</li>
                    <li><strong className="text-slate-600">Select:</strong> Highlights connections and opens details panels.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ADD ELEMENT */}
        {activeTab === 'add' && (
          <div className="space-y-4" id="panel-add">
            {/* Subsection A: Create Person Node */}
            <div className="space-y-3 bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Users className="h-4 w-4 text-indigo-500" />
                Add New Person
              </h3>

              <form onSubmit={handleAddNodeSubmit} className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Miller"
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Role / Position</label>
                    <input
                      type="text"
                      placeholder="e.g. Engineer"
                      value={newNodeRole}
                      onChange={(e) => setNewNodeRole(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Company / Group</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Tech"
                      value={newNodeCompany}
                      onChange={(e) => setNewNodeCompany(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Short Biography</label>
                  <textarea
                    placeholder="Write a tiny bio or fun fact about them..."
                    value={newNodeBio}
                    onChange={(e) => setNewNodeBio(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white h-16 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Size ({newNodeSize}px)</label>
                    <input
                      type="range"
                      min="30"
                      max="60"
                      value={newNodeSize}
                      onChange={(e) => setNewNodeSize(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Accent Color</label>
                    <div className="flex flex-wrap gap-1">
                      {THEME_COLORS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setNewNodeColor(c.value)}
                          className={`w-4.5 h-4.5 rounded-full border border-white cursor-pointer ${
                            newNodeColor === c.value ? 'ring-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Create Person Profile
                </button>
              </form>
            </div>

            {/* Subsection B: Create Relationship Edge */}
            <div className="space-y-3 bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Link2 className="h-4 w-4 text-emerald-500" />
                Add Relationship Link
              </h3>

              {nodes.length >= 2 ? (
                <form onSubmit={handleAddEdgeSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Person A (Start)</label>
                      <select
                        value={newEdgeSource}
                        onChange={(e) => setNewEdgeSource(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select source</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Person B (Target)</label>
                      <select
                        value={newEdgeTarget}
                        onChange={(e) => setNewEdgeTarget(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select target</option>
                        {nodes.map((n) => (
                          <option key={n.id} value={n.id} disabled={n.id === newEdgeSource}>
                            {n.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Link Relationship</label>
                      <select
                        value={newEdgeLabel}
                        onChange={(e) => setNewEdgeLabel(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="Friend">Friend</option>
                        <option value="Colleague">Colleague</option>
                        <option value="Family">Family</option>
                        <option value="Partner">Partner</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Classmate">Classmate</option>
                        <option value="Collaborator">Collaborator</option>
                        <option value="Reports to">Reports to</option>
                        <option value="Sync Partner">Sync Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Strength ({newEdgeWeight} / 5)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={newEdgeWeight}
                        onChange={(e) => setNewEdgeWeight(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                    disabled={!newEdgeSource || !newEdgeTarget || newEdgeSource === newEdgeTarget}
                  >
                    Establish Link
                  </button>
                </form>
              ) : (
                <p className="text-xs text-slate-500 italic bg-slate-100/50 p-3 rounded-xl text-center">
                  You need to have at least 2 people in the network first.
                </p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PATH FINDER */}
        {activeTab === 'path' && (
          <div className="space-y-4" id="panel-path">
            <div className="space-y-3 bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="h-4 w-4 text-indigo-500" />
                Shortest Path Analyzer
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Choose two people to find and highlight the shortest social connection path between them. Perfect for tracing relationships!
              </p>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Start Person</label>
                  <select
                    value={pathStartId}
                    onChange={(e) => setPathStartId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Choose start...</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.label} ({n.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Person</label>
                  <select
                    value={pathEndId}
                    onChange={(e) => setPathEndId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Choose target...</option>
                    {nodes.map((n) => (
                      <option key={n.id} value={n.id} disabled={n.id === pathStartId}>
                        {n.label} ({n.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onFindPath(pathStartId, pathEndId)}
                    disabled={!pathStartId || !pathEndId || pathStartId === pathEndId}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    Analyze Connection
                  </button>
                  {pathNodeIds.length > 0 && (
                    <button
                      onClick={() => {
                        onClearPath();
                        setPathStartId('');
                        setPathEndId('');
                      }}
                      className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Path Results Panel */}
            {pathNodeIds.length > 0 && (
              <div className="bg-emerald-50/40 border border-emerald-100 p-4 rounded-2xl space-y-3" id="path-results-container">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wide">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Path Discovered ({pathNodeIds.length - 1} Degrees)
                </div>

                <div className="space-y-1">
                  {pathNodeIds.map((nodeId, idx) => {
                    const nodeObj = nodes.find((n) => n.id === nodeId);
                    if (!nodeObj) return null;
                    return (
                      <div key={nodeId} className="flex flex-col">
                        <div className="flex items-center gap-2 p-1.5 bg-white/80 rounded-lg border border-emerald-100/60 shadow-sm">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: nodeObj.color }}
                          />
                          <div className="text-xs">
                            <span className="font-bold text-slate-800">{nodeObj.label}</span>
                            <span className="text-[10px] text-slate-400 font-medium ml-1.5">
                              {nodeObj.role}
                            </span>
                          </div>
                        </div>

                        {idx < pathNodeIds.length - 1 && (
                          <div className="pl-4 py-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                            <span className="h-4 w-0.5 bg-emerald-200 block" />
                            <span className="italic">
                              connected as {
                                edges.find(
                                  (e) =>
                                    (e.source === nodeId && e.target === pathNodeIds[idx + 1]) ||
                                    (e.target === nodeId && e.source === pathNodeIds[idx + 1])
                                )?.label || 'Linked'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
