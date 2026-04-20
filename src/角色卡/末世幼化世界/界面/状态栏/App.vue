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

        <!-- 主布局：左侧菜单 + 右侧内容 -->
        <div class="main-layout">
          <!-- 左侧菜单 -->
          <div class="sidebar">
            <StatusPanel />
            
            <!-- 菜单导航 -->
            <nav class="menu">
              <button
                v-for="item in menuItems"
                :key="item.id"
                class="menu-item"
                :class="{ active: activeMenu === item.id }"
                @click="activeMenu = item.id"
              >
                <span class="menu-arrow">▶</span>
                <span class="menu-label">{{ item.label }}</span>
              </button>
            </nav>
          </div>

          <!-- 右侧内容区域 -->
          <div class="content">
            <TabNav v-model="activeTab" :tabs="currentTabs" />
            
            <div class="content-area">
              <div v-if="activeMenu === '状态'" class="tab-pane active">
                <div v-if="activeTab === '属性'" class="panel">
                  <div class="placeholder">
                    <div class="placeholder-text">SPECIAL 属性</div>
                    <div class="placeholder-sub">力量、感知、耐力、魅力、智力、敏捷、幸运</div>
                  </div>
                </div>
                <div v-else-if="activeTab === '技能'" class="panel">
                  <div class="placeholder">
                    <div class="placeholder-text">技能列表</div>
                    <div class="placeholder-sub">各种生存技能...</div>
                  </div>
                </div>
              </div>
              <div v-else-if="activeMenu === '道具'" class="tab-pane active">
                <div class="placeholder">
                  <div class="placeholder-text">道具栏</div>
                  <div class="placeholder-sub">武器、装备、消耗品...</div>
                </div>
              </div>
              <div v-else-if="activeMenu === '数据'" class="tab-pane active">
                <div class="placeholder">
                  <div class="placeholder-text">数据面板</div>
                  <div class="placeholder-sub">任务、统计、笔记...</div>
                </div>
              </div>
              <div v-else-if="activeMenu === '地图'" class="tab-pane active">
                <div class="placeholder">
                  <div class="placeholder-text">地图</div>
                  <div class="placeholder-sub">当前位置和地标...</div>
                </div>
              </div>
              <div v-else-if="activeMenu === '广播'" class="tab-pane active">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import StatusPanel from './components/StatusPanel.vue'
import TabNav from './components/TabNav.vue'
import { useStatusStore } from './store'

// ==========================================
// Store
// ==========================================
const store = useStatusStore()

// ==========================================
// 加载状态
// ==========================================
const isBooting = ref(true)

// ==========================================
// 菜单导航
// ==========================================
const menuItems = [
  { id: '状态', label: '状态' },
  { id: '道具', label: '道具' },
  { id: '数据', label: '数据' },
  { id: '地图', label: '地图' },
  { id: '广播', label: '广播' },
]

const activeMenu = ref('状态')

// ==========================================
// 标签导航（根据菜单动态变化）
// ==========================================
const statusTabs = [
  { id: '属性', label: '属性' },
  { id: '技能', label: '技能' },
]

const currentTabs = computed(() => {
  if (activeMenu.value === '状态') {
    return statusTabs
  }
  return []
})

const activeTab = ref('属性')

// 切换菜单时重置标签
watch(activeMenu, () => {
  if (activeMenu.value === '状态') {
    activeTab.value = '属性'
  }
})

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

/* 主容器 */
.pipboy-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  font-family: 'Share Tech Mono', monospace;
  contain: layout style;
}

/* Bezel */
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

/* 主布局 - 左右结构 */
.main-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧边栏 */
.sidebar {
  width: 180px;
  display: flex;
  flex-direction: column;
  border-right: 2px solid #1a5a1a;
  background: rgba(10, 30, 10, 0.3);
}

/* 菜单 */
.menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  color: #4a9a4a;
  font-size: 14px;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.menu-item:hover {
  background: rgba(139, 255, 139, 0.1);
  border-color: #1a5a1a;
  color: #8BFF8B;
}

.menu-item.active {
  background: rgba(139, 255, 139, 0.15);
  border-color: #8BFF8B;
  color: #8BFF8B;
  box-shadow: 0 0 15px rgba(139, 255, 139, 0.2), inset 0 0 15px rgba(139, 255, 139, 0.05);
}

.menu-arrow {
  font-size: 10px;
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
}

.content-area {
  flex: 1;
  padding: 12px;
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

.panel {
  height: 100%;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  min-height: 150px;
}

.placeholder-text {
  color: #8BFF8B;
  font-size: 16px;
}

.placeholder-sub {
  color: #4a9a4a;
  font-size: 11px;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .sidebar {
    width: 120px;
  }

  .menu-item {
    padding: 8px;
    font-size: 12px;
  }
}
</style>
