/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import { request } from "../../request/index"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		goodsObj: {} // 商品详情对象
	},

	GoodsObj: {}, //  完整的商品详情对象

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		const { goods_id } = options
		this.getGoodsDetail(goods_id)
	},

	async getGoodsDetail(goods_id) {
		const { data: res } = await request({
			url: "/goods/detail",
			data: { goods_id }
		})
		let { message: goodsObj } = res
		this.GoodsObj = goodsObj
		// 优化 微信小程序 data的性能
		this.setData({
			goodsObj: {
				goods_name: goodsObj.goods_name,
				goods_price: goodsObj.goods_price,
				// ipone 设备不支持 .webp格式的图片，假如后台没办法修改，而且图片也存在 .jpg格式，前端就自己修改
				goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, ".jpg"),
				pics: goodsObj.pics
			}
		})
	},

	/**
	 * 点击轮播图预览图片
	 * @param {*} e
	 */
	handelPreview(e) {
		const urls = this.GoodsObj.pics.map(v => v.pics_mid)
		const { imgsrc: current } = e.currentTarget.dataset
		console.log(current)
		console.log(urls)
		wx.previewImage({
			current,
			urls
		})
	},

	/**
	 * 添加到购物车
	 */
	handelCartAdd() {
		// 获取缓存中的 购物车数组
		let cart = wx.getStorageSync("cart") || []
		// 判断 购物车数组 是否为空，是空数组则直接添加
		if (cart.length === 0) {
			this.GoodsObj.num = 1
			this.GoodsObj.checked = true
			cart.push(this.GoodsObj)
		} else {
			// 判断 商品对象是否存在于购物车数组中
      let index = cart.findIndex(v => v.goods_id === this.GoodsObj.goods_id)
       // 不存在 第一次添加
			if (index === -1) {
				this.GoodsObj.num = 1
				this.GoodsObj.checked = true
				cart.push(this.GoodsObj)
			} else {
        // 已经存在购物车数据 执行 num++
				cart[index].num++
			}
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart)
    // 弹窗提示
		wx.showToast({
      title: "添加成功",
      // true 防止用户 手抖 疯狂点击按钮
			mask: true
		})
	}
})
