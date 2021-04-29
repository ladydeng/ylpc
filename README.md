# ylpc
## 项目目录结构
```
src文件夹下：
assets 静态资源文件
      -css
      -images
common 公共资源，如防抖，混入
components 项目组件
      -content 项目组件
      -common 可以重复利用的组件
network 网络请求
      -request.js 封装好的网络请求
      -home.js 首页的网络请求
      -detail.js 详情页的网络请求
router 路由文件
      -index.js
store 公共状态文件
      -index.js
      -getters.js getters的一些函数
      -getters_type.js getters中函数的常量名
      -mutations.js mutaions的一些函数
      -mutations_type.js mutations中函数的常量名
      -actions.js actions的一些函数
      -actions_type.js actions中函数的常量名
views 项目页面
      -student
        -Student.vue 学生基本信息
        -Class.vue 班级信息
      -
        -Class.vue 班级信息
      -login
        -login.vue 登录页面
App.vue  vue项目根组件
main.js  vue项目入口js文件
```
## 项目功能模块
```
学生信息
  -学生基本信息
  -班级信息
  -学生状态
  -学生意见
  -信息统计
  -就业信息
员工信息
  -员工列表
考试系统
  -成绩查询
  -成绩统计
  -在线考试
  -题库
OA系统
  -CRM管理
  -教务管理
  -行政管理
  -市场营销
  -人事管理
  -财务管理
出勤
  -考勤记录
  -出勤基本信息
业绩考核
  -部门信息
  -通用考核
  -市场部门考核
  -人力资源部门考核
  -技术部考核
  -岗位信息
人力资源
  -面试人员
  -邀约面试
  -退档
  -入职历史记录
考核算法
  -数据编号
  -员工编号
  -算法类型
  -算法内容
内训业务管理
  -课程基本信息
  -授课基本信息

```