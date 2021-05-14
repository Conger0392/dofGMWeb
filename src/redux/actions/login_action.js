import {SAVEUSERINFO,DELETEUSERINFO} from '../action_type.js'

export const createSaveUserInfoAction = (value) => {
  localStorage.setItem('user',JSON.stringify(value.user))
  localStorage.setItem('token',value.token)
 return  {type:SAVEUSERINFO,data:value}
}

export const createDeleteUserInfoAction = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
 return  {type:DELETEUSERINFO}
}

