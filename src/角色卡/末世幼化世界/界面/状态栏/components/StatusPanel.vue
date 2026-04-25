<template>
  <div id="p-status" class="page" :class="{ active: active }">
    <div class="tabs">
      <div
        v-for="tab in statusTabs"
        :key="tab.id"
        class="tab"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </div>
    </div>
    <div class="scrollable">
      <div v-show="activeTab === 'special'" class="data-content">
        <div class="special-list">
          <div
            v-for="attr in specialAttrs"
            :key="attr.key"
            class="spec-item"
            :class="{ selected: selectedSpecial === attr.key }"
            @click="selectedSpecial = attr.key"
          >
            <div class="spec-info">
              <div class="spec-letter">{{ attr.letter }}</div>
              <div class="spec-details">
                <div class="spec-name">{{ attr.name }}</div>
                <div class="spec-desc">{{ attr.desc }}</div>
              </div>
            </div>
            <div class="spec-val">{{ attr.value }}</div>
          </div>
        </div>
      </div>
      <div v-show="activeTab === 'skills'" class="data-content">
        <div v-if="skills.length === 0" class="empty-inv">
          <div class="empty-text">暂无技能</div>
        </div>
        <div v-else class="skills-list">
          <div
            v-for="skill in skills"
            :key="skill.name"
            class="expandable"
            :class="{ selected: selectedSkill === skill.name }"
            @click="toggleSkill(skill.name)"
          >
            <div class="exp-header">
              <span class="exp-name">{{ skill.name }}</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ skill.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeTab === 'perks'" class="data-content">
        <div v-if="perks.length === 0" class="empty-inv">
          <div class="empty-text">暂无专长</div>
        </div>
        <div v-else class="perks-list">
          <div
            v-for="perk in perks"
            :key="perk.name"
            class="expandable"
            :class="{ selected: selectedPerk === perk.name }"
            @click="togglePerk(perk.name)"
          >
            <div class="exp-header">
              <span class="exp-name">{{ perk.name }}</span>
            </div>
            <div class="exp-details">
              <div class="exp-details-inner">
                <div class="exp-details-content">
                  <div class="exp-desc">{{ perk.desc }}</div>
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
import { computed, ref } from 'vue';
import { useStatusStore } from '../store';

defineProps<{
  active: boolean;
}>();

const store = useStatusStore();
const activeTab = ref('special');
const selectedSpecial = ref('力量');
const selectedSkill = ref<string | null>(null);
const selectedPerk = ref<string | null>(null);

const statusTabs = [
  { id: 'special', label: '属性' },
  { id: 'skills', label: '技能' },
  { id: 'perks', label: '专长' },
];

const SPECIAL_DEFS = [
  { key: '力量', letter: 'S', name: '力量 Strength', desc: '近战伤害与负重能力' },
  { key: '感知', letter: 'P', name: '感知 Perception', desc: '环境感知与VATS精度' },
  { key: '耐力', letter: 'E', name: '耐力 Endurance', desc: '生命值与抗性' },
  { key: '魅力', letter: 'C', name: '魅力 Charisma', desc: '对话与交易能力' },
  { key: '智力', letter: 'I', name: '智力 Intelligence', desc: '经验获取与黑客' },
  { key: '敏捷', letter: 'A', name: '敏捷 Agility', desc: '行动点数与潜行' },
  { key: '幸运', letter: 'L', name: '幸运 Luck', desc: '暴击与随机事件' },
];

const specialAttrs = computed(() => {
  const attrPoints = store.data?.状态?.属性点;
  return SPECIAL_DEFS.map(def => ({
    key: def.key,
    letter: def.letter,
    name: def.name,
    desc: def.desc,
    value: attrPoints?.[def.key as keyof typeof attrPoints] ?? 5,
  }));
});

const skills = computed(() => {
  const skillsData = store.data?.状态?.技能;
  if (!skillsData || Object.keys(skillsData).length === 0) {
    return [];
  }
  return Object.entries(skillsData).map(([name, data]) => ({
    name,
    value: 0,
    desc: data?.描述 ?? '',
    effects: '',
  }));
});

const perks = computed(() => {
  const perksData = store.data?.状态?.专长;
  if (!perksData || Object.keys(perksData).length === 0) {
    return [];
  }
  return Object.entries(perksData).map(([name, data]) => ({
    name,
    rank: 1,
    desc: data?.描述 ?? '',
    effects: '',
  }));
});

const toggleSkill = (name: string) => {
  selectedSkill.value = selectedSkill.value === name ? null : name;
};

const togglePerk = (name: string) => {
  selectedPerk.value = selectedPerk.value === name ? null : name;
};
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

/* SPECIAL 属性 (唯一特有样式) */
.special-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: rgba(26, 90, 26, 0.08);
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
  background: rgba(139, 255, 139, 0.1);
  border-color: var(--g);
  box-shadow: 0 0 12px rgba(139, 255, 139, 0.2);
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
  font-size: 24px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 10px rgba(139, 255, 139, 0.8);
  width: 32px;
  text-align: center;
}
.spec-name {
  color: var(--g);
  font-size: 16px;
  font-weight: bold;
}
.spec-desc {
  color: var(--gd);
  font-size: 12px;
  margin-top: 2px;
}
.spec-val {
  font-size: 28px;
  font-weight: bold;
  color: var(--g);
  text-shadow: 0 0 15px rgba(139, 255, 139, 1);
  min-width: 40px;
  text-align: center;
}

/* 空状态 */
.empty-inv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
.empty-text {
  color: var(--gd);
  font-size: 16px;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .tabs {
    gap: 4px;
    padding-bottom: 10px;
    margin-bottom: 12px;
  }
  .tab {
    font-size: 12px;
    padding: 5px 12px;
  }
  .tab::after {
    bottom: -12px;
  }
  .exp-header {
    padding: 8px 12px;
  }
  .exp-name {
    font-size: 13px;
  }
  .exp-details-content {
    padding: 0 10px;
  }
  .expandable.selected .exp-details-content {
    padding: 10px 10px;
  }
  .exp-desc {
    font-size: 12px;
  }
  .spec-letter {
    font-size: 20px;
    width: 28px;
  }
  .spec-name {
    font-size: 14px;
  }
  .spec-desc {
    font-size: 11px;
  }
  .spec-val {
    font-size: 24px;
  }
  .empty-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .tabs {
    gap: 3px;
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .tab {
    font-size: 11px;
    padding: 4px 8px;
  }
  .tab::after {
    bottom: -10px;
  }
  .exp-header {
    padding: 7px 10px;
  }
  .exp-name {
    font-size: 12px;
  }
  .exp-details-content {
    padding: 0 8px;
  }
  .expandable.selected .exp-details-content {
    padding: 8px 8px;
  }
  .exp-desc {
    font-size: 11px;
  }
  .spec-item {
    padding: 8px 10px;
  }
  .spec-letter {
    font-size: 18px;
    width: 24px;
  }
  .spec-name {
    font-size: 13px;
  }
  .spec-desc {
    font-size: 10px;
  }
  .spec-val {
    font-size: 20px;
  }
  .empty-text {
    font-size: 13px;
  }
  .empty-inv {
    padding: 30px 0;
  }
}
</style>
