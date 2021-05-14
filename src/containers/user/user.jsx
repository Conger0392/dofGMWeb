import React, { Component } from 'react'
import {
  Card, Button, Icon, Table, message, Cascader, Menu, Dropdown,
  Modal, Form, Input, Select, Popconfirm, Row, Col, notification
} from 'antd';
import dayjs from 'dayjs'
import {
  reqUserList, reqAddUser, reqDeleteUser, reqUserUpdate, reqAccountTool, reqgRoleTools,
  reqGroleList, reqGrow, reqUpdatePvP
} from '../../api'
import { PAGE_SIZE } from '../../config'
import jobs from '../../config/job'
import grows from '../../config/grow'

import './user.less'

const { Item } = Form
const { Option } = Select


@Form.create()
class User extends Component {

  state = {
    //是否展示新增弹窗
    addUpdateVisible: false,
    //是否提示转职确认框
    growVisible: false,
    pkVisible: false,
    //添加修改用户类型
    operType: 'add',
    //分页板类型
    tagsType: 'recharge',

    //用户列表
    userList: [],
    userLoading: true,
    //用户角色列表
    gRoleList: [],
    total: '',
    current: '',
    //展开的行
    expandedRowKeys: [],

    //要转职的名称
    growText: '',
    //要专职的角色对应值
    growValue: [],


    //角色列表
    roleList: [],
    //模态框当前值
    modalCurrentName: '',
    modalCurrentQq: '',
    modalCurrentRoleId: '',

    //模态框当前ID
    modalCurrentId: '',
    //当前展示角色的mid
    receive_charac_no: '',
    //当前选择角色的名字
    gRoleName: '',
    //最新的UID
    lastUID: '',


  }



  componentDidMount() {
    this.getUserList()
  }
  //获取用户列表
  getUserList = async () => {
    let result = await reqUserList()
    const { status, data, msg } = result
    if (0 === status) {
      this.setState({ userList: data.users.reverse() })
      this.setState({ roleList: data.roles, userLoading: false })
    } else {
      message.error(msg, 1)
    }
  }
  //获取用户角色列表
  getGroleList = async (pn, UID) => {


    let result = await reqGroleList(pn, UID)
    const { status, data, msg } = result
    if (0 === status) {
      this.setState({
        gRoleList: data.list.reverse(),
        total: data.total,
        current: data.pageNum,
        lastUID: UID
      })
    } else {
      message.error(msg, 1)
    }


  }

  //创建修改用户弹窗----确定按钮回调
  handleOk = () => {
    let { operType } = this.state
    this.props.form.validateFields(['accountname', 'password', 'qq', 'role_id'], async (err, values) => {

      if (err) {
        message.warning('输入有误,请检查', 1)
        return
      }
      if ('add' === operType) this.toAdd(values)

      if ('update' === operType) {
        //展开从表单中获取的数据添加一个uid属性值为当前选择的uid
        this.toUpdate({ ...values, UID: this.state.modalCurrentId })
      }

    })
  }

  //添加修改用户----取消按钮回调
  handleCancel = () => {
    this.setState({
      addUpdateVisible: false,
    })
    this.props.form.resetFields()
  }

  //添加用户操作
  toAdd = async (values) => {
    let result = await reqAddUser(values)
    const { status, data, msg } = result
    if (0 === status) {
      let userList = this.state.userList
      //把拿到的数据逆向放入列表中
      userList.unshift(data)
      this.setState({ userList, addUpdateVisible: false })
      this.getUserList()
      message.success(msg, 1)

    } else {
      message.error(msg, 1)
    }
  }
  //修改用户操作
  toUpdate = async (userObj) => {
    let result = await reqUserUpdate(userObj)

    const { status, msg } = result
    if (0 === status) {
      this.getUserList()
      this.props.form.resetFields()
      this.setState({ addUpdateVisible: false, });
      message.success(msg, 1)
      this.props.form.resetFields()
    }
    if (1 === status) {

      message.error(msg, 1)

    }
  }



  //打开添加弹窗
  showAdd = () => {
    this.props.form.resetFields()
    this.setState({
      addUpdateVisible: true,
      operType: 'add',
      modalCurrentValue: '',
      modalCurrentId: ''
    });
  };

  //回显修改用户
  showUpdate = (item) => {
    const { UID, accountname, qq, role_id } = item

    this.setState({
      addUpdateVisible: true,
      operType: 'update',
      modalCurrentName: accountname,
      modalCurrentQq: qq,
      modalCurrentRoleId: role_id,
      modalCurrentId: UID
    });
  };

  //删除用户
  deleteUser = async (uid) => {

    let result = await reqDeleteUser(uid)
    const { status, msg } = result
    if (0 === status) {
      message.success(msg, 1)
      this.getUserList()
    } else {
      message.error(msg, 1)
    }
  }



