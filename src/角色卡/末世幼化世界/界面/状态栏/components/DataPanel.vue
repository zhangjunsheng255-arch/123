<template>
  <div id="p-data" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in dataTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: dataTab === tab.id }"
        @click="dataTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <div v-show="dataTab === 'quests'" class="data-content">
        <div v-if="stat_data?.基地" class="data-grid">
          <div class="data-card">
            <div class="data-title">基地等级</div>
            <div class="data-val">{{ stat_data.基地.基地等级 || 0 }}</div>
          </div>
          <div class="data-card">
            <div class="data-title">控制总数</div>
            <div class="data-val">
              {{ stat_data.基地.控制统计?.当前控制幼女总数 || 0 }}/{{ stat_data.基地.控制统计?.可控制上限 || 3 }}
            </div>
          </div>
          <div class="data-card">
            <div class="data-title">战斗型幼女</div>
            <div class="data-val">{{ stat_data.基地.幼女分类与数量?.战斗型幼女 || 0 }}</div>
          </div>
          <div class="data-card">
            <div class="data-title">游戏时间</div>
            <div class="data-val">{{ stat_data?.世界?.时间?.阶段 || '未知' }}</div>
          </div>
        </div>
        <div class="inv-cat">进行中的任务</div>
        <template v-if="stat_data?.基地?.任务系统">
          <div
            v-for="(quest, name) in stat_data.基地.任务系统"
            :key="name"
            class="expandable"
            :class="{ selected: expandedItem === 'quest_' + name }"
            @click="toggleExpand('quest_' + name)"
          >
            <div class="exp-header">
              <span class="exp-name">{{ name }}</span>
              <span class="exp-meta">{{ (quest as any).状态 }} ({{ (quest as any).进度 || 0 }}%)</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ (quest as any).描述 }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-show="dataTab === 'stats'" class="data-content">
        <div v-if="stat_data?.NPC列表" class="data-grid">
          <div v-for="(val, name) in stat_data.NPC列表" :key="name" class="data-card">
            <div class="data-title">{{ name }}</div>
            <div class="data-val">{{ (val as any).好感度 || 0 }}</div>
            <div class="data-title" style="margin-top: 5px">{{ (val as any).关系 || '未知' }}</div>
          </div>
        </div>
      </div>
      <div v-show="dataTab === 'notes'" class="data-content">
        <template v-if="stat_data?.重要人物列表">
          <div v-for="(person, name) in stat_data.重要人物列表" :key="name" class="expandable">
            <div class="exp-header">
              <span class="exp-name">{{ name }}</span>
              <span class="exp-meta">{{ (person as any).关系 || '中立' }} ({{ (person as any).好感度 || 0 }})</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  active: boolean;
  stat_data: any;
}>();

const emit = defineEmits<{
  'update:active': [value: boolean];
  requestDataPage: [];
}>();

const dataTab = ref('quests');
const expandedItem = ref<string | null>(null);

const dataTabs = [
  { id: 'quests', label: '任务' },
  { id: 'stats', label: '统计' },
  { id: 'notes', label: '笔记' },
];

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};

// Auto-expand when a new quest arrives or first time data loads
watch(
  () => props.stat_data?.基地?.任务系统,
  newQuests => {
    if (newQuests && Object.keys(newQuests).length > 0) {
      emit('requestDataPage');
      dataTab.value = 'quests';
      // Automatically expand the first quest
      const firstQuestKey = Object.keys(newQuests)[0];
      expandedItem.value = 'quest_' + firstQuestKey;
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease),
    visibility 0.3s;
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

.inv-cat {
  color: var(--gd);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--gD);
}
.inv-cat:first-child {
  margin-top: 0;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.data-card {
  padding: 16px;
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid var(--gD);
  transition: border-color 0.2s;
}
.data-card:hover {
  border-color: var(--gd);
}
.data-title {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.data-val {
  color: var(--g);
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 12px rgba(139, 255, 139, 0.6);
}
</style>
