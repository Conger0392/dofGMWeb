import React, { Component } from 'react'
import { Icon, Button, Modal } from 'antd'
import screenfull from 'screenfull'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import './css/header.less'
import { createDeleteUserInfoAction } from '../../../redux/actions/login_action'
import menuList from '../../../config/menu_config' 



@connect(
  state => ({ 
    userInfo: state.userInfo,
    title :state.title
  }),
  { deleteUser: createDeleteUserInfoAction }
)
@withRouter
class Header extends Component {

  state = {
    isFull: false,
    
    
  }

  componentDidMount() {
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({ isFull })
    })

    this.getTitle()
  }

  componentWillUnmount() {
    clearInterval(this.timeId)
  }

  fullScreen = () => {
    screenfull.toggle()
  }

  logOut = () => {
    let { deleteUser } = this.props
    Modal.confirm({
      title: '提示',
      content: '确定要退出登录吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        deleteUser()
      }
    });

  }
  //获取标题
  getTitle = () => {
    let {pathname} = this.props.location
    
    let pathKey = pathname.split('/').reverse()[0]
    
    if (pathname.indexOf('product') !== -1) {
      pathKey = 'product'
    }
    let title = ''
    menuList.forEach((item) => {

      if (item.children instanceof Array) {
        let tmp = item.children.find((citem) => {
          
          return citem.key === pathKey
        })
        if (tmp) {
          title = tmp.title
        }

      } else {
        if (pathKey === item.key) {
          title = item.title
        }
      }
    })
    this.setState({title})
  }
  render() {
    let { isFull } = this.state
    let { user } = this.props.userInfo

    return (
      <header className="header">
        <div className="header-top">
          <Button size="small" onClick={this.fullScreen}>
            <Icon type={isFull ? 'fullscreen-exit' : 'fullscreen'} />
          </Button>
          <span className="username">欢迎，{user.accountname}</span>
          <Button type="link" onClick={this.logOut}>退出登录</Button>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            {this.props.title || this.state.title}
          </div>
        </div>
      </header>
    )
  }
}

export default Header