<template>
  <div id="p-map" class="page" :class="{ active: active }">
    <div
      id="mapContainer"
      class="map-container"
      :class="{ dragging: mapState.isDrag }"
      @mousedown="mapMouseDown"
      @mousemove="mapMouseMove"
      @mouseup="mapMouseUp"
      @mouseleave="mapMouseUp"
      @wheel="mapWheel"
      @click="mapClick"
    >
      <div class="map-info">
        {{ stat_data?.世界?.当前位置?.具体地点 || '未知' }}<br />
        {{ stat_data?.世界?.当前位置?.区域 || '联邦废土' }}
      </div>
      <div class="map-controls">
        <div class="map-btn" @click="zoomIn">+</div>
        <div class="map-btn" @click="zoomOut">-</div>
        <div class="map-btn" @click="locatePlayer">◎</div>
      </div>
      <div id="mapContent" class="map-content" :style="mapTransformStyle">
        <div class="map-grid"></div>
        <div class="map-player" style="left: 1000px; top: 1000px"></div>
        <template v-if="stat_data?.在场人物">
          <div
            v-for="(loc, name) in stat_data.在场人物"
            :key="name"
            class="map-landmark"
            :style="{
              left: getMapCoord(name as string, loc, 'x') + 'px',
              top: getMapCoord(name as string, loc, 'y') + 'px',
            }"
            @click.stop="showLandmarkInfo(name as string, loc)"
          >
            <div class="landmark-label">{{ name }}</div>
          </div>
        </template>
      </div>
      <div id="landmarkInfo" class="landmark-info" :class="{ show: mapState.showInfo }">
        <div class="landmark-info-title">{{ mapState.infoTitle }}</div>
        <div class="landmark-info-desc">{{ mapState.infoDesc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineProps<{
  active: boolean;
  stat_data: any;
}>();

const getStableRandom = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return (Math.abs(hash) % 200) - 100;
};
const getMapCoord = (name: string, loc: any, axis: 'x' | 'y') => loc[axis] || 1000 + getStableRandom(name + axis);

// Map Logic
const mapState = ref({
  scale: 1,
  tx: -800,
  ty: -800,
  isDrag: false,
  sx: 0,
  sy: 0,
  showInfo: false,
  infoTitle: '',
  infoDesc: '',
});

const mapTransformStyle = computed(
  () => `translate(${mapState.value.tx}px, ${mapState.value.ty}px) scale(${mapState.value.scale})`,
);

const zoomIn = () => {
  mapState.value.scale = Math.min(mapState.value.scale * 1.2, 3);
};
const zoomOut = () => {
  mapState.value.scale = Math.max(mapState.value.scale / 1.2, 0.5);
};
const locatePlayer = () => {
  const r = document.getElementById('mapContainer')?.getBoundingClientRect();
  if (r) {
    mapState.value.tx = r.width / 2 - 1000 * mapState.value.scale;
    mapState.value.ty = r.height / 2 - 1000 * mapState.value.scale;
  }
};

const mapMouseDown = (e: MouseEvent) => {
  mapState.value.isDrag = true;
  mapState.value.sx = e.clientX - mapState.value.tx;
  mapState.value.sy = e.clientY - mapState.value.ty;
};
const mapMouseMove = (e: MouseEvent) => {
  if (mapState.value.isDrag) {
    mapState.value.tx = e.clientX - mapState.value.sx;
    mapState.value.ty = e.clientY - mapState.value.sy;
  }
};
const mapMouseUp = () => (mapState.value.isDrag = false);
const mapWheel = (e: WheelEvent) => {
  e.preventDefault();
  mapState.value.scale = Math.max(0.5, Math.min(3, mapState.value.scale * (e.deltaY > 0 ? 0.9 : 1.1)));
};
const mapClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('map-container') || target.classList.contains('map-grid')) {
    mapState.value.showInfo = false;
  }
};

const showLandmarkInfo = (name: string, loc: any) => {
  mapState.value.infoTitle = name;
  mapState.value.infoDesc = loc.类型 ? `类型: ${loc.类型}` : '未知实体';
  mapState.value.showInfo = true;
};
</script>

<style scoped>
.page {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease),
    visibility 0.3s;
}
.page.active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--gD);
  background: #0a150a;
  cursor: grab;
  touch-action: none;
}
.map-container:active {
  cursor: grabbing;
}
.map-container.dragging .map-content {
  transition: none;
}
.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 100;
}
.map-btn {
  width: 32px;
  height: 32px;
  background: rgba(10, 30, 10, 0.9);
  border: 1px solid var(--gD);
  color: var(--g);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s var(--ease);
}
.map-btn:hover {
  background: rgba(139, 255, 139, 0.2);
  border-color: var(--g);
  box-shadow: 0 0 10px rgba(139, 255, 139, 0.3);
}
.map-content {
  position: absolute;
  transform-origin: 0 0;
  transition: transform 0.15s var(--ease-out);
  will-change: transform;
}
.map-grid {
  position: absolute;
  width: 2000px;
  height: 2000px;
  background-image:
    linear-gradient(var(--gD) 1px, transparent 1px), linear-gradient(90deg, var(--gD) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.2;
}
.map-landmark {
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--g);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  box-shadow: 0 0 15px var(--g);
  animation: landmarkPulse 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes landmarkPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.8;
  }
}
.map-landmark::before {
  content: '';
  position: absolute;
  inset: -8px;
  border: 2px solid var(--g);
  border-radius: 50%;
  opacity: 0.4;
}
.map-landmark::after {
  content: '▼';
  color: #050a05;
  font-size: 12px;
  font-weight: bold;
}
.landmark-label {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--g);
  font-size: 11px;
  white-space: nowrap;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}
.map-player {
  position: absolute;
  width: 16px;
  height: 16px;
  background: var(--r);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px var(--r);
  z-index: 50;
  animation: playerPulse 1s infinite;
}
@keyframes playerPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
  }
}
.map-player::before {
  content: '';
  position: absolute;
  inset: -6px;
  border: 2px solid var(--r);
  border-radius: 50%;
  opacity: 0.6;
}
.landmark-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: rgba(5, 10, 5, 0.95);
  border: 1px solid var(--gD);
  padding: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s var(--ease);
  z-index: 200;
}
.landmark-info.show {
  opacity: 1;
  pointer-events: auto;
}
.landmark-info-title {
  color: var(--g);
  font-size: 16px;
  margin-bottom: 6px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.5);
}
.landmark-info-desc {
  color: var(--gd);
  font-size: 13px;
  line-height: 1.5;
}
.map-info {
  position: absolute;
  top: 10px;
  left: 10px;
  color: var(--g);
  font-size: 13px;
  line-height: 1.5;
  z-index: 50;
}
</style>
