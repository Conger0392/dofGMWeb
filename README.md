# DOF_GM
DOF_GM网页管理系统 前端

项目使用的react和antd开发

## 安装环境

```bash
npm install 
```
配套后台：
https://github.com/Conger0392/dofGM


## 使用说明

本地测试的话需要在package里开启代理 上线的话删除这个就行
  "proxy": "http://localhost:5000"
  
端口修改的话可以去查一下在modules里的react-scripts-scripts-start.js
搜索9518 改成自己的端口
本地测试
```bash
npm start 
```
## 部署
打包项目
```bash
npm run build 
```
打包后将文件上传服务器 我是用的是宝塔在网站直接添加页面




添加之后配置反向代理防止产生跨域问题，以nginx为例。


````
server{
    listen       80;        # 页面访问端口
    listen  [::]:9518;        # 页面访问端口
    server_name  localhost;
    
    # 站点目录， “/home/html/dnf”改为你自己的目录
    location / {
        root   /home/html/dnf;
        try_files $uri $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # 后台服务代理，“http://127.0.0.1:5000;”改为你自己的服务路径和端口
       location ~/manage{
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host:$server_port;
    }
}
````



