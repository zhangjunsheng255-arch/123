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

          <div id="boot" class="boot" :class="{ hide: !showBoot }">
            <div class="boot-logo">▼▼▼</div>
            <div class="boot-t">ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</div>
            <div class="boot-t">LOADING PIP-BOY 3000 OS...</div>
            <div class="boot-bar"><div class="boot-fill"></div></div>
          </div>

          <div class="status">
            <div class="status-l">
              <div class="stat">
                <label>HP</label>
                <div class="bar-wrap">
                  <div
                    class="bar"
                    :style="{
                      width:
                        Math.min(((stat_data?.主角?.HP?.当前 || 0) / (stat_data?.主角?.HP?.上限 || 1)) * 100, 100) +
                        '%',
                    }"
                  ></div>
                  <div class="segs"><div v-for="i in 10" :key="i" class="seg"></div></div>
                </div>
                <span class="val">{{ stat_data?.主角?.HP?.当前 || 0 }}/{{ stat_data?.主角?.HP?.上限 || 0 }}</span>
              </div>
              <div class="stat">
                <label>AP</label>
                <div class="bar-wrap">
                  <div
                    class="bar"
                    :style="{
                      width:
                        Math.min(((stat_data?.主角?.AP?.当前 || 0) / (stat_data?.主角?.AP?.上限 || 1)) * 100, 100) +
                        '%',
                    }"
                  ></div>
                  <div class="segs"><div v-for="i in 10" :key="i" class="seg"></div></div>
                </div>
                <span class="val">{{ stat_data?.主角?.AP?.当前 || 0 }}/{{ stat_data?.主角?.AP?.上限 || 0 }}</span>
              </div>
            </div>
            <div class="status-c">
              <div class="stat">
                <label>LEVEL</label><span class="val">{{ stat_data?.主角?.当前等级 || 1 }}</span>
              </div>
              <div class="stat">
                <label>位置</label><span class="val">{{ stat_data?.世界?.当前位置?.具体地点 || '未知' }}</span>
              </div>
            </div>
            <div class="status-r">
              <div class="stat">
                <label>CAPS</label><span class="val">{{ stat_data?.主角?.晶核数量 || 0 }}</span>
              </div>
              <div class="info-item">
                <label>负重</label>
                <span
                  >{{ currentWeight }}/{{ stat_data?.状态?.属性点?.力量 ? stat_data.状态.属性点.力量 * 10 : 0 }}</span
                >
              </div>
            </div>
          </div>

          <div class="main">
            <div class="menu">
              <div
                v-for="menu in menus"
                :key="menu.id"
                class="menu-item"
                :class="{ active: currentMenu === menu.id }"
                @click="currentMenu = menu.id"
              >
                <svg viewBox="0 0 24 24" v-html="menu.svg"></svg>{{ menu.label }}
              </div>
            </div>

            <div class="center">
              <!-- Status Page -->
              <div id="p-status" class="page" :class="{ active: currentMenu === 'status' }">
                <div class="tabs">
                  <div
                    v-for="tab in statusTabs"
                    :key="tab.id"
                    class="tab"
                    :class="{ active: statusTab === tab.id }"
                    @click="statusTab = tab.id"
                  >
                    {{ tab.label }}
                  </div>
                </div>
                <div class="scrollable">
                  <div v-show="statusTab === 'special'" class="stat-content">
                    <div v-if="stat_data?.状态?.属性点" class="special">
                      <div
                        v-for="(val, key) in stat_data.状态.属性点"
                        :key="key"
                        class="spec-item"
                        :class="{ selected: selectedSpecial === key }"
                        @click="selectedSpecial = key as string"
                      >
                        <div class="spec-info">
                          <div class="spec-letter">{{ getSpecialLetter(key as string) }}</div>
                          <div>
                            <div class="spec-name">{{ key }}</div>
                            <div class="spec-desc">{{ getSpecialDesc(key as string) }}</div>
                          </div>
                        </div>
                        <div class="spec-val">{{ val }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-show="statusTab === 'skills'" class="stat-content">
                    <template v-if="stat_data?.状态?.技能">
                      <div
                        v-for="(skill, name) in stat_data.状态.技能"
                        :key="name"
                        class="expandable"
                        :class="{ selected: expandedItem === 'skill_' + name }"
                        @click="toggleExpand('skill_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ (skill as any).描述 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div v-show="statusTab === 'perks'" class="stat-content">
                    <template v-if="stat_data?.状态?.专长">
                      <div
                        v-for="(perk, name) in stat_data.状态.专长"
                        :key="name"
                        class="expandable"
                        :class="{ selected: expandedItem === 'perk_' + name }"
                        @click="toggleExpand('perk_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ (perk as any).描述 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Inventory Page -->
              <div id="p-inv" class="page" :class="{ active: currentMenu === 'inv' }">
                <div class="tabs">
                  <div
                    v-for="tab in invTabs"
                    :key="tab.id"
                    class="tab"
                    :class="{ active: invTab === tab.id }"
                    @click="invTab = tab.id"
                  >
                    {{ tab.label }}
                  </div>
                </div>
                <div class="scrollable">
                  <div v-for="tab in invTabs" :key="tab.id" v-show="invTab === tab.id" class="inv-section">
                    <div
                      v-for="(item, name) in stat_data?.背包?.[tab.key as keyof typeof stat_data.背包] || {}"
                      :key="name"
                      class="expandable"
                      :class="{ selected: expandedItem === 'inv_' + name }"
                      @click="toggleExpand('inv_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }} ({{ (item as any).数量 || 1 }})</span>
                        <span class="exp-meta">
                          <span v-if="(item as any).品质">{{ (item as any).品质 }}</span>
                          <span v-if="(item as any).类型">{{ (item as any).类型 }}</span>
                          <span v-if="(item as any).部位">{{ (item as any).部位 }}</span>
                        </span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ (item as any).描述 }}</div>
                            <div v-if="(item as any).效果" class="exp-effects">{{ (item as any).效果 }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Data Page -->
              <div id="p-data" class="page" :class="{ active: currentMenu === 'data' }">
                <div class="tabs">
                  <div
                    v-for="tab in dataTabs"
                    :key="tab.id"
                    class="tab"
                    :class="{ active: dataTab === tab.id }"
                    @click="dataTab = tab.id"
                  >
                    {{ tab.label }}
                  </div>
                </div>
                <div class="scrollable">
                  <div v-show="dataTab === 'quests'" class="data-content">
                    <div v-if="stat_data?.基地" class="data-grid">
                      <div class="data-card">
                        <div class="data-title">基地等级</div>
                        <div class="data-val">{{ stat_data.基地.基地等级 || 0 }}</div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">控制总数</div>
                        <div class="data-val">
                          {{ stat_data.基地.控制统计?.当前控制幼女总数 || 0 }}/{{
                            stat_data.基地.控制统计?.可控制上限 || 3
                          }}
                        </div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">战斗型幼女</div>
                        <div class="data-val">{{ stat_data.基地.幼女分类与数量?.战斗型幼女 || 0 }}</div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">游戏时间</div>
                        <div class="data-val">{{ stat_data?.世界?.时间?.阶段 || '未知' }}</div>
                      </div>
                    </div>
                    <div class="inv-cat">进行中的任务</div>
                    <template v-if="stat_data?.基地?.任务系统">
                      <div
                        v-for="(quest, name) in stat_data.基地.任务系统"
                        :key="name"
                        class="expandable"
                        :class="{ selected: expandedItem === 'quest_' + name }"
                        @click="toggleExpand('quest_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta">{{ (quest as any).状态 }} ({{ (quest as any).进度 || 0 }}%)</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ (quest as any).描述 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div v-show="dataTab === 'stats'" class="data-content">
                    <div v-if="stat_data?.NPC列表" class="data-grid">
                      <div v-for="(val, name) in stat_data.NPC列表" :key="name" class="data-card">
                        <div class="data-title">{{ name }}</div>
                        <div class="data-val">{{ (val as any).好感度 || 0 }}</div>
                        <div class="data-title" style="margin-top: 5px">{{ (val as any).关系 || '未知' }}</div>
                      </div>
                    </div>
                  </div>
                  <div v-show="dataTab === 'notes'" class="data-content">
                    <template v-if="stat_data?.重要人物列表">
                      <div v-for="(person, name) in stat_data.重要人物列表" :key="name" class="expandable">
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta"
                            >{{ (person as any).关系 || '中立' }} ({{ (person as any).好感度 || 0 }})</span
                          >
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Map Page -->
              <div id="p-map" class="page" :class="{ active: currentMenu === 'map' }">
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

              <!-- Radio Page -->
              <div id="p-radio" class="page" :class="{ active: currentMenu === 'radio' }">
                <div class="scrollable">
                  <template v-for="cat in radioCategories" :key="cat.id">
                    <div class="inv-cat">{{ cat.label }}</div>
                    <div
                      v-for="(content, name) in stat_data?.广播系统?.[cat.key as keyof typeof stat_data.广播系统] || {}"
                      :key="name"
                      class="expandable"
                      :class="{ selected: expandedItem === 'radio_' + cat.id + '_' + name }"
                      @click="toggleExpand('radio_' + cat.id + '_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }}</span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ content }}</div>
                            <div
                              v-show="expandedItem === 'radio_' + cat.id + '_' + name"
                              class="sound"
                              style="margin-top: 10px; height: 20px"
                            >
                              <div class="s-bar"></div>
                              <div class="s-bar"></div>
                              <div class="s-bar"></div>
                              <div class="s-bar"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
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
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useDataStore } from './store';
import { storeToRefs } from 'pinia';

