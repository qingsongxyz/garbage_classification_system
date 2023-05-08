import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus';
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import BaiduMap from 'vue-baidu-map-3x';
import echarts from '@/util/echarts';

const app = createApp(App)
const pinia = createPinia() //pinia状态管理库
pinia.use(piniaPluginPersistedstate) //持久化插件
app.use(pinia);
app.use(router)
//设置全局语言为中文
app.use(ElementPlus, { locale: zhCn })
app.use(BaiduMap, {
    ak: 't8yaRYeMGEUaYC7b49sQoHi36bDpjFgp',
});
//echarts按需引入
app.config.globalProperties.$echarts = echarts;
//导入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount("#app");
