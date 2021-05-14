import React, { Component } from 'react'
import { Menu, Icon } from 'antd';
import { Link,withRouter} from 'react-router-dom';
import { connect} from 'react-redux';
import logo from '../../../static/imgs/logo.png'
import {createSaveTitleAction} from '../../../redux/actions/menu_action'
import menuList from '../../../config/menu_config'

import './left_nav.less'
const { SubMenu, Item } = Menu;
@connect(
  state => ({
    menus:state.userInfo.user.role,
    username:state.userInfo.user.accountname
  }),
  {
    saveTitle:createSaveTitleAction
  }
)
@withRouter
class LeftNav extends Component {


  hasAuth = (item) => {
    //获取当前用户可以看到的菜单
    const {menus,username} = this.props
    
    if ('conger' === username) {
      return true
    }else if(!item.children){
      return menus.find((item2) => {
        return item2 === item.key
      })
    }else if(item.children){
      return item.children.some((item3) => {
        return menus.indexOf(item3.key) !== -1
      })
    }
  }

  //用于创建菜单的函数
  createMenu = (target) => {
    return target.map((item) => {
        if (this.hasAuth(item)) {
          if (!item.children) {
            return (
              <Item key={item.key} onClick={() => {this.props.saveTitle(item.title)}}>
                <Link to={item.path}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </Link>
              </Item>
            )
          } else {
            return (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </span>
                }
              >
                {this.createMenu(item.children)}
              </SubMenu>
            )
          }
        }
    })
  }


  render() {
    return (
      <div>
        <header className='header-nav'>
          <img src={logo} alt="logo" />
          <h1>GMtools</h1>
        </header>
        <Menu
          selectedKeys={this.props.location.pathname.split('/').reverse([0])}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark">

          {
            this.createMenu(menuList)
          }

        </Menu>
      </div>
    )
  }
}
export default LeftNav