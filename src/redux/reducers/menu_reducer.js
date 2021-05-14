
import {SAVEUTITLE} from '../action_type.js'


//初始化userInfo数据
let initState = ''

export default function test(preState=initState,action) {
  
  let {type,data} = action
  switch (type) {
    case SAVEUTITLE:
      return data
    default:
      return preState
  }
}