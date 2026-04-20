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

interface PlayerData {
  HP?: number
  HP上限?: number
  AP?: number
  AP上限?: number
}

interface MvuStatData {
  世界?: WorldData
  玩家?: PlayerData
}

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

  // HP
  const hpCurrent = computed(() => mvuData.value?.玩家?.HP ?? 245)
  const hpMax = computed(() => mvuData.value?.玩家?.HP上限 ?? 285)
  const hpPercent = computed(() => Math.min(100, Math.max(0, (hpCurrent.value / hpMax.value) * 100)))

  // AP
  const apCurrent = computed(() => mvuData.value?.玩家?.AP ?? 140)
  const apMax = computed(() => mvuData.value?.玩家?.AP上限 ?? 140)
  const apPercent = computed(() => Math.min(100, Math.max(0, (apCurrent.value / apMax.value) * 100)))

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
    displayTime,
    displayLocation,
    displayPeriod,
  }
})
