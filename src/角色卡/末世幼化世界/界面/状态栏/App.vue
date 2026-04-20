<template>
  <div class="card">
    <TopBar :stat_data="stat_data" />

    <div class="main">
      <MenuNav v-model:currentMenu="currentMenu" />

      <div class="center">
        <StatusPanel v-if="currentMenu === 'status'" :stat_data="stat_data" />
        <InventoryPanel v-else-if="currentMenu === 'inv'" :stat_data="stat_data" />
        <DataPanel v-else-if="currentMenu === 'data'" :stat_data="stat_data" @requestDataPage="currentMenu = 'data'" />
        <MapPanel v-else-if="currentMenu === 'map'" :stat_data="stat_data" />
        <RadioPanel v-else-if="currentMenu === 'radio'" :stat_data="stat_data" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDataStore } from './store';
import { storeToRefs } from 'pinia';

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
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 720px;
  background: #111;
  border: 2px solid var(--gd);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  color: var(--g);
  margin: 0 auto;
  padding: 12px;
  height: 500px;
}

.main {
  display: flex;
  flex: 1;
  gap: 15px;
  margin-top: 10px;
  min-height: 0;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 2px solid var(--gD);
  padding-left: 15px;
  overflow: auto;
}
</style>
