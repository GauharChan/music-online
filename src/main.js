import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import '@/assets/reset.less'
import '@/assets/font/iconfont.css'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(Element)
// Vue.use(Dialog)
// Vue.use(Scrollbar)

// 重写打印方法
Vue.prototype.$print = (obj, type) => {
  type = type || "log";
  const log = JSON.parse(JSON.stringify(obj));
  console[type](log)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
