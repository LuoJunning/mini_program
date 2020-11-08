import {
	getSetting,
	chooseAddress,
	openSetting,
	showModal,
	showToast
} from "../../utils/asyncWx.js"
import regeneratorRuntime from "../../lib/runtime/runtime"

Page({
	data: {
		address: {}, // 收货地址
		cart: [], // 购物车数组
		totalPrice: 0, // 总价格
		totalNum: 0 // 总数量
	},

	onShow() {
		const address = wx.getStorageSync("address")
    let cart = wx.getStorageSync("cart") || []
    console.log(1111,cart);
    cart = cart.filter(v => v.checked)
    console.log(2222,cart);
		// 计算购物车底部工具栏 总价格、总数量
		// 总价格 总数量
		let totalPrice = 0
		let totalNum = 0
		cart.forEach(v => {
			if (v.checked) {
				totalPrice += v.goods_price * v.num
				totalNum += v.num
			}
		})
		this.setData({
			address,
			cart,
			totalPrice,
			totalNum
		})
	},

	/**
	 * 获取用户的收货地址
	 */
	async handelChooseAddres() {
		try {
			// 1.获取 权限状态
			const result1 = await getSetting()
			// 获取权限状态 只要发现一些 属性名很怪异的时候  都要使用 [] 形式来获取属性值
			const scopeAddress = result1.authSetting["scope.address"]
			// 2 判断 权限状态
			if (scopeAddress === false) await openSetting()
			let address = await chooseAddress()
			address.all =
				address.provinceName +
				address.cityName +
				address.countyName +
				address.detailInfo
			wx.setStorageSync("address", address)
		} catch (error) {
			console.log(error)
		}
	}
})
