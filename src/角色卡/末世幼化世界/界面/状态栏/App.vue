<template>
  <div class="card">
    <BootScreen />

    <TopBar :stat_data="stat_data" />

    <div class="main">
      <MenuNav v-model:currentMenu="currentMenu" />

      <div class="center">
        <StatusPanel :active="currentMenu === 'status'" :stat_data="stat_data" />
        <InventoryPanel :active="currentMenu === 'inv'" :stat_data="stat_data" />
        <DataPanel :active="currentMenu === 'data'" :stat_data="stat_data" @requestDataPage="currentMenu = 'data'" />
        <MapPanel :active="currentMenu === 'map'" :stat_data="stat_data" />
        <RadioPanel :active="currentMenu === 'radio'" :stat_data="stat_data" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useDataStore } from './store';
import { storeToRefs } from 'pinia';

import BootScreen from './components/BootScreen.vue';
import TopBar from './components/TopBar.vue';
import MenuNav from './components/MenuNav.vue';
import StatusPanel from './components/StatusPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import DataPanel from './components/DataPanel.vue';
import MapPanel from './components/MapPanel.vue';
import RadioPanel from './components/RadioPanel.vue';

const store = useDataStore();
const { data: stat_data } = storeToRefs(store);

const currentMenu = ref('status');

// Lifecycle
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;

    const menus = ['status', 'inv', 'data', 'map', 'radio'];
    const idx = menus.indexOf(currentMenu.value);

    if (idx !== -1) {
      const nextIdx = e.key === 'ArrowUp' ? idx - 1 : idx + 1;
      if (nextIdx >= 0 && nextIdx < menus.length) currentMenu.value = menus[nextIdx];
    }
  };

  const handleWheel = (e: WheelEvent) => {
    const activePage = document.querySelector('.page.active .scrollable');
    if (!activePage) return;
    const { scrollTop, scrollHeight, clientHeight } = activePage;
    if ((e.deltaY > 0 && scrollTop < scrollHeight - clientHeight) || (e.deltaY < 0 && scrollTop > 0)) {
      activePage.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('wheel', handleWheel, { passive: false });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('wheel', handleWheel);
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --g: #8bff8b;
  --gd: #4a9a4a;
  --gD: #1a5a1a;
  --r: #ff4d4d;
  --c1: #9b8365;
  --c2: #7b6344;
  --c3: #6b5344;
  --c4: #4a3728;
  --c5: #3a2a20;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

.card {
  width: 100%;
  max-width: 720px;
  background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%);
  border: 3px solid var(--gd);
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 0.8),
    0 5px 15px rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  color: var(--g);
  margin: 0 auto;
  padding: 16px;
  position: relative;
  overflow: hidden;
  height: 500px;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0 2px, transparent 2px 4px);
  pointer-events: none;
  z-index: 10;
  opacity: 0.5;
}

.main {
  display: flex;
  height: calc(100% - 60px);
  gap: 15px;
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 2px solid var(--gD);
  padding-left: 20px;
  position: relative;
  overflow: hidden;
}
</style>
