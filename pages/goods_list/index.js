/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */

import { request } from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        value: "综合",
        id: 0,
        isActive: true
      },
      {
        value: "销量",
        id: 1,
        isActive: false
      },
      {
        value: "价格",
        id: 2,
        isActive: false
      }
    ],
    goodsList: []
  },

  // 请求参数，带分页
  QueryParams: {
    query: "",
    cid: "",
    pagenum: "1",
    pagesize: "10"
  },

  // 商品列表的总页数，默认为1
  pageNumber: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },

  /**
   * 页面上滑 滚动条触底事件
   */
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.pageNumber) {
      // 没有下一页数据
      // console.log("%c" + "没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)")
      wx.showToast({ title: "没有下一页数据" })
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

  /**
   * 监听⽤⼾下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList()
  },

  /**
   * 获取商品列表信息
   */
  async getGoodsList() {
    const { data: res } = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    // 获取商品列表总条数
    const { total } = res.message
    // 计算商品列表总页数
    this.pageNumber = Math.ceil(total / this.QueryParams.pagesize)
    // 商品列表数组
    let goodsList = res.message.goods
    // 合并商品列表数组
    goodsList = [...this.data.goodsList, ...goodsList]
    this.setData({ goodsList })
    // 停止下拉刷新， 如果没有下拉，调用这个api也没有问题
    wx.stopPullDownRefresh()
  },

  /**
   * 接受子组件通过事件传递的参数
   * @param {*} e
   */
  handelItemTap(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach(v => {
      v.isActive = v.id === index ? true : false
    })
    this.setData({
      tabs
    })
  }
})