const store = useDataStore();
const { data: stat_data } = storeToRefs(store);

// State
const showBoot = ref(true);
const currentMenu = ref('status');
const statusTab = ref('special');
const invTab = ref('weapons');
const dataTab = ref('quests');
const expandedItem = ref<string | null>(null);
const selectedSpecial = ref('力量');

// Auto-expand when a new quest arrives or first time data loads
watch(
  () => stat_data.value?.基地?.任务系统,
  newQuests => {
    if (newQuests && Object.keys(newQuests).length > 0) {
      currentMenu.value = 'data';
      dataTab.value = 'quests';
      // Automatically expand the first quest
      const firstQuestKey = Object.keys(newQuests)[0];
      expandedItem.value = 'quest_' + firstQuestKey;
    }
  },
  { deep: true, immediate: true }, // immediate true in case data already has quests
);

// Navigation Config
const menus = [
  {
    id: 'status',
    label: '状态',
    svg: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="5" />',
  },
  {
    id: 'inv',
    label: '道具',
    svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/><path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>',
  },
  {
    id: 'data',
    label: '数据',
    svg: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
  },
  {
    id: 'map',
    label: '地图',
    svg: '<path d="M20.5 3l-6 1.5-5.5-1.5-6 1.5v15l6-1.5 5.5 1.5 6-1.5V3zM15 18.5l-5.5-1.5-4.5 1.1V5.6l4.5-1.1 5.5 1.5v12.5z"/>',
  },
  {
    id: 'radio',
    label: '广播',
    svg: '<path d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"/>',
  },
];
const statusTabs = [
  { id: 'special', label: 'SPECIAL' },
  { id: 'skills', label: '技能' },
  { id: 'perks', label: 'PERK' },
];
const invTabs = [
  { id: 'weapons', label: '武器', key: '武器' },
  { id: 'apparel', label: '服装', key: '装备' },
  { id: 'aid', label: '药品', key: '药品' },
  { id: 'misc', label: '杂物', key: '道具' },
];
const dataTabs = [
  { id: 'quests', label: '任务' },
  { id: 'stats', label: '统计' },
  { id: 'notes', label: '笔记' },
];
const radioCategories = [
  { id: 'faction', label: '势力广播', key: '势力广播' },
  { id: 'personal', label: '个人广播', key: '个人广播' },
];

