import myAxios from '../api/myaxios'
import {
  BASE_URL
} from '../config'


export const reqLogin = (username, password) => {
  let URL = `manage/login`
  return myAxios.post(URL, {
    username,
    password
  })
}




//请求删除图片
export const reqDeletePictrue = (name) => {
  let URL = `${BASE_URL}/manage/img/delete`
  return myAxios.post(URL, {
    name
  })
}


// -------------道具api-------------

//请求道具列表
export const reqProductList = (pageNum, pageSize) => {
  let URL = `${BASE_URL}/manage/product/list`
  return myAxios.get(URL, {
    params: {
      pageNum,
      pageSize
    }
  })
}

//请求更新道具状态
export const reqUpdateProductStatus = (productId, status) => {
  let URL = `${BASE_URL}/manage/product/updateStatus`
  return myAxios.post(URL, {
    productId,
    status
  })
}

//搜索道具
export const reqSearchProduct = (pageNum, pageSize, searchType, keyWord, email) => {
  let URL = `${BASE_URL}/manage/product/search`
  return myAxios.get(URL, {
    params: {
      pageNum,
      pageSize,
      [searchType]: keyWord,
      email
    }
  })
}


//通过id获取道具信息
export const reqProdById = (productId) => {
  let URL = `${BASE_URL}/manage/product/info`
  return myAxios.get(URL, {
    params: {
      productId
    }
  })
}

//请求添加道具
export const reqAddProduct = (productObj) => {

  let URL = `${BASE_URL}/manage/product/add`
  return myAxios.post(URL, {
    ...productObj
  })
}

//请求更新道具
export const reqUpdateProduct = (productObj) => {
  let URL = `${BASE_URL}/manage/product/update`
  return myAxios.post(URL, {
    ...productObj
  })
}


//删除道具
export const reqDeleteItem = (Id) => {

  let URL = `${BASE_URL}/manage/product/delete`
  return myAxios.post(URL, {
    Id
  })
}
// -------------道具api-------------


// -------------角色api-------------
//请求角色列表
export const reqRoleList = () => {
  let URL = `${BASE_URL}/manage/role/list`
  return myAxios.get(URL)
}

//请求添加角色
export const reqAddRole = (roleName) => {
  let URL = `${BASE_URL}/manage/role/add`
  return myAxios.post(URL, roleName)
}

//请求给角色授权
export const reqAuthRole = (roleObj) => {
  let URL = `${BASE_URL}/manage/role/update`
  return myAxios.post(URL, {
    ...roleObj,
    auth_time: Date.now()
  })
}
// -------------角色api-------------

// -------------用户api-------------
//请求用户列表同时附带角色列表
export const reqUserList = () => {
  let URL = `${BASE_URL}/manage/user/list`
  return myAxios.get(URL)
}

//请求添加用户
export const reqAddUser = (userObj) => {
  let URL = `${BASE_URL}/manage/user/add`
  return myAxios.post(URL, {
    ...userObj
  })
}
//请求删除用户
export const reqDeleteUser = (uid) => {
  let URL = `${BASE_URL}/manage/user/delete`
  return myAxios.post(URL, {
    uid
  })
}

//更新用户
export const reqUserUpdate = (userObj) => {

  let URL = `${BASE_URL}/manage/user/update`
  return myAxios.post(URL, {
    ...userObj
  })
}
//账号工具
export const reqAccountTool = (UID, type) => {

  let URL = `${BASE_URL}/manage/user/acctool`
  return myAxios.post(URL, {
    UID,
    type
  })
}
//角色工具
export const reqgRoleTools = (mid, type) => {

  let URL = `${BASE_URL}/manage/user/gRoleTool`
  return myAxios.post(URL, {
    mid,
    type
  })
}



// -------------用户api-------------

//请求用户下的游戏角色列表

export const reqGroleList = (pageNum, UID) => {
  let URL = `${BASE_URL}/manage/user/gRoleList`
  return myAxios.get(URL, {
    params: {
      pageNum,
      pageSize: 5,
      UID
    }
  })
}

//请求在线角色
export const reqOnlineRoles = () => {
  let URL = `${BASE_URL}/manage/user/getOnlineRoles`
  return myAxios.get(URL)
}
//请求所有角色
export const reqGameRoleList = () => {
  let URL = `${BASE_URL}/manage/user/allGameRoles`
  return myAxios.get(URL)
}


//转职
export const reqGrow = (charac_no, job, grow_type) => {

  let URL = `${BASE_URL}/manage/user/grow`
  return myAxios.post(URL, {
    charac_no,
    job,
    grow_type
  })
}

//修改pk
export const reqUpdatePvP = (pkObj) => {

  let URL = `${BASE_URL}/manage/user/updatePK`
  return myAxios.post(URL, {
    ...pkObj
  })
}

//-------------充值/邮件api-------------

export const reqRecharge = (creditObj) => {

  let URL = `${BASE_URL}/manage/credit/recharge`
  return myAxios.post(URL, {
    ...creditObj
  })
}

export const reqBub = (amounts, accounts, bubTime, bubOper) => {

  let URL = `${BASE_URL}/manage/credit/bubble`
  return myAxios.post(URL, {
    amounts,
    accounts,
    bubTime,
    bubOper
  })
}


export const reqSendEmail = (postalObj) => {

  let URL = `${BASE_URL}/manage/credit/postal`
  return myAxios.post(URL, {
    ...postalObj
  })
}

export const reqSendOnlineEmail = (postalOnline) => {

  let URL = `${BASE_URL}/manage/credit/postalOnline`
  return myAxios.post(URL, {
    ...postalOnline
  })
}