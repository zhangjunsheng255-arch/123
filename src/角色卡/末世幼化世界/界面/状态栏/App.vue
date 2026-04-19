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

          <div class="boot" :class="{ hide: !showBoot }" id="boot">
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
                        Math.min(
                          ((stat_data?.主角?.当前状态?.生命值 || 0) / (stat_data?.主角?.当前状态?.最大生命值 || 1)) *
                            100,
                          100,
                        ) + '%',
                    }"
                    id="hp"
                  ></div>
                  <div class="segs"><div class="seg" v-for="i in 10" :key="i"></div></div>
                </div>
                <span class="val"
                  >{{ stat_data?.主角?.当前状态?.生命值 || 0 }}/{{ stat_data?.主角?.当前状态?.最大生命值 || 0 }}</span
                >
              </div>
              <div class="stat">
                <label>AP</label>
                <div class="bar-wrap">
                  <div
                    class="bar"
                    :style="{
                      width:
                        Math.min(
                          ((stat_data?.主角?.当前状态?.行动点数 || 0) /
                            (stat_data?.主角?.当前状态?.最大行动点数 || 1)) *
                            100,
                          100,
                        ) + '%',
                    }"
                  ></div>
                  <div class="segs"><div class="seg" v-for="i in 10" :key="i"></div></div>
                </div>
                <span class="val"
                  >{{ stat_data?.主角?.当前状态?.行动点数 || 0 }}/{{
                    stat_data?.主角?.当前状态?.最大行动点数 || 0
                  }}</span
                >
              </div>
            </div>
            <div class="status-c">
              <div class="stat">
                <label>LEVEL</label><span class="val">{{ stat_data?.主角?.等级 || 1 }}</span>
              </div>
              <div class="stat">
                <label>位置</label><span class="val">{{ stat_data?.世界?.当前地点 || '未知' }}</span>
              </div>
            </div>
            <div class="status-r">
              <div class="stat">
                <label>CAPS</label><span class="val">{{ stat_data?.主角?.瓶盖 || 0 }}</span>
              </div>
              <div class="info-item">
                <label>负重</label><span>{{ currentWeight }}/{{ stat_data?.主角?.最大负重 || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="main">
            <div class="menu">
              <div class="menu-item" :class="{ active: currentMenu === 'status' }" @click="currentMenu = 'status'">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  />
                  <circle cx="12" cy="12" r="5" /></svg
                >状态
              </div>
              <div class="menu-item" :class="{ active: currentMenu === 'inv' }" @click="currentMenu = 'inv'">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                  />
                  <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" /></svg
                >道具
              </div>
              <div class="menu-item" :class="{ active: currentMenu === 'data' }" @click="currentMenu = 'data'">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"
                  /></svg
                >数据
              </div>
              <div class="menu-item" :class="{ active: currentMenu === 'map' }" @click="currentMenu = 'map'">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M20.5 3l-6 1.5-5.5-1.5-6 1.5v15l6-1.5 5.5 1.5 6-1.5V3zM15 18.5l-5.5-1.5-4.5 1.1V5.6l4.5-1.1 5.5 1.5v12.5z"
                  /></svg
                >地图
              </div>
              <div class="menu-item" :class="{ active: currentMenu === 'radio' }" @click="currentMenu = 'radio'">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M3.24 6.15C2.51 6.43 2 7.17 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H8.3l8.26-3.34L15.88 1 3.24 6.15zM7 20c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-8h-2v-2h-2v2H4V8h16v4z"
                  /></svg
                >广播
              </div>
            </div>

            <div class="center">
              <!-- Status Page -->
              <div class="page" :class="{ active: currentMenu === 'status' }" id="p-status">
                <div class="tabs">
                  <div class="tab" :class="{ active: statusTab === 'special' }" @click="statusTab = 'special'">
                    SPECIAL
                  </div>
                  <div class="tab" :class="{ active: statusTab === 'skills' }" @click="statusTab = 'skills'">技能</div>
                  <div class="tab" :class="{ active: statusTab === 'perks' }" @click="statusTab = 'perks'">PERK</div>
                </div>
                <div class="scrollable">
                  <div class="stat-content" v-show="statusTab === 'special'">
                    <div class="special" v-if="stat_data?.主角?.SPECIAL属性">
                      <div
                        class="spec-item"
                        v-for="(val, key) in stat_data.主角.SPECIAL属性"
                        :key="key"
                        :class="{ selected: selectedSpecial === key }"
                        @click="selectedSpecial = key"
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
                  <div class="stat-content" v-show="statusTab === 'skills'">
                    <template v-if="stat_data?.主角?.技能">
                      <div
                        class="expandable"
                        v-for="(skill, name) in stat_data.主角.技能"
                        :key="name"
                        :class="{ selected: expandedItem === 'skill_' + name }"
                        @click="toggleExpand('skill_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta">{{ skill.等级 }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ skill.描述 }}</div>
                              <div class="exp-effects" v-if="skill.效果">{{ skill.效果 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="stat-content" v-show="statusTab === 'perks'">
                    <template v-if="stat_data?.主角?.Perks">
                      <div
                        class="expandable"
                        v-for="(perk, name) in stat_data.主角.Perks"
                        :key="name"
                        :class="{ selected: expandedItem === 'perk_' + name }"
                        @click="toggleExpand('perk_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta">Rank {{ perk.Rank || 1 }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ perk.描述 }}</div>
                              <div class="exp-effects" v-if="perk.效果">{{ perk.效果 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Inventory Page -->
              <div class="page" :class="{ active: currentMenu === 'inv' }" id="p-inv">
                <div class="tabs">
                  <div class="tab" :class="{ active: invTab === 'weapons' }" @click="invTab = 'weapons'">武器</div>
                  <div class="tab" :class="{ active: invTab === 'apparel' }" @click="invTab = 'apparel'">服装</div>
                  <div class="tab" :class="{ active: invTab === 'aid' }" @click="invTab = 'aid'">药品</div>
                  <div class="tab" :class="{ active: invTab === 'misc' }" @click="invTab = 'misc'">杂物</div>
                </div>
                <div class="scrollable">
                  <div class="inv-section" v-show="invTab === 'weapons'">
                    <div
                      class="expandable"
                      v-for="(item, name) in filterItems('武器')"
                      :key="name"
                      :class="{ selected: expandedItem === 'inv_' + name }"
                      @click="toggleExpand('inv_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }} ({{ item.数量 }})</span>
                        <span class="exp-meta">
                          <span v-if="item.伤害">dmg {{ item.伤害 }}</span>
                          <span>{{ item.重量 }}</span>
                          <span>{{ item.价值 }}</span>
                        </span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ item.描述 }}</div>
                            <div class="exp-effects" v-if="item.效果">{{ item.效果 }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="inv-section" v-show="invTab === 'apparel'">
                    <div
                      class="expandable"
                      v-for="(item, name) in filterItems('服装')"
                      :key="name"
                      :class="{ selected: expandedItem === 'inv_' + name }"
                      @click="toggleExpand('inv_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }} ({{ item.数量 }})</span>
                        <span class="exp-meta">
                          <span v-if="item.装甲">装甲 {{ item.装甲 }}</span>
                          <span>{{ item.重量 }}</span>
                          <span>{{ item.价值 }}</span>
                        </span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ item.描述 }}</div>
                            <div class="exp-effects" v-if="item.效果">{{ item.效果 }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="inv-section" v-show="invTab === 'aid'">
                    <div
                      class="expandable"
                      v-for="(item, name) in filterItems('药品')"
                      :key="name"
                      :class="{ selected: expandedItem === 'inv_' + name }"
                      @click="toggleExpand('inv_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }} ({{ item.数量 }})</span>
                        <span class="exp-meta">
                          <span v-if="item.恢复">{{ item.恢复 }}</span>
                          <span>{{ item.重量 }}</span>
                          <span>{{ item.价值 }}</span>
                        </span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ item.描述 }}</div>
                            <div class="exp-effects" v-if="item.效果">{{ item.效果 }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="inv-section" v-show="invTab === 'misc'">
                    <div
                      class="expandable"
                      v-for="(item, name) in filterItems('杂物')"
                      :key="name"
                      :class="{ selected: expandedItem === 'inv_' + name }"
                      @click="toggleExpand('inv_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }} ({{ item.数量 }})</span>
                        <span class="exp-meta">
                          <span>材料</span>
                          <span>{{ item.重量 }}</span>
                          <span>{{ item.价值 }}</span>
                        </span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ item.描述 }}</div>
                            <div class="exp-effects" v-if="item.效果">{{ item.效果 }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Data Page -->
              <div class="page" :class="{ active: currentMenu === 'data' }" id="p-data">
                <div class="tabs">
                  <div class="tab" :class="{ active: dataTab === 'quests' }" @click="dataTab = 'quests'">任务</div>
                  <div class="tab" :class="{ active: dataTab === 'stats' }" @click="dataTab = 'stats'">统计</div>
                  <div class="tab" :class="{ active: dataTab === 'notes' }" @click="dataTab = 'notes'">笔记</div>
                </div>
                <div class="scrollable">
                  <div class="data-content" v-show="dataTab === 'quests'">
                    <div class="data-grid" v-if="stat_data?.统计">
                      <div class="data-card">
                        <div class="data-title">已发现地点</div>
                        <div class="data-val">{{ stat_data.统计.已发现地点 || 0 }}</div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">击杀敌人</div>
                        <div class="data-val">{{ stat_data.统计.击杀敌人 || 0 }}</div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">完成任务</div>
                        <div class="data-val">{{ stat_data.统计.完成任务 || 0 }}</div>
                      </div>
                      <div class="data-card">
                        <div class="data-title">游戏时间</div>
                        <div class="data-val">{{ stat_data?.世界?.当前时间 || '未知' }}</div>
                      </div>
                    </div>
                    <div class="inv-cat">进行中的任务</div>
                    <template v-if="stat_data?.任务">
                      <div
                        class="expandable"
                        v-for="(quest, name) in stat_data.任务"
                        :key="name"
                        :class="{ selected: expandedItem === 'quest_' + name }"
                        @click="toggleExpand('quest_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta">{{ quest.类型 || '任务' }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ quest.描述 }}</div>
                              <div class="exp-effects" v-if="quest.目标">{{ quest.目标 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                  <div class="data-content" v-show="dataTab === 'stats'">
                    <div class="data-grid" v-if="stat_data?.统计">
                      <div
                        class="data-card"
                        v-for="(val, key) in Object.entries(stat_data.统计).filter(
                          ([k]) => !['已发现地点', '击杀敌人', '完成任务'].includes(k),
                        )"
                        :key="val[0]"
                      >
                        <div class="data-title">{{ val[0] }}</div>
                        <div class="data-val">{{ val[1] }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="data-content" v-show="dataTab === 'notes'">
                    <template v-if="stat_data?.笔记">
                      <div
                        class="expandable"
                        v-for="(note, name) in stat_data.笔记"
                        :key="name"
                        :class="{ selected: expandedItem === 'note_' + name }"
                        @click="toggleExpand('note_' + name)"
                      >
                        <div class="exp-header">
                          <span class="exp-name">{{ name }}</span>
                          <span class="exp-meta">{{ note.类型 || '笔记' }}</span>
                        </div>
                        <div class="exp-details">
                          <div class="exp-details-inner">
                            <div class="exp-details-content">
                              <div class="exp-desc">{{ note.内容 }}</div>
                              <div class="exp-effects" v-if="note.效果">{{ note.效果 }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Map Page -->
              <div class="page" :class="{ active: currentMenu === 'map' }" id="p-map">
                <div
                  class="map-container"
                  id="mapContainer"
                  :class="{ dragging: mapState.isDrag }"
                  @mousedown="mapMouseDown"
                  @mousemove="mapMouseMove"
                  @mouseup="mapMouseUp"
                  @mouseleave="mapMouseUp"
                  @wheel="mapWheel"
                  @click="mapClick"
                >
                  <div class="map-info">{{ stat_data?.世界?.当前地点 || '未知' }}<br />联邦废土</div>
                  <div class="map-controls">
                    <div
                      class="map-btn"
                      @click="
                        mapState.scale = Math.min(mapState.scale * 1.2, 3);
                        scheduleMapUpdate();
                      "
                    >
                      +
                    </div>
                    <div
                      class="map-btn"
                      @click="
                        mapState.scale = Math.max(mapState.scale / 1.2, 0.5);
                        scheduleMapUpdate();
                      "
                    >
                      -
                    </div>
                    <div class="map-btn" @click="locatePlayer">◎</div>
                  </div>
                  <div class="map-content" id="mapContent" :style="mapTransformStyle">
                    <div class="map-grid"></div>
                    <!-- Assuming player is at 1000, 1000 for now, could be driven by data if coordinates exist -->
                    <div class="map-player" style="left: 1000px; top: 1000px"></div>
                    <template v-if="stat_data?.地图地点">
                      <div
                        class="map-landmark"
                        v-for="(loc, name) in stat_data.地图地点"
                        :key="name"
                        :style="{ left: (loc.x || 1000) + 'px', top: (loc.y || 1000) + 'px' }"
                        @click.stop="showLandmarkInfo(name as string, loc)"
                      >
                        <div class="landmark-label">{{ name }}</div>
                      </div>
                    </template>
                  </div>
                  <div class="landmark-info" :class="{ show: mapState.showInfo }" id="landmarkInfo">
                    <div class="landmark-info-title">{{ mapState.infoTitle }}</div>
                    <div class="landmark-info-desc">{{ mapState.infoDesc }}</div>
                  </div>
                </div>
              </div>

              <!-- Radio Page -->
              <div class="page" :class="{ active: currentMenu === 'radio' }" id="p-radio">
                <div class="scrollable">
                  <template v-if="stat_data?.广播电台">
                    <div
                      class="expandable"
                      v-for="(station, name) in stat_data.广播电台"
                      :key="name"
                      :class="{ selected: expandedItem === 'radio_' + name }"
                      @click="toggleExpand('radio_' + name)"
                    >
                      <div class="exp-header">
                        <span class="exp-name">{{ name }}</span>
                        <span class="exp-meta">{{ station.频率 }}</span>
                      </div>
                      <div class="exp-details">
                        <div class="exp-details-inner">
                          <div class="exp-details-content">
                            <div class="exp-desc">{{ station.描述 }}</div>
                            <div class="exp-effects" v-if="station.当前播放">正在播放: {{ station.当前播放 }}</div>
                            <div
                              class="sound"
                              style="margin-top: 10px; height: 20px"
                              v-show="expandedItem === 'radio_' + name"
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useDataStore } from './store';

const store = useDataStore();
const stat_data = store.data;

// State
const showBoot = ref(true);
const currentMenu = ref('status');
const statusTab = ref('special');
const invTab = ref('weapons');
const dataTab = ref('quests');
const expandedItem = ref<string | null>(null);
const selectedSpecial = ref('力量');

// Computed
const currentWeight = computed(() => {
  let weight = 0;
  if (stat_data?.主角?.物品栏) {
    for (const item of Object.values(stat_data.主角.物品栏)) {
      weight += ((item as any).重量 || 0) * ((item as any).数量 || 1);
    }
  }
  return weight.toFixed(1);
});

// Helpers
const getSpecialLetter = (key: string) => {
  const map: Record<string, string> = { 力量: 'S', 感知: 'P', 耐力: 'E', 魅力: 'C', 智力: 'I', 敏捷: 'A', 幸运: 'L' };
  return map[key] || key.charAt(0);
};

const getSpecialDesc = (key: string) => {
  const map: Record<string, string> = {
    力量: '近战伤害与负重能力',
    感知: '环境感知与VATS精度',
    耐力: '生命值与抗性',
    魅力: '对话与交易能力',
    智力: '经验获取与黑客',
    敏捷: '行动点数与潜行',
    幸运: '暴击与随机事件',
  };
  return map[key] || '';
};

const filterItems = (category: string) => {
  const items: Record<string, any> = {};
  if (stat_data?.主角?.物品栏) {
    for (const [name, item] of Object.entries(stat_data.主角.物品栏)) {
      if ((item as any).类型 === category) {
        items[name] = item;
      }
    }
  }
  return items;
};

const toggleExpand = (id: string) => {
  expandedItem.value = expandedItem.value === id ? null : id;
};

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
  raf: null as number | null,
});

