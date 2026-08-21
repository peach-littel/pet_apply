import { reactive } from 'vue'

// 全局状态
export const store = reactive({
	// 购物车
	cart: [],
	// 收藏的宠物
	favoritePets: [],
	// 收藏的商品
	favoriteGoods: [],
	// 用户信息
	userInfo: null,
	// 登录状态
	isLogin: false
})

// 购物车操作
export const cartStore = {
	// 添加商品
	add(goods, spec = '', quantity = 1) {
		const exist = store.cart.find(item => item.id === goods.id && item.spec === spec)
		if (exist) {
			exist.quantity += quantity
		} else {
			store.cart.push({
				...goods,
				spec,
				quantity,
				checked: true
			})
		}
	},
	// 移除商品
	remove(id) {
		const idx = store.cart.findIndex(item => item.id === id)
		if (idx > -1) store.cart.splice(idx, 1)
	},
	// 修改数量
	updateQty(id, quantity) {
		const item = store.cart.find(item => item.id === id)
		if (item) item.quantity = Math.max(1, quantity)
	},
	// 切换选中
	toggleCheck(id) {
		const item = store.cart.find(item => item.id === id)
		if (item) item.checked = !item.checked
	},
	// 全选/取消全选
	toggleAll(checked) {
		store.cart.forEach(item => item.checked = checked)
	},
	// 获取总价
	getTotal() {
		return store.cart
			.filter(item => item.checked)
			.reduce((sum, item) => sum + item.price * item.quantity, 0)
	},
	// 获取选中数量
	getCheckedCount() {
		return store.cart.filter(item => item.checked).length
	}
}

// 收藏操作
export const favoriteStore = {
	// 切换宠物收藏
	togglePet(pet) {
		const idx = store.favoritePets.findIndex(item => item.id === pet.id)
		if (idx > -1) {
			store.favoritePets.splice(idx, 1)
			return false
		} else {
			store.favoritePets.push(pet)
			return true
		}
	},
	// 判断是否收藏
	isPetFavorited(id) {
		return store.favoritePets.some(item => item.id === id)
	}
}

// 用户操作
export const userStore = {
	login(userInfo) {
		store.userInfo = userInfo
		store.isLogin = true
		uni.setStorageSync('userInfo', userInfo)
	},
	logout() {
		store.userInfo = null
		store.isLogin = false
		uni.removeStorageSync('userInfo')
	},
	init() {
		const userInfo = uni.getStorageSync('userInfo')
		if (userInfo) {
			store.userInfo = userInfo
			store.isLogin = true
		}
	}
}