import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import rem from './rem'
import './assets/css/base.css'
import Vant from 'vant'
import 'vant/lib/index.css'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  preLoad: 3,//距离当前dom距离页面底部的高度
  error: '',//加载失败显示的图片
  loading: '',//加载中显示的图片
  attempt: 1 // 图片加载失败，最多重试的次数
});

Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  rem,
  render: h => h(App)
}).$mount('#app')
