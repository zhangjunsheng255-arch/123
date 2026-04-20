<template>
  <div id="p-status" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in statusTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: statusTab === tab.id }"
        @click="statusTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <div v-show="statusTab === 'special'" class="stat-content">
        <div v-if="stat_data?.状态?.属性点" class="special">
          <div
            v-for="(val, key) in stat_data.状态.属性点"
            :key="key"
            class="spec-item"
            :class="{ selected: selectedSpecial === key }"
            @click="selectedSpecial = key as string"
          >
            <div class="spec-info">
              <div class="spec-letter">{{ getSpecialLetter(key as string) }}</div>
              <div>
                <div class="spec-name">{{ key }}</div>
                <div class="spec-desc">{{ getSpecialDesc(key as string) }}</div>
              </div>
            </div>
            <div class="spec-val">{{ val }}</div>
          </div>
        </div>
      </div>
      <div v-show="statusTab === 'skills'" class="stat-content">
        <template v-if="stat_data?.状态?.技能">
          <div
            v-for="(skill, name) in stat_data.状态.技能"
            :key="name"
            class="expandable"
            :class="{ selected: expandedItem === 'skill_' + name }"
            @click="toggleExpand('skill_' + name)"
          >
            <div class="exp-header">
              <span class="exp-name">{{ name }}</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ (skill as any).描述 }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-show="statusTab === 'perks'" class="stat-content">
        <template v-if="stat_data?.状态?.专长">
          <div
            v-for="(perk, name) in stat_data.状态.专长"
            :key="name"
            class="expandable"
            :class="{ selected: expandedItem === 'perk_' + name }"
            @click="toggleExpand('perk_' + name)"
          >
            <div class="exp-header">
              <span class="exp-name">{{ name }}</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ (perk as any).描述 }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  active: boolean;
  stat_data: any;
}>();

const statusTab = ref('special');
const selectedSpecial = ref('力量');
const expandedItem = ref<string | null>(null);

const statusTabs = [
  { id: 'special', label: 'SPECIAL' },
  { id: 'skills', label: '技能' },
  { id: 'perks', label: 'PERK' },
];

const getSpecialLetter = (key: string) =>
  ({ 力量: 'S', 感知: 'P', 耐力: 'E', 魅力: 'C', 智力: 'I', 敏捷: 'A', 幸运: 'L' })[key] || key.charAt(0);
const getSpecialDesc = (key: string) =>
  ({
    力量: '近战伤害与负重能力',
    感知: '环境感知与VATS精度',
    耐力: '生命值与抗性',
    魅力: '对话与交易能力',
    智力: '经验获取与黑客',
    敏捷: '行动点数与潜行',
    幸运: '暴击与随机事件',
  })[key] || '';

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};
</script>

<style scoped>
.page {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease),
    visibility 0.3s;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
.page.active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  z-index: 10;
}

.tabs {
  display: flex;
  gap: 5px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 15px;
}
.tab {
  color: var(--gD);
  font-size: 14px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
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

.scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
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
  transition: background 0.2s;
}
.scrollable::-webkit-scrollbar-thumb:hover {
  background: var(--gd);
}

.expandable {
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s var(--ease);
  overflow: hidden;
  margin-bottom: 6px;
  transform: translateZ(0);
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
  transition: background 0.2s var(--ease);
}
.exp-name {
  color: var(--g);
  font-size: 15px;
}
.exp-meta {
  color: var(--gd);
  font-size: 13px;
  display: flex;
  gap: 15px;
}
.exp-details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease);
}
.exp-details-inner {
  overflow: hidden;
}
.expandable.selected .exp-details {
  grid-template-rows: 1fr;
}
.exp-details-content {
  padding: 0 14px;
  transition:
    padding 0.35s var(--ease),
    opacity 0.35s var(--ease),
    border-color 0.35s var(--ease);
  opacity: 0;
  border-top: 1px solid transparent;
}
.expandable.selected .exp-details-content {
  padding: 12px 14px;
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

.special {
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
  transition: all 0.2s var(--ease);
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
</style>
