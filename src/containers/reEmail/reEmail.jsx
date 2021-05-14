import React, { Component } from 'react'
import {
  Button, Tabs, message, Switch,
  Form, Input, Select, Col
} from 'antd';
import { connect } from 'react-redux'
import SearchSelect from './SearchSelect'
import Emp from './emp'
import { reqRecharge, reqSendEmail, reqUserList, reqGameRoleList } from '../../api'

const { Item } = Form
const { Option } = Select
const { TabPane } = Tabs;



@connect(
  state => ({
    productList: state.productList,
  })

)
@Form.create()
class Bar extends Component {



  state = {

    //所有用户列表
    userList: [],
    gameRoleList: [],
    //分页板类型
    tagsType: 'recharge',

    //当前展示角色的mid
    receive_charac_no: '',
    //当前选择角色的名字
    gRoleName: '',
    //最新的UID
    lastUID: '',

    userValue: ''

  }

  componentDidMount() {
    const { userList, gameRoleList } = this.state
    //没有就请求一下
    if (0 === userList.length) {
      this.getUserList()
    }
    if (0 === gameRoleList.length) {
      this.getGameRoleList()
    }

  }
 
  //获取所有用户列表
  getUserList = async () => {
    let result = await reqUserList()
    const { status, data, msg } = result
    if (0 === status) {
      let userList = []
      // 直接加工成select能用的格式
      data.users.forEach(item => {
        userList.push({
          text: item.accountname,
          value: item.UID
        })
      });

      this.setState({ userList })
    } else {
      message.error(msg, 1)
    }
  }

  //获取所有角色列表
  getGameRoleList = async () => {
    let result = await reqGameRoleList()
    const { status, data, msg } = result
    // console.log(data.users);
    if (0 === status) {
      let list = []
      // 直接加工成select能用的格式
      data.forEach((item) => {
        list.push({
          text: item.charac_name,
          value: item.charac_no
        })
      })
      this.setState({ gameRoleList: list })
    } else {
      message.error(msg, 1)
    }

  }

  //切换页面事件
  tagsChange = (key) => {
    // console.log(key);
  }

  //是否封装
  sealFalg = (checked) => {
    this.setState({ sealFlag: checked })
  }


