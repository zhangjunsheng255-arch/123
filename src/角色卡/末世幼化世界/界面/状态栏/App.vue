<template>
  <div class="device">
    <div class="top">
      <div class="brand">PIP-BOY 3000 MARK IV</div>
    </div>

    <div class="case">
      <div class="trim"></div>
      <div class="screw tl"></div>
      <div class="screw tr"></div>
      <div class="screw bl"></div>
      <div class="screw br"></div>

      <div class="bezel">
        <div class="glass"></div>
        <div class="screen">
          <div class="glow"></div>
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
  </div>

  <!-- CRT 效果 -->
  <div class="crt">
    <div class="scanlines"></div>
    <div class="flicker"></div>
    <div class="noise"></div>
    <div class="vignette"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

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

// 获取 MVU 数据
const fetchMvuData = () => {
  try {
    const data = Mvu.getMvuData({ type: 'message', message_id: messageId.value })
    mvuData.value = _.get(data, 'stat_data', {})
  } catch (e) {
    console.error('获取 MVU 数据失败:', e)
  }
}

// ==========================================
// 计算属性 - 从 MVU 数据读取
// ==========================================

// 显示的时间
const displayTime = computed(() => {
  return _.get(mvuData.value, '世界.时间.时刻', '08:00')
})

// 显示的地点（区域 + 具体地点）
const displayLocation = computed(() => {
  const region = _.get(mvuData.value, '世界.当前位置.区域', '荒野公路')
  const location = _.get(mvuData.value, '世界.当前位置.具体地点', '废弃加油站')
  return `${region}·${location}`
})

// 显示的时刻/阶段
const displayPeriod = computed(() => {
  return _.get(mvuData.value, '世界.时间.阶段', '上午')
})

// ==========================================
// 监听 MVU 变量更新
// ==========================================
let unsubscribe: (() => void) | null = null

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
  unsubscribe = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, () => {
    fetchMvuData()
  })

  // 启动动画 2.5秒后结束
  setTimeout(() => {
    isBooting.value = false
  }, 2500)
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --g: #8BFF8B;
  --gd: #4a9a4a;
  --gD: #1a5a1a;
  --r: #FF4D4D;
  --c1: #9B8365;
  --c2: #7B6344;
  --c3: #6B5344;
  --c4: #4A3728;
  --c5: #3A2A20;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

body {
  background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%);
  font-family: 'Share Tech Mono', monospace;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  user-select: none;
}
</style>

<style scoped>
/* CRT Effects */
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
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, .3) 0 2px, transparent 2px 4px);
  animation: scan 8s linear infinite;
  contain: strict;
}

@keyframes scan {
  to {
    transform: translateY(4px);
  }
}

.flicker {
  position: absolute;
  inset: 0;
  background: rgba(139, 255, 139, .02);
  animation: flick 0.15s infinite;
}

@keyframes flick {

  0%,
  100% {
    opacity: 0.028;
  }

  50% {
    opacity: 0.015;
  }
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: n 0.5s steps(5) infinite;
}

@keyframes n {

  0%,
  100% {
    transform: translate(0);
  }

  50% {
    transform: translate(-2%, 2%);
  }
}

.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, .4) 100%);
}

/* Device */
.device {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top {
  width: 80%;
  height: 50px;
  background: linear-gradient(180deg, var(--c1) 0%, var(--c2) 50%, var(--c5) 100%);
  border-radius: 25px 25px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 5px rgba(255, 255, 255, .2), 0 10px 30px rgba(0, 0, 0, .5);
}

.brand {
  font-size: 20px;
  color: var(--c5);
  letter-spacing: 4px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, .2);
}

.case {
  width: 100%;
  aspect-ratio: 16/10;
  background: linear-gradient(145deg, var(--c1) 0%, var(--c2) 30%, var(--c3) 50%, var(--c4) 100%);
  border-radius: 30px;
  padding: 15px;
  position: relative;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, .4), 0 20px 60px rgba(0, 0, 0, .8);
}

.trim {
  position: absolute;
  inset: 6px;
  border: 2px solid var(--gD);
  border-radius: 28px;
  opacity: 0.6;
  pointer-events: none;
}

.trim::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--gd);
  border-radius: 24px;
  opacity: 0.4;
}

.screw {
  position: absolute;
  width: 16px;
  height: 16px;
  background: radial-gradient(circle at 30% 30%, #D0D0D0 0%, #606060 100%);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, .5), 0 3px 6px rgba(0, 0, 0, .5);
  z-index: 10;
}

.screw::before,
.screw::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background: #404040;
}

.screw::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.screw::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.tl {
  top: 12px;
  left: 12px;
}

.tr {
  top: 12px;
  right: 12px;
}

.bl {
  bottom: 12px;
  left: 12px;
}

.br {
  bottom: 12px;
  right: 12px;
}

.bezel {
  background: linear-gradient(145deg, #2a2520 0%, #1a1510 100%);
  border-radius: 24px;
  padding: 10px;
  height: 100%;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, .8);
}

.glass {
  position: absolute;
  inset: 10px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(255, 255, 255, .1) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, .05) 100%);
  pointer-events: none;
  z-index: 100;
}

.screen {
  background: #050a05;
  border-radius: 18px;
  height: 100%;
  padding: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, .9);
}

.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(139, 255, 139, .08) 0%, transparent 60%);
  pointer-events: none;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.8;
  }

  50% {
    opacity: 1;
  }
}

.curve {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, .2) 0%, transparent 10%, transparent 90%, rgba(0, 0, 0, .2) 100%);
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
  transition: opacity 0.5s var(--ease);
}

.boot.hide {
  opacity: 0;
  pointer-events: none;
}

.boot-logo {
  font-size: 36px;
  color: var(--g);
  text-shadow: 0 0 30px rgba(139, 255, 139, .8);
  margin-bottom: 20px;
  animation: bootPulse 2s infinite;
}

@keyframes bootPulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.boot-t {
  color: var(--gd);
  font-size: 14px;
  margin: 4px 0;
  text-align: center;
  padding: 0 20px;
}

.boot-bar {
  width: 250px;
  height: 3px;
  background: var(--gD);
  margin-top: 20px;
  overflow: hidden;
}

.boot-fill {
  height: 100%;
  background: var(--g);
  box-shadow: 0 0 10px var(--g);
  animation: boot 2.5s var(--ease-out) forwards;
}

@keyframes boot {
  from {
    width: 0;
  }

  to {
    width: 100%;
  }
}

/* Status Bar */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 12px;
  background: rgba(26, 90, 26, 0.1);
  border-radius: 8px;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.status-label {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.status-value {
  color: var(--g);
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(139, 255, 139, .6);
  text-align: center;
}

.time-section .status-value {
  font-size: 20px;
  letter-spacing: 1px;
}

.location-section .status-value {
  font-size: 14px;
}

.period-section .status-value {
  font-size: 18px;
  color: var(--g);
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {

  0%,
  100% {
    text-shadow: 0 0 10px rgba(139, 255, 139, .6);
  }

  50% {
    text-shadow: 0 0 20px rgba(139, 255, 139, 1), 0 0 30px rgba(139, 255, 139, .8);
  }
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100% - 85px);
}

.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.placeholder-text {
  color: var(--g);
  font-size: 20px;
  text-shadow: 0 0 15px rgba(139, 255, 139, .5);
}

.placeholder-sub {
  color: var(--gd);
  font-size: 12px;
}
</style>
