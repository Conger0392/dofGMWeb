import {SAVEUTITLE} from '../action_type.js'

export const createSaveTitleAction = (value) => {
 return  {type:SAVEUTITLE,data:value}
}