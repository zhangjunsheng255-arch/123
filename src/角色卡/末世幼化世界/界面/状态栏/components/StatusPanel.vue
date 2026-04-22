<template>
  <div class="status-panel">
    <!-- 顶部状态栏 -->
    <div class="top-stats">
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
    
    <!-- 中间信息栏 -->
    <div class="info-section">
      <div class="info-row">
        <label>LEVEL</label>
        <span class="val">{{ level }}</span>
      </div>
      <div class="info-row">
        <label>位置</label>
        <span class="val">{{ displayLocation }}</span>
      </div>
    </div>
    
    <!-- 右侧信息 -->
    <div class="right-info">
      <div class="info-row">
        <label>CAPS</label>
        <span class="val">{{ caps }}</span>
      </div>
      <div class="info-row">
        <label>负重</label>
        <span class="val">{{ weightCurrent }}/{{ weightMax }}</span>
      </div>
    </div>
    
    <!-- 时间显示 -->
    <div class="time-section">
      <span class="time-val">{{ displayTime }}</span>
      <span class="period-val">{{ displayPeriod }}</span>
    </div>
  </div>
  
  <!-- 属性/技能/专长面板 -->
  <div class="stats-panel">
    <!-- Tab 导航 -->
    <div class="tabs">
      <div 
        class="tab" 
        :class="{ active: activeTab === 'special' }"
        @click="activeTab = 'special'"
      >SPECIAL</div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'skills' }"
        @click="activeTab = 'skills'"
      >技能</div>
      <div 
        class="tab" 
        :class="{ active: activeTab === 'perks' }"
        @click="activeTab = 'perks'"
      >PERK</div>
    </div>
    
    <!-- SPECIAL 属性 -->
    <div v-if="activeTab === 'special'" class="tab-content">
      <div class="special-list">
        <div 
          v-for="attr in specialAttrs" 
          :key="attr.key"
          class="spec-item"
          :class="{ selected: selectedSpecial === attr.key }"
          @click="selectedSpecial = attr.key"
        >
          <div class="spec-info">
            <div class="spec-letter">{{ attr.letter }}</div>
            <div class="spec-details">
              <div class="spec-name">{{ attr.name }}</div>
              <div class="spec-desc">{{ attr.desc }}</div>
            </div>
          </div>
          <div class="spec-val">{{ attr.value }}</div>
        </div>
      </div>
    </div>
    
    <!-- 技能 -->
    <div v-if="activeTab === 'skills'" class="tab-content">
      <div class="skills-list scrollable">
        <div 
          v-for="skill in skills" 
          :key="skill.name"
          class="expandable"
          :class="{ selected: selectedSkill === skill.name }"
          @click="selectedSkill = selectedSkill === skill.name ? null : skill.name"
        >
          <div class="exp-header">
            <span class="exp-name">{{ skill.name }}</span>
            <span class="exp-meta">{{ skill.value }}</span>
          </div>
          <div class="exp-details" v-if="selectedSkill === skill.name">
            <div class="exp-desc">{{ skill.desc }}</div>
            <div class="exp-effects">{{ skill.effects }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 专长 -->
    <div v-if="activeTab === 'perks'" class="tab-content">
      <div class="perks-list scrollable">
        <div 
          v-for="perk in perks" 
          :key="perk.name"
          class="expandable"
          :class="{ selected: selectedPerk === perk.name }"
          @click="selectedPerk = selectedPerk === perk.name ? null : perk.name"
        >
          <div class="exp-header">
            <span class="exp-name">{{ perk.name }}</span>
            <span class="exp-meta">Rank {{ perk.rank }}</span>
          </div>
          <div class="exp-details" v-if="selectedPerk === perk.name">
            <div class="exp-desc">{{ perk.desc }}</div>
            <div class="exp-effects">{{ perk.effects }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStatusStore } from '../store'

const store = useStatusStore()
const activeTab = ref('special')
const selectedSpecial = ref('S')
const selectedSkill = ref<string | null>(null)
const selectedPerk = ref<string | null>(null)

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

// SPECIAL 属性
const specialAttrs = computed(() => store.specialAttrs)

// 技能
const skills = computed(() => store.skills)

// 专长
const perks = computed(() => store.perks)
</script>

<style scoped>
.status-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 12px;
  border-bottom: 2px solid var(--gD);
}

.top-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 140px;
}

.stat-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.info-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-row label {
  color: var(--gd);
  font-size: 11px;
}

.right-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  width: 100px;
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

/* Stats Panel */
.stats-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tabs {
  display: flex;
  gap: 5px;
  padding: 12px 0;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 15px;
}

.tab {
  color: var(--gd);
  font-size: 14px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--g);
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 0 8px var(--g);
}

.tab:hover {
  color: var(--gd);
}

.tab.active {
  color: var(--g);
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.8);
}

.tab.active::after {
  opacity: 1;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

/* SPECIAL */
.special-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(26, 90, 26, 0.1);
  border: 1px solid var(--gD);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.spec-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--g);
  opacity: 0;
  transition: opacity 0.2s;
}

.spec-item:hover,
.spec-item.selected {
  background: rgba(139, 255, 139, 0.15);
  border-color: var(--g);
  box-shadow: 0 0 15px rgba(139, 255, 139, 0.3);
}

.spec-item.selected::before {
  opacity: 1;
  box-shadow: 0 0 8px var(--g);
}

.spec-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spec-letter {
  font-size: 28px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 12px rgba(139, 255, 139, 0.8);
  width: 35px;
  text-align: center;
}

.spec-name {
  color: var(--g);
  font-size: 16px;
}

.spec-desc {
  color: var(--gd);
  font-size: 11px;
  margin-top: 2px;
}

.spec-val {
  font-size: 32px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 15px rgba(139, 255, 139, 1);
  min-width: 45px;
  text-align: center;
}

/* Skills & Perks */
.skills-list,
.perks-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100%;
  overflow-y: auto;
}

.scrollable {
  padding-right: 8px;
}

.scrollable::-webkit-scrollbar {
  width: 6px;
}

.scrollable::-webkit-scrollbar-track {
  background: rgba(26, 90, 26, 0.2);
  border-radius: 3px;
  border: 1px solid var(--gD);
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--gD);
  border-radius: 3px;
  border: 1px solid var(--gd);
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background: var(--gd);
}

.expandable {
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.expandable:hover,
.expandable.selected {
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--g);
  box-shadow: 0 0 12px rgba(139, 255, 139, 0.2);
}

.expandable.selected .exp-header {
  background: rgba(139, 255, 139, 0.15);
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.exp-name {
  color: var(--g);
  font-size: 15px;
}

.exp-meta {
  color: var(--gd);
  font-size: 13px;
}

.exp-details {
  padding: 0 14px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.35s;
  opacity: 0;
  border-top: 1px solid transparent;
}

.expandable.selected .exp-details {
  padding: 12px 14px;
  max-height: 200px;
  opacity: 1;
  border-top-color: var(--gD);
}

.exp-desc {
  color: var(--gd);
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.exp-effects {
  color: var(--g);
  font-size: 12px;
}

.exp-effects::before {
  content: '效果: ';
  color: var(--gd);
}
</style>
