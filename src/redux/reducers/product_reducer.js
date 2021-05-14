import {SAVEPRODLIST} from '../action_type.js'



//初始化userInfo数据
let initState = []

export default function test(preState = initState, action) {

  let {
    type,
    data
  } = action
  let newState
  switch (type) {
    case SAVEPRODLIST:
      newState = [...data]
      return newState
    default:
      return preState
  }
}