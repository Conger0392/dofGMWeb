import React, { Component } from 'react'
import {
  Table,
  Row, Button, message, Switch,
  Form, Input, Col
} from 'antd';
import dayjs from 'dayjs'
import { reqOnlineRoles, reqSendOnlineEmail, reqBub } from '../../api'

import './manage.less'

const { Item } = Form

@Form.create()
class Line extends Component {

  state = {
    // //在线邮件
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    //在线角色列表
    OnlineRolesList: [],
    //泡点
    bubAmount: 50,
    bubTime: 30,
    bubStatus: false,
  }

  componentDidMount() {
    //组件一挂载就请求一次
    this.getOnlineRoles()
    this.getBubStatus()
  }
  //获取在线角色列表
  getOnlineRoles = async () => {
    let result = await reqOnlineRoles()
    const { status, data, msg } = result
    if (0 === status) {
      this.setState({ OnlineRolesList: data })
    } else {
      message.error(msg, 1)
    }


  }

  //获取泡点状态
  getBubStatus = async () => {

    //只是获取状态
    let result = await reqBub(null, null, null, 'get')

    const { status, data, msg } = result
    // console.log(result);
    if (0 === status) {

      this.setState({
        bubStatus: data.bubStatus,
        bubAmount: data.currentBubAmount,
        bubTime: data.currentBubTime
      })
    } else {
      message.error(msg, 1)
    }
  }

  //泡点开关状态改变事件
  onlineBub = (checked) => {

    this.setState({ bubStatus: checked })
    //setState是异步的直接拿拿不到，在这里给自身添加一个属性
    this.bubStatus = checked

    let accounts = []
    
    if (this.bubStatus) {
      //如果是开启状态 获取所有在线用户的UID
      this.state.OnlineRolesList.map((item) => (

        accounts.push(item.m_id)
      ))

      this.sendBub(accounts)
    } else {
      //如果是关闭就发送关闭请求
      this.closeBub()
    }
  }

  //开启泡点
  sendBub = async (accounts) => {
    
    //发送泡点请求
    let result = await reqBub(this.state.bubAmount, accounts, this.state.bubTime, 'open')

    const { status, msg } = result
    if (0 === status) {
      message.success(msg, 1)
    } else {
      message.error(msg, 1)
    }
  }

  //关闭泡点
  closeBub = async () => {

    //发送关闭请求
    let result = await reqBub(null, null, null, 'close')
    const { status, msg } = result
    if (0 === status) {
      message.success(msg, 1)
    } else {
      message.error(msg, 1)
    }
  }

  //受控组件，泡点数量改变自动维护状态
  bubInputChange = (e) => {
    this.setState({
      bubAmount: e.target.value
    })
  }

  bubTimeChange = (e) => {
    this.setState({
      bubTime: e.target.value
    })
  }

  //发送在线邮件
  sendAll = async () => {
    //拿出所有UID
    let { OnlineRolesList } = this.state
    let mids = []
    OnlineRolesList.forEach((item) => {
      mids.push(item.charac_no)
    })

    this.props.form.validateFields(['onlineItemId', 'onlineAddInfo'], async (err, values) => {
      if (err) {
        message.warning('输入有误,请检查', 1)
        return
      }
      this.setState({ loading: true });
      let result = await reqSendOnlineEmail({ ...values, mids })
      const { status, msg } = result
      if (0 === status) {
        this.setState({
          selectedRowKeys: [],
          loading: false,
        });
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }
    })


    // ajax request after empty completing

  };


  
  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  render() {

    const OnlineColumns = [

      //用户账号
      {
        title: '用户账号',
        dataIndex: 'accountname',
        key: 'accountname',
      },
      //角色名
      {
        title: '角色名',
        dataIndex: 'charac_name',
        key: 'charac_name',

      },
      //登录时间
      {
        title: '登录时间',
        dataIndex: 'last_login_date',
        key: 'last_login_date',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      //登录IP
      {
        title: '登录IP',
        dataIndex: 'login_ip',
        key: 'login_ip',

      },

      //所在频道
      {
        title: '所在频道',
        dataIndex: 'm_channel_no',
        key: 'm_channel_no',
        render: (item) => {
          return 'ch ' + (item - 3000)
        }
      },

      //操作
      {
        title: '操作',
        key: 'option',
        render: (item) => (
          <div>
            <Button
              type='link'
              onClick={() => { this.showUpdate(item) }}
            >功能1
            </Button>
          </div>
        )
      }
    ];

    const { loading, selectedRowKeys } = this.state;
    const sendAllSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Row
          className='sendOnline'
          >
          <Col

            span={12}
          >
            <Form
              onSubmit={this.online}
              layout="inline"
            >
              <Item label="道具代码">
                {
                  getFieldDecorator('onlineItemId', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入物品代码' },
                      { pattern: /[1-9]\d*/, message: '请输入大于零的代码' },
                    ],
                  })(
                    <Input
                      placeholder="代码"
                      type='nubmer'
                    />
                  )
                }
              </Item>
              <Item label="道具数量">
                {
                  getFieldDecorator('onlineAddInfo', {
                    initialValue: 1,
                    rules: [
                      { required: true, message: '请输入数量' },
                      { pattern: /[1-9]\d*/, message: '请输入大于零的数值' },
                    ],
                  })(
                    <Input
                      placeholder="数量"
                      type='nubmer'
                    />
                  )
                }
              </Item>

              <Button
                className='onlineSub'
                type="primary"

                onClick={this.sendAll}
                htmlType="submit"
                disabled={!hasSelected}
                loading={loading}>
                发送在线福利
                        </Button>
            </Form>
            <Button
              type="primary"
              onClick={this.getOnlineRoles}>
              刷新在线列表
                        </Button>
          </Col>
          <Col span={7}>
            <div className='bubbleInfo'>
              <Input
                placeholder="泡点数量"
                type='nubmer'
                value={this.state.bubAmount}
                onChange={this.bubInputChange}
              />
              <Input
                placeholder="泡点间隔"
                type='nubmer'
                value={this.state.bubTime}
                onChange={this.bubTimeChange}
              />
              <Switch
                className='bubSwitch'
                checked={this.state.bubStatus}
                onChange={this.onlineBub}
                checkedChildren="开启泡点"
                unCheckedChildren='关闭泡点'
              />
            </div>
          </Col>
        </Row>


        <Table
          rowSelection={sendAllSelection}
          columns={OnlineColumns}
          dataSource={this.state.OnlineRolesList}
          rowKey='m_id'
        />
      </div>
    )
  }
}
export default Line