<template>
	<view class="cart-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">购物车</text>
			<text class="nav-edit" @click="toggleEdit">{{ isEdit ? '完成' : '管理' }}</text>
		</view>

		<!-- 购物车列表 -->
		<view class="cart-list" v-if="cartList.length > 0">
			<view class="cart-item" v-for="item in cartList" :key="item.id + item.spec" @click="goDetail(item)">
				<view class="check-circle" :class="{ checked: item.checked }" @click.stop="toggleCheck(item)">
					<text v-if="item.checked">✓</text>
				</view>
				<image class="item-img" :src="item.image" mode="aspectFill" />
				<view class="item-info">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-spec">{{ item.spec }}</text>
					<view class="item-bottom">
						<text class="item-price">¥{{ item.price }}</text>
						<view class="quantity-control" @click.stop>
							<view class="qty-btn" @click="changeQty(item, -1)">-</view>
							<text class="qty-num">{{ item.quantity }}</text>
							<view class="qty-btn" @click="changeQty(item, 1)">+</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 空购物车 -->
		<view class="empty-cart" v-else>
			<text class="empty-icon">🛒</text>
			<text class="empty-text">购物车还是空的</text>
			<view class="empty-btn" @click="goShopping">去逛逛</view>
		</view>

		<!-- 底部结算栏 -->
		<view class="bottom-bar" v-if="cartList.length > 0">
			<!-- 左侧：全选 -->
			<view class="check-all" @click="toggleAll">
				<view class="check-circle" :class="{ checked: isAllChecked }">
					<text v-if="isAllChecked">✓</text>
				</view>
				<text class="check-text">全选</text>
			</view>
			
			<!-- 中间：合计（编辑模式下隐藏） -->
			<view class="total-section" v-if="!isEdit">
				<text class="total-text">合计：</text>
				<text class="total-price">¥{{ totalPrice }}</text>
			</view>
			
			<!-- 右侧：删除/去结算按钮 -->
			<view class="bar-btn" :class="{ disabled: checkedCount === 0 }" @click="handleAction">
				{{ isEdit ? `删除(${checkedCount})` : `去结算(${checkedCount})` }}
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 获取全局购物车数据
const app = getApp()
const { cartList: globalCartList, removeFromCart } = app.globalData

// ---- 本地状态 ----
const isEdit = ref(false)

// 使用 computed 响应式绑定全局购物车数据
const cartList = computed({
	get: () => globalCartList.value,
	set: (val) => { globalCartList.value = val }
})

// ---- 计算属性 ----
const isAllChecked = computed(() => {
	return cartList.value.length > 0 && cartList.value.every(item => item.checked)
})

const checkedCount = computed(() => {
	return cartList.value.filter(item => item.checked).length
})

