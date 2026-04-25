<template>
  <div id="p-inv" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in invTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: invTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <template v-for="tab in invTabs" :key="tab.id">
        <div v-if="invTab === tab.id" class="inv-section">
          <div v-if="!itemsByTab[tab.id] || itemsByTab[tab.id].length === 0" class="empty-inv">
            <div class="empty-text">{{ tab.emptyText }}</div>
          </div>
          <template v-else>
            <div
              v-for="entry in itemsByTab[tab.id]"
              :key="entry.name"
              class="expandable"
              :class="{ selected: expandedItem === 'inv_' + entry.name }"
              @click="toggleExpand('inv_' + entry.name)"
            >
              <div class="exp-header">
                <div class="exp-left">
                  <span class="exp-name">{{ entry.name }}</span>
                  <div class="exp-tag-row">
                    <span v-for="tag in entry.tags" :key="tag.label" class="exp-tag" :class="tag.class">
                      {{ tag.label }}
                    </span>
                  </div>
                </div>
                <span class="exp-count" :class="{ plural: entry.item.数量 > 1 }"> x{{ entry.item.数量 }} </span>
              </div>
              <div class="exp-details">
                <div class="exp-details-inner">
                  <div class="exp-details-content">
                    <div class="exp-desc">{{ entry.item.描述 }}</div>
                    <div v-if="entry.item.效果" class="exp-effects">{{ entry.item.效果 }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStatusStore } from '../store';

defineProps<{
  active: boolean;
}>();

const store = useStatusStore();

const invTab = ref('weapons');
const expandedItem = ref<string | null>(null);

const invTabs = [
  { id: 'weapons', label: '武器', key: '武器', emptyText: '暂无武器' },
  { id: 'apparel', label: '装备', key: '装备', emptyText: '暂无装备' },
  { id: 'aid', label: '药品', key: '药品', emptyText: '暂无药品' },
  { id: 'misc', label: '道具', key: '道具', emptyText: '暂无道具' },
];

const QUALITY_CLASS: Record<string, string> = {
  普通: 'tag-common',
  稀有: 'tag-rare',
  史诗: 'tag-epic',
  传说: 'tag-legend',
};

const WEAPON_TYPE_CLASS: Record<string, string> = {
  近战: 'tag-type',
  远程: 'tag-type',
  枪械: 'tag-type',
  投掷: 'tag-type',
};

const ITEM_TYPE_CLASS: Record<string, string> = {
  恢复: 'tag-heal',
  增益: 'tag-buff',
  特殊: 'tag-special',
  材料: 'tag-mat',
  任务: 'tag-quest',
  消耗: 'tag-consumable',
  杂项: 'tag-misc',
};

const SLOT_CLASS: Record<string, string> = {
  主手: 'tag-slot',
  副手: 'tag-slot',
  头部: 'tag-slot',
  上装: 'tag-slot',
  下装: 'tag-slot',
  腿部: 'tag-slot',
  足部: 'tag-slot',
  饰品: 'tag-slot',
};

interface ItemEntry {
  name: string;
  item: Record<string, any>;
  tags: { label: string; class: string }[];
}

function buildTags(item: Record<string, any>, tabId: string): { label: string; class: string }[] {
  const tags: { label: string; class: string }[] = [];

  if (item.品质) {
    tags.push({ label: item.品质, class: QUALITY_CLASS[item.品质] ?? 'tag-common' });
  }

  if (tabId === 'weapons') {
    if (item.部位) {
      tags.push({ label: item.部位, class: SLOT_CLASS[item.部位] ?? 'tag-slot' });
    }
    if (item.类型) {
      tags.push({ label: item.类型, class: WEAPON_TYPE_CLASS[item.类型] ?? 'tag-type' });
    }
  } else if (tabId === 'apparel') {
    if (item.部位) {
      tags.push({ label: item.部位, class: SLOT_CLASS[item.部位] ?? 'tag-slot' });
    }
  } else if (tabId === 'aid' || tabId === 'misc') {
    if (item.类型) {
      tags.push({ label: item.类型, class: ITEM_TYPE_CLASS[item.类型] ?? 'tag-misc' });
    }
  }

  return tags;
}

const itemsByTab = computed<Record<string, ItemEntry[]>>(() => {
  const bp = store.data?.背包;
  const result: Record<string, ItemEntry[]> = {
    weapons: [],
    apparel: [],
    aid: [],
    misc: [],
  };

  if (!bp) return result;

  const tabMap: Record<string, string> = {
    武器: 'weapons',
    装备: 'apparel',
    药品: 'aid',
    道具: 'misc',
  };

  for (const [tabId, key] of Object.entries(tabMap)) {
    const category = (bp as Record<string, any>)[tabId];
    if (category && typeof category === 'object') {
      result[key] = Object.entries(category).map(([name, item]) => ({
        name,
        item: item as Record<string, any>,
        tags: buildTags(item as Record<string, any>, key),
      }));
    }
  }

  return result;
});

