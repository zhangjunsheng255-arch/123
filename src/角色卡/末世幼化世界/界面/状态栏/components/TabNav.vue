<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: model === tab.id }"
      @click="toggleTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[]
}>()

const model = defineModel<string>('status_tab', { required: true })

function toggleTab(id: string) {
  model.value = id
}
</script>

<style scoped>
.tabs {
  display: flex;
  background: #0a1a0a;
  border-bottom: 2px solid #1a5a1a;
  padding: 4px 4px 0;
  gap: 4px;
}

.tab-button {
  flex: 1;
  padding: 8px 12px;
  border: none;
  background: transparent;
  color: #4a9a4a;
  font-size: 11px;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.tab-button:hover {
  background: #1a3a1a;
  color: #8BFF8B;
}

.tab-button.active {
  background: #1a5a1a;
  color: #8BFF8B;
  border-color: #1a5a1a;
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #1a5a1a;
}
</style>