const mapTransformStyle = computed(() => {
  return `translate(${mapState.value.tx}px, ${mapState.value.ty}px) scale(${mapState.value.scale})`;
});

const scheduleMapUpdate = () => {
  // Vue reactivity handles the update via computed property
};

const mapMouseDown = (e: MouseEvent) => {
  mapState.value.isDrag = true;
  mapState.value.sx = e.clientX - mapState.value.tx;
  mapState.value.sy = e.clientY - mapState.value.ty;
};

const mapMouseMove = (e: MouseEvent) => {
  if (!mapState.value.isDrag) return;
  mapState.value.tx = e.clientX - mapState.value.sx;
  mapState.value.ty = e.clientY - mapState.value.sy;
};

const mapMouseUp = () => {
  mapState.value.isDrag = false;
};

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

const locatePlayer = () => {
  const container = document.getElementById('mapContainer');
  if (container) {
    const r = container.getBoundingClientRect();
    mapState.value.tx = r.width / 2 - 1000 * mapState.value.scale;
    mapState.value.ty = r.height / 2 - 1000 * mapState.value.scale;
  }
};

const showLandmarkInfo = (name: string, loc: any) => {
  mapState.value.infoTitle = name;
  mapState.value.infoDesc = loc.描述 || '';
  mapState.value.showInfo = true;
};

