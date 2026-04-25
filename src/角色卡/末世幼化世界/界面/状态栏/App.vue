<template>
  <div class="pipboy-container">
    <div class="bezel">
      <div class="screen">
        <BootScreen :visible="isBooting" />
        <TopBar />
        <div class="main-layout">
          <div class="sidebar">
            <MenuNav v-model:current-menu="activeMenu" />
          </div>
          <div class="content">
            <div v-if="activeMenu === 'status'" class="panel">
              <StatusPanel />
            </div>
            <div v-else-if="activeMenu === 'inv'" class="panel">
              <InventoryPanel :active="true" :stat-data="statData" />
            </div>
            <div v-else-if="activeMenu === 'data'" class="panel">
              <DataPanel :active="true" :stat-data="statData" @request-data-page="activeMenu = 'data'" />
            </div>
            <div v-else-if="activeMenu === 'map'" class="panel">
              <MapPanel :active="true" :stat-data="statData" />
            </div>
            <div v-else-if="activeMenu === 'radio'" class="panel">
              <RadioPanel :active="true" :stat-data="statData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useStatusStore } from './store';
import BootScreen from './components/BootScreen.vue';
import TopBar from './components/TopBar.vue';
import MenuNav from './components/MenuNav.vue';
import StatusPanel from './components/StatusPanel.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import DataPanel from './components/DataPanel.vue';
import MapPanel from './components/MapPanel.vue';
import RadioPanel from './components/RadioPanel.vue';

const store = useStatusStore();
const statData = computed(() => store.data);

const isBooting = ref(true);
const activeMenu = ref('status');

onMounted(() => {
  setTimeout(() => {
    isBooting.value = false;
  }, 2500);
});
</script>

<style scoped>
.pipboy-container {
  width: 100%;
  height: 600px;
  min-height: 600px;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  overflow: hidden;
}

.bezel {
  flex: 1;
  background: #1a1510;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  overflow: hidden;
}

.screen {
  flex: 1;
  background: var(--bg-dark);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.sidebar {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 2px solid var(--gD);
  background: rgba(10, 30, 10, 0.3);
  padding: 12px 10px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  padding: 12px;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  animation: fadeEffect 0.3s;
}

@keyframes fadeEffect {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .pipboy-container {
    height: 550px;
    min-height: 550px;
    max-height: 550px;
  }

  .sidebar {
    width: 100px;
    padding: 10px 8px;
  }

  .content {
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .pipboy-container {
    height: 500px;
    min-height: 500px;
    max-height: 500px;
  }

  .bezel {
    padding: 6px;
  }

  .sidebar {
    width: 85px;
    padding: 8px 6px;
  }

  .content {
    padding: 8px;
  }
}
</style>
