import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// ==========================================
// 类型定义
// ==========================================
interface WorldData {
  时间?: {
    日期?: string
    时刻?: string
    天气?: string
    阶段?: string
  }
  当前位置?: {
    区域?: string
    具体地点?: string
  }
}

interface StatPool {
  当前?: number
  上限?: number
}

interface SpecialAttr {
  值?: number
  描述?: string
}

interface Skill {
  值?: number
  描述?: string
  效果?: string
}

interface Perk {
  等级?: number
  描述?: string
  效果?: string
}

interface MvuStatData {
  世界?: WorldData
  主角?: {
    HP?: StatPool
    AP?: StatPool
    等级?: number
    瓶盖?: number
    负重?: StatPool
    SPECIAL?: {
      力量?: SpecialAttr
      感知?: SpecialAttr
      耐力?: SpecialAttr
      魅力?: SpecialAttr
      智力?: SpecialAttr
      敏捷?: SpecialAttr
      幸运?: SpecialAttr
    }
    技能?: Record<string, Skill>
    专长?: Record<string, Perk>
  }
}

// SPECIAL 属性定义
const SPECIAL_DEFS = [
  { key: '力量', letter: 'S', name: '力量 Strength', desc: '近战伤害与负重能力' },
  { key: '感知', letter: 'P', name: '感知 Perception', desc: '环境感知与VATS精度' },
  { key: '耐力', letter: 'E', name: '耐力 Endurance', desc: '生命值与抗性' },
  { key: '魅力', letter: 'C', name: '魅力 Charisma', desc: '对话与交易能力' },
  { key: '智力', letter: 'I', name: '智力 Intelligence', desc: '经验获取与黑客' },
  { key: '敏捷', letter: 'A', name: '敏捷 Agility', desc: '行动点数与潜行' },
  { key: '幸运', letter: 'L', name: '幸运 Luck', desc: '暴击与随机事件' },
]

// ==========================================
// Store
// ==========================================
export const useStatusStore = defineStore('status', () => {
  // MVU 数据
  const mvuData = ref<MvuStatData>({})
  const messageId = ref<number>(0)

  // 获取 MVU 数据
  const fetchMvuData = () => {
    try {
      const data = Mvu.getMvuData({ type: 'message', message_id: messageId.value })
      mvuData.value = data?.stat_data ?? {}
    } catch (e) {
      console.error('获取 MVU 数据失败:', e)
    }
  }

  // ==========================================
  // 计算属性 - 从 MVU 数据读取
  // ==========================================

  // HP - 使用主角.HP.当前和主角.HP.上限
  const hpCurrent = computed(() => mvuData.value?.主角?.HP?.当前 ?? 100)
  const hpMax = computed(() => mvuData.value?.主角?.HP?.上限 ?? 100)
  const hpPercent = computed(() => Math.min(100, Math.max(0, (hpCurrent.value / hpMax.value) * 100)))

  // AP - 使用主角.AP.当前和主角.AP.上限
  const apCurrent = computed(() => mvuData.value?.主角?.AP?.当前 ?? 50)
  const apMax = computed(() => mvuData.value?.主角?.AP?.上限 ?? 50)
  const apPercent = computed(() => Math.min(100, Math.max(0, (apCurrent.value / apMax.value) * 100)))

  // 等级
  const level = computed(() => mvuData.value?.主角?.等级 ?? 1)

  // 瓶盖
  const caps = computed(() => mvuData.value?.主角?.瓶盖 ?? 0)

  // 负重
  const weightCurrent = computed(() => mvuData.value?.主角?.负重?.当前 ?? 0)
  const weightMax = computed(() => mvuData.value?.主角?.负重?.上限 ?? 100)

  // 显示的时间
  const displayTime = computed(() => {
    return mvuData.value?.世界?.时间?.时刻 ?? '08:00'
  })

  // 显示的地点（区域 + 具体地点）
  const displayLocation = computed(() => {
    const region = mvuData.value?.世界?.当前位置?.区域 ?? '荒野'
    const location = mvuData.value?.世界?.当前位置?.具体地点 ?? '未知地点'
    return `${region}·${location}`
  })

  // 显示的时刻/阶段
  const displayPeriod = computed(() => {
    return mvuData.value?.世界?.时间?.阶段 ?? '早晨'
  })

  // SPECIAL 属性
  const specialAttrs = computed(() => {
    const special = mvuData.value?.主角?.SPECIAL
    return SPECIAL_DEFS.map(def => ({
      key: def.key,
      letter: def.letter,
      name: def.name,
      desc: special?.[def.key as keyof typeof special]?.描述 ?? def.desc,
      value: special?.[def.key as keyof typeof special]?.值 ?? 5,
    }))
  })

  // 技能 - 减少默认数量
  const skills = computed(() => {
    const skillsData = mvuData.value?.主角?.技能
    if (!skillsData) {
      // 默认只有3个技能
      return [
        { name: '小型枪械', value: 50, desc: '使用手枪、步枪等小型武器的技能', effects: '每点提升5%命中率' },
        { name: '口才', value: 50, desc: '通过对话影响他人的技能', effects: '每点提升5%对话成功率' },
        { name: '黑客', value: 50, desc: '入侵计算机终端的技能', effects: '每点提升5%黑客成功率' },
      ]
    }
    return Object.entries(skillsData).map(([name, data]) => ({
      name,
      value: data.值 ?? 50,
      desc: data.描述 ?? '',
      effects: data.效果 ?? '',
    }))
  })

  // 专长 - 减少默认数量
  const perks = computed(() => {
    const perksData = mvuData.value?.主角?.专长
    if (!perksData) {
      // 默认只有2个专长
      return [
        { name: '独行侠', rank: 1, desc: '没有同伴时获得加成', effects: '伤害+10%' },
        { name: '搜刮者', rank: 1, desc: '更容易找到稀有物品', effects: '找到稀有物品几率+25%' },
      ]
    }
    return Object.entries(perksData).map(([name, data]) => ({
      name,
      rank: data.等级 ?? 1,
      desc: data.描述 ?? '',
      effects: data.效果 ?? '',
    }))
  })

  return {
    mvuData,
    messageId,
    fetchMvuData,
    hpCurrent,
    hpMax,
    hpPercent,
    apCurrent,
    apMax,
    apPercent,
    level,
    caps,
    weightCurrent,
    weightMax,
    displayTime,
    displayLocation,
    displayPeriod,
    specialAttrs,
    skills,
    perks,
  }
})
