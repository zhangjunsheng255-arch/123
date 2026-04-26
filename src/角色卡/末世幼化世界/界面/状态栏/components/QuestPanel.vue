<template>
  <div id="p-quest" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in mainTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: mainTab === tab.id }"
        @click="mainTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <!-- 任务标签页 -->
      <div v-show="mainTab === 'quests'" class="quest-content">
        <div class="filter-row">
          <div
            v-for="f in questFilters"
            :key="f.id"
            class="filter-btn"
            :class="{ active: questFilter === f.id }"
            @click="questFilter = f.id"
          >
            {{ f.label }}
          </div>
        </div>
        <template v-if="filteredQuests && Object.keys(filteredQuests).length > 0">
          <div
            v-for="(quest, name) in filteredQuests"
            :key="name as string"
            class="expandable"
            :class="{ selected: expandedItem === 'quest_' + (name as string) }"
            @click="toggleExpand('quest_' + (name as string))"
          >
            <div class="exp-header">
              <span class="exp-name">{{ name as string }}</span>
              <div class="exp-meta">
                <span class="quest-type-tag" :class="'type-' + ((quest as any).类型 ?? '日常')">{{ (quest as any).类型 ?? '日常' }}</span>
                <span>{{ (quest as any).状态 }}</span>
                <span>{{ (quest as any).进度 ?? 0 }}%</span>
              </div>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ (quest as any).描述 }}</div>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: ((quest as any).进度 ?? 0) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div v-else class="empty-hint">暂无{{ questFilters.find(f => f.id === questFilter)?.label ?? '任务' }}</div>
      </div>

      <!-- 关系速览标签页 -->
      <div v-show="mainTab === 'relations'" class="quest-content">
        <div class="inv-cat">NPC 关系</div>
        <div v-if="stat_data?.NPC列表" class="data-grid">
          <div v-for="(val, name) in stat_data.NPC列表" :key="name as string" class="data-card">
            <div class="data-title">{{ name as string }}</div>
            <div class="data-val">{{ (val as any).好感度 ?? 0 }}</div>
            <div class="data-sub">{{ (val as any).关系 ?? '未知' }}</div>
          </div>
        </div>
        <div v-else class="empty-hint">暂无 NPC 记录</div>

        <div v-if="stat_data?.重要人物列表" class="inv-cat" style="margin-top: 16px">重要人物</div>
        <template v-if="stat_data?.重要人物列表">
          <div v-for="(person, name) in stat_data.重要人物列表" :key="name as string" class="expandable">
            <div class="exp-header">
              <span class="exp-name">{{ name as string }}</span>
              <span class="exp-meta">{{ (person as any).关系 ?? '中立' }} ({{ (person as any).好感度 ?? 0 }})</span>
            </div>
          </div>
        </template>
        <div v-else-if="mainTab === 'relations'" class="empty-hint">暂无重要人物记录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  active: boolean;
  stat_data: any;
}>();

const emit = defineEmits<{
  requestQuestPage: [];
}>();

const mainTab = ref('quests');
const questFilter = ref('进行中');
const expandedItem = ref<string | null>(null);

const mainTabs = [
  { id: 'quests', label: '任务' },
  { id: 'relations', label: '关系速览' },
];

const questFilters = [
  { id: '进行中', label: '进行中' },
  { id: '已完成', label: '已完成' },
  { id: '未接取', label: '未接取' },
];

const filteredQuests = computed(() => {
  const quests = props.stat_data?.基地?.任务系统;
  if (!quests) return null;
  const result: Record<string, any> = {};
  for (const [name, quest] of Object.entries(quests)) {
    if ((quest as any).状态 === questFilter.value) {
      result[name] = quest;
    }
  }
  return result;
});

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};

watch(
  () => props.stat_data?.基地?.任务系统,
  newQuests => {
    if (newQuests && Object.keys(newQuests).length > 0) {
      emit('requestQuestPage');
      questFilter.value = '进行中';
      const activeQuest = Object.entries(newQuests).find(([, q]) => (q as any).状态 === '进行中');
      if (activeQuest) {
        expandedItem.value = 'quest_' + activeQuest[0];
      }
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

.filter-row {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.filter-btn {
  color: var(--gD);
  font-size: 12px;
  padding: 4px 12px;
  border: 1px solid var(--gD);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.filter-btn:hover {
  color: var(--gd);
  border-color: var(--gd);
}
.filter-btn.active {
  color: var(--g);
  border-color: var(--g);
  background: rgba(139, 255, 139, 0.1);
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.6);
}

.quest-type-tag {
  font-size: 11px;
  padding: 1px 6px;
  border: 1px solid var(--gd);
}
.quest-type-tag.type-主线 {
  color: #ff8b4d;
  border-color: #ff8b4d;
}
.quest-type-tag.type-支线 {
  color: #4da6ff;
  border-color: #4da6ff;
}
.quest-type-tag.type-日常 {
  color: var(--gd);
  border-color: var(--gd);
}
.quest-type-tag.type-紧急 {
  color: var(--r);
  border-color: var(--r);
}
.quest-type-tag.type-委托 {
  color: #ffcc4d;
  border-color: #ffcc4d;
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
  gap: 10px;
  align-items: center;
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

.progress-bar {
  height: 4px;
  background: var(--gD);
  border-radius: 2px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--g);
  box-shadow: 0 0 6px rgba(139, 255, 139, 0.6);
  transition: width 0.3s var(--ease);
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
.data-sub {
  color: var(--gd);
  font-size: 13px;
  margin-top: 5px;
}

.empty-hint {
  color: var(--gD);
  font-size: 13px;
  text-align: center;
  padding: 30px 0;
}

@media (max-width: 768px) {
  .tabs {
    gap: 4px;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }
  .tab {
    font-size: 12px;
    padding: 5px 12px;
  }
  .tab::after {
    bottom: -12px;
  }
  .exp-header {
    padding: 8px 12px;
  }
  .exp-name {
    font-size: 13px;
  }
  .exp-meta {
    font-size: 11px;
  }
  .exp-details-content {
    padding: 0 10px;
  }
  .expandable.selected .exp-details-content {
    padding: 10px 10px;
  }
  .exp-desc {
    font-size: 12px;
  }
  .data-grid {
    gap: 8px;
  }
  .data-card {
    padding: 12px;
  }
  .data-val {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .tabs {
    gap: 3px;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .tab {
    font-size: 11px;
    padding: 4px 8px;
  }
  .tab::after {
    bottom: -10px;
  }
  .exp-header {
    padding: 7px 10px;
  }
  .exp-name {
    font-size: 12px;
  }
  .exp-meta {
    font-size: 10px;
  }
  .exp-details-content {
    padding: 0 8px;
  }
  .expandable.selected .exp-details-content {
    padding: 8px 8px;
  }
  .exp-desc {
    font-size: 11px;
  }
  .data-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .data-card {
    padding: 10px;
  }
  .data-title {
    font-size: 10px;
    margin-bottom: 4px;
  }
  .data-val {
    font-size: 18px;
  }
}
</style>
