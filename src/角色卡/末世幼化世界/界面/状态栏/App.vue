<template>
  <div class="status-bar-container">
    <div class="bezel">
      <div class="screen">
        <!-- 加载动画 -->
        <div class="boot" :class="{ hide: !isBooting }">
          <div class="boot-logo">▼▼▼</div>
          <div class="boot-t">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
          <div class="boot-t">LOADING PIP-BOY 3000 OS...</div>
          <div class="boot-bar">
            <div class="boot-fill"></div>
          </div>
        </div>

        <!-- 状态栏 -->
        <div class="status">
          <!-- 左侧：HP、AP -->
          <div class="status-l">
            <div class="stat">
              <label>HP</label>
              <div class="bar-wrap">
                <div class="bar" :style="{ width: hpPercent + '%' }"></div>
                <div class="segs">
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                </div>
              </div>
              <span class="val">{{ hpCurrent }}/{{ hpMax }}</span>
            </div>
            <div class="stat">
              <label>AP</label>
              <div class="bar-wrap">
                <div class="bar" :style="{ width: apPercent + '%' }"></div>
                <div class="segs">
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                  <div class="seg"></div>
                </div>
              </div>
              <span class="val">{{ apCurrent }}/{{ apMax }}</span>
            </div>
          </div>
          <!-- 中间：时间、时刻 -->
          <div class="status-c">
            <div class="stat">
              <label>时间</label>
              <span class="val time-val">{{ displayTime }}</span>
            </div>
            <div class="stat">
              <label>时刻</label>
              <span class="val">{{ displayPeriod }}</span>
            </div>
          </div>
          <!-- 右侧：当前位置 -->
          <div class="status-r">
            <div class="stat location-stat">
              <label>当前位置</label>
              <span class="val location-val">{{ displayLocation }}</span>
            </div>
          </div>
        </div>

        <!-- 主内容区域 -->
        <div class="main-content">
          <slot>
            <div class="placeholder">
              <div class="placeholder-text">系统就绪</div>
              <div class="placeholder-sub">等待输入...</div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

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
// 加载状态
// ==========================================
const isBooting = ref(true)

// ==========================================
// MVU 数据
// ==========================================
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

// ==========================================
// 监听 MVU 变量更新
// ==========================================
let eventListener: EventOnReturn | null = null
let bootTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 获取当前消息楼层ID
  try {
    messageId.value = getCurrentMessageId()
  } catch (e) {
    console.error('获取消息楼层ID失败:', e)
  }

  // 初始获取数据
  fetchMvuData()

  // 监听 MVU 变量更新事件
  eventListener = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, fetchMvuData)

  // 启动动画 2.5秒后结束
  bootTimer = setTimeout(() => {
    isBooting.value = false
  }, 2500)
})

onUnmounted(() => {
  if (eventListener) {
    eventListener.stop()
  }
  if (bootTimer) {
    clearTimeout(bootTimer)
  }
})
</script>

<style scoped>
/* CSS 变量 */
:root {
  --g: #8BFF8B;
  --gd: #4a9a4a;
  --gD: #1a5a1a;
  --r: #FF4D4D;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

/* 主容器 - 适配酒馆界面 */
.status-bar-container {
  width: 100%;
  height: 100%;
  min-height: 120px;
  max-height: 200px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  contain: layout style;
}

/* Bezel - 简化边框 */
.bezel {
  flex: 1;
  background: #1a1510;
  border-radius: 12px;
  padding: 6px;
  display: flex;
  overflow: hidden;
}

.screen {
  flex: 1;
  background: #050a05;
  border-radius: 8px;
  padding: 10px 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Boot Screen */
.boot {
  position: absolute;
  inset: 0;
  background: #050a05;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.boot.hide {
  opacity: 0;
  pointer-events: none;
}

.boot-logo {
  font-size: 28px;
  color: #8BFF8B;
  margin-bottom: 12px;
}

.boot-t {
  color: #4a9a4a;
  font-size: 11px;
  margin: 3px 0;
  text-align: center;
  padding: 0 16px;
}

.boot-bar {
  width: 180px;
  height: 2px;
  background: #1a5a1a;
  margin-top: 12px;
  overflow: hidden;
}

.boot-fill {
  height: 100%;
  background: #8BFF8B;
  animation: boot 2.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes boot {
  from { width: 0; }
  to { width: 100%; }
}

/* Status Bar - 参考前端界面.html */
.status {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 2px solid #1a5a1a;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.status-l,
.status-c {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.status-l {
  width: 180px;
}

.status-c {
  width: 100px;
  align-items: center;
}

.status-r {
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #8BFF8B;
  font-size: 12px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.stat label {
  color: #4a9a4a;
  font-size: 10px;
  min-width: 22px;
  text-transform: uppercase;
}

.stat .val {
  font-size: 13px;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

.stat .time-val {
  font-size: 16px;
  letter-spacing: 1px;
}

.location-stat {
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.location-stat label {
  min-width: auto;
  font-size: 9px;
}

.location-val {
  font-size: 14px !important;
  min-width: auto !important;
  text-align: right;
}

/* 进度条 */
.bar-wrap {
  flex: 1;
  height: 10px;
  background: #0a2a0a;
  border: 2px solid #1a5a1a;
  position: relative;
  overflow: hidden;
  min-width: 60px;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #8BFF8B 0%, #4a9a4a 100%);
  box-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.bar::after {
  content: '';
  position: absolute;
  inset: 0 0 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
}

.segs {
  position: absolute;
  inset: 0;
  display: flex;
}

.seg {
  flex: 1;
  border-right: 1px solid rgba(0, 0, 0, 0.5);
}

.seg:last-child {
  border-right: none;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.placeholder-text {
  color: #8BFF8B;
  font-size: 14px;
}

.placeholder-sub {
  color: #4a9a4a;
  font-size: 10px;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .status-l {
    width: 140px;
  }

  .status-c {
    width: 80px;
  }

  .stat {
    font-size: 10px;
  }

  .stat label {
    font-size: 9px;
  }

  .stat .val {
    font-size: 11px;
    min-width: 40px;
  }

  .stat .time-val {
    font-size: 13px;
  }

  .location-val {
    font-size: 11px !important;
  }

  .bar-wrap {
    min-width: 50px;
    height: 8px;
  }
}
</style>
