export const Schema = z.object({
  // ========== 世界信息 ==========
  世界: z.string().default("末世幼化世界"),
  时间: z.object({
    年: z.number().default(2026),
    月: z.number().min(1).max(12).default(4),
    日: z.number().min(1).max(31).default(16),
    时: z.number().min(0).max(23).default(8),
    分: z.number().min(0).max(59).default(0),
    天气: z.enum(["晴朗", "多云", "阴雨", "暴雨", "雾", "沙尘"]).default("晴朗"),
    阶段: z.enum(["清晨", "上午", "中午", "下午", "傍晚", "夜晚", "深夜"]).default("上午"),
  }).default({}),
  当前位置: z.object({
    区域: z.string().default("荒野公路"),
    具体地点: z.string().default("废弃加油站"),
  }).default({}),

  // ========== 广播系统 ==========
  广播系统: z.object({
    势力广播: z.array(z.object({
      势力名: z.string(),
      广播内容: z.string(),
    })).default([]),
    个人广播: z.array(z.object({
      发送者: z.string(),
      内容: z.string(),
    })).default([]),
  }).default({}),

  // ========== 主角部分 ==========
  主角: z.object({
    人物姓名: z.string().default(""),
    人物年龄: z.number().default(25),
    HP: z.object({
      当前: z.number().min(0).default(100),
      上限: z.number().default(100),
    }).default({}),
    AP: z.object({
      当前: z.number().min(0).default(50),
      上限: z.number().default(50),
    }).default({}),
    当前等级: z.number().min(1).max(9).default(1),
    晶核数量: z.number().min(0).default(0),
    当前装备: z.object({
      主手: z.string().default(""),
      副手: z.string().default(""),
      头部: z.string().default(""),
      上装: z.string().default(""),
      下装: z.string().default(""),
      腿部: z.string().default(""),
      足部: z.string().default(""),
      饰品: z.array(z.string()).default([]),
    }).default({}),
    称号: z.array(z.string()).default([]),
  }).default({}),

  // ========== 状态 ==========
  状态: z.object({
    属性点: z.object({
      力量: z.number().min(1).default(5),
      感知: z.number().min(1).default(5),
      耐力: z.number().min(1).default(5),
      魅力: z.number().min(1).default(5),
      智力: z.number().min(1).default(5),
      敏捷: z.number().min(1).default(5),
      幸运: z.number().min(1).default(5),
    }).default({}),
    技能: z.array(z.object({
      名称: z.string(),
      等级: z.number().min(1).max(10),
      描述: z.string(),
    })).default([]),
    专长: z.array(z.object({
      名称: z.string(),
      类型: z.enum(["战斗", "生存", "制造", "社交", "特殊"]),
      效果: z.string(),
    })).default([]),
  }).default({}),

  // ========== 背包 ==========
  背包: z.object({
    武器: z.array(z.object({
      名称: z.string(),
      类型: z.enum(["近战", "手枪", "步枪", "霰弹枪", "狙击枪", "特殊"]),
      品质: z.enum(["普通", "精良", "稀有", "史诗", "传说"]),
      数量: z.number().min(1).default(1),
      描述: z.string(),
    })).default([]),
    服装: z.array(z.object({
      名称: z.string(),
      部位: z.enum(["头部", "上装", "下装", "腿部", "足部", "饰品"]),
      品质: z.enum(["普通", "精良", "稀有", "史诗", "传说"]),
      防御: z.number().default(0),
      数量: z.number().min(1).default(1),
      描述: z.string(),
    })).default([]),
    药品: z.array(z.object({
      名称: z.string(),
      类型: z.enum(["治疗", "强化", "解毒", "抑制", "特殊"]),
      效果: z.string(),
      数量: z.number().min(0).default(1),
    })).default([]),
    道具: z.array(z.object({
      名称: z.string(),
      类型: z.enum(["材料", "图纸", "钥匙", "任务", "特殊", "书籍"]),
      稀有度: z.enum(["普通", "稀有", "史诗", "传说"]),
      数量: z.number().min(0).default(1),
      描述: z.string(),
    })).default([]),
  }).default({}),

  // ========== 基地 ==========
  基地: z.object({
    基地等级: z.number().min(0).max(9).default(0),
    控制统计: z.object({
      当前控制幼女总数: z.number().min(0).default(0),
      可控制上限: z.number().min(0).default(3),
    }).default({}),
    功能区域: z.object({
      核心休息区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      物资储藏区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      外围防御区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      农业种植区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      隔离繁育区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      医疗科研区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      能源中枢区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
      航空管制区: z.object({
        等级: z.number().min(0).max(9).default(0),
        已解锁: z.boolean().default(false),
      }).default({}),
    }).default({}),
    幼女分类与数量: z.object({
      战斗型幼女: z.number().min(0).default(0),
      探索搜集型幼女: z.number().min(0).default(0),
      生产种植型幼女: z.number().min(0).default(0),
      繁育辅助型幼女: z.number().min(0).default(0),
    }).default({}),
    任务系统: z.array(z.object({
      任务名: z.string(),
      任务类型: z.enum(["主线", "支线", "日常", "紧急", "委托"]),
      任务描述: z.string(),
      进度: z.number().min(0).max(100).default(0),
      奖励: z.string(),
      状态: z.enum(["未接取", "进行中", "已完成", "已放弃"]).default("未接取"),
    })).default([]),
  }).default({}),

  // ========== NPC部分 ==========
  NPC列表: z.array(z.object({
    ID: z.string(),
    人物姓名: z.string(),
    人物年龄: z.number(),
    人物穿着: z.string(),
    人物等级: z.number().min(1).max(9),
    内心想法: z.string(),
    关系: z.enum(["敌对", "冷淡", "中立", "友好", "亲密"]).default("中立"),
  })).default([]),

  // ========== 重要人物部分 ==========
  重要人物列表: z.array(z.object({
    ID: z.string(),
    人物姓名: z.string(),
    人物年龄: z.number(),
    人物穿着: z.string(),
    人物等级: z.number().min(1).max(9),
    内心想法: z.string(),
    好感度: z.number().transform(value => _.clamp(value, -100, 100)).default(0),
  })).default([]),

  // ========== 在场人物 ==========
  在场人物: z.array(z.object({
    ID: z.string(),
    人物姓名: z.string(),
    类型: z.enum(["主角", "重要人物", "NPC", "敌人", "中立"]),
  })).default([]),
});

export type Schema = z.output<typeof Schema>;