const switchTab = (id: string) => {
  invTab.value = id;
};

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};
</script>

<style scoped>
.page {
  position: relative;
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
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 10px;
  flex-shrink: 0;
}
.tab {
  color: var(--gd);
  font-size: 10px;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
.tab::after {
  content: '';
  position: absolute;
  bottom: -10px;
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

.inv-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.expandable {
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s var(--ease);
  overflow: hidden;
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
  padding: 14px 14px;
  gap: 10px;
  transition: background 0.2s var(--ease);
}

.exp-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.exp-name {
  color: var(--g);
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exp-tag-row {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.exp-tag {
  font-size: 12px;
  padding: 3px 8px;
  line-height: 1.4;
  border: 1px solid;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* 品质标签 */
.tag-common {
  color: var(--gd);
  border-color: var(--gD);
  background: rgba(26, 90, 26, 0.3);
}
.tag-rare {
  color: #6eb5ff;
  border-color: #3060a0;
  background: rgba(48, 96, 160, 0.25);
}
.tag-epic {
  color: #c58bff;
  border-color: #6030a0;
  background: rgba(96, 48, 160, 0.25);
}
.tag-legend {
  color: #ffb347;
  border-color: #a06020;
  background: rgba(160, 96, 32, 0.25);
  text-shadow: 0 0 6px rgba(255, 179, 71, 0.5);
}

/* 类型标签 */
.tag-type {
  color: var(--gd);
  border-color: var(--gD);
  background: rgba(26, 90, 26, 0.2);
}
.tag-heal {
  color: #8bff8b;
  border-color: #1a5a1a;
  background: rgba(26, 90, 26, 0.35);
}
.tag-buff {
  color: #6eb5ff;
  border-color: #1a3a5a;
  background: rgba(26, 58, 90, 0.25);
}
.tag-special {
  color: #c58bff;
  border-color: #3a1a5a;
  background: rgba(58, 26, 90, 0.25);
}
.tag-mat {
  color: #a0a080;
  border-color: #4a4a30;
  background: rgba(74, 74, 48, 0.25);
}
.tag-quest {
  color: #ffb347;
  border-color: #5a3a1a;
  background: rgba(90, 58, 26, 0.25);
}
.tag-consumable {
  color: #8bd4ff;
  border-color: #2a4a5a;
  background: rgba(42, 74, 90, 0.25);
}
.tag-misc {
  color: var(--gd);
  border-color: var(--gD);
  background: rgba(26, 90, 26, 0.15);
}

/* 部位标签 */
.tag-slot {
  color: #a0a080;
  border-color: #3a3a20;
  background: rgba(58, 58, 32, 0.2);
}

.exp-count {
  color: var(--gd);
  font-size: 16px;
  font-weight: bold;
  flex-shrink: 0;
}
.exp-count.plural {
  color: var(--g);
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.4);
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

.empty-inv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
.empty-text {
  color: var(--gd);
  font-size: 16px;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .tabs {
    gap: 5px;
    padding-bottom: 7px;
    margin-bottom: 9px;
  }

  .tab {
    font-size: 9px;
    padding: 3px 8px;
  }

  .tab::after {
    bottom: -9px;
  }

  .exp-header {
    padding: 11px 12px;
    gap: 6px;
  }

  .exp-left {
    gap: 6px;
  }

  .exp-name {
    font-size: 13px;
  }

  .exp-tag {
    font-size: 10px;
    padding: 2px 6px;
  }

  .exp-tag-row {
    gap: 4px;
  }

  .exp-count {
    font-size: 14px;
  }

  .exp-details-content {
    padding: 0 10px;
  }

  .expandable.selected .exp-details-content {
    padding: 10px 10px;
  }

  .empty-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .tabs {
    gap: 3px;
    padding-bottom: 6px;
    margin-bottom: 8px;
  }

  .tab {
    font-size: 8px;
    padding: 3px 6px;
  }

  .tab::after {
    bottom: -8px;
  }

  .exp-header {
    padding: 9px 10px;
    gap: 4px;
  }

  .exp-left {
    gap: 4px;
  }

  .exp-name {
    font-size: 12px;
    max-width: none;
    min-width: 0;
    flex-shrink: 1;
  }

  .exp-tag {
    font-size: 9px;
    padding: 2px 5px;
    letter-spacing: 0;
  }

  .exp-tag-row {
    gap: 3px;
    flex-shrink: 0;
  }

  .exp-count {
    font-size: 12px;
    min-width: 0;
    flex-shrink: 0;
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

  .empty-text {
    font-size: 13px;
  }

  .empty-inv {
    padding: 30px 0;
  }
}
</style>
