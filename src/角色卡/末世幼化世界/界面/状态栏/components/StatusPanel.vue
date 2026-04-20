<template>
  <div class="status-panel">
    <!-- HP -->
    <div class="stat-row">
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
    
    <!-- AP -->
    <div class="stat-row">
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
    
    <!-- 时间 -->
    <div class="info-row">
      <label>时间</label>
      <span class="time-val">{{ displayTime }}</span>
    </div>
    
    <!-- 时刻 -->
    <div class="info-row">
      <label>时刻</label>
      <span class="val">{{ displayPeriod }}</span>
    </div>
    
    <!-- 位置 -->
    <div class="location-row">
      <label>位置</label>
      <span class="location-val">{{ displayLocation }}</span>
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
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-bottom: 2px solid #1a5a1a;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-row label {
  color: #4a9a4a;
  font-size: 10px;
  text-transform: uppercase;
}

.bar-wrap {
  height: 10px;
  background: #0a2a0a;
  border: 2px solid #1a5a1a;
  position: relative;
  overflow: hidden;
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

.val {
  color: #8BFF8B;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row label {
  color: #4a9a4a;
  font-size: 10px;
  text-transform: uppercase;
}

.time-val {
  color: #8BFF8B;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.location-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
}

.location-row label {
  color: #4a9a4a;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.location-val {
  color: #8BFF8B;
  font-size: 11px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
  line-height: 1.3;
}
</style>
