import axios from 'axios'
import qs from 'querystring'
import {message} from 'antd'
import store from '../redux/store'
import {createDeleteUserInfoAction} from '../redux/actions/login_action'
const instance = axios.create({
  timmeout:4000
})

instance.interceptors.request.use((config) => {
  // console.log(config);
  let {method,data} = config
  let {token} =  store.getState().userInfo
  if (token) config.headers.Authorization = 'dof_' + token
  if ('post' === method.toLowerCase()) {
    if (data instanceof Object) {
      config.data = qs.stringify(data)
    }
  }
 return config 
},
(error) => {
  return Promise.reject(error)
})



instance.interceptors.response.use((response) => {
  // console.log(response);
  return response.data 
 },
 (error) => {
  //  console.log(error);
   if (!error.response) {
    message.error('网络错误,请稍后重试',2)
    store.dispatch(createDeleteUserInfoAction())
   }else{
    if (401 === error.response.status) {
      message.error('身份校验失败,请重新登录',2)
      //删除用户本地存储的信息
      store.dispatch(createDeleteUserInfoAction())
     }else{
      message.error(error.message,1)
     }
   }
   
  
   return new Promise(() => {
    //传一个空函数 状态为pending 中断promise链 
   })
 })
export default instance

