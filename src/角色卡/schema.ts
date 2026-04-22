import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

// ==========================================
// 基础复用模型 (Base Schemas)
// ==========================================

// 基础状态池模型，用于HP、AP等
const BaseStatSchema = z.object({
  当前: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 9999))
    .prefault(100),
  上限: z.coerce
    .number()
    .transform(v => _.clamp(v, 1, 9999))
    .prefault(100),
});

// 基础物品模型，用于背包内物品数量管理
const BaseItemSchema = z.object({
  数量: z.coerce
    .number()
    .transform(v => _.clamp(v, 0, 9999))
    .prefault(1),
});

// 基础人际关系模型，用于各个人物列表
const BaseRelationSchema = z.object({
  好感度: z.coerce
    .number()
    .transform(v => _.clamp(v, -100, 100))
    .prefault(0),
  关系: z.enum(['敌对', '冷淡', '中立', '友好', '亲密']).prefault('中立'),
});

// ==========================================
// 顶层结构定义
// ==========================================

export const Schema = z.object({
  // ========== 世界环境系统 ==========
  世界: z
    .object({
      时间: z
        .object({
          日期: z.string().prefault('2026-04-16'),
          时刻: z.string().prefault('08:00'),
          天气: z.enum(['晴朗', '多云', '阴雨', '暴雨', '雾', '沙尘']).prefault('晴朗'),
          阶段: z.enum(['清晨', '上午', '中午', '下午', '傍晚', '夜晚', '深夜']).prefault('上午'),
        })
        .prefault({}),

      当前位置: z
        .object({
          区域: z.string().prefault('荒野公路'),
          具体地点: z.string().prefault('废弃加油站'),
        })
        .prefault({}),
    })
    .prefault({}),

  广播系统: z
    .object({
      势力广播: z.record(z.string().describe('广播频道/势力名'), z.string().describe('广播内容')).prefault({}),
      个人广播: z.record(z.string().describe('广播频道/个人名'), z.string().describe('广播内容')).prefault({}),
    })
    .prefault({}),

  // ========== 主角核心系统 ==========
  主角: z
    .object({
      人物姓名: z
        .string()
        .transform(v => v.trim())
        .prefault('写卡大师'),
      人物年龄: z.coerce
        .number()
        .transform(v => _.clamp(v, 18, 60))
        .prefault(25),

      // 复用状态池模型
      HP: BaseStatSchema.extend({}).prefault({}),
      AP: BaseStatSchema.extend({
        当前: z.coerce
          .number()
          .transform(v => _.clamp(v, 0, 9999))
          .prefault(50),
        上限: z.coerce
          .number()
          .transform(v => _.clamp(v, 1, 9999))
          .prefault(50),
      }).prefault({}),

      当前等级: z.coerce
        .number()
        .transform(v => _.clamp(v, 1, 9))
        .prefault(1),
      经验值: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 999999))
        .prefault(0),
      晶核数量: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 999999))
        .describe('世界通用货币/能源')
        .prefault(0),

      当前装备: z
        .record(z.enum(['主手', '副手', '头部', '上装', '下装', '腿部', '足部', '饰品']), z.string())
        .prefault({
          主手: '',
          副手: '',
          头部: '',
          上装: '',
          下装: '',
          腿部: '',
          足部: '',
          饰品: '',
        }),

      称号: z
        .record(z.string().describe('称号名'), z.boolean())
        .transform(data => _.pickBy(data, Boolean))
        .prefault({}),
    })
    .prefault({}),

  // ========== 主角状态系统 ==========
  状态: z
    .object({
      属性点: z
        .object({
          力量: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          感知: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          耐力: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          魅力: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          智力: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          敏捷: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
          幸运: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 100))
            .prefault(5),
        })
        .prefault({}),

      技能: z.record(z.string().describe('技能名'), z.object({ 描述: z.string().prefault('') })).prefault({}),
      专长: z.record(z.string().describe('专长名'), z.object({ 描述: z.string().prefault('') })).prefault({}),
    })
    .prefault({}),

  // ========== 背包系统 ==========
  背包: z
    .object({
      武器: z
        .record(
          z.string().describe('武器名'),
          BaseItemSchema.extend({
            类型: z.enum(['近战', '远程', '枪械', '投掷']).prefault('近战'),
            部位: z.enum(['主手', '副手']).prefault('主手'),
            品质: z.enum(['普通', '稀有', '史诗', '传说']).prefault('普通'),
            描述: z.string().prefault(''),
            效果: z.string().prefault(''),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),

      装备: z
        .record(
          z.string().describe('装备名'),
          BaseItemSchema.extend({
            部位: z.enum(['头部', '上装', '下装', '腿部', '足部', '饰品']).prefault('头部'),
            品质: z.enum(['普通', '稀有', '史诗', '传说']).prefault('普通'),
            描述: z.string().prefault(''),
            效果: z.string().prefault(''),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),

      药品: z
        .record(
          z.string().describe('药品名'),
          BaseItemSchema.extend({
            类型: z.enum(['恢复', '增益', '特殊']).prefault('恢复'),
            品质: z.enum(['普通', '稀有', '史诗', '传说']).prefault('普通'),
            描述: z.string().prefault(''),
            效果: z.string().prefault(''),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),

      道具: z
        .record(
          z.string().describe('道具名'),
          BaseItemSchema.extend({
            类型: z.enum(['材料', '任务', '消耗', '杂项']).prefault('材料'),
            品质: z.enum(['普通', '稀有', '史诗', '传说']).prefault('普通'),
            描述: z.string().prefault(''),
            效果: z.string().prefault(''),
          }),
        )
        .transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
        .prefault({}),
    })
    .prefault({}),

  // ========== 基地建设系统 ==========
  基地: z
    .object({
      基地等级: z.coerce
        .number()
        .transform(v => _.clamp(v, 0, 9))
        .prefault(0),

      控制统计: z
        .object({
          当前控制幼女总数: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          可控制上限: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(3),
        })
        .prefault({}),

      功能区域: z
        .object({
          核心休息区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          物资储藏区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          外围防御区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          农业种植区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          隔离繁育区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          医疗科研区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          能源中枢区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
          航空管制区: z.object({ 已解锁: z.boolean().prefault(false) }).prefault({}),
        })
        .prefault({}),

      幼女分类与数量: z
        .object({
          战斗型幼女: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          探索搜集型幼女: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          生产种植型幼女: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
          繁育辅助型幼女: z.coerce
            .number()
            .transform(v => _.clamp(v, 0, 999))
            .prefault(0),
        })
        .prefault({}),

      任务系统: z
        .record(
          z.string().describe('任务名'),
          z.object({
            类型: z.enum(['主线', '支线', '日常', '紧急', '委托']).prefault('日常'),
            描述: z.string().prefault(''),
            进度: z.coerce
              .number()
              .transform(v => _.clamp(v, 0, 100))
              .prefault(0),
            状态: z.enum(['未接取', '进行中', '已完成', '已放弃']).prefault('未接取'),
          }),
        )
        .prefault({}),
    })
    .prefault({}),

  // ========== 人际关系系统 ==========
  // 复用基础人际关系模型
  NPC列表: z.record(z.string().describe('NPC姓名'), BaseRelationSchema).prefault({}),

  重要人物列表: z.record(z.string().describe('重要人物姓名'), BaseRelationSchema).prefault({}),

  在场人物: z
    .record(
      z.string().describe('人物姓名'),
      z.object({
        类型: z.string().prefault(''),
      }),
    )
    .prefault({}),
});

$(() => {
  registerMvuSchema(Schema);
});
