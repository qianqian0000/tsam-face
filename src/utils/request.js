import axios from 'axios'
import store from '@/store'
// 根据环境不同引入不同api地址
import { baseApi } from '@/config'
// create an axios instance
const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': '*/*'
  },
  baseURL: baseApi, // url = base url + request url
  timeout: 5000, // request timeout
})

// request拦截器 request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      config.headers['X-Token'] = ''
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data ? response.data : response
    /*
    if (res.code === -1) {
        this.$toast.show('系统错误，请稍后尝试！')
        return Promise.reject(res)
    }
    */
    //return Promise.resolve(res)
    return res
  },
  error => {
    this.$toast.show(error)
    // console.log('err' + error) // for debug
    // return Promise.resolve(res)
  }
)

export default service
