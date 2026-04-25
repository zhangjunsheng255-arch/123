<template>
  <div class="top-bar">
    <!-- 中间：等级/晶核/位置 -->
    <div class="center-section">
      <div class="info-row">
        <span class="info-item">
          <label>LEVEL</label>
          <span class="val">{{ level }}</span>
        </span>
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
      <span class="time-val">{{ displayTime }}</span>
      <span class="period-val">{{ displayPeriod }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStatusStore } from '../store';

const store = useStatusStore();

// 等级 - 主角.当前等级
const level = computed(() => store.data?.主角?.当前等级 ?? 1);

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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
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
    padding: 10px 12px;
    gap: 15px;
    flex-wrap: wrap;
  }

  .center-section {
    flex-direction: row;
    align-items: center;
    gap: 15px;
    width: calc(100% - 100px);
  }

  .info-row {
    gap: 15px;
  }

  .location-row {
    flex: 1;
    min-width: 0;
  }

  .right-section {
    width: 80px;
  }

  .time-val {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .top-bar {
    padding: 8px 10px;
    gap: 10px;
  }

  .val {
    font-size: 12px;
    min-width: 50px;
  }

  .center-section {
    width: 100%;
    justify-content: space-between;
  }

  .info-item label,
  .location-row label {
    font-size: 11px;
  }

  .location-val {
    font-size: 12px;
  }

  .right-section {
    width: auto;
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .time-val {
    font-size: 14px;
  }

  .period-val {
    font-size: 11px;
  }
}
</style>