// Computed
const currentWeight = computed(() => {
  let weight = 0;
  for (const tab of invTabs) {
    const category = stat_data.value?.背包?.[tab.key as keyof typeof stat_data.value.背包];
    if (category) {
      for (const item of Object.values(category)) {
        weight += (item as any).数量 || 1;
      }
    }
  }
  return weight.toFixed(1);
});

// Helpers
const getSpecialLetter = (key: string) =>
  ({ 力量: 'S', 感知: 'P', 耐力: 'E', 魅力: 'C', 智力: 'I', 敏捷: 'A', 幸运: 'L' })[key] || key.charAt(0);
const getSpecialDesc = (key: string) =>
  ({
    力量: '近战伤害与负重能力',
    感知: '环境感知与VATS精度',
    耐力: '生命值与抗性',
    魅力: '对话与交易能力',
    智力: '经验获取与黑客',
    敏捷: '行动点数与潜行',
    幸运: '暴击与随机事件',
  })[key] || '';

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};

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

// Lifecycle
let bootTimer: ReturnType<typeof setTimeout>;
onMounted(() => {
  bootTimer = setTimeout(() => (showBoot.value = false), 3500);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const idx = menus.findIndex(m => m.id === currentMenu.value);
    if (idx !== -1) {
      const nextIdx = e.key === 'ArrowUp' ? idx - 1 : idx + 1;
      if (nextIdx >= 0 && nextIdx < menus.length) currentMenu.value = menus[nextIdx].id;
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
    clearTimeout(bootTimer);
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

.status {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 15px;
}
.status-l,
.status-c {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 140px;
}
.status-r {
  display: flex;
  align-items: center;
  gap: 20px;
}
.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--g);
  font-size: 14px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}
.stat label {
  color: var(--gd);
  font-size: 11px;
  min-width: 25px;
}
.stat .val {
  font-size: 16px;
  font-weight: bold;
  min-width: 60px;
}
.bar-wrap {
  flex: 1;
  height: 12px;
  background: #0a2a0a;
  border: 2px solid var(--gD);
  position: relative;
  overflow: hidden;
  min-width: 80px;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, var(--g) 0%, var(--gd) 100%);
  box-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
  transition: width 0.3s var(--ease);
  position: relative;
}
.bar::after {
  content: '';
  position: absolute;
  inset: 0 0 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%);
}
.segs {
  position: absolute;
  inset: 0;
  display: flex;
}
.seg {
  flex: 1;
  border-right: 1px solid rgba(0, 0, 0, 0.5);
}
.seg:last-child {
  border-right: none;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--g);
  font-size: 14px;
}
.info-item label {
  color: var(--gd);
  font-size: 11px;
}

