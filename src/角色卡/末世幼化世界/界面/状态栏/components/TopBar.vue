<template>
  <div class="top-bar">
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

    <!-- 等级 -->
    <div class="info-row">
      <label>LEVEL</label>
      <span class="val">{{ level }}</span>
    </div>

    <!-- 位置 -->
    <div class="info-row">
      <label>位置</label>
      <span class="val">{{ displayLocation }}</span>
    </div>

    <!-- 瓶盖 -->
    <div class="info-row">
      <label>CAPS</label>
      <span class="val">{{ caps }}</span>
    </div>

    <!-- 负重 -->
    <div class="info-row">
      <label>负重</label>
      <span class="val">{{ weightCurrent }}/{{ weightMax }}</span>
    </div>

    <!-- 时间 -->
    <div class="time-section">
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
const weightCurrent = computed(() => store.weightCurrent)
const weightMax = computed(() => store.weightMax)
const displayTime = computed(() => store.displayTime)
const displayLocation = computed(() => store.displayLocation)
const displayPeriod = computed(() => store.displayPeriod)
</script>

<style scoped>
.top-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 12px;
  border-bottom: 2px solid var(--gD);
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 140px;
}

.stat-row label {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
}

.bar-wrap {
  height: 12px;
  background: #0a2a0a;
  border: 2px solid var(--gD);
  position: relative;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--g) 0%, var(--gd) 100%);
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
  color: var(--g);
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 80px;
}

.info-row label {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  margin-left: auto;
}

.time-val {
  color: var(--g);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.period-val {
  color: var(--gd);
  font-size: 11px;
}
</style>
