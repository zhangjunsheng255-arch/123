import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// ==========================================
// 类型定义 - 严格匹配 schema.json 和 initvar.yaml
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

interface Skill {
  描述?: string
}

interface Perk {
  描述?: string
}

// 严格匹配 initvar.yaml 的结构
interface MvuStatData {
  世界?: WorldData
  主角?: {
    HP?: StatPool
    AP?: StatPool
    当前等级?: number
    经验值?: number
    晶核数量?: number
    人物姓名?: string
    人物年龄?: number
  }
  状态?: {
    属性点?: {
      力量?: number
      感知?: number
      耐力?: number
      魅力?: number
      智力?: number
      敏捷?: number
      幸运?: number
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

  // 获取 MVU 数据 - 尝试多种方式
  const fetchMvuData = () => {
    try {
      // 首先尝试获取消息楼层变量
      let data = null
      try {
        data = Mvu.getMvuData({ type: 'message', message_id: messageId.value })
      } catch (e) {
        console.log('消息楼层变量获取失败，尝试全局变量')
      }

      // 如果消息楼层没有数据，尝试全局变量
      if (!data || !data.stat_data) {
        try {
          data = Mvu.getMvuData({ type: 'global' })
        } catch (e) {
          console.log('全局变量获取失败')
        }
      }

      // 合并数据
      const messageData = data?.stat_data ?? {}

      // 同时获取全局变量中的技能和专长（可能存储在全局）
      let globalData: MvuStatData = {}
      try {
        const global = Mvu.getMvuData({ type: 'global' })
        globalData = global?.stat_data ?? {}
      } catch (e) {
        // 忽略错误
      }

      // 合并消息楼层和全局数据
      mvuData.value = {
        ...globalData,
        ...messageData,
        状态: {
          ...globalData?.状态,
          ...messageData?.状态,
          // 合并技能和专长
          技能: {
            ...globalData?.状态?.技能,
            ...messageData?.状态?.技能,
          },
          专长: {
            ...globalData?.状态?.专长,
            ...messageData?.状态?.专长,
          },
        },
      }

      console.log('MVU 数据已更新:', mvuData.value)
    } catch (e) {
      console.error('获取 MVU 数据失败:', e)
    }
  }

  // ==========================================
  // 计算属性 - 严格匹配 initvar.yaml 的变量路径
  // ==========================================

  // HP - 主角.HP.当前/上限
  const hpCurrent = computed(() => mvuData.value?.主角?.HP?.当前 ?? 100)
  const hpMax = computed(() => mvuData.value?.主角?.HP?.上限 ?? 100)
  const hpPercent = computed(() => Math.min(100, Math.max(0, (hpCurrent.value / hpMax.value) * 100)))

  // AP - 主角.AP.当前/上限
  const apCurrent = computed(() => mvuData.value?.主角?.AP?.当前 ?? 50)
  const apMax = computed(() => mvuData.value?.主角?.AP?.上限 ?? 50)
  const apPercent = computed(() => Math.min(100, Math.max(0, (apCurrent.value / apMax.value) * 100)))

  // 等级 - 主角.当前等级
  const level = computed(() => mvuData.value?.主角?.当前等级 ?? 1)

  // 晶核 - 主角.晶核数量 (不是瓶盖)
  const caps = computed(() => mvuData.value?.主角?.晶核数量 ?? 0)

  // 显示的时间 - 世界.时间.时刻
  const displayTime = computed(() => {
    return mvuData.value?.世界?.时间?.时刻 ?? '08:00'
  })

  // 显示的地点 - 世界.当前位置.区域/具体地点
  const displayLocation = computed(() => {
    const region = mvuData.value?.世界?.当前位置?.区域 ?? '荒野'
    const location = mvuData.value?.世界?.当前位置?.具体地点 ?? '未知地点'
    return `${region}·${location}`
  })

  // 显示的时刻/阶段 - 世界.时间.阶段
  const displayPeriod = computed(() => {
    return mvuData.value?.世界?.时间?.阶段 ?? '上午'
  })

  // SPECIAL 属性 - 状态.属性点.xxx (不是主角.SPECIAL)
  const specialAttrs = computed(() => {
    const attrPoints = mvuData.value?.状态?.属性点
    return SPECIAL_DEFS.map(def => ({
      key: def.key,
      letter: def.letter,
      name: def.name,
      desc: def.desc,
      value: attrPoints?.[def.key as keyof typeof attrPoints] ?? 5,
    }))
  })

  // 技能 - 状态.技能 (合并全局和消息楼层)
  const skills = computed(() => {
    const skillsData = mvuData.value?.状态?.技能
    console.log('技能数据:', skillsData)
    if (!skillsData || Object.keys(skillsData).length === 0) {
      return [] // 默认空数组，不显示任何技能
    }
    return Object.entries(skillsData).map(([name, data]) => ({
      name,
      value: 0, // 技能没有数值，只有描述
      desc: data?.描述 ?? '',
      effects: '',
    }))
  })

  // 专长 - 状态.专长 (合并全局和消息楼层)
  const perks = computed(() => {
    const perksData = mvuData.value?.状态?.专长
    console.log('专长数据:', perksData)
    if (!perksData || Object.keys(perksData).length === 0) {
      return [] // 默认空数组，不显示任何专长
    }
    return Object.entries(perksData).map(([name, data]) => ({
      name,
      rank: 1, // 专长没有等级，只有描述
      desc: data?.描述 ?? '',
      effects: '',
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
    displayTime,
    displayLocation,
    displayPeriod,
    specialAttrs,
    skills,
    perks,
  }
})
