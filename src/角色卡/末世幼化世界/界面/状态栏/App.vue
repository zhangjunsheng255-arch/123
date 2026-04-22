<template>
  <div class="pipboy-container">
    <div class="bezel">
      <div class="screen">
        <!-- 加载动画 -->
        <div class="boot" :class="{ hide: !isBooting }">
          <div class="boot-logo">▼▼▼</div>
          <div class="boot-t">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
          <div class="boot-t">LOADING PIP-BOY 3000 OS...</div>
          <div class="boot-bar">
            <div class="boot-fill"></div>
          </div>
        </div>

        <!-- 顶部状态栏 -->
        <TopBar />

        <!-- 主布局：左侧菜单 + 右侧内容 -->
        <div class="main-layout">
          <!-- 左侧菜单 -->
          <div class="sidebar">
            <nav class="menu">
              <button v-for="item in menuItems" :key="item.id" class="menu-item"
                :class="{ active: activeMenu === item.id }" @click="activeMenu = item.id">
                <span class="menu-arrow">▶</span>
                <span class="menu-label">{{ item.label }}</span>
              </button>
            </nav>
          </div>

          <!-- 右侧内容区域 -->
          <div class="content">
            <div v-if="activeMenu === '状态'" class="panel active">
              <StatusPanel />
            </div>
            <div v-else-if="activeMenu === '道具'" class="panel active">
              <div class="placeholder">
                <div class="placeholder-text">道具栏</div>
                <div class="placeholder-sub">武器、装备、消耗品...</div>
              </div>
            </div>
            <div v-else-if="activeMenu === '数据'" class="panel active">
              <div class="placeholder">
                <div class="placeholder-text">数据面板</div>
                <div class="placeholder-sub">任务、统计、笔记...</div>
              </div>
            </div>
            <div v-else-if="activeMenu === '地图'" class="panel active">
              <div class="placeholder">
                <div class="placeholder-text">地图</div>
                <div class="placeholder-sub">当前位置和地标...</div>
              </div>
            </div>
            <div v-else-if="activeMenu === '广播'" class="panel active">
              <div class="placeholder">
                <div class="placeholder-text">广播</div>
                <div class="placeholder-sub">可接收的电台频率...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import TopBar from './components/TopBar.vue'
import StatusPanel from './components/StatusPanel.vue'
import { useStatusStore } from './store'

const store = useStatusStore()
const isBooting = ref(true)

const menuItems = [
  { id: '状态', label: '状态' },
  { id: '道具', label: '道具' },
  { id: '数据', label: '数据' },
  { id: '地图', label: '地图' },
  { id: '广播', label: '广播' },
]

const activeMenu = ref('状态')

let eventListener: EventOnReturn | null = null
let bootTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  try {
    store.messageId = getCurrentMessageId()
  } catch (e) {
    console.error('获取消息楼层ID失败:', e)
  }

  store.fetchMvuData()
  eventListener = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, store.fetchMvuData)

  bootTimer = setTimeout(() => {
    isBooting.value = false
  }, 2500)
})

onUnmounted(() => {
  if (eventListener) {
    eventListener.stop()
  }
  if (bootTimer) {
    clearTimeout(bootTimer)
  }
})
</script>

<style>
/* CSS 变量 */
:root {
  --g: #8BFF8B;
  --gd: #4a9a4a;
  --gD: #1a5a1a;
  --r: #FF4D4D;
  --bg-dark: #050a05;
  --bg-panel: #0a150a;
}
</style>

<style scoped>
.pipboy-container {
  width: 100%;
  /* 固定高度：顶部栏约80px + SPECIAL内容约480px + 边距 */
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

/* Boot Screen */
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

/* 主布局 */
.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

/* 左侧边栏 */
.sidebar {
  width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 2px solid var(--gD);
  background: rgba(10, 30, 10, 0.3);
}

.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 10px;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--gd);
  font-size: 16px;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-weight: bold;
}

.menu-item:hover {
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--gD);
  color: var(--g);
}

.menu-item.active {
  background: rgba(139, 255, 139, 0.15);
  border-color: var(--g);
  color: var(--g);
  box-shadow: 0 0 15px rgba(139, 255, 139, 0.2), inset 0 0 15px rgba(139, 255, 139, 0.05);
}

.menu-arrow {
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.menu-item.active .menu-arrow {
  opacity: 1;
}

/* 右侧内容区 */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
  padding: 12px;
}

.panel {
  display: none;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.panel.active {
  display: flex;
  flex-direction: column;
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

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
}

.placeholder-text {
  color: var(--g);
  font-size: 20px;
  font-weight: bold;
}

.placeholder-sub {
  color: var(--gd);
  font-size: 14px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .pipboy-container {
    height: 550px;
    min-height: 550px;
    max-height: 550px;
  }

  .sidebar {
    width: 100px;
  }

  .menu {
    padding: 10px 8px;
    gap: 6px;
  }

  .menu-item {
    padding: 10px 12px;
    font-size: 15px;
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
  }

  .menu {
    padding: 8px 6px;
    gap: 5px;
  }

  .menu-item {
    padding: 8px 10px;
    font-size: 14px;
    gap: 6px;
  }

  .menu-arrow {
    font-size: 10px;
  }

  .content {
    padding: 8px;
  }

  .placeholder-text {
    font-size: 16px;
  }

  .placeholder-sub {
    font-size: 12px;
  }
}
</style>