  //选择角色供充值/邮件显示使用
  choosegRole = (item) => {

    this.setState({
      receive_charac_no: item.charac_no,
      gRoleName: item.charac_name
    });
    notification.open({
      message: '已选择角色',
      description:
        '可以在右侧进行充值和发送邮件操作了',
    });
  }



  //角色职业名称
  roleJob = (job, grow_type) => {

    let result = jobs.find((item) => {
      return item.jobType === job + ''
    })

    return result.subs[grow_type]
  }

  //点击展开触发的事件
  onExpandRoles = (expanded, record) => {

    if (expanded) {
      // 初始化用户下角色列表
      this.setState({ getGroleList: [] })
      // 初始化关闭所有展开窗 把其他展开的关掉
      this.setState({ expandedRowKeys: [] })
      // 设置展开参数 发送最新展开的用户id 请求数据
      this.getGroleList(1, record.UID)
      //将展开用户的UID存入state

      // 设置展开窗Key
      this.onExpandedRowsChange(record)
    } else {
      this.setState({ expandedRowKeys: [] })
    }

  }
  onExpandedRowsChange = (expandedRows) => {
    //这俩加方括号什么意思呢？
    this.setState({ expandedRowKeys: [expandedRows.UID] })
  }

  //子表格切换分页时默认参数是pagenum和pagesize，暂时没找到如何多加一个参数
  childTablePagi = (pn = 1) => {
    this.getGroleList(pn, this.state.lastUID)
  }

  //转职联动菜单选中后
  growChange = (value, selectedOptions) => {

    const { gRoleName } = this.state
    if (gRoleName) {
      //如果选择了角色
      this.setState({
        growText: selectedOptions.map(o => o.label).join(', '),
        growValue: value,
        growVisible: true
      });
    } else {
      message.warn('请先选择角色！！');
    }




  }

  //转职模态框确定按钮
  growOK = async () => {

    //从state拿到要转职的角色no和要转职的属性
    const { growValue, receive_charac_no } = this.state

    //发送转职请求
    let result = await reqGrow(receive_charac_no, growValue[0], growValue[1])
    const { status, msg } = result
    if (0 === status) {
      message.success(msg, 1)
    } else {
      message.error(msg, 1)
    }
    this.setState({ growVisible: false })
  }

  //转职模态框确定按钮
  growCancel = () => {

    this.setState({ growVisible: false })
  }
  showPK = () => {

    this.props.form.resetFields()
    if ('' === this.state.gRoleName) {
      message.warning('请先选择角色')
      return
    }
    this.setState({ pkVisible: true })
  }