// Lifecycle
let bootTimer: ReturnType<typeof setTimeout>;
let hpInterval: ReturnType<typeof setInterval>;
const hpOffset = ref(0);

onMounted(() => {
  bootTimer = setTimeout(() => {
    showBoot.value = false;
  }, 3500);

  hpInterval = setInterval(() => {
    hpOffset.value = (Math.random() - 0.5) * 4;
  }, 2000);

  // Keyboard nav
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    const menus = ['status', 'inv', 'data', 'map', 'radio'];
    const idx = menus.indexOf(currentMenu.value);
    if (idx !== -1) {
      let nextIdx = e.key === 'ArrowUp' ? idx - 1 : idx + 1;
      if (nextIdx >= 0 && nextIdx < menus.length) {
        currentMenu.value = menus[nextIdx];
      }
    }
  };

  // Scroll
  const handleWheel = (e: WheelEvent) => {
    const activePage = document.querySelector('.page.active .scrollable');
    if (!activePage) return;
    const st = activePage.scrollTop;
    const sh = activePage.scrollHeight;
    const ch = activePage.clientHeight;
    if ((e.deltaY > 0 && st < sh - ch) || (e.deltaY < 0 && st > 0)) {
      activePage.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('wheel', handleWheel, { passive: false });

  onUnmounted(() => {
    clearTimeout(bootTimer);
    clearInterval(hpInterval);
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
  /* Centering */
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

/* Status Bar */
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

.info-bar {
  display: flex;
  gap: 25px;
  align-items: center;
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

/* Main Content */
.main {
  display: flex;
  height: calc(100% - 85px);
  gap: 15px;
}

/* Menu */
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

/* Center Panel */
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

/* Scrollbar */
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

/* Expandable - Optimized Animation */
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

/* SPECIAL */
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

/* Category */
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

/* Map */
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

/* Data */
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

/* Sound bars */
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
