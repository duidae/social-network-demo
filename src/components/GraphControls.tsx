import { LayoutType, PresetNetwork, GraphMetrics } from '../types';
import { PRESET_NETWORKS } from '../data/presets';
import {
  RefreshCw,
  Layout,
  Layers,
  Database,
  BarChart3,
  Network
} from 'lucide-react';

interface GraphControlsProps {
  currentPresetId: string;
  onSelectPreset: (presetId: string) => void;
  layoutType: LayoutType;
  onChangeLayout: (layout: LayoutType) => void;
  metrics: GraphMetrics;
  onResetToPreset: () => void;
  onExportJSON: () => void;
}

export default function GraphControls({
  currentPresetId,
  onSelectPreset,
  layoutType,
  onChangeLayout,
  metrics,
  onResetToPreset,
  onExportJSON,
}: GraphControlsProps) {
  // Available layouts mapped to human readable labels
  const LAYOUT_OPTIONS: { value: LayoutType; label: string; desc: string }[] = [
    { value: 'cose', label: 'Physics Force (CoSE)', desc: 'Organic physics-based spacing' },
    { value: 'circular', label: 'Circular Ring', desc: 'Symmetrical circular loop' },
    { value: 'concentric', label: 'Concentric Rings', desc: 'Grouped by connection levels' },
    { value: 'grid', label: 'Orthogonal Grid', desc: 'Structured matrix alignment' },
    { value: 'breadthfirst', label: 'Hierarchical Tree', desc: 'Breadth-first parent-child tree' },
    { value: 'random', label: 'Randomized Scatter', desc: 'Arbitrary spatial placements' },
  ];

  return (
    <div className="bg-white border border-slate-200/50 rounded-2xl p-4 space-y-4 shadow-md shadow-slate-200/20" id="graph-controls-container">
      {/* Top row: Preset and Layout Selectors */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        
        {/* Preset Selector */}
        <div className="flex-1 space-y-1.5" id="presets-selector-sub">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Select Social Template
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_NETWORKS.map((preset) => {
              const isActive = preset.id === currentPresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md shadow-indigo-500/25 border-transparent'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-500'
                  }`}
                  title={preset.description}
                >
                  <Database className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout Selector and Action Row */}
        <div className="flex flex-wrap items-end gap-3" id="layout-controls-sub">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Graph Algorithm Layout
            </label>
            <div className="relative">
              <select
                value={layoutType}
                onChange={(e) => onChangeLayout(e.target.value as LayoutType)}
                className="pl-9 pr-8 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white cursor-pointer appearance-none min-w-[200px]"
                id="select-graph-layout"
              >
                {LAYOUT_OPTIONS.map((l) => (
                  <option key={l.value} value={l.value} title={l.desc}>
                    {l.label}
                  </option>
                ))}
              </select>
              <Layout className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              <div className="absolute right-3 top-2.5 pointer-events-none text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onResetToPreset}
              title="Reset graph back to template defaults"
              className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              id="btn-reset-graph"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
              Reset Template
            </button>
            <button
              onClick={onExportJSON}
              title="Copy the network JSON elements payload"
              className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              id="btn-export-graph"
            >
              <Layers className="h-3.5 w-3.5 text-slate-500" />
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Analytics Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-slate-100" id="metrics-cards-grid">
        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Network className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total People</div>
            <div className="text-base font-extrabold text-slate-800">{metrics.nodeCount}</div>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Relationships</div>
            <div className="text-base font-extrabold text-slate-800">{metrics.edgeCount}</div>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Connections</div>
            <div className="text-base font-extrabold text-slate-800">{metrics.avgDegree.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
            <RefreshCw className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Network Density</div>
            <div className="text-base font-extrabold text-slate-800">{(metrics.density * 100).toFixed(1)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
