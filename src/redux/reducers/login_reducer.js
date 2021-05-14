
import {SAVEUSERINFO,DELETEUSERINFO} from '../action_type.js'

//尝试从localStorage中读取之前保存的信息
let user = JSON.parse(localStorage.getItem('user'))
let token = localStorage.getItem('token')

//初始化userInfo数据
let initState = {
  //若有值，取出使用，没有值，为空
  user: user || '',
  token: token || '',
  isLogin: user && token ? true :false
}

export default function test(preState=initState,action) {
  
  let {type,data} = action
  switch (type) {
    case SAVEUSERINFO:
      return {user:data.user,token:data.token,isLogin:true}
    case DELETEUSERINFO:
      return {user:'',token:'',isLogin:false}
    default:
      return preState
  }
}