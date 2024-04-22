import './assets/main.scss'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import App from './App.vue'
import {createPinia} from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import locale from 'element-plus/dist/locale/zh-cn.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import tween from './utils/tween'
// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css'


//引入全局css
import './assets/css/global.css';
import VueAMap, {initAMapApiLoader} from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css'
// 引入和风天气图标
import 'qweather-icons/font/qweather-icons.css';

initAMapApiLoader({
    key: '9d9704b872a88fca59adc67ef0dfe83f',
    plugin: [
      "AMap.Scale",
      "AMap.OverView",
      "AMap.ToolBar",
      "AMap.MapType",
      "AMap.DistrictSearch",
    ],
    v: "1.4.4",
  })
  window._AMapSecurityConfig =  {
    securityJsCode: '9acadcf3d4ee5992242b04b7fd9da587', // 新版key需要配合安全密钥使用

  }


const app = createApp(App);
const pinia = createPinia();
const persist = createPersistedState();
//保存token
pinia.use(persist)
//使用token
app.use(pinia)
app.use(router)
app.use(ElementPlus,{locale})
app.use(VueAMap)
app.use(tween)
app.mount('#app')
app.use(VueAwesomeSwiper, /* { default options with global component } */)
