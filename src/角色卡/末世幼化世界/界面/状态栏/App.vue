<template>
  <div class="status-bar-container">
    <div class="bezel">
      <div class="glass"></div>
      <div class="screen">
        <div class="curve"></div>

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
        <div class="status-bar">
          <div class="status-section time-section">
            <div class="status-label">时间</div>
            <div class="status-value">{{ displayTime }}</div>
          </div>
          <div class="status-section location-section">
            <div class="status-label">地点</div>
            <div class="status-value">{{ displayLocation }}</div>
          </div>
          <div class="status-section period-section">
            <div class="status-label">时刻</div>
            <div class="status-value">{{ displayPeriod }}</div>
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

  <!-- CRT 效果 -->
  <div class="crt">
    <div class="scanlines"></div>
    <div class="flicker"></div>
    <div class="noise"></div>
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

interface MvuStatData {
  世界?: WorldData
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

// 获取 MVU 数据 - 使用可选链优化
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
  background: linear-gradient(145deg, #2a2520 0%, #1a1510 100%);
  border-radius: 12px;
  padding: 6px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, .8), 0 4px 12px rgba(0, 0, 0, .4);
  display: flex;
  overflow: hidden;
}

.glass {
  position: absolute;
  inset: 6px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(255, 255, 255, .08) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, .03) 100%);
  pointer-events: none;
  z-index: 100;
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
  box-shadow: inset 0 0 20px rgba(0, 0, 0, .9);
}



.curve {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, .15) 0%, transparent 10%, transparent 90%, rgba(0, 0, 0, .15) 100%);
  pointer-events: none;
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
  text-shadow: 0 0 20px rgba(139, 255, 139, .8);
  margin-bottom: 12px;
  animation: bootPulse 2s infinite;
}

@keyframes bootPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
  box-shadow: 0 0 8px #8BFF8B;
  animation: boot 2.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes boot {
  from { width: 0; }
  to { width: 100%; }
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #1a5a1a;
  margin-bottom: 8px;
  background: rgba(26, 90, 26, 0.08);
  border-radius: 6px;
  flex-shrink: 0;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
}

.status-label {
  color: #4a9a4a;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-value {
  color: #8BFF8B;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.time-section .status-value {
  font-size: 16px;
  letter-spacing: 1px;
}

.location-section .status-value {
  font-size: 11px;
}

.period-section .status-value {
  font-size: 14px;
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

/* CRT Effects - 简化 */
.crt {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  contain: strict;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, .25) 0 1px, transparent 1px 3px);
  opacity: 0.6;
}

.flicker {
  position: absolute;
  inset: 0;
  background: rgba(139, 255, 139, .015);
  animation: flick 0.15s steps(2) infinite;
}

@keyframes flick {
  0%, 100% { opacity: 0.025; }
  50% { opacity: 0.012; }
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* 响应式适配 */
@media (max-width: 480px) {
  .status-bar {
    padding: 6px 8px;
  }
  
  .status-value {
    font-size: 11px;
  }
  
  .time-section .status-value {
    font-size: 14px;
  }
  
  .location-section .status-value {
    font-size: 9px;
  }
  
  .period-section .status-value {
    font-size: 12px;
  }
  
  .status-label {
    font-size: 8px;
  }
}
</style>
