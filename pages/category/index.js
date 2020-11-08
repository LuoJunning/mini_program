import { request } from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
  /**
   * 页面的初始数据、
   */
  data: {
    leftCateList: [], // 左侧分类的标题
    rightCateData: [], // 右侧分类的内容
    currentIndex: 0, // 当前显示的分类的索引，默认的索引为0
    scrollTop: 0 // 右侧分类详情的 滚动窗口scroll-view 距离顶部的距离
  },

  Category: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /**
     * 0 web中的本地存储和小程序中的本地存储的区别
     *  1 写代码的方式比一样了
     *    web: localStorage.setItem("key":"value") localStorage.getItem("key")
     *    小程序：wx.setStorageSync("key","value") wx.getStorageSync("key")
     *  2 存储的时候 小程序不做类型转换
     *    web: 不管存入的是什么类型的数据，都会先调用一下 toString(), 把数据变成了字符串再存进去
     *    小程序：不存在 类型转换这个操作 存进去的是什么数据类型 获取的就是什么数据类型
     * 业务逻辑：
     * 1. 先判断一下本地存储中有没有旧的数据
     * { time:Date.now(), data:[...]}
     * 2. 没有旧的数据 直接发送新请求
     * 3. 有旧的数据 并且 旧的数据也没有过期，就使用 本地存储中的旧数据即可
     */
    const Cates = wx.getStorageSync("cates")
    if (!Cates) {
      this.getCategoryData()
      console.log(111111, "第一次获取数据")
    } else {
      // 先设定10秒，实现了再改成10分钟
      // if (Date.now() - Cates.time > 1000 * 10) {
      if (Date.now() - Cates.time > 1000 * 60 * 10) {
        this.getCategoryData()
        console.log(222222, "缓存超时，再次获取数据")
      } else {
        // 直接从缓存中获取数据
        console.log(333333, "直接从缓存中获取数据")
        this.Category = Cates.cates
        const leftCateList = this.Category.map(v => v.cat_name)
        const rightCateData = this.Category[0].children
        this.setData({
          leftCateList,
          rightCateData
        })
      }
    }
  },

  /**
   * 获取商品分类信息
   */
  async getCategoryData() {
    console.log(66666)
    const { data: res } = await request({ url: "/categories" })
    this.Category = res.message
    wx.setStorageSync("cates", {
      time: Date.now(),
      cates: this.Category
    })
    const leftCateList = this.Category.map(v => v.cat_name)
    const rightCateData = this.Category[0].children
    this.setData({
      leftCateList,
      rightCateData
    })
  },

  /**
   * 点击左侧菜单，改变右侧显示内容
   * @param {*} e
   */
  handleIndexTap(e) {
    // 1. 从点击事件对象中获取点击的分类的索引
    const { index } = e.currentTarget.dataset
    // 2. 改变右侧显示内容
    const rightCateData = this.Category[index].children
    // 3. 赋值
    this.setData({
      // 每次点击把 右侧的scroll-view 标签距离顶部的距离设置为0
      currentIndex: index,
      rightCateData,
      scrollTop: 0
    })
  }
})
