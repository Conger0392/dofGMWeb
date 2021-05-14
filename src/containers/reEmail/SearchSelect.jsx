import React, { Component } from 'react'
import { Select } from 'antd';
const { Option } = Select

let currentValue;
/**
 * 数据少的用这个不用每次都请求服务器
 */
export default class SearchSelect extends Component {

  state = {

    data: [],
    value: '',

  }

  //文本框变化时的回调
  userSearch = value => {
    //拿到值去整个列表中匹配一下
    if (value) {
      //有的话进行匹配一下
      this.queryUser(value);
    } else {
      //没有值清空下拉菜单
      this.setState({ data: [] });
    }
  };
  //选中后将值放到状态中
  userChange = value => {
    this.setState({ value });
    this.props.onChange(value)
  };

 
  /**
   * 进行查找的方法
   * @param {*文本框变动传入的值} value 
   * @param {*} callback 
   */
  queryUser = async (value) => {
    const { list } = this.props
    //将传过来的值放到current value里
    currentValue = value;
    //在这里判断当前值是不是传过来的值
    if (currentValue === value) {
      //定义一个新的
      let data = [];
    
      data = list.filter(item => {
        //从拿到的数据中找如果有就返回到data中
        return item.text.indexOf(value) !== -1
      });
      //加工成select能用的格式

      this.setState({ data })
    }

  }
  render() {
    return (
      <div>
        <Select
          showSearch
          allowClear
          autoFocus={true}
          placeholder='用户账号'
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          onSearch={this.userSearch}
          onChange={this.userChange}
          notFoundContent={null}
        >
          {this.state.data.map((item) => (
            <Option key={item.value}>{item.text}</Option>
          ))}
        </Select>
      </div>
    )
  }
}