  //验证强化等级设置
  upgradeLev = (rule, value, callback) => {

    if (value < 0 || value > 31) {
      callback("设置等级有误")
    } else {
      callback()
    }
  }
  //充值提交事件
  recharge = (event) => {
    event.preventDefault()
    this.props.form.validateFields(['UID', 'reType', 'amounts'], async (err, values) => {
      // console.log(values);
      if (err) return
      let result
      const { reType } = values
      //做个简单判断 大于option中value的某个值就充值的角色的 小于就是给账号充值的
      if (reType <= 2) {
        result = await reqRecharge(values)
      } else {
        result = await reqRecharge({ ...values, mid: this.state.receive_charac_no })
      }


      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }
    })
  }

  //邮件提交事件
  sendEmail = (event) => {
    event.preventDefault()
    //验证项
    let verifyList = ['item_id', 'amplify_option', 'amplify_value', 'upgrade',
      'seperate_upgrade', 'gold', 'sealFlag', 'addInfo', 'mid'
    ]
    this.props.form.validateFields(verifyList, async (err, values) => {
      // console.log(values);
      if (err) return

      const result = await reqSendEmail(values)
      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }

    })
  }

  render() {


    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Tabs
          defaultActiveKey="1"
          onChange={this.tagsChange}
          type='line'
          tabPosition='left'
        >
          <TabPane tab="充值页面" key="1"
          >
            <Form
              className='recharge'
              onSubmit={this.recharge}
              labelCol={{ md: 3 }}
              wrapperCol={{ md: 3 }}
            >
              <Item label="充值账号">
                {
                  getFieldDecorator('UID', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入用户账号' }],
                  })(
                    <SearchSelect list={this.state.userList} />
                  )
                }
              </Item>

              <Item label="充值类型">
                {getFieldDecorator('reType', {
                  initialValue: '0',
                  rules: [{ required: true, message: '必须选择一个类型' },],
                })(
                  <Select>
                    <Option value='0'>D币</Option>
                    <Option value='1'>D点</Option>
                    <Option value='2'>时装点</Option>
                    <Option value='3'>金币</Option>
                    <Option value='4'>SP点</Option>
                    <Option value='5'>TP点</Option>
                    <Option value='6'>QP点</Option>
                  </Select>
                )}
              </Item>

              <Item label="充值金额">
                {getFieldDecorator('amounts', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入金额' },
                    { max: 6, message: '请适当充值！！' },
                    { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的数值' },
                  ]
                })(
                  <Input
                    placeholder="金额"
                    type='number'
                  />
                )}
              </Item>
              <Col span={7} style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                >充值</Button>
              </Col>

            </Form>

          </TabPane>
          <TabPane tab="发送邮件" key="2">
            <Form
              className='recharge'
              onSubmit={this.sendEmail}
              labelCol={{ md: 3 }}
              wrapperCol={{ md: 6 }}
            >
              <Item label="邮件角色">
                {
                  getFieldDecorator('mid', {
                    initialValue: '',
                    rules: [{ required: true, message: '请输入角色名称' }],
                  })(
                    <SearchSelect list={this.state.gameRoleList} />
                  )
                }
              </Item>
              <Item label="物品名称">
                {
                  getFieldDecorator('item_id', {
                    initialValue: '',
                    rules: [
                      { required: true, message: '请输入物品名称' },
                    ],
                  })(
                    <Emp placeholder="道具代码" />
                  )
                }
              </Item>
              <Item label="红字属性">
                {getFieldDecorator('amplify_option', {
                  initialValue: '0',

                })(
                  <Select>
                    <Option value='1'>体力</Option>
                    <Option value='2'>精神</Option>
                    <Option value='3'>力量</Option>
                    <Option value='4'>智力</Option>
                  </Select>
                )}
              </Item>
              <Item label="红字数值">
                {getFieldDecorator('amplify_value', {
                  initialValue: '',
                  rules: [
                    { max: 3, message: '适当就行别太变态' },
                    { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的数值' },
                  ]
                })(
                  <Input
                    placeholder="数值"
                    type='number'
                  />
                )}
              </Item>
              <Item label='强化等级'>
                {getFieldDecorator('upgrade', {
                  initialValue: '',
                  rules: [{ validator: this.upgradeLev }]
                })(
                  <Input
                    placeholder="等级"
                    type='number'
                  />
                )}
              </Item>
              <Item label='锻造等级'>
                {getFieldDecorator('seperate_upgrade', {
                  initialValue: '0',
                  rules: [{ validator: this.upgradeLev }]
                })(
                  <Input
                    placeholder="等级"
                    type='number'
                  />
                )}

              </Item>
              <Item label="金币数量">
                {getFieldDecorator('gold', {
                  initialValue: '',
                  rules: [
                    { max: 8, message: '别发太多了！' },
                    { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的数值' },
                  ]
                })(
                  <Input
                    placeholder="数量"
                    type='number'
                  />
                )}
              </Item>
              <Item label="是否封装">
                {getFieldDecorator('sealFlag', {
                  initialValue: false,
                })(
                  <Switch
                    checked={this.state.sealFlag}
                    onChange={this.sealFalg}
                  />
                )}

              </Item>
              <Item label="物品数量">
                {getFieldDecorator('addInfo', {
                  initialValue: '',
                  rules: [
                    { required: true, message: '请输入数量' },
                    { max: 4, message: '别发太多了！' },
                    { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的数值' },
                  ]
                })(
                  <Input
                    placeholder="数量"
                    type='number'
                  />
                )}
              </Item>
              <Col span={7} style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                >发送</Button>
              </Col>
            </Form>
          </TabPane>


        </Tabs>

      </div>
    )
  }
}
export default Bar