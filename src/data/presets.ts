import { PresetNetwork } from '../types';

export const PRESET_NETWORKS: PresetNetwork[] = [
  {
    id: 'startup',
    name: 'Silicon Valley Startup',
    description: 'A tight-knit, fast-growing tech company hierarchy and collaborative network.',
    icon: 'Briefcase',
    nodes: [
      {
        id: 'node-1',
        label: 'Sarah Jenkins',
        role: 'Chief Executive Officer',
        company: 'Apex Technologies',
        bio: 'Visionary leader with 15+ years of experience scaling software companies. Former product leader.',
        gender: 'female',
        color: '#E11D48', // rose-600
        size: 50,
        avatarSeed: 'sarah'
      },
      {
        id: 'node-2',
        label: 'Devon Carter',
        role: 'Lead Architect',
        company: 'Apex Technologies',
        bio: 'Systems thinker, open-source maintainer, and technical backbone of Apex. Enjoys sailing.',
        gender: 'male',
        color: '#2563EB', // blue-600
        size: 45,
        avatarSeed: 'devon'
      },
      {
        id: 'node-3',
        label: 'Aria Chen',
        role: 'Frontend Developer',
        company: 'Apex Technologies',
        bio: 'React and CSS wizard. Passionate about beautiful animations and pixel-perfect user interfaces.',
        gender: 'female',
        color: '#0D9488', // teal-600
        size: 40,
        avatarSeed: 'aria'
      },
      {
        id: 'node-4',
        label: 'Leo Vasquez',
        role: 'Lead Designer',
        company: 'Apex Technologies',
        bio: 'Believer in empathetic design, micro-interactions, and visual storytelling. Former agency art director.',
        gender: 'male',
        color: '#7C3AED', // violet-600
        size: 42,
        avatarSeed: 'leo'
      },
      {
        id: 'node-5',
        label: 'Maya Patel',
        role: 'Director of Product',
        company: 'Apex Technologies',
        bio: 'Translates high-level visions into feature roadmaps. Obsessed with user analytics and metrics.',
        gender: 'female',
        color: '#EA580C', // orange-600
        size: 44,
        avatarSeed: 'maya'
      },
      {
        id: 'node-6',
        label: 'Tina Alvarez',
        role: 'HR & Operations',
        company: 'Apex Technologies',
        bio: 'Keeps the workplace thriving. Passionate about team building, diversity, and mental well-being.',
        gender: 'female',
        color: '#DB2777', // pink-600
        size: 38,
        avatarSeed: 'tina'
      },
      {
        id: 'node-7',
        label: 'Kenji Sato',
        role: 'Marketing Lead',
        company: 'Apex Technologies',
        bio: 'Growth hacker, content creator, and SEO specialist. Loves craft coffee and sci-fi books.',
        gender: 'male',
        color: '#CA8A04', // yellow-600
        size: 38,
        avatarSeed: 'kenji'
      }
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2', label: 'Reports to', weight: 5, color: '#E11D48' },
      { id: 'edge-2', source: 'node-1', target: 'node-5', label: 'Reports to', weight: 5, color: '#E11D48' },
      { id: 'edge-3', source: 'node-1', target: 'node-6', label: 'Reports to', weight: 4, color: '#DB2777' },
      { id: 'edge-4', source: 'node-2', target: 'node-3', label: 'Collaborator', weight: 4, color: '#2563EB' },
      { id: 'edge-5', source: 'node-5', target: 'node-4', label: 'Collaborator', weight: 4, color: '#EA580C' },
      { id: 'edge-6', source: 'node-4', target: 'node-3', label: 'Collaborator', weight: 3, color: '#7C3AED' },
      { id: 'edge-7', source: 'node-5', target: 'node-2', label: 'Sync Partner', weight: 3, color: '#2563EB' },
      { id: 'edge-8', source: 'node-1', target: 'node-7', label: 'Reports to', weight: 3, color: '#CA8A04' },
      { id: 'edge-9', source: 'node-5', target: 'node-7', label: 'Sync Partner', weight: 3, color: '#EA580C' },
      { id: 'edge-10', source: 'node-6', target: 'node-3', label: 'Mentoring', weight: 2, color: '#DB2777' }
    ]
  },
  {
    id: 'research',
    name: 'Academic Research Lab',
    description: 'A university research group collaborating on physics and high-performance computing.',
    icon: 'GraduationCap',
    nodes: [
      {
        id: 'node-101',
        label: 'Dr. Helen Vance',
        role: 'Principal Investigator',
        company: 'Quantum Lab',
        bio: 'Professor of Quantum Physics. Author of 100+ papers. Loves mentoring future researchers.',
        gender: 'female',
        color: '#16A34A', // green-600
        size: 52,
        avatarSeed: 'helen'
      },
      {
        id: 'node-102',
        label: 'Dr. Raj Singh',
        role: 'Postdoctoral Fellow',
        company: 'Quantum Lab',
        bio: 'Developing quantum simulators. When not in the lab, he runs ultra-marathons.',
        gender: 'male',
        color: '#0891B2', // cyan-600
        size: 44,
        avatarSeed: 'raj'
      },
      {
        id: 'node-103',
        label: 'Chloe Dubois',
        role: 'Ph.D. Candidate',
        company: 'Quantum Lab',
        bio: 'Focusing on cryogenics. Enthusiast of French baking and classical piano.',
        gender: 'female',
        color: '#D97706', // amber-600
        size: 40,
        avatarSeed: 'chloe'
      },
      {
        id: 'node-104',
        label: 'Marcus Thorne',
        role: 'Ph.D. Candidate',
        company: 'Quantum Lab',
        bio: 'Simulation engineer. Enjoys programming retro 8-bit computers and video games.',
        gender: 'male',
        color: '#4F46E5', // indigo-600
        size: 40,
        avatarSeed: 'marcus'
      },
      {
        id: 'node-105',
        label: 'Yuki Tanaka',
        role: 'Graduate Student',
        company: 'Quantum Lab',
        bio: 'Studying Josephson junctions. Avid travel photographer and hiker.',
        gender: 'other',
        color: '#EC4899', // pink-500
        size: 36,
        avatarSeed: 'yuki'
      },
      {
        id: 'node-106',
        label: 'Liam Fletcher',
        role: 'Lab Manager',
        company: 'Quantum Lab',
        bio: 'Ensures everything from nitrogen tanks to safety protocols is in place. Home brewer.',
        gender: 'male',
        color: '#4B5563', // gray-600
        size: 38,
        avatarSeed: 'liam'
      }
    ],
    edges: [
      { id: 'edge-101', source: 'node-101', target: 'node-102', label: 'Advises', weight: 5, color: '#16A34A' },
      { id: 'edge-102', source: 'node-101', target: 'node-103', label: 'Advises', weight: 5, color: '#16A34A' },
      { id: 'edge-103', source: 'node-101', target: 'node-104', label: 'Advises', weight: 5, color: '#16A34A' },
      { id: 'edge-104', source: 'node-102', target: 'node-105', label: 'Mentors', weight: 4, color: '#0891B2' },
      { id: 'edge-105', source: 'node-103', target: 'node-104', label: 'Lab Partners', weight: 4, color: '#D97706' },
      { id: 'edge-106', source: 'node-101', target: 'node-106', label: 'Directs', weight: 3, color: '#4B5563' },
      { id: 'edge-107', source: 'node-106', target: 'node-103', label: 'Safety Sync', weight: 2, color: '#4B5563' },
      { id: 'edge-108', source: 'node-104', target: 'node-105', label: 'Collaborator', weight: 3, color: '#4F46E5' }
    ]
  },
  {
    id: 'neighborhood',
    name: 'Creative Community Collective',
    description: 'An informal local neighborhood network of creators, food makers, and organizers.',
    icon: 'Heart',
    nodes: [
      {
        id: 'node-201',
        label: 'Arthur Pendelton',
        role: 'Council President',
        company: 'Westside Alliance',
        bio: 'Retired teacher dedicating his spare time to green urban development. Garden coordinator.',
        gender: 'male',
        color: '#0F766E', // teal-700
        size: 46,
        avatarSeed: 'arthur'
      },
      {
        id: 'node-202',
        label: 'Maria Rossi',
        role: 'Artisan Baker',
        company: 'Daily Crumb Bakery',
        bio: 'Sourdough expert whose bakery smells of rosemary. Throws community workshops.',
        gender: 'female',
        color: '#BE123C', // rose-700
        size: 42,
        avatarSeed: 'maria'
      },
      {
        id: 'node-203',
        label: 'Oliver Vance',
        role: 'Urban Landscaper',
        company: 'Westside Alliance',
        bio: 'Landscape architect helping neighborhoods design community gardens and pocket forests.',
        gender: 'male',
        color: '#15803D', // green-700
        size: 38,
        avatarSeed: 'oliver'
      },
      {
        id: 'node-204',
        label: 'Sophia Martinez',
        role: 'Art Teacher',
        company: 'District High School',
        bio: 'Mural artist and educator organizing local street art projects for high schoolers.',
        gender: 'female',
        color: '#6D28D9', // violet-700
        size: 40,
        avatarSeed: 'sophia'
      },
      {
        id: 'node-205',
        label: 'Evelyn Gray',
        role: 'Retired Illustrator',
        company: 'Westside Alliance',
        bio: 'Sketches local landmarks and sells botanical prints. Resident since 1980.',
        gender: 'female',
        color: '#B45309', // amber-700
        size: 42,
        avatarSeed: 'evelyn'
      },
      {
        id: 'node-206',
        label: 'Carlos Mendez',
        role: 'Neighborhood Officer',
        company: 'Community Safety',
        bio: 'Friendly safety coordinator. Runs bicycle safety rodeos for kids on weekends.',
        gender: 'male',
        color: '#1D4ED8', // blue-700
        size: 40,
        avatarSeed: 'carlos'
      }
    ],
    edges: [
      { id: 'edge-201', source: 'node-201', target: 'node-203', label: 'Co-Organizers', weight: 5, color: '#0F766E' },
      { id: 'edge-202', source: 'node-201', target: 'node-206', label: 'Collaborator', weight: 4, color: '#1D4ED8' },
      { id: 'edge-203', source: 'node-202', target: 'node-201', label: 'Suppliers', weight: 3, color: '#BE123C' },
      { id: 'edge-204', source: 'node-204', target: 'node-202', label: 'Friends', weight: 4, color: '#6D28D9' },
      { id: 'edge-205', source: 'node-203', target: 'node-205', label: 'Landscaping', weight: 3, color: '#15803D' },
      { id: 'edge-206', source: 'node-204', target: 'node-205', label: 'Mentorship', weight: 5, color: '#6D28D9' },
      { id: 'edge-207', source: 'node-206', target: 'node-202', label: 'Regular Customer', weight: 2, color: '#1D4ED8' }
    ]
  }
];
