<template>
  <div class="status-panel">
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStatusStore } from '../store'

const store = useStatusStore()

// HP
const hpCurrent = computed(() => store.hpCurrent)
const hpMax = computed(() => store.hpMax)
const hpPercent = computed(() => store.hpPercent)

// AP
const apCurrent = computed(() => store.apCurrent)
const apMax = computed(() => store.apMax)
const apPercent = computed(() => store.apPercent)

// 显示的时间
const displayTime = computed(() => store.displayTime)

// 显示的地点
const displayLocation = computed(() => store.displayLocation)

// 显示的时刻/阶段
const displayPeriod = computed(() => store.displayPeriod)
</script>

<style scoped>
.status-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 10px;
  gap: 24px;
}

.status-l,
.status-c {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-l {
  flex: 0 0 auto;
  min-width: 160px;
}

.status-c {
  flex: 0 0 auto;
  align-items: flex-start;
  min-width: 80px;
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
  gap: 8px;
  color: #8BFF8B;
  font-size: 12px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.stat label {
  color: #4a9a4a;
  font-size: 10px;
  min-width: 24px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.stat .val {
  font-size: 13px;
  font-weight: bold;
  min-width: 50px;
  text-align: right;
}

.stat .time-val {
  font-size: 18px;
  letter-spacing: 2px;
  min-width: auto;
}

.location-stat {
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.location-stat label {
  min-width: auto;
  font-size: 9px;
  letter-spacing: 1px;
}

.location-val {
  font-size: 15px !important;
  min-width: auto !important;
  text-align: right;
  letter-spacing: 1px;
}

/* 进度条 */
.bar-wrap {
  flex: 1;
  height: 12px;
  background: #0a2a0a;
  border: 2px solid #1a5a1a;
  position: relative;
  overflow: hidden;
  min-width: 80px;
  max-width: 120px;
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

/* 响应式适配 */
@media (max-width: 480px) {
  .status-panel {
    padding: 6px 10px 8px;
    gap: 12px;
  }

  .status-l {
    min-width: 120px;
  }

  .status-c {
    min-width: 60px;
  }

  .stat {
    font-size: 10px;
    gap: 6px;
  }

  .stat label {
    font-size: 9px;
    min-width: 20px;
  }

  .stat .val {
    font-size: 11px;
    min-width: 40px;
  }

  .stat .time-val {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .location-val {
    font-size: 12px !important;
  }

  .bar-wrap {
    min-width: 50px;
    max-width: 80px;
    height: 10px;
  }
}
</style>
