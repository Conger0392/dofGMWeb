import React,{Component} from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {createDeleteUserInfoAction} from '../../redux/actions/login_action'
import {connect} from 'react-redux'
import {Layout} from 'antd'

import Header from './header/header'
import Home from '../../components/home/home'
import CDK from '../cdk/cdk'
import Product from '../product/product'
import AddUpdate from '../product/add_update'
import User from '../user/user'
import Role from '../role/role'
import ReEmail from '../reEmail/reEmail'
import Manage from '../manage/manage'
import LeftNav from './left_nav/left_nav'
import './css/admin.less'
const {Sider,Content,Footer} = Layout 

@connect(
  state => ({userInfo:state.userInfo}),
  {
    deleteUser:createDeleteUserInfoAction,
    
  }
)
 class Admin extends Component{



  
  render(){
    let {isLogin} = this.props.userInfo

    if (!isLogin) {
    
      return <Redirect to='/login'/>
    }else{
      return (
        <Layout className="admin">
        <Sider className='sider'>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header className="header">Header</Header>
          <Content className="content">
            <Switch>
              <Route path="/admin/home" component={Home}/>
              <Route path="/admin/prod_about/cdk" component={CDK}/>
              <Route path="/admin/prod_about/product" component={Product} exact/>
              <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
              <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}/>
              <Route path="/admin/user" component={User}/>
              <Route path="/admin/role" component={Role}/>
              <Route path="/admin/online/reEmail" component={ReEmail}/>
              <Route path="/admin/online/manage" component={Manage}/>
              <Redirect to="/admin/home"/>
            </Switch>
          </Content>
          <Footer className="footer">
            推荐使用谷歌浏览器，获取最佳用户体验
          </Footer>
        </Layout>
      </Layout>
      )
   
    }
   
  }
}

export default Admin
