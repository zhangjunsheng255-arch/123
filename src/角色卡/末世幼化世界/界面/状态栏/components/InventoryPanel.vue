<template>
  <div id="p-inv" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in invTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: invTab === tab.id }"
        @click="invTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <div v-for="tab in invTabs" :key="tab.id" v-show="invTab === tab.id" class="inv-section">
        <div
          v-for="(item, name) in stat_data?.鑳屽寘?.[tab.key as keyof typeof stat_data.鑳屽寘] || {}"
          :key="name"
          class="expandable"
          :class="{ selected: expandedItem === 'inv_' + name }"
          @click="toggleExpand('inv_' + name)"
        >
          <div class="exp-header">
            <span class="exp-name">{{ name }} ({{ (item as any).鏁伴噺 || 1 }})</span>
            <span class="exp-meta">
              <span v-if="(item as any).鍝佽川">{{ (item as any).鍝佽川 }}</span>
              <span v-if="(item as any).绫诲瀷">{{ (item as any).绫诲瀷 }}</span>
              <span v-if="(item as any).閮ㄤ綅">{{ (item as any).閮ㄤ綅 }}</span>
            </span>
          </div>
          <div class="exp-details">
            <div class="exp-details-inner">
              <div class="exp-details-content">
                <div class="exp-desc">{{ (item as any).鎻忚堪 }}</div>
                <div v-if="(item as any).鏁堟灉" class="exp-effects">{{ (item as any).鏁堟灉 }}</div>
              </div>
            </div>
          </div>
        </div>
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

const invTab = ref('weapons');
const expandedItem = ref<string | null>(null);

const invTabs = [
  { id: 'weapons', label: '姝﹀櫒', key: '姝﹀櫒' },
  { id: 'apparel', label: '鏈嶈', key: '瑁呭' },
  { id: 'aid', label: '鑽搧', key: '鑽搧' },
  { id: 'misc', label: '鏉傜墿', key: '閬撳叿' },
];

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
  position: relative;
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
  content: '鏁堟灉: ';
  color: var(--gd);
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
</style>
