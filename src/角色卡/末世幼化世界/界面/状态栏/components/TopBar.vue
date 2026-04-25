<template>
  <div class="top-bar">
    <!-- 左侧：HP/AP -->
    <div class="left-section">
      <!-- HP -->
      <div class="stat-row">
        <label>HP</label>
        <span class="val">{{ hpCurrent }}/{{ hpMax }}</span>
      </div>

      <!-- AP -->
      <div class="stat-row">
        <label>AP</label>
        <span class="val">{{ apCurrent }}/{{ apMax }}</span>
      </div>
    </div>

    <!-- 中间：晶核/位置 -->
    <div class="center-section">
      <div class="info-row">
        <span class="info-item">
          <label>晶核</label>
          <span class="val">{{ caps }}</span>
        </span>
      </div>
      <div class="location-row">
        <label>位置</label>
        <span class="location-val">{{ displayLocation }}</span>
      </div>
    </div>

    <!-- 右侧：时间 -->
    <div class="right-section">
      <div class="time-group">
        <span class="time-val">{{ displayTime }}</span>
        <span class="period-val">{{ displayPeriod }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '../store';

const store = useStatusStore();

// HP - 主角.HP.当前/上限
const hpCurrent = computed(() => store.data?.主角?.HP?.当前 ?? 100);
const hpMax = computed(() => store.data?.主角?.HP?.上限 ?? 100);

// AP - 主角.AP.当前/上限
const apCurrent = computed(() => store.data?.主角?.AP?.当前 ?? 50);
const apMax = computed(() => store.data?.主角?.AP?.上限 ?? 50);

// 晶核 - 主角.晶核数量
const caps = computed(() => store.data?.主角?.晶核数量 ?? 0);

// 显示的时间 - 世界.时间.时刻
const displayTime = computed(() => store.data?.世界?.时间?.时刻 ?? '08:00');

// 显示的地点 - 世界.当前位置.区域/具体地点
const displayLocation = computed(() => {
  const region = store.data?.世界?.当前位置?.区域 ?? '荒野';
  const location = store.data?.世界?.当前位置?.具体地点 ?? '未知地点';
  return `${region}·${location}`;
});

// 显示的时刻/阶段 - 世界.时间.阶段
const displayPeriod = computed(() => store.data?.世界?.时间?.阶段 ?? '上午');
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 2px solid var(--gD);
  gap: 20px;
  flex-shrink: 0;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 200px;
  flex-shrink: 0;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-row label {
  color: var(--gd);
  font-size: 14px;
  text-transform: uppercase;
  min-width: 30px;
  font-weight: bold;
}

.val {
  color: var(--g);
  font-size: 14px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
  min-width: 60px;
  text-align: right;
}

.center-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.info-row {
  display: flex;
  gap: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item label {
  color: var(--gd);
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
}

.location-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-row label {
  color: var(--gd);
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
}

.location-val {
  color: var(--g);
  font-size: 14px;
  text-shadow: 0 0 8px rgba(139, 255, 139, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right-section {
  flex-shrink: 0;
}

.time-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.time-val {
  color: var(--g);
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.6);
}

.period-val {
  color: var(--gd);
  font-size: 12px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .top-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "hp ap"
      "caps time"
      "loc loc";
    gap: 8px 18px;
    padding: 10px 12px;
  }

  .left-section,
  .center-section,
  .info-row,
  .right-section {
    display: contents;
  }

  .stat-row:first-child {
    grid-area: hp;
  }

  .stat-row:last-child {
    grid-area: ap;
  }

  .info-item {
    grid-area: caps;
  }

  .time-group {
    grid-area: time;
    flex-direction: row;
    align-items: center;
    gap: 6px;
  }

  .location-row {
    grid-area: loc;
  }

  .stat-row {
    gap: 4px;
  }

  .time-val {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 8px 10px;
    gap: 4px 8px;
  }

  .stat-row label {
    font-size: 11px;
    min-width: 22px;
  }

  .val {
    font-size: 12px;
    min-width: 0;
  }

  .info-item label,
  .location-row label {
    font-size: 11px;
  }

  .location-val {
    font-size: 12px;
  }

  .time-val {
    font-size: 14px;
    letter-spacing: 1px;
  }

  .period-val {
    font-size: 11px;
  }
}
</style>