.main {
  display: flex;
  height: calc(100% - 85px);
  gap: 15px;
}
.menu {
  width: 120px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.menu-item {
  color: var(--gD);
  font-size: 16px;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
}
.menu-item::before {
  content: '';
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-left: 6px solid var(--g);
  opacity: 0;
  transition: opacity 0.2s;
}
.menu-item:hover,
.menu-item.active {
  color: var(--g);
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--g);
  box-shadow:
    0 0 15px rgba(139, 255, 139, 0.2),
    inset 0 0 15px rgba(139, 255, 139, 0.05);
}
.menu-item.active::before {
  opacity: 1;
}
.menu-item svg {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  fill: currentColor;
  transition: opacity 0.2s;
}
.menu-item:hover svg,
.menu-item.active svg {
  opacity: 1;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 2px solid var(--gD);
  padding-left: 20px;
  position: relative;
}
.tabs {
  display: flex;
  gap: 5px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gD);
  margin-bottom: 15px;
}
.tab {
  color: var(--gD);
  font-size: 14px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.2s var(--ease);
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.tab::after {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--g);
  opacity: 0;
  transition: opacity 0.2s;
  box-shadow: 0 0 8px var(--g);
}
.tab:hover {
  color: var(--gd);
}
.tab.active {
  color: var(--g);
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.8);
}
.tab.active::after {
  opacity: 1;
}

.page {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition:
    opacity 0.3s var(--ease),
    visibility 0.3s;
  z-index: 1;
  display: flex;
  flex-direction: column;
}
.page.active {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  z-index: 10;
}

