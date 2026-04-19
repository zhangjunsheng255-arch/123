<template>
  <div class="menu">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="menu-item"
      :class="{ active: currentMenu === menu.id }"
      @click="$emit('update:currentMenu', menu.id)"
    >
      <svg viewBox="0 0 24 24" v-html="menu.svg"></svg>{{ menu.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentMenu: string;
}>();

defineEmits<{
  'update:currentMenu': [value: string];
}>();

const menus = [
  {
    id: 'status',
    label: '状态',
    svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5" />',
  },
  {
    id: 'inv',
    label: '道具',
    svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>',
  },
  {
    id: 'data',
    label: '数据',
    svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  },
  {
    id: 'map',
    label: '地图',
    svg: '<path d="M20.5 3l-6 1.5-5.5-1.5-6 1.5v15l6-1.5 5.5 1.5 6-1.5V3zM15 18.5l-5.5-1.5-4.5 1.1V5.6l4.5-1.1 5.5 1.5v12.5z"/>',
  },
  {
    id: 'radio',
    label: '广播',
    svg: '<path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>',
  },
];
</script>

<style scoped>
.menu {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.menu-item {
  color: var(--gD);
  font-size: 16px;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
.menu-item::before {
  content: '';
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-left: 6px solid var(--g);
  opacity: 0;
  transition: opacity 0.2s;
}
.menu-item:hover,
.menu-item.active {
  color: var(--g);
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--g);
  box-shadow:
    0 0 15px rgba(139, 255, 139, 0.2),
    inset 0 0 15px rgba(139, 255, 139, 0.05);
}
.menu-item.active::before {
  opacity: 1;
}
.menu-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  fill: currentColor;
  transition: opacity 0.2s;
}
.menu-item:hover svg,
.menu-item.active svg {
  opacity: 1;
}
</style>
