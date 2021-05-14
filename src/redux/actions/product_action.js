import {SAVEPRODLIST} from '../action_type.js'

export const createSaveProductAction = (value) => {
 return  {type:SAVEPRODLIST,data:value}
}