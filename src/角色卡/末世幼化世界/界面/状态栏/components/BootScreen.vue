<template>
  <div class="boot" :class="{ hide: !visible }">
    <div class="boot-logo">▼▼▼</div>
    <div class="boot-t">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
    <div class="boot-t">LOADING PIP-BOY 3000 OS...</div>
    <div class="boot-bar">
      <div class="boot-fill"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
}>();
</script>

<style scoped>
.boot {
  position: absolute;
  inset: 0;
  background: var(--bg-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s ease;
}

.boot.hide {
  opacity: 0;
  pointer-events: none;
}

.boot-logo {
  font-size: 28px;
  color: var(--g);
  margin-bottom: 16px;
}

.boot-t {
  color: var(--gd);
  font-size: 13px;
  margin: 4px 0;
  text-align: center;
  padding: 0 20px;
}

.boot-bar {
  width: 200px;
  height: 3px;
  background: var(--gD);
  margin-top: 16px;
  overflow: hidden;
}

.boot-fill {
  height: 100%;
  background: var(--g);
  animation: boot 2.5s ease-out forwards;
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
