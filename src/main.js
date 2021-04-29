import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import api from './path/asyncUtil.js'
/* 完整引入 Antd */
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import store from './store';
import Blob from "@/excel/Blob.js"
import Export2Excel from "@/excel/Export2Excel.js"
import axios from 'axios'


// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

// 全局引入echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;
Vue.use(Antd);

Vue.config.productionTip = false;

Vue.prototype.api = api

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')