.scrollable {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}
.scrollable::-webkit-scrollbar {
  width: 6px;
}
.scrollable::-webkit-scrollbar-track {
  background: rgba(26, 90, 26, 0.2);
  border-radius: 3px;
  border: 1px solid var(--gD);
}
.scrollable::-webkit-scrollbar-thumb {
  background: var(--gD);
  border-radius: 3px;
  border: 1px solid var(--gd);
  transition: background 0.2s;
}
.scrollable::-webkit-scrollbar-thumb:hover {
  background: var(--gd);
}

.expandable {
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s var(--ease);
  overflow: hidden;
  margin-bottom: 6px;
  transform: translateZ(0);
}
.expandable:hover,
.expandable.selected {
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--g);
  box-shadow: 0 0 12px rgba(139, 255, 139, 0.2);
}
.expandable.selected .exp-header {
  background: rgba(139, 255, 139, 0.15);
}
.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  transition: background 0.2s var(--ease);
}
.exp-name {
  color: var(--g);
  font-size: 15px;
}
.exp-meta {
  color: var(--gd);
  font-size: 13px;
  display: flex;
  gap: 15px;
}
.exp-details {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease);
}
.exp-details-inner {
  overflow: hidden;
}
.expandable.selected .exp-details {
  grid-template-rows: 1fr;
}
.exp-details-content {
  padding: 0 14px;
  transition:
    padding 0.35s var(--ease),
    opacity 0.35s var(--ease),
    border-color 0.35s var(--ease);
  opacity: 0;
  border-top: 1px solid transparent;
}
.expandable.selected .exp-details-content {
  padding: 12px 14px;
  opacity: 1;
  border-top-color: var(--gD);
}
.exp-desc {
  color: var(--gd);
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 8px;
}
.exp-effects {
  color: var(--g);
  font-size: 12px;
}
.exp-effects::before {
  content: '效果: ';
  color: var(--gd);
}

.special {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(26, 90, 26, 0.1);
  border: 1px solid var(--gD);
  cursor: pointer;
  transition: all 0.2s var(--ease);
  position: relative;
}
.spec-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--g);
  opacity: 0;
  transition: opacity 0.2s;
}
.spec-item:hover,
.spec-item.selected {
  background: rgba(139, 255, 139, 0.15);
  border-color: var(--g);
  box-shadow: 0 0 15px rgba(139, 255, 139, 0.3);
}
.spec-item.selected::before {
  opacity: 1;
  box-shadow: 0 0 8px var(--g);
}
.spec-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.spec-letter {
  font-size: 28px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 12px rgba(139, 255, 139, 0.8);
  width: 35px;
  text-align: center;
}
.spec-name {
  color: var(--g);
  font-size: 16px;
}
.spec-desc {
  color: var(--gd);
  font-size: 11px;
  margin-top: 2px;
}
.spec-val {
  font-size: 32px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 15px rgba(139, 255, 139, 1);
  min-width: 45px;
  text-align: center;
}

.inv-cat {
  color: var(--gd);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 12px 0 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--gD);
}
.inv-cat:first-child {
  margin-top: 0;
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

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.data-card {
  padding: 16px;
  background: rgba(26, 90, 26, 0.08);
  border: 1px solid var(--gD);
  transition: border-color 0.2s;
}
.data-card:hover {
  border-color: var(--gd);
}
.data-title {
  color: var(--gd);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.data-val {
  color: var(--g);
  font-size: 28px;
  font-weight: bold;
  text-shadow: 0 0 12px rgba(139, 255, 139, 0.6);
}

.sound {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 18px;
}
.s-bar {
  width: 3px;
  background: var(--g);
  animation: sound 0.5s ease-in-out infinite alternate;
}
@keyframes sound {
  from {
    transform: scaleY(0.5);
  }
  to {
    transform: scaleY(1);
  }
}
.s-bar:nth-child(1) {
  height: 6px;
}
.s-bar:nth-child(2) {
  height: 14px;
  animation-delay: 0.1s;
}
.s-bar:nth-child(3) {
  height: 9px;
  animation-delay: 0.2s;
}
.s-bar:nth-child(4) {
  height: 16px;
  animation-delay: 0.15s;
}

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
