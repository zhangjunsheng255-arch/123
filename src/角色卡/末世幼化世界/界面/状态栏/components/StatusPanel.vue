<template>
  <div class="stats-panel">
    <!-- Tab 导航 -->
    <div class="tabs">
      <div class="tab" :class="{ active: activeTab === 'special' }" @click="activeTab = 'special'">
        属性
      </div>
      <div class="tab" :class="{ active: activeTab === 'skills' }" @click="activeTab = 'skills'">
        技能
      </div>
      <div class="tab" :class="{ active: activeTab === 'perks' }" @click="activeTab = 'perks'">
        专长
      </div>
    </div>

    <!-- SPECIAL 属性 -->
    <div v-if="activeTab === 'special'" class="tab-content">
      <div class="special-list">
        <div v-for="attr in specialAttrs" :key="attr.key" class="spec-item"
          :class="{ selected: selectedSpecial === attr.key }" @click="selectedSpecial = attr.key">
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
      <div v-if="skills.length === 0" class="empty-message">
        <div class="empty-text">暂无技能</div>
        <div class="empty-sub">通过剧情发展获得技能</div>
      </div>
      <div v-else class="skills-list scrollable">
        <div v-for="skill in skills" :key="skill.name" class="expandable"
          :class="{ selected: selectedSkill === skill.name }"
          @click="selectedSkill = selectedSkill === skill.name ? null : skill.name">
          <div class="exp-header">
            <span class="exp-name">{{ skill.name }}</span>
          </div>
          <div class="exp-details" v-if="selectedSkill === skill.name">
            <div class="exp-desc">{{ skill.desc }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 专长 -->
    <div v-if="activeTab === 'perks'" class="tab-content">
      <div v-if="perks.length === 0" class="empty-message">
        <div class="empty-text">暂无专长</div>
        <div class="empty-sub">通过剧情发展获得专长</div>
      </div>
      <div v-else class="perks-list scrollable">
        <div v-for="perk in perks" :key="perk.name" class="expandable"
          :class="{ selected: selectedPerk === perk.name }"
          @click="selectedPerk = selectedPerk === perk.name ? null : perk.name">
          <div class="exp-header">
            <span class="exp-name">{{ perk.name }}</span>
          </div>
          <div class="exp-details" v-if="selectedPerk === perk.name">
            <div class="exp-desc">{{ perk.desc }}</div>
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

// SPECIAL 属性
const specialAttrs = computed(() => store.specialAttrs)

// 技能
const skills = computed(() => store.skills)

// 专长
const perks = computed(() => store.perks)
</script>

<style scoped>
.stats-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 12px 0;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 12px;
  flex-shrink: 0;
}

.tab {
  color: var(--gd);
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

.tab::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--g);
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 0 8px var(--g);
}

.tab:hover {
  color: var(--g);
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
  min-height: 0;
}

/* 滚动区域 */
.scrollable {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.scrollable::-webkit-scrollbar {
  width: 8px;
}

.scrollable::-webkit-scrollbar-track {
  background: rgba(26, 90, 26, 0.2);
  border-radius: 4px;
  border: 1px solid var(--gD);
}

.scrollable::-webkit-scrollbar-thumb {
  background: var(--gD);
  border-radius: 4px;
  border: 1px solid var(--gd);
}

.scrollable::-webkit-scrollbar-thumb:hover {
  background: var(--gd);
}

/* SPECIAL - 固定高度 */
.special-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(26, 90, 26, 0.1);
  border: 1px solid var(--gD);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex: 1;
  min-height: 0;
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
  box-shadow: 0 0 12px rgba(139, 255, 139, 0.3);
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
  font-size: 24px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.8);
  width: 32px;
  text-align: center;
}

.spec-name {
  color: var(--g);
  font-size: 16px;
  font-weight: bold;
}

.spec-desc {
  color: var(--gd);
  font-size: 12px;
  margin-top: 2px;
}

.spec-val {
  font-size: 28px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 15px rgba(139, 255, 139, 1);
  min-width: 40px;
  text-align: center;
}

/* 空状态提示 */
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.empty-text {
  color: var(--g);
  font-size: 20px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.5);
  font-weight: bold;
}

.empty-sub {
  color: var(--gd);
  font-size: 14px;
}

/* Skills & Perks */
.skills-list,
.perks-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  padding: 12px 14px;
  transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.exp-name {
  color: var(--g);
  font-size: 16px;
  font-weight: bold;
}

.exp-meta {
  color: var(--gd);
  font-size: 14px;
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
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 8px;
}

.exp-effects {
  color: var(--g);
  font-size: 13px;
}

.exp-effects::before {
  content: '效果: ';
  color: var(--gd);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .tabs {
    gap: 6px;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  .tab {
    font-size: 14px;
    padding: 6px 12px;
  }

  .spec-letter {
    font-size: 20px;
    width: 28px;
  }

  .spec-name {
    font-size: 14px;
  }

  .spec-desc {
    font-size: 11px;
  }

  .spec-val {
    font-size: 24px;
  }

  .empty-text {
    font-size: 18px;
  }

  .empty-sub {
    font-size: 12px;
  }

  .exp-name {
    font-size: 14px;
  }

  .exp-desc {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .tabs {
    gap: 4px;
    padding: 8px 0;
  }

  .tab {
    font-size: 13px;
    padding: 5px 10px;
  }

  .spec-item {
    padding: 8px 10px;
  }

  .spec-letter {
    font-size: 18px;
    width: 24px;
  }

  .spec-name {
    font-size: 13px;
  }

  .spec-desc {
    font-size: 10px;
  }

  .spec-val {
    font-size: 20px;
  }

  .exp-header {
    padding: 10px 12px;
  }

  .exp-name {
    font-size: 13px;
  }
}
</style>
