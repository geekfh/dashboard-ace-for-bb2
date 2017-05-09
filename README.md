# API Documents
## 关联项目 ##
- 基础前端框架(union-assets) [https://git.iboxpay.com/omms/union-assets](https://git.iboxpay.com/omms/union-assets "union-assets")
- 基础框架编译环境(union-build) [https://git.iboxpay.com/omms/union-build](https://git.iboxpay.com/omms/union-build "union-build")
- demo&docs(union-resources) [https://git.iboxpay.com/omms/union-resources](https://git.iboxpay.com/omms/union-resources "union-resources")

## 准备工作 ##

### 全局安装jsdoc ###
> npm install -g jsdoc

### 验证是否成功 ###
> jsdoc -v //任意地方执行此代码验证jsdoc是否安装成功

## 生成文档 ##
> jsdoc -c .jsdoc3 //拉取union-resources，在根目录下执行命令

## 目录说明 ##
- app: 子系统模块(子应用)
- assets: 基础框架
- docs: 基础框架文档
- templates: jsdoc3文档模板
- third-party: 第三方资源目录
- index.html: 应用首页面
- login.html: 应用登录页面

## 前端架构 ##
[http://wiki.iboxpay.com/pages/viewpage.action?pageId=10095422](http://wiki.iboxpay.com/pages/viewpage.action?pageId=10095422 "运管前端框架设计")


