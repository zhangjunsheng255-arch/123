<template>
  <div id="p-base" class="page" :class="{ active: active }">
    <div class="scrollable">
      <!-- 基地概况 -->
      <div class="inv-cat">基地概况</div>
      <div v-if="stat_data?.基地" class="data-grid">
        <div class="data-card">
          <div class="data-title">基地等级</div>
          <div class="data-val">{{ stat_data.基地.基地等级 ?? 0 }}</div>
        </div>
        <div class="data-card">
          <div class="data-title">控制总数</div>
          <div class="data-val">
            {{ stat_data.基地.控制统计?.当前控制幼女总数 ?? 0 }}<span class="data-max"> / {{ stat_data.基地.控制统计?.可控制上限 ?? 3 }}</span>
          </div>
        </div>
        <div class="data-card">
          <div class="data-title">游戏时间</div>
          <div class="data-val">{{ stat_data?.世界?.时间?.阶段 ?? '未知' }}</div>
        </div>
      </div>

      <!-- 功能区域解锁状态 -->
      <div class="inv-cat">功能区域</div>
      <div v-if="stat_data?.基地?.功能区域" class="data-grid area-grid">
        <div
          v-for="(area, name) in stat_data.基地.功能区域"
          :key="name"
          class="data-card area-card"
          :class="{ unlocked: (area as any).已解锁 }"
        >
          <div class="data-title">{{ name }}</div>
          <div class="area-status">{{ (area as any).已解锁 ? '已解锁' : '未解锁' }}</div>
        </div>
      </div>

      <!-- 幼女分类与数量 -->
      <div class="inv-cat">幼女分类与数量</div>
      <div v-if="stat_data?.基地?.幼女分类与数量" class="data-grid girl-grid">
        <div
          v-for="(count, type) in stat_data.基地.幼女分类与数量"
          :key="type as string"
          class="data-card"
        >
          <div class="data-title">{{ type }}</div>
          <div class="data-val">{{ count ?? 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean;
  stat_data: any;
}>();
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

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.area-grid {
  grid-template-columns: repeat(4, 1fr);
}
.girl-grid {
  grid-template-columns: repeat(2, 1fr);
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

.area-card {
  padding: 12px;
}
.area-card.unlocked {
  border-color: var(--g);
}
.area-card:not(.unlocked) {
  opacity: 0.5;
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
.data-max {
  color: var(--gD);
  font-size: 18px;
  font-weight: normal;
}

.area-status {
  font-size: 13px;
  font-weight: bold;
  color: var(--gd);
  margin-top: 4px;
}
.area-card.unlocked .area-status {
  color: var(--g);
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
}

@media (max-width: 768px) {
  .data-grid {
    gap: 8px;
  }
  .area-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .data-card {
    padding: 12px;
  }
  .area-card {
    padding: 10px;
  }
  .data-val {
    font-size: 22px;
  }
  .data-max {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .data-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .area-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .girl-grid {
    grid-template-columns: 1fr;
  }
  .data-card {
    padding: 10px;
  }
  .area-card {
    padding: 8px;
  }
  .data-title {
    font-size: 10px;
    margin-bottom: 4px;
  }
  .data-val {
    font-size: 18px;
  }
  .data-max {
    font-size: 13px;
  }
  .area-status {
    font-size: 11px;
  }
}
</style>
