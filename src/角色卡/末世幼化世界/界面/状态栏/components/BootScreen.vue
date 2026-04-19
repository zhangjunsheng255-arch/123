<template>
  <div id="boot" class="boot" :class="{ hide: !showBoot }">
    <div class="boot-logo">▼▼▼</div>
    <div class="boot-t">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
    <div class="boot-t">LOADING PIP-BOY 3000 OS...</div>
    <div class="boot-bar"><div class="boot-fill"></div></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const showBoot = ref(true);

let bootTimer: ReturnType<typeof setTimeout>;
onMounted(() => {
  bootTimer = setTimeout(() => (showBoot.value = false), 3500);

  onUnmounted(() => {
    clearTimeout(bootTimer);
  });
});
</script>

<style scoped>
.boot {
  position: absolute;
  inset: 0;
  background: #050a05;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s var(--ease);
}
.boot.hide {
  opacity: 0;
  pointer-events: none;
}
.boot-logo {
  font-size: 48px;
  color: var(--g);
  text-shadow: 0 0 30px rgba(139, 255, 139, 0.8);
  margin-bottom: 30px;
  animation: bootPulse 2s infinite;
}
@keyframes bootPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
.boot-t {
  color: var(--gd);
  font-size: 16px;
  margin: 5px 0;
}
.boot-bar {
  width: 300px;
  height: 4px;
  background: var(--gD);
  margin-top: 30px;
  overflow: hidden;
}
.boot-fill {
  height: 100%;
  background: var(--g);
  box-shadow: 0 0 10px var(--g);
  animation: boot 3s var(--ease-out) forwards;
}
@keyframes boot {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
