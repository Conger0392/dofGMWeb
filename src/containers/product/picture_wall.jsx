import { Upload, Icon, Modal, message } from 'antd';
import React,{Component} from 'react'
import {BASE_URL} from '../../config/index'
import { reqDeletePictrue} from '../../api/index'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,//是否展示预览窗
    previewImage: '', //预览图片
    fileList: [],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async({file,fileList }) => {
    
    if ('done' === file.status) {
      fileList[fileList.length-1].url = file.response.data.url
      fileList[fileList.length-1].name = file.response.data.name
    }

    if ('removed' === file.status) {
     let result = await reqDeletePictrue(file.name)
     const {status} = result
     if (0 === status) {
       message.success('删除图片成功',1)
     }else{
       message.error('删除图片失败',1)
     }
    }
    this.setState({ fileList });
  }
  
  getImgsArr = () => {
   let result = []
   this.state.fileList.forEach((item) => {
    result.push(item.name) 
   }) 
   return result
  }

  setFileList = (imgsArr) => {
    let fileList = []
    imgsArr.forEach((item,index) => {
      fileList.push({uid:index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({fileList})
   }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={`${BASE_URL}/manage/img/upload`}
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

