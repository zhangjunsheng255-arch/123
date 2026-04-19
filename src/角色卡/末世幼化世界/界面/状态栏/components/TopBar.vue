<template>
  <div class="status">
    <div class="status-l">
      <div class="stat">
        <label>HP</label>
        <div class="bar-wrap">
          <div
            class="bar"
            :style="{
              width: Math.min(((stat_data?.涓昏?.HP?.褰撳墠 || 0) / (stat_data?.涓昏?.HP?.涓婇檺 || 1)) * 100, 100) + '%',
            }"
          ></div>
          <div class="segs"><div v-for="i in 10" :key="i" class="seg"></div></div>
        </div>
        <span class="val">{{ stat_data?.涓昏?.HP?.褰撳墠 || 0 }}/{{ stat_data?.涓昏?.HP?.涓婇檺 || 0 }}</span>
      </div>
      <div class="stat">
        <label>AP</label>
        <div class="bar-wrap">
          <div
            class="bar"
            :style="{
              width: Math.min(((stat_data?.涓昏?.AP?.褰撳墠 || 0) / (stat_data?.涓昏?.AP?.涓婇檺 || 1)) * 100, 100) + '%',
            }"
          ></div>
          <div class="segs"><div v-for="i in 10" :key="i" class="seg"></div></div>
        </div>
        <span class="val">{{ stat_data?.涓昏?.AP?.褰撳墠 || 0 }}/{{ stat_data?.涓昏?.AP?.涓婇檺 || 0 }}</span>
      </div>
    </div>
    <div class="status-c">
      <div class="stat">
        <label>LEVEL</label><span class="val">{{ stat_data?.涓昏?.褰撳墠绛夌骇 || 1 }}</span>
      </div>
      <div class="stat">
        <label>浣嶇疆</label><span class="val">{{ stat_data?.涓栫晫?.褰撳墠浣嶇疆?.鍏蜂綋鍦扮偣 || '鏈煡' }}</span>
      </div>
    </div>
    <div class="status-r">
      <div class="stat">
        <label>CAPS</label><span class="val">{{ stat_data?.涓昏?.鏅舵牳鏁伴噺 || 0 }}</span>
      </div>
      <div class="info-item">
        <label>璐熼噸</label>
        <span>{{ currentWeight }}/{{ stat_data?.鐘舵€?.灞炴€х偣?.鍔涢噺 ? stat_data.鐘舵€?灞炴€х偣.鍔涢噺 * 10 : 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  stat_data: any;
}>();

const currentWeight = computed(() => {
  let weight = 0;
  const invTabs = [
    { id: 'weapons', label: '姝﹀櫒', key: '姝﹀櫒' },
    { id: 'apparel', label: '鏈嶈', key: '瑁呭' },
    { id: 'aid', label: '鑽搧', key: '鑽搧' },
    { id: 'misc', label: '鏉傜墿', key: '閬撳叿' },
  ];
  for (const tab of invTabs) {
    const category = props.stat_data?.鑳屽寘?.[tab.key as keyof typeof props.stat_data.鑳屽寘];
    if (category) {
      for (const item of Object.values(category)) {
        weight += (item as any).鏁伴噺 || 1;
      }
    }
  }
  return weight.toFixed(1);
});
</script>

<style scoped>
.status {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 15px;
}
.status-l,
.status-c {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 140px;
}
.status-r {
  display: flex;
  align-items: center;
  gap: 20px;
}
.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--g);
  font-size: 14px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}
.stat label {
  color: var(--gd);
  font-size: 11px;
  min-width: 25px;
}
.stat .val {
  font-size: 16px;
  font-weight: bold;
  min-width: 60px;
}
.bar-wrap {
  flex: 1;
  height: 12px;
  background: #0a2a0a;
  border: 2px solid var(--gD);
  position: relative;
  overflow: hidden;
  min-width: 80px;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--g) 0%, var(--gd) 100%);
  box-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
  transition: width 0.3s var(--ease);
  position: relative;
}
.bar::after {
  content: '';
  position: relative;
  inset: 0 0 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
}
.segs {
  position: relative;
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
.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--g);
  font-size: 14px;
}
.info-item label {
  color: var(--gd);
  font-size: 11px;
}
</style>
