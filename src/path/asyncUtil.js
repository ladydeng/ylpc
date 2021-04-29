/**
 * 本文件包含内容
 * 1.路由请求监听
 * 2.路由响应监听
 * 3.请求访问根地址
 * 4.封装异步 GET POST 请求方法
 */
import axios from 'axios'
// axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config.headers['token'] = store.state.token
  return config;

}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (resp) {
  // 如果长时间未操作，token 失效 ，status！= 200 || resp.data.status != 200 ，可以重新登录
  // console.log("响应：", resp)
  // if (resp.status != 200 || resp.data.status != 200) {
  //   router.push("/login")
  // }
  return resp;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

  /**
   * GET请求封装
   * @param {*} url 地址
   * @param {*} params 参数
   */
  function sendGetRequest(vueData,url, params) {
      axios.get(url, params).then(function (response) {
        vueData = response.data
      })
  }
  /**
   * POST请求封装
   * @param {*} url 地址
   * @param {*} params 参数
   */
  function sendPostRequest(url, params) {

    var res = this;

    axios.post(url, params).then(function (data) {
      res = data.data;
    })

    return res;

  }
/**
 * 根地址
 */
 /**配置了vue反向代理 **/
var baseURL = "http://yl.gateway.zzcedu.com/data-staff";
export default {
  baseURL
}