const totalPrice = computed(() => {
	return cartList.value
		.filter(item => item.checked)
		.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// ---- 方法 ----
const goBack = () => {
	uni.navigateBack()
}

// ---- ⭐ 点击商品跳转详情页 ----
const goDetail = (item) => {
	// 套餐商品跳转到套餐详情或新手页
	if (item.isPackage) {
		uni.navigateTo({ url: '/pages/newbie/newbie' })
		return
	}
	// 普通商品跳转到商品详情页
	uni.navigateTo({ 
		url: `/pages/goods-detail/goods-detail?id=${item.id}` 
	})
}

const toggleCheck = (item) => {
	item.checked = !item.checked
}

const toggleAll = () => {
	const newState = !isAllChecked.value
	cartList.value.forEach(item => item.checked = newState)
}

const changeQty = (item, delta) => {
	const newQty = item.quantity + delta
	if (newQty >= 1) {
		item.quantity = newQty
		globalCartList.value = [...globalCartList.value]
	}
}

const toggleEdit = () => {
	isEdit.value = !isEdit.value
}

const handleAction = () => {
	if (isEdit.value) {
		if (checkedCount.value === 0) {
			uni.showToast({ title: '请选择要删除的商品', icon: 'none' })
			return
		}
		uni.showModal({
			title: '确认删除',
			content: `确定删除选中的${checkedCount.value}件商品吗？`,
			success: (res) => {
				if (res.confirm) {
					const toRemove = cartList.value.filter(item => item.checked)
					toRemove.forEach(item => {
						removeFromCart(item.id, item.spec)
					})
					uni.showToast({ title: '删除成功', icon: 'success' })
					if (cartList.value.length === 0) {
						isEdit.value = false
					}
				}
			}
		})
	} else {
		if (checkedCount.value === 0) {
			uni.showToast({ title: '请选择商品', icon: 'none' })
			return
		}
		//跳转到结算页，传递选中的商品
		const selectedItems = cartList.value.filter(item => item.checked)
		uni.navigateTo({
			url: `/pages/checkout/checkout?items=${encodeURIComponent(JSON.stringify(selectedItems))}`
		})
	}
}

const goShopping = () => {
	uni.switchTab({ url: '/pages/mall/mall' })
}
</script>

<style lang="scss" scoped>
.cart-page {
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 140rpx;
}

/* ========== 顶部导航（左中右布局） ========== */
.nav-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 60rpx 32rpx 24rpx;
	background: #fff;
}

.nav-left {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.back-icon {
	font-size: 70rpx;
	font-weight: 300;
	color: #333;
	line-height: 1;
	margin-bottom: 10px;
}

.nav-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
	text-align: center;
}

.nav-edit {
	font-size: 28rpx;
	color: #D49A55;
	flex-shrink: 0;
	width: 72rpx;
	text-align: right;
}

/* ========== 购物车列表 ========== */
.cart-list {
	padding: 20rpx 24rpx;
}
.cart-item {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.98);
	}
}
.check-circle {
	width: 44rpx;
	height: 44rpx;
	border: 2rpx solid #D0D0D0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
	font-size: 24rpx;
	color: #fff;
	transition: all 0.2s;
}
.check-circle.checked {
	background: #D49A55;
	border-color: #D49A55;
}
.item-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 16rpx;
	margin-right: 20rpx;
	flex-shrink: 0;
}
.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}
.item-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
	margin-bottom: 8rpx;
}
.item-spec {
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
}
.item-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.item-price {
	font-size: 36rpx;
	color: #E64340;
	font-weight: bold;
}
.quantity-control {
	display: flex;
	align-items: center;
	border: 1rpx solid #E0E0E0;
	border-radius: 8rpx;
	overflow: hidden;
}
.qty-btn {
	width: 56rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #333;
	background: #F8F8F8;
}
.qty-num {
	width: 72rpx;
	text-align: center;
	font-size: 26rpx;
	color: #333;
}

/* ========== 空购物车 ========== */
.empty-cart {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 200rpx;
}
.empty-icon {
	font-size: 160rpx;
	margin-bottom: 32rpx;
	opacity: 0.5;
}
.empty-text {
	font-size: 30rpx;
	color: #999;
	margin-bottom: 48rpx;
}
.empty-btn {
	padding: 20rpx 80rpx;
	background: #D49A55;
	color: #fff;
	font-size: 30rpx;
	border-radius: 44rpx;
}

/* ========== 底部结算栏 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	padding-bottom: env(safe-area-inset-bottom);
	box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05);
}

.check-all {
	display: flex;
	align-items: center;
	flex-shrink: 0;
}
.check-text {
	font-size: 28rpx;
	color: #333;
	margin-left: 12rpx;
}

.total-section {
	display: flex;
	align-items: baseline;
	justify-content: flex-end;
	flex: 1;
	margin: 0 16rpx;
}
.total-text {
	font-size: 28rpx;
	color: #333;
}
.total-price {
	font-size: 44rpx;
	color: #E64340;
	font-weight: bold;
}

.bar-btn {
	padding: 0 48rpx;
	height: 88rpx;
	background: linear-gradient(90deg, #D49A55, #B8860B);
	color: #fff;
	font-size: 30rpx;
	font-weight: bold;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.bar-btn.disabled {
	opacity: 0.5;
}
</style>