  //确定修改
  pkOK = () => {

    this.props.form.validateFields(['win', 'pvp_point', 'pvp_grade'], async (err, values) => {

      if (err) {
        message.warning('输入有误,请检查', 1)
        return
      }
      //发送请求
      let result = await reqUpdatePvP({ ...values, charac_no: this.state.receive_charac_no })

      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }
    })
    this.setState({ pkVisible: false })
  }

  pkCancel = () => {

    this.setState({ pkVisible: false })
  }
  //账号工具 
  accountTool = async (UID, type) => {
    let result
    switch (type) {
      case 'removeReg':
        result = await reqAccountTool(UID, 'removeReg')
        break;
      case 'dungeonAll':
        result = await reqAccountTool(UID, 'dungeonAll')
        break;
      case 'ban':
        result = await reqAccountTool(UID, 'ban')
        break;
      case 'unban':
        result = await reqAccountTool(UID, 'unban')
        break;
      default:
        result = null
    }
    if (result) {
      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }
    } else {
      message.error('操作有误，请联系管理', 1)
    }
  }
  //账号工具 
  gRoleTools = async (type) => {
    const mid = this.state.receive_charac_no
    let result
    switch (type) {
      case 'openLR':
        result = await reqgRoleTools(mid, 'openLR')
        break;
      case 'Secondary':
        result = await reqgRoleTools(mid, 'Secondary')
        break;
      case 'nolimitLevEq':
        result = await reqgRoleTools(mid, 'nolimitLevEq')
        break;
      case 'clearPets':
        result = await reqgRoleTools(mid, 'clearPets')
        break;
      case 'clearFashion':
        result = await reqgRoleTools(mid, 'clearFashion')
        break;
      case 'clearBags':
        result = await reqgRoleTools(mid, 'clearBags')
        break;
      default:
        result = null
    }
    if (result) {
      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
      } else {
        message.error(msg, 1)
      }
    } else {
      message.error('操作有误，请联系管理', 1)
    }
  }

  render() {
    //角色工具
    const toolsMenu = (
      <Menu>
        <Menu.Item key="0">
          <Button type='link' onClick={() => { this.gRoleTools('openLR') }}>开启左右槽</Button>
        </Menu.Item>
        <Menu.Item key="1">
          <Button type='link' onClick={() => { this.gRoleTools('Secondary') }}>副职业满级</Button>
        </Menu.Item>
        <Menu.Item key="2">
          <Button type='link' onClick={() => { this.gRoleTools('nolimitLevEq') }}>不限装备等级</Button>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
          <Button type='link' onClick={() => { this.gRoleTools('clearPets') }}>清空角色宠物</Button>
        </Menu.Item>
        <Menu.Item key="4">
          <Button type='link' onClick={() => { this.gRoleTools('clearFashion') }}>清空角色时装</Button>
        </Menu.Item>
        <Menu.Item key="5">
          <Button type='link' onClick={() => { this.gRoleTools('clearBags') }}>清空角色背包</Button>
        </Menu.Item>
      </Menu>
    );

    const expandedRowRender = () => {

      const columns = [
        //角色名
        {
          title: '角色名',
          dataIndex: 'charac_name',
          key: 'charac_name'
        },
        //职业
        {
          title: '职业',
          // dataIndex: 'job',
          key: 'job',
          render: (item) => (this.roleJob(item.job, item.grow_type))
        },
        {
          title: '副职业',
          dataIndex: 'expert_job',
          key: 'expert_job',
          //render: (item) => (this.roleJob(item.job, item.grow_type))
        },
        //等级
        {
          title: '等级',
          dataIndex: 'lev',
          key: 'lev'
        },
        //操作
        {
          title: '操作',
          // dataIndex: 'operation',
          key: 'operation',
          render: (item) => (
            <div>
              <Button
                type='link'
                onClick={() => (this.choosegRole(item))}>
                选择玩家
              </Button>

              <Cascader
                options={grows}
                onChange={this.growChange}>
                <Button type='link'>转职</Button>
              </Cascader>

              <Button
                type='link'
                onClick={() => (this.showPK(item))}>
                PK修改
              </Button>

              <Dropdown
                overlay={toolsMenu}
                trigger={['click']}
              >
                <Button
                  type='link'
                  onClick={e => e.preventDefault()}>
                  角色工具<Icon type="down" />
                </Button>
              </Dropdown>,


            </div>
          )
        },
      ];


      return <Table
        columns={columns}
        dataSource={this.state.gRoleList}
        pagination={
          {
            total: this.state.total,
            pageSize: PAGE_SIZE,
            current: this.state.current,
            hideOnSinglePage: true,
            onChange: this.childTablePagi,
          }
        }
        rowKey='charac_no'
      />;
    };



    const dataSource = this.state.userList

    const columns = [
      //用户名
      {
        title: '用户名',
        dataIndex: 'accountname',
        key: 'accountname',
      },
      //qq
      {
        title: 'qq',
        dataIndex: 'qq',
        key: 'qq',
      },
      //注册时间
      {
        title: '注册时间',
        dataIndex: 'reg_date',
        key: 'reg_date',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      //用户权限
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id) => {
          let result = this.state.roleList.find((item) => {
            return item.rid === id
          })
          if (result) return result.name
        }
      },
      //操作
      {
        title: '操作',
        key: 'option',
        width: '30%',
        render: (item) => (
          <div>
            <Button
              type='link'
              onClick={() => { this.showUpdate(item) }}
            >修改
            </Button>
            <Popconfirm

              title={'确定要封禁【' + item.accountname + '】吗'}
              onConfirm={() => { this.accountTool(item.UID, 'ban') }}
              onCancel={() => { this.accountTool(item.UID, 'unban') }}
              okText="封禁"
              cancelText="解封"
            >
              <Button type='link'>封号/解封
              </Button>
            </Popconfirm>
            <Button type='link' onClick={() => { this.accountTool(item.UID, 'removeReg') }}>解除注册限制</Button>
            <Button type='link' onClick={() => { this.accountTool(item.UID, 'dungeonAll') }}>副本等级全开</Button>
            <Popconfirm
              title={'确定要删除玩家【' + item.accountname + '】吗'}
              onConfirm={() => { this.deleteUser(item.UID) }}
              okText="是"
              cancelText="否"
            >
              <Button type='link'>删除</Button>
            </Popconfirm>

          </div>
        )
      }
    ];
    const { getFieldDecorator } = this.props.form

    return (
      <div className='userIndex'>
        <Card
          title={
            <div>
              <Row className='title'>
                <Col span={5}>
                  <Button type='primary' onClick={this.showAdd}>
                    <Icon type="plus" />创建用户
              </Button>
                </Col>
                <Col span={8}>
                  <h1>当前选择角色是:【{this.state.gRoleName}】</h1>
                </Col>
              </Row>

            </div>
          }

        >
          <Table
            className='userInfo'
            dataSource={dataSource}
            columns={columns}
            expandedRowRender={expandedRowRender}
            onExpand={this.onExpandRoles}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpandedRowsChange={this.onExpandedRowsChange}
            bordered
            loading={this.state.userLoading}
            pagination={{ defaultPageSize: PAGE_SIZE }}
            rowKey="UID"
          />
        </Card>

        {/* 转职提示框 */}
        <Modal
          className='growModal'
          title={
            '确定要把【' + this.state.gRoleName + '】转职成【' + this.state.growText + '】吗？'
          }
          visible={this.state.growVisible}
          onOk={this.growOK}
          onCancel={this.growCancel}
          okText="确定"
          cancelText="再想想"
        >
          <h2>转职前请确保全身装备为空，技能都不在技能栏</h2>
          <h2>转职前请确保全身装备为空，技能都不在技能栏</h2>
          <h2>转职前请确保全身装备为空，技能都不在技能栏</h2>
        </Modal>
        {/* 修改pk提示框 */}
        <Modal
          //不单独改了样式和转职一样吧
          className='growModal'
          title={
            '确定要修改【' + this.state.gRoleName + '】的PK信息吗'
          }
          visible={this.state.pkVisible}
          onOk={this.pkOK}
          onCancel={this.pkCancel}
          okText="确定"
          cancelText="再想想"
        >
          <h2>修改时请确保角色不要在线</h2>
          <h2>修改时请确保角色不要在线</h2>
          <h2>修改时请确保角色不要在线</h2>
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>

            <Item label="胜场">
              {getFieldDecorator('win', {
                initialValue: '',
                rules: [
                  { required: true, message: '胜场必须输入' },
                  { min: 1, message: '胜场最少1位' },
                  { max: 6, message: '改太多了' },
                ],
              })(<Input type='number' placeholder="胜场" />)}
            </Item>
            <Item label="胜点">
              {getFieldDecorator('pvp_point', {
                initialValue: '',
                rules: [
                  { required: true, message: '胜点必须输入' },
                  { min: 1, message: '胜点最少1位' },
                  { max: 6, message: '改太多了' },
                ],
              })(<Input type='number' placeholder="胜点" />)}
            </Item>
            <Item label="段位">
              {getFieldDecorator('pvp_grade', {
                initialValue: '',
                rules: [{ required: true, message: '必须选择一个等级' },],
              })(
                <Select>
                  <Option value=''>请选择一个角色</Option>
                  <Option value='34'>斗神</Option>
                  <Option value='33'>霸王</Option>
                  <Option value='32'>小霸王</Option>
                  <Option value='31'>名人</Option>
                  <Option value='30'>达人</Option>
                  <Option value='29'>尊10</Option>
                  <Option value='20'>尊1</Option>
                  <Option value='19'>10段</Option>
                  <Option value='10'>1段</Option>
                  <Option value='9'>1级</Option>
                </Select>
              )}
            </Item>
          </Form>
        </Modal>
        {/* 新增角色提示框 */}
        <Modal
          title={this.state.operType === 'add' ? '创建用户' : '修改用户'}
          visible={this.state.addUpdateVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            <Item label="用户名">
              {getFieldDecorator('accountname', {
                initialValue: this.state.modalCurrentName,
                rules: [
                  { required: true, message: '用户名必须输入' },
                  { min: 4, message: '用户名最小为4位' },
                  { max: 12, message: '用户名最大为12位' },
                  { pattern: /^\w+$/, message: '用户名只能为字母数字下划线组合' },
                ],
              })(<Input placeholder="请输入用户名" />)}
            </Item>
            <Item label="密码">
              {getFieldDecorator('password', {
                initialValue: '',
                rules: [
                  { required: true, message: '密码必须输入' },
                  { min: 4, message: '用户名最小为4位' },
                  { max: 12, message: '用户名最大为12位' },
                  { pattern: /^\w+$/, message: '用户名只能为字母数字下划线组合' },
                ],
              })(<Input placeholder="请输入密码" />)}
            </Item>

            <Item label="qq">
              {getFieldDecorator('qq', {
                initialValue: this.state.modalCurrentQq,
                rules: [
                  { required: true, message: 'qq必须输入' },
                  { min: 5, message: '用户名最小为5位' },
                  { max: 11, message: '用户名最大为11位' },

                ],
              })(<Input type='number' placeholder="请输入qq" />)}
            </Item>
            <Item label="角色">
              {getFieldDecorator('role_id', {
                initialValue: this.state.modalCurrentRoleId,
                rules: [{ required: true, message: '必须选择一个角色' },],
              })(
                <Select>
                  <Option value=''>请选择一个角色</Option>
                  {
                    this.state.roleList.map((item) => {
                      return <Option key={item.rid} value={item.rid}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default User