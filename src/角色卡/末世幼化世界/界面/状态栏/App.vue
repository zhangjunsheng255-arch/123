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
        <StatusPanel />

        <!-- 标签导航 -->
        <TabNav v-model="activeTab" :tabs="tabs" />

        <!-- 内容区域 -->
        <div class="content-area">
          <div v-if="activeTab === '状态'" class="tab-pane active">
            <div class="placeholder">
              <div class="placeholder-text">状态面板</div>
              <div class="placeholder-sub">角色状态详细信息...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useStatusStore } from './store'
import StatusPanel from './components/StatusPanel.vue'
import TabNav from './components/TabNav.vue'

// ==========================================
// Store
// ==========================================
const store = useStatusStore()

// ==========================================
// 加载状态
// ==========================================
const isBooting = ref(true)

// ==========================================
// 标签导航
// ==========================================
const tabs = [{ id: '状态', label: '状态' }]
const activeTab = ref('状态')

// ==========================================
// 监听 MVU 变量更新
// ==========================================
let eventListener: EventOnReturn | null = null
let bootTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  // 获取当前消息楼层ID
  try {
    store.messageId = getCurrentMessageId()
  } catch (e) {
    console.error('获取消息楼层ID失败:', e)
  }

  // 初始获取数据
  store.fetchMvuData()

  // 监听 MVU 变量更新事件
  eventListener = eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, store.fetchMvuData)

  // 启动动画 2.5秒后结束
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

<style scoped>
/* CSS 变量 */
:host {
  --g: #8BFF8B;
  --gd: #4a9a4a;
  --gD: #1a5a1a;
  --r: #FF4D4D;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
}

/* 主容器 - 适配酒馆界面 */
.pipboy-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  contain: layout style;
}

/* Bezel - 简化边框 */
.bezel {
  flex: 1;
  background: #1a1510;
  border-radius: 12px;
  padding: 6px;
  display: flex;
  overflow: hidden;
}

.screen {
  flex: 1;
  background: #050a05;
  border-radius: 8px;
  padding: 0;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Boot Screen */
.boot {
  position: absolute;
  inset: 0;
  background: #050a05;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.boot.hide {
  opacity: 0;
  pointer-events: none;
}

.boot-logo {
  font-size: 28px;
  color: #8BFF8B;
  margin-bottom: 12px;
}

.boot-t {
  color: #4a9a4a;
  font-size: 11px;
  margin: 3px 0;
  text-align: center;
  padding: 0 16px;
}

.boot-bar {
  width: 180px;
  height: 2px;
  background: #1a5a1a;
  margin-top: 12px;
  overflow: hidden;
}

.boot-fill {
  height: 100%;
  background: #8BFF8B;
  animation: boot 2.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes boot {
  from { width: 0; }
  to { width: 100%; }
}

/* Content Area */
.content-area {
  flex: 1;
  padding: 12px;
  min-height: 0;
  overflow: auto;
}

.tab-pane {
  display: none;
  animation: fadeEffect 0.3s;
}

.tab-pane.active {
  display: block;
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
  gap: 8px;
  height: 100%;
  min-height: 100px;
}

.placeholder-text {
  color: #8BFF8B;
  font-size: 14px;
}

.placeholder-sub {
  color: #4a9a4a;
  font-size: 10px;
}
</style>
