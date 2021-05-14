import { Button, Icon, Card, Select, Input, Table, message, Popconfirm } from 'antd'
import React, { Component } from 'react'
import { PAGE_SIZE } from '../../config/index'
import { reqProductList, reqUpdateProductStatus, reqSearchProduct, reqDeleteItem } from '../../api/index'
import { connect } from 'react-redux'
import { createSaveProductAction } from '../../redux/actions/product_action'
import './css/product.less'

const { Option } = Select

@connect(
  state => ({}),
  { saveProduct: createSaveProductAction }
)
class Product extends Component {

  state = {
    ProductList: [],
    total: '',
    current: 1,
    keyWord: '',
    searchType: 'itemName',
    itemLoading: true
  }

  componentDidMount() {
    this.getProductList()

  }
  //默认值第一页 如果传了参数就用pn
  getProductList = async (pn = 1) => {
    const { searchType, keyWord } = this.state
    let result

    if (this.isSearch) {
      result = await reqSearchProduct(pn, PAGE_SIZE, searchType, keyWord)
    } else {
      result = await reqProductList(pn, PAGE_SIZE)
    }
    const { status, data } = result
    // console.log(data);
    if (0 === status) {
      this.setState({
        ProductList: data.list,
        total: data.total,
        current: data.pageNum * 1,
        itemLoading: false
      })
      //把获取到的商品信息放到redux中
      this.props.saveProduct(data.list)
    } else {
      message.error("获取商品列表失败", 1)
    }

  }


  updateProdStatus = async ({ _id, status }) => {
    // console.log(_id,status);
    let productList = [...this.state.ProductList]
    if (1 === status) {
      status = 2
    } else {
      status = 1
    }
    let result = await reqUpdateProductStatus(_id, status)

    if (0 === result.status) {
      productList = productList.map((item) => {
        if (_id === item._id) {
          item.status = status
        }
        return item
      })
      this.setState({ productList })
      message.success('商品状态更新成功', 1)
    } else {
      message.error('商品状态更新失败', 1)
    }
  }
  deleteItem = async (Id) => {
    let result = await reqDeleteItem(Id)
    const { status, msg } = result
    if (0 === status) {
      message.success(msg, 1)
      this.getProductList()
    } else {
      message.error(msg, 1)
    }
  }

  search = async () => {
    this.isSearch = true
    this.getProductList()

  }
  render() {


    const columns = [
      //名称
      {
        title: '道具名称',
        dataIndex: 'ItemName',
        key: 'ItemName',
        width: '50%',
      },
      //描述
      {
        title: '道具代码',
        dataIndex: 'ItemCode',
        key: 'ItemCode',
      },
      //操作
      {
        title: '操作',
        // dataIndex: 'opera',
        key: 'opera',
        align: 'center',
        width: '20%',
        render: (item) => {
          return (
            <div>
              <Button type='link' onClick={() => { this.props.history.push(`/admin/prod_about/product/add_update/${item.Id}`) }}>修改</Button><br />
              <Popconfirm
                title={'确定要删除道具【' + item.ItemName + '】吗'}
                onConfirm={() => { this.deleteItem(item.Id) }}
                okText="是"
                cancelText="否"
              >
                <Button type='link'>删除</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Card title={
          <div >
            <Select
              defaultValue='itemName'
              onChange={(value) => { this.setState({ searchType: value }) }}
            >
              <Option value='itemName'>按名称搜索</Option>
              <Option value='itemCode'>按代码搜索</Option>
            </Select>
            <Input
              style={{ width: '20%', margin: '0 10px' }}
              placeholder='请输入关键词'
              allowClear
              onChange={(event) => { this.setState({ keyWord: event.target.value }) }} />
            <Button type='primary' onClick={this.search}><Icon type='search' />搜索</Button>
          </div>
        }
          extra={
            <Button type='primary' onClick={() => { this.props.history.push('/admin/prod_about/product/add_update') }}><Icon type='plus' />添加商品</Button>
          }>
          <Table
            className='proTable'
            dataSource={this.state.ProductList}
            columns={columns}
            bordered
            pagination={{
              total: this.state.total,
              pageSize: PAGE_SIZE,
              current: this.state.current,
              onChange: this.getProductList,
            }}
            loading={this.state.itemLoading}
            rowKey='Id'
            size='small'
          />;
        </Card>
      </div>
    )
  }
}
export default Product