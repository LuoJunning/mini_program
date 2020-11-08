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
		allChecked: false, // 全选的状态，默认为 false
		totalPrice: 0, // 总价格
		totalNum: 0 // 总数量
	},

	onShow() {
		const address = wx.getStorageSync("address")
		const cart = wx.getStorageSync("cart") || []
		// 计算购物车底部工具栏 的全选、总价格、总数量
		this.setCart(cart)
		this.setData({ address })
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
	},

	/**
	 * 改变单个商品的选中状态
	 * @param {*} e
	 */
	handelItemChange(e) {
		// 获取改变商品状态的商品ID
		const { id } = e.currentTarget.dataset
		// 获取购物车数据
		const { cart } = this.data
		// 找到 改变商品状态的商品 的数组索引
		const index = cart.findIndex(v => v.goods_id === id)
		// 把它的选中状态取反
		cart[index].checked = !cart[index].checked
		// 重新计算 全选、商品总价格、商品总数量
		this.setCart(cart)
	},

	/**
	 * 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
	 * @param {array} cart
	 */
	setCart(cart) {
		// 全选
		let allChecked = true
		// 总价格 总数量
		let totalPrice = 0
		let totalNum = 0
		cart.forEach(v => {
			if (v.checked) {
				totalPrice += v.goods_price * v.num
				totalNum += v.num
			} else {
				allChecked = false
			}
		})
		allChecked = cart.length !== 0 ? allChecked : false

		this.setData({
			cart,
			allChecked,
			totalPrice,
			totalNum
		})
		wx.setStorageSync("cart", cart)
	},

	/**
	 * 设置 购物车全选的复选框，改变商品的复选框的状态，
	 */
	handelItemAllChecked() {
		// 获取购物车数据，全选状态
		let { cart, allChecked } = this.data
		// 全选状态取反
		allChecked = !allChecked
		// 购物车中的所有商品数据的选中状态 跟随 全选
		cart.forEach(v => (v.checked = allChecked))
		// 重新设置 data 中的数据
		// 重新 设置缓存中的数据
		this.setCart(cart)
	},

	/**
	 * 编辑购物车中商品的数量
	 */
	async handelItemNumEdit(e) {
		const { id, operation } = e.currentTarget.dataset
		let { cart } = this.data
		const index = cart.findIndex(v => v.goods_id === id)
		if (cart[index].num === 1 && operation === -1) {
			let res = await showModal({ content: "您是否要删除商品" })
			if (res.confirm) {
				cart.splice(index, 1)
				this.setCart(cart)
			}
		} else {
			cart[index].num += operation
			this.setCart(cart)
		}
	},

	/**
	 * 点击结算
	 */
	async handelPay() {
		const { address, totalNum } = this.data
		if (totalNum === 0) {
			await showToast({ title: "您还未选择商品到购物车" })
			return
		}
		if(!address.userName) {
			await showToast({ title: "您还未选择收货地址"})
			return
		}
		wx.navigateTo({
			url: '../pay/index',
		});
	},

	handelChooseAddres22222() {
		// 1.获取 权限状态
		wx.getSetting({
			success: result => {
				// 2.获取权限状态 只要发现一些 属性名很怪异的时候  都要使用 [] 形式来获取属性值
				const scopeAddress = result.authSetting["scope.address"]
				console.log("result", result)
				console.log("scopeAddress", scopeAddress)
				if (scopeAddress === true || scopeAddress === undefined) {
					console.log("进来了")
					wx.chooseAddress({
						success: result1 => {
							console.log("result1", result1)
							console.log("进来了22")
						},
						fail: result11 => {
							console.log("建英是聚聚fail")
							console.log(result11)
							wx.openSetting({
								success: result2 => {
									// 4.可以调用 收货地址代码
									console.log("openSetting")
									wx.chooseAddress({
										success: result3 => {
											console.log("result3", result3)
										}
									})
								},
								fail: () => {
									console.log("完犊子")
								}
							})
						}
						// complete: result12 => {
						//   console.log("建英是聚聚complete");
						//   console.log(result12);

						// }
					})
				} else {
					// 3.用户 以前拒绝过授予权限 先诱导用户打开授权页面
					wx.openSetting({
						success: result2 => {
							// 4.可以调用 收货地址代码
							wx.chooseAddress({
								success: result3 => {
									console.log("result3", result3)
								}
							})
						}
					})
				}
			}
		})
	},
	handelChooseAddres11111() {
		/**
		 * 获取用户的收货地址
		 */
		// console.log("建英是猪猪");
		// wx.chooseAddress({
		//   success: (result)=>{
		//     console.log("建英是聚聚");
		//     console.log(result);
		//   },
		//   	fail: () => {
		//     console.log("建英是聚聚fail");
		//     },
		// 	complete: () => {
		//     console.log("建英是聚聚complete");
		//   }
		// });
		/**
		 * 获取 用户权限状态
		 */
		// wx.getSetting({
		// 	success: result => {
		// 		console.log(result)
		// 	},
		// 	fail: () => {},
		// 	complete: () => {}
		// })
	}
})
