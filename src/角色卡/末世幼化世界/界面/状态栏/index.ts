import { waitUntil } from 'async-wait-until';
import App from './App.vue';
import './global.css';

$(async () => {
  // 等待 MVU 初始化，但设置超时避免一直等待
  try {
    await waitGlobalInitialized('Mvu');
    // 等待消息楼层变量，最多等3秒
    await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'), { timeout: 3000 });
  } catch (e) {
    console.warn('MVU 或变量未就绪，使用默认值:', e);
  }
  createApp(App).use(createPinia()).mount('#app');
});
