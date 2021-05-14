//项目的菜单配置
const arr = [
  {
    title: '首页', // 菜单标题名称
    key: 'home', // 对应的path
    icon: 'home', // 图标名称
    path: '/admin/home'//对应路径
  },
  {
    title: '道具管理',
    key: 'prod_about',
    icon: 'appstore',
    children: [ // 子菜单列表
      {
        title: 'CDK管理',
        key: 'cdk',
        icon: 'unordered-list',
        path: '/admin/prod_about/cdk'
      },
      {
        title: '道具列表',
        key: 'product',
        icon: 'tool',
        path: '/admin/prod_about/product'
      },
    ]
  },

  {
    title: '用户管理',
    key: 'user',
    icon: 'user',
    path: '/admin/user'
  },
  {
    title: '权限管理',
    key: 'role',
    icon: 'safety',
    path: '/admin/role'
  },

  {
    title: '在线工具',
    key: 'online',
    icon: 'area-chart',
    children: [
      {
        title: '充值/邮件',
        key: 'reEmail',
        icon: 'bar-chart',
        path: '/admin/online/reEmail'
      },
      {
        title: '在线管理',
        key: 'manage',
        icon: 'line-chart',
        path: '/admin/online/manage'
      },
    ]
  },
]
export default arr