import { request } from "./../../request/index"

import regeneratorRuntime from "../../lib/runtime/runtime"

//Page Object
Page({
  data: {
    swiperList: [], // 轮播图 数据
    CateList: [], // 分类 数据
    floorList: [] // 楼层 数据
  },
  //options(Object)
  onLoad: function (options) {
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },

  /**
   * 获取轮播图数据
   */
  getSwiperList() {
    request({ url: "/home/swiperdata" }).then(res => {
      const { message: swiperList } = res.data
      this.setData({
        swiperList
      })
    })
  },

  /**
   * 获取分类数据
   */
  async getCateList() {
    request({ url: "/home/catitems" }).then(res => {
      const { message: CateList } = res.data
      this.setData({
        CateList
      })
    })
  },

  /**
   * 获取楼层数据
   */
  getFloorList() {
    request({ url: "/home/floordata" }).then(res => {
      const { message: floorList } = res.data
      this.setData({
        floorList
      })
    })
  }
})
