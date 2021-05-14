import {combineReducers} from 'redux'

import LoginReducer from './login_reducer.js'
import menuReducer from './menu_reducer.js'
import productReducer from './product_reducer'

export default combineReducers({
  userInfo:LoginReducer,
  title:menuReducer,
  productList:productReducer,
})