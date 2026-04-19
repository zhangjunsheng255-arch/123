<template>
  <div class="crt">
    <div class="scanlines"></div>
    <div class="flicker"></div>
    <div class="noise"></div>
    <div class="vignette"></div>
  </div>

  <div class="device">
    <div class="top"><div class="brand">PIP-BOY 3000 MARK IV</div></div>

    <div class="case">
      <div class="trim"></div>
      <div class="screw tl"></div>
      <div class="screw tr"></div>
      <div class="screw bl"></div>
      <div class="screw br"></div>

      <div class="bezel">
        <div class="glass"></div>
        <div class="screen">
          <div class="glow"></div>
          <div class="curve"></div>

          <BootScreen />

          <TopBar :stat_data="stat_data" />

          <div class="main">
            <MenuNav v-model:currentMenu="currentMenu" />

            <div class="center">
              <StatusPanel :active="currentMenu === 'status'" :stat_data="stat_data" />
              <InventoryPanel :active="currentMenu === 'inv'" :stat_data="stat_data" />
              <DataPanel
                :active="currentMenu === 'data'"
                :stat_data="stat_data"
                @requestDataPage="currentMenu = 'data'"
              />
              <MapPanel :active="currentMenu === 'map'" :stat_data="stat_data" />
              <RadioPanel :active="currentMenu === 'radio'" :stat_data="stat_data" />
            </div>
          </div>
        </div>
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

.crt {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  contain: strict;
}
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.3) 0 2px, transparent 2px 4px);
  animation: scan 8s linear infinite;
  contain: strict;
}
@keyframes scan {
  to {
    transform: translateY(4px);
  }
}
.flicker {
  position: absolute;
  inset: 0;
  background: rgba(139, 255, 139, 0.02);
  animation: flick 0.15s infinite;
}
@keyframes flick {
  0%,
  100% {
    opacity: 0.028;
  }
  50% {
    opacity: 0.015;
  }
}
.noise {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: n 0.5s steps(5) infinite;
}
@keyframes n {
  0%,
  100% {
    transform: translate(0);
  }
  50% {
    transform: translate(-2%, 2%);
  }
}
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
}

.device {
  width: 1000px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Share Tech Mono', monospace;
  background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%);
  user-select: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.top {
  width: 800px;
  height: 60px;
  background: linear-gradient(180deg, var(--c1) 0%, var(--c2) 50%, var(--c5) 100%);
  border-radius: 30px 30px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 2px 5px rgba(255, 255, 255, 0.2),
    0 10px 30px rgba(0, 0, 0, 0.5);
}
.brand {
  font-size: 24px;
  color: var(--c5);
  letter-spacing: 6px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
}

.case {
  width: 900px;
  height: 580px;
  background: linear-gradient(145deg, var(--c1) 0%, var(--c2) 30%, var(--c3) 50%, var(--c4) 100%);
  border-radius: 40px;
  padding: 20px;
  position: relative;
  box-shadow:
    inset 0 0 80px rgba(0, 0, 0, 0.4),
    0 20px 60px rgba(0, 0, 0, 0.8);
}
.trim {
  position: absolute;
  inset: 8px;
  border: 2px solid var(--gD);
  border-radius: 35px;
  opacity: 0.6;
  pointer-events: none;
}
.trim::before {
  content: '';
  position: absolute;
  inset: 3px;
  border: 1px solid var(--gd);
  border-radius: 30px;
  opacity: 0.4;
}

.screw {
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 30% 30%, #d0d0d0 0%, #606060 100%);
  border-radius: 50%;
  box-shadow:
    inset 0 2px 4px rgba(255, 255, 255, 0.5),
    0 3px 6px rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.screw::before,
.screw::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 2px;
  background: #404040;
}
.screw::before {
  transform: translate(-50%, -50%) rotate(45deg);
}
.screw::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
.tl {
  top: 15px;
  left: 15px;
}
.tr {
  top: 15px;
  right: 15px;
}
.bl {
  bottom: 15px;
  left: 15px;
}
.br {
  bottom: 15px;
  right: 15px;
}

.bezel {
  background: linear-gradient(145deg, #2a2520 0%, #1a1510 100%);
  border-radius: 30px;
  padding: 12px;
  height: 100%;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
}
.glass {
  position: absolute;
  inset: 12px;
  border-radius: 22px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 30%,
    transparent 70%,
    rgba(255, 255, 255, 0.05) 100%
  );
  pointer-events: none;
  z-index: 100;
}
.screen {
  background: #050a05;
  border-radius: 22px;
  height: 100%;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.9);
}
.glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(139, 255, 139, 0.08) 0%, transparent 60%);
  pointer-events: none;
  animation: pulse 4s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
.curve {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, transparent 10%, transparent 90%, rgba(0, 0, 0, 0.2) 100%);
  pointer-events: none;
}

.main {
  display: flex;
  height: calc(100% - 85px);
  gap: 15px;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 2px solid var(--gD);
  padding-left: 20px;
  position: relative;
}
</style>
