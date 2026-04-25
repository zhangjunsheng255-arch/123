<template>
  <div class="menu">
    <div
      v-for="menu in menus"
      :key="menu.id"
      class="menu-item"
      :class="{ active: currentMenu === menu.id }"
      @click="$emit('update:currentMenu', menu.id)"
    >
      {{ menu.label }}
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
  { id: 'status', label: '状态' },
  { id: 'inv', label: '背包' },
  { id: 'data', label: '数据' },
  { id: 'map', label: '地图' },
  { id: 'radio', label: '广播' },
];
</script>

<style scoped>
.menu {
  width: 100%;
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
  text-align: center;
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
</style>
