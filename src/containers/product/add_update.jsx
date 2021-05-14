import React, { Component } from 'react'
import { Card, Button, Icon, Form, Input, message } from 'antd'
import { connect } from 'react-redux'
import { reqAddProduct, reqUpdateProduct } from '../../api/index'
const { Item } = Form

@connect(
  state => ({
    productList: state.productList
  }),
  {}
)
@Form.create()
class AddUpdate extends Component {
  state = {
    operaType: 'add',
    ItemName: '',
    ItemCode: '',
    Id: ''
  }
  componentDidMount() {
    const { productList } = this.props
    const { id } = this.props.match.params
    if (id) {

      this.setState({ operaType: 'update', Id: id })

      if (productList.length) {
        let result = productList.find((item) => {

          return item.Id === (id * 1)
        })
        if (result) {
          let { ItemName, ItemCode } = result
          this.setState({ ItemName, ItemCode })
        }
      }
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const { operaType, Id } = this.state
    this.props.form.validateFields(async (err, values) => {
      if (err) return
      let result
      if ('add' === operaType) {
        result = await reqAddProduct(values)
      } else {
        result = await reqUpdateProduct({ ...values, Id })
      }
      const { status, msg } = result
      if (0 === status) {
        message.success(msg, 1)
        this.props.history.replace('/admin/prod_about/product')
      } else {
        message.error(msg, 1)
      }

    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { operaType } = this.state


    return (
      <Card
        title={
          <div>
            <Button type="link" onClick={this.props.history.goBack}>
              <Icon type="arrow-left" />
              <span>返回</span>
            </Button>
            <span>{operaType === 'add' ? '道具添加' : '道具修改'}</span>
          </div>}
      >
        <Form
          onSubmit={this.handleSubmit}
          labelCol={{ md: 2 }}
          wrapperCol={{ md: 3 }}

        >
          <Item label="道具名称">
            {
              getFieldDecorator('ItemName', {
                initialValue: this.state.ItemName || '',
                rules: [{ required: true, message: '请输入道具名称' }],
              })(
                <Input
                  placeholder="道具名称"
                />
              )
            }
          </Item>
          <Item label="道具代码">
            {getFieldDecorator('ItemCode', {
              initialValue: this.state.ItemCode || '',
              rules: [
                { required: true, message: '请输入道具代码' },
              ],
            })(
              <Input
                placeholder="道具代码"
              />
            )}
          </Item>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form>
      </Card>
    )
  }
}
export default AddUpdate
