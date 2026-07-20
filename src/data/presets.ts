import { PresetNetwork } from '../types';

const zhangWanChuanNetwork = {
  id: "chang-wan-chuan-network",
  name: "張萬傳人物關係",
  description:
    "根據公開文獻整理之張萬傳藝術人際網絡（第一版）",

  icon: "Palette",

  nodes: [
    {
      id: "chang",
      label: "張萬傳",
      role: "畫家",
      company: "臺灣",
      bio: "臺灣野獸派代表畫家。",
      color: "#E63946",
      size: 70,
      avatarSeed: "chang"
    },

    {
      id: "hung",
      label: "洪瑞麟",
      role: "畫家",
      company: "臺灣",
      bio: "終生好友，共赴日本習畫。",
      color: "#2563EB",
      size: 55,
      avatarSeed: "hung"
    },

    {
      id: "chen_tw",
      label: "陳德旺",
      role: "畫家",
      company: "臺灣",
      bio: "終生好友，共赴日本習畫。",
      color: "#2563EB",
      size: 55,
      avatarSeed: "chen"
    },

    {
      id: "yang",
      label: "楊三郎",
      role: "畫家",
      company: "臺陽美術",
      bio: "研究所前輩，長期藝術交流。",
      color: "#0D9488",
      size: 45,
      avatarSeed: "yang"
    },

    {
      id: "li_shi_chiao",
      label: "李石樵",
      role: "畫家",
      company: "東京",
      bio: "東京共同租屋。",
      color: "#F59E0B",
      size: 42,
      avatarSeed: "lishi"
    },

    {
      id: "li_mei_shu",
      label: "李梅樹",
      role: "畫家",
      company: "東京",
      bio: "東京共同租屋。",
      color: "#F59E0B",
      size: 42,
      avatarSeed: "limei"
    },

    {
      id: "chen_chih_chi",
      label: "陳植棋",
      role: "畫家",
      company: "臺灣繪畫研究所",
      bio: "共同居住，亦為重要前輩。",
      color: "#7C3AED",
      size: 44,
      avatarSeed: "chencc"
    },

    {
      id: "ishikawa",
      label: "石川欽一郎",
      role: "教師",
      company: "臺灣繪畫研究所",
      bio: "教授素描、水彩、油畫。",
      color: "#059669",
      size: 46,
      avatarSeed: "ishikawa"
    },

    {
      id: "lan",
      label: "藍蔭鼎",
      role: "畫家",
      company: "臺灣繪畫研究所",
      bio: "研究所前輩。",
      color: "#14B8A6",
      size: 40,
      avatarSeed: "lan"
    },

    {
      id: "ni",
      label: "倪蔣懷",
      role: "贊助者",
      company: "臺灣繪畫研究所",
      bio: "創辦研究所，支持張萬傳學畫。",
      color: "#EA580C",
      size: 48,
      avatarSeed: "ni"
    },

    {
      id: "liao",
      label: "廖德政",
      role: "畫家",
      company: "紀元美術會",
      bio: "共同成立紀元美術會。",
      color: "#8B5CF6",
      size: 42,
      avatarSeed: "liao"
    },

    {
      id: "chang_yi_hsiung",
      label: "張義雄",
      role: "畫家",
      company: "紀元美術會",
      bio: "共同成立紀元美術會。",
      color: "#8B5CF6",
      size: 42,
      avatarSeed: "changyi"
    },

    {
      id: "tsai",
      label: "蔡蔭棠",
      role: "畫家",
      company: "星期日畫家會",
      bio: "共同成立星期日畫家會。",
      color: "#A855F7",
      size: 40,
      avatarSeed: "tsai"
    }
  ],

  edges: [

    {
      id: "e1",
      source: "chang",
      target: "hung",
      label: "終生好友",
      weight: 5,
      color: "#2563EB"
    },

    {
      id: "e2",
      source: "chang",
      target: "chen_tw",
      label: "終生好友",
      weight: 5,
      color: "#2563EB"
    },

    {
      id: "e3",
      source: "chang",
      target: "yang",
      label: "藝術交流",
      weight: 3,
      color: "#0D9488"
    },

    {
      id: "e4",
      source: "chang",
      target: "li_shi_chiao",
      label: "東京共同租屋",
      weight: 4,
      color: "#F59E0B"
    },

    {
      id: "e5",
      source: "chang",
      target: "li_mei_shu",
      label: "東京共同租屋",
      weight: 4,
      color: "#F59E0B"
    },

    {
      id: "e6",
      source: "chang",
      target: "chen_chih_chi",
      label: "共同居住",
      weight: 4,
      color: "#7C3AED"
    },

    {
      id: "e7",
      source: "chang",
      target: "ishikawa",
      label: "學習繪畫",
      weight: 5,
      color: "#059669"
    },

    {
      id: "e8",
      source: "chang",
      target: "ni",
      label: "研究所創辦人",
      weight: 4,
      color: "#EA580C"
    },

    {
      id: "e9",
      source: "chang",
      target: "lan",
      label: "研究所前輩",
      weight: 2,
      color: "#14B8A6"
    },

    {
      id: "e10",
      source: "chang",
      target: "liao",
      label: "共同成立紀元美術會",
      weight: 4,
      color: "#8B5CF6"
    },

    {
      id: "e11",
      source: "chang",
      target: "chang_yi_hsiung",
      label: "共同成立紀元美術會",
      weight: 4,
      color: "#8B5CF6"
    },

    {
      id: "e12",
      source: "chang",
      target: "tsai",
      label: "星期日畫家會",
      weight: 3,
      color: "#A855F7"
    }

  ]
}

export const PRESET_NETWORKS: PresetNetwork[] = [
  zhangWanChuanNetwork,
];
