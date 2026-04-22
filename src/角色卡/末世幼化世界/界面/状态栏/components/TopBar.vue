<template>
  <div class="top-bar">
    <!-- 左侧：HP/AP -->
    <div class="left-section">
      <!-- HP -->
      <div class="stat-row">
        <label>HP</label>
        <div class="bar-wrap">
          <div class="bar" :style="{ width: hpPercent + '%' }"></div>
          <div class="segs">
            <div class="seg" v-for="i in 10" :key="i"></div>
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
            <div class="seg" v-for="i in 10" :key="i"></div>
          </div>
        </div>
        <span class="val">{{ apCurrent }}/{{ apMax }}</span>
      </div>
    </div>

    <!-- 中间：等级/晶核/位置 -->
    <div class="center-section">
      <div class="info-row">
        <span class="info-item">
          <label>LEVEL</label>
          <span class="val">{{ level }}</span>
        </span>
        <span class="info-item">
          <label>晶核</label>
          <span class="val">{{ caps }}</span>
        </span>
      </div>
      <div class="location-row">
        <label>位置</label>
        <span class="location-val">{{ displayLocation }}</span>
      </div>
    </div>

    <!-- 右侧：时间 -->
    <div class="right-section">
      <span class="time-val">{{ displayTime }}</span>
      <span class="period-val">{{ displayPeriod }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStatusStore } from '../store'

const store = useStatusStore()

// HP/AP
const hpCurrent = computed(() => store.hpCurrent)
const hpMax = computed(() => store.hpMax)
const hpPercent = computed(() => store.hpPercent)
const apCurrent = computed(() => store.apCurrent)
const apMax = computed(() => store.apMax)
const apPercent = computed(() => store.apPercent)

// 其他状态
const level = computed(() => store.level)
const caps = computed(() => store.caps)
const displayTime = computed(() => store.displayTime)
const displayLocation = computed(() => store.displayLocation)
const displayPeriod = computed(() => store.displayPeriod)
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 2px solid var(--gD);
  gap: 15px;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 160px;
  flex-shrink: 0;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-row label {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
  min-width: 25px;
}

.bar-wrap {
  flex: 1;
  height: 10px;
  background: #0a2a0a;
  border: 1px solid var(--gD);
  position: relative;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--g) 0%, var(--gd) 100%);
  box-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
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
  color: var(--g);
  font-size: 12px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
  min-width: 50px;
  text-align: right;
}

.center-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item label {
  color: var(--gd);
  font-size: 10px;
  text-transform: uppercase;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.location-row label {
  color: var(--gd);
  font-size: 10px;
  text-transform: uppercase;
}

.location-val {
  color: var(--g);
  font-size: 12px;
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}

.time-val {
  color: var(--g);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.period-val {
  color: var(--gd);
  font-size: 10px;
}
</style>
