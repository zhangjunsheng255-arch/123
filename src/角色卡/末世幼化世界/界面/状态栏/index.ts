import { waitUntil } from 'async-wait-until'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

$(async () => {
  // 等待 MVU 全局对象初始化
  await waitGlobalInitialized('Mvu')
  // 等待变量数据可用
  await waitUntil(() => {
    try {
      return _.has(getVariables({ type: 'message' }), 'stat_data')
    } catch {
      return false
    }
  })
  // 创建 Vue 应用
  createApp(App).use(createPinia()).mount('#app')
})
