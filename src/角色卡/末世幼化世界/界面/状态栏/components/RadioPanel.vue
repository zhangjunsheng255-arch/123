<template>
  <div id="p-radio" class="page" :class="{ active: active }">
    <div class="scrollable">
      <template v-for="cat in radioCategories" :key="cat.id">
        <div class="inv-cat">{{ cat.label }}</div>
        <div
          v-for="(content, name) in stat_data?.广播系统?.[cat.key as keyof typeof stat_data.广播系统] || {}"
          :key="name"
          class="expandable"
          :class="{ selected: expandedItem === 'radio_' + cat.id + '_' + name }"
          @click="toggleExpand('radio_' + cat.id + '_' + name)"
        >
          <div class="exp-header">
            <span class="exp-name">{{ name }}</span>
          </div>
          <div class="exp-details">
            <div class="exp-details-inner">
              <div class="exp-details-content">
                <div class="exp-desc">{{ content }}</div>
                <div
                  v-show="expandedItem === 'radio_' + cat.id + '_' + name"
                  class="sound"
                  style="margin-top: 10px; height: 20px"
                >
                  <div class="s-bar"></div>
                  <div class="s-bar"></div>
                  <div class="s-bar"></div>
                  <div class="s-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  active: boolean;
  stat_data: any;
}>();

const expandedItem = ref<string | null>(null);

const radioCategories = [
  { id: 'faction', label: '势力广播', key: '势力广播' },
  { id: 'personal', label: '个人广播', key: '个人广播' },
];

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

.sound {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 18px;
}
.s-bar {
  width: 3px;
  background: var(--g);
  animation: sound 0.5s ease-in-out infinite alternate;
}
@keyframes sound {
  from {
    transform: scaleY(0.5);
  }
  to {
    transform: scaleY(1);
  }
}
.s-bar:nth-child(1) {
  height: 6px;
}
.s-bar:nth-child(2) {
  height: 14px;
  animation-delay: 0.1s;
}
.s-bar:nth-child(3) {
  height: 9px;
  animation-delay: 0.2s;
}
.s-bar:nth-child(4) {
  height: 16px;
  animation-delay: 0.15s;
}
</style>
