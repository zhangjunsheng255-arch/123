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
  const hpCurrent = computed(() => mvuData.value?.主角?.HP?.当前 ?? 245)
  const hpMax = computed(() => mvuData.value?.主角?.HP?.上限 ?? 285)
  const hpPercent = computed(() => Math.min(100, Math.max(0, (hpCurrent.value / hpMax.value) * 100)))

  // AP - 使用主角.AP.当前和主角.AP.上限
  const apCurrent = computed(() => mvuData.value?.主角?.AP?.当前 ?? 140)
  const apMax = computed(() => mvuData.value?.主角?.AP?.上限 ?? 140)
  const apPercent = computed(() => Math.min(100, Math.max(0, (apCurrent.value / apMax.value) * 100)))

  // 等级
  const level = computed(() => mvuData.value?.主角?.等级 ?? 28)

  // 瓶盖
  const caps = computed(() => mvuData.value?.主角?.瓶盖 ?? 2847)

  // 负重
  const weightCurrent = computed(() => mvuData.value?.主角?.负重?.当前 ?? 185)
  const weightMax = computed(() => mvuData.value?.主角?.负重?.上限 ?? 250)

  // 显示的时间
  const displayTime = computed(() => {
    return mvuData.value?.世界?.时间?.时刻 ?? '08:00'
  })

  // 显示的地点（区域 + 具体地点）
  const displayLocation = computed(() => {
    const region = mvuData.value?.世界?.当前位置?.区域 ?? '荒野公路'
    const location = mvuData.value?.世界?.当前位置?.具体地点 ?? '废弃加油站'
    return `${region}·${location}`
  })

  // 显示的时刻/阶段
  const displayPeriod = computed(() => {
    return mvuData.value?.世界?.时间?.阶段 ?? '上午'
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

  // 技能
  const skills = computed(() => {
    const skillsData = mvuData.value?.主角?.技能
    if (!skillsData) {
      // 默认技能
      return [
        { name: '小型枪械', value: 65, desc: '使用手枪、步枪和冲锋枪等小型武器的技能。影响命中率和伤害。', effects: '每点提升5%命中率和2%伤害' },
        { name: '大型枪械', value: 42, desc: '使用重机枪、火箭筒等大型武器的技能。需要较高的力量才能有效使用。', effects: '每点提升4%命中率和3%伤害' },
        { name: '能量武器', value: 58, desc: '使用激光武器、等离子武器等高科技武器的技能。需要理解武器原理。', effects: '每点提升5%命中率和2%暴击率' },
        { name: '徒手', value: 38, desc: '不使用武器时的格斗技能。包括拳击、摔跤和各种格斗技巧。', effects: '每点提升6%伤害和3%暴击率' },
        { name: '近战武器', value: 45, desc: '使用刀、棍棒、球棒等近战武器的技能。在近距离战斗中非常有效。', effects: '每点提升5%命中率和3%伤害' },
        { name: '口才', value: 52, desc: '通过对话影响他人的技能。可以 convince 他人、获取信息或避免战斗。', effects: '每点提升5%对话成功率和降低5%商品价格' },
        { name: '交易', value: 48, desc: '买卖物品时的讨价还价技能。影响购买和出售价格。', effects: '每点降低购买价格2%并提升出售价格2%' },
        { name: '开锁', value: 55, desc: '打开各种锁具的技能。可以进入锁住的房间和容器获取战利品。', effects: '每点提升5%开锁成功率，可开启更高级锁具' },
        { name: '黑客', value: 72, desc: '入侵计算机终端的技能。可以获取信息、关闭安全系统或控制设备。', effects: '每点提升5%黑客成功率，可入侵更高级终端' },
      ]
    }
    return Object.entries(skillsData).map(([name, data]) => ({
      name,
      value: data.值 ?? 50,
      desc: data.描述 ?? '',
      effects: data.效果 ?? '',
    }))
  })

  // 专长
  const perks = computed(() => {
    const perksData = mvuData.value?.主角?.专长
    if (!perksData) {
      // 默认专长
      return [
        { name: '独行侠', rank: 2, desc: '没有同伴时，获得伤害减免和行动点回复加成。适合独狼玩家。', effects: '+20%伤害减免，+25%行动点回复速度' },
        { name: '枪械迷', rank: 3, desc: '精通枪械改装，可以制作更高级的枪械配件。解锁新的改装选项。', effects: '解锁高级枪械改装，制作成本降低30%' },
        { name: '骇客', rank: 2, desc: '高级黑客技能，入侵终端时不会触发警报，且可以尝试更多密码。', effects: '入侵失败不触发警报，每次尝试次数+1' },
        { name: '搜刮者', rank: 1, desc: '在搜索容器时有更高几率找到稀有物品。在废土上生存的关键技能。', effects: '+50%找到额外战利品几率，+25%找到稀有物品几率' },
        { name: '科学!', rank: 2, desc: '掌握先进科技，可以制作能量武器改装和动力装甲配件。', effects: '解锁能量武器和动力装甲改装，制作成本降低25%' },
        { name: '装甲商', rank: 1, desc: '精通护甲制作和改装，可以制作更高级的护甲配件。', effects: '解锁高级护甲改装，护甲耐久度提升30%' },
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
