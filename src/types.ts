export interface PersonNode {
  id: string;
  label: string;
  role: string;
  company: string;
  bio: string;
  gender: 'male' | 'female' | 'other';
  color: string;
  size: number;
  avatarSeed: string; // Used to generate nice consistently styled placeholder initials or avatars
}

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  label: string; // 'Friend' | 'Colleague' | 'Family' | 'Partner' | 'Mentor' | 'Classmate'
  weight: number; // 1 to 5 (maps to edge thickness)
  color: string;
}

export interface PresetNetwork {
  id: string;
  name: string;
  description: string;
  icon: string;
  nodes: PersonNode[];
  edges: RelationshipEdge[];
}

export type LayoutType = 'cose' | 'grid' | 'circular' | 'concentric' | 'breadthfirst' | 'random';

export interface GraphMetrics {
  nodeCount: number;
  edgeCount: number;
  density: number;
  avgDegree: number;
}
