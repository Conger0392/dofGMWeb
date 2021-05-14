import React, { Component } from 'react'
import { Select, Spin, message } from 'antd';

import debounce from 'lodash/debounce';
import { reqSearchProduct } from '../../api';

const { Option } = Select;

/*
数据多的用这个，请求服务器返回的数据就少一点，不然全返回会卡死
 */
export default class Emp extends Component {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    empData: [],
    value: '',
    fetching: false,
  };

  fetchUser = async (value) => {
    // console.log('fetching user', value);

    if ('' !== value) {
      this.lastFetchId += 1;
      const fetchId = this.lastFetchId;
      this.setState({ data: [], fetching: true });
      let result = await reqSearchProduct(null, null, 'itemName', value, 'email')

      const { status, data, msg } = result

      if (0 === status) {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }

        let empData = data.list.map(item => ({
          text: item.ItemName,
          value: item.ItemCode,
        }));
        // 只存前100条

        this.setState({ empData: empData.slice(0, 100), fetching: false });
      } else {
        message.error(msg, 1)
      }
    }



  };
  handleOnBlur = () => {
    this.setState({ empData: this.state.empData.slice(0, 100) })
  }


  handleChange = value => {
    if ('' !== value) {
      this.setState({
        value,
        data: [],
        fetching: false,
      });
      this.props.onChange(value)
    }
  };

  render() {
    const { fetching, empData } = this.state;
    return (
      <Select
        showSearch
        allowClear
        placeholder={this.props.placeholder}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        onBlur={this.handleOnBlur}
        style={{ width: '100%' }}
      >
        {empData.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    );
  }
}
