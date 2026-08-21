<template>
	<view class="success-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goHome">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">支付成功</text>
			<view class="nav-right">
				<text class="share-icon" @click="handleShare">📤</text>
			</view>
		</view>

		<!-- 成功动画 -->
		<view class="success-animation">
			<view class="icon-circle">
				<view class="icon-check">✓</view>
			</view>
			<view class="confetti-container">
				<view class="confetti" v-for="i in 12" :key="i" :style="getConfettiStyle(i)"></view>
			</view>
		</view>

		<!-- 成功信息 -->
		<view class="success-info">
			<text class="success-title">支付成功！</text>
			<text class="success-desc">您的订单已成功支付，感谢您的购买</text>
		</view>

		<!-- 订单信息 -->
		<view class="order-card">
			<view class="order-row">
				<text class="order-label">订单编号</text>
				<view class="order-value-wrap">
					<text class="order-value">{{ orderId }}</text>
					<text class="copy-btn" @click="copyOrderId">复制</text>
				</view>
			</view>
			<view class="order-row">
				<text class="order-label">支付金额</text>
				<text class="order-value" style="color:#D44C4C;font-weight:700;">¥{{ amount }}</text>
			</view>
			<view class="order-row">
				<text class="order-label">支付方式</text>
				<text class="order-value">微信支付</text>
			</view>
			<view class="order-row">
				<text class="order-label">支付时间</text>
				<text class="order-value">{{ payTime }}</text>
			</view>
			<view class="order-row" v-if="deliveryInfo">
				<text class="order-label">预计送达</text>
				<text class="order-value" style="color:#4ECDC4;">{{ deliveryInfo }}</text>
			</view>
		</view>

		<!-- 推荐商品 -->
		<view class="recommend-section" v-if="recommendList.length > 0">
			<view class="recommend-header">
				<text class="recommend-title">猜你喜欢</text>
				<text class="recommend-more" @click="goMall">更多 ›</text>
			</view>
			<scroll-view class="recommend-scroll" scroll-x="true" show-scrollbar="false">
				<view class="recommend-item" v-for="item in recommendList" :key="item.id" @click="goGoodsDetail(item)">
					<image class="recommend-img" :src="item.image" mode="aspectFill" />
					<text class="recommend-name">{{ item.name }}</text>
					<text class="recommend-price">¥{{ item.price }}</text>
				</view>
			</scroll-view>
		</view>

		<!-- 按钮 -->
		<view class="btn-wrap">
			<view class="btn btn-secondary" @click="goOrders">
				<text>查看订单</text>
			</view>
			<view class="btn btn-primary" @click="goHome">
				<text>返回首页</text>
			</view>
		</view>

		<!-- 分享弹窗 -->
		<view class="modal-mask" v-if="showShareModal" @click="closeShareModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">分享订单</text>
					<text class="modal-close" @click="closeShareModal">✕</text>
				</view>
				<view class="share-options">
					<view class="share-item" @click="shareTo('wechat')">
						<view class="share-icon-wrap" style="background:#07C160;">
							<text>💬</text>
						</view>
						<text>微信好友</text>
					</view>
					<view class="share-item" @click="shareTo('moment')">
						<view class="share-icon-wrap" style="background:#07C160;">
							<text>🔄</text>
						</view>
						<text>朋友圈</text>
					</view>
					<view class="share-item" @click="shareTo('copy')">
						<view class="share-icon-wrap" style="background:#D49A55;">
							<text>📋</text>
						</view>
						<text>复制链接</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 数据 ----
const orderId = ref('')
const amount = ref('0.00')
const payTime = ref('')
const deliveryInfo = ref('')
const showShareModal = ref(false)

// ---- 推荐商品 ----
const recommendList = ref([])

// ---- 格式化时间 ----
const formatTime = (date) => {
	const d = new Date(date)
	return d.getFullYear() + '-' +
		String(d.getMonth() + 1).padStart(2, '0') + '-' +
		String(d.getDate()).padStart(2, '0') + ' ' +
		String(d.getHours()).padStart(2, '0') + ':' +
		String(d.getMinutes()).padStart(2, '0')
}

// ---- 彩带样式 ----
const getConfettiStyle = (index) => {
	const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8A5C', '#6C5CE7', '#FD79A8', '#00B894']
	const size = 8 + Math.random() * 12
	const left = 10 + Math.random() * 80
	const delay = Math.random() * 1.5
	const duration = 0.8 + Math.random() * 0.8
	return {
		width: size + 'rpx',
		height: size + 'rpx',
		left: left + '%',
		backgroundColor: colors[index % colors.length],
		animationDelay: delay + 's',
		animationDuration: duration + 's',
		borderRadius: Math.random() > 0.5 ? '50%' : '4rpx'
	}
}

// ---- 获取推荐商品 ----
const loadRecommend = () => {
	if (globalData.getGoodsList) {
		const allGoods = globalData.getGoodsList()
		const shuffled = [...allGoods].sort(() => Math.random() - 0.5)
		recommendList.value = shuffled.slice(0, 4)
	}
}

// ---- ⭐ 更新订单状态为待发货 ----
const updateOrderStatus = (orderId) => {
	console.log('===== 更新订单状态 =====')
	console.log('订单号:', orderId)
	
	let updated = false
	
	// ⭐ 状态改为 shipping（待发货）
	if (globalData.updateOrderStatus) {
		const result = globalData.updateOrderStatus(orderId, 'shipping')
		console.log('使用 updateOrderStatus 更新结果:', result)
		if (result !== false) {
			updated = true
		}
	}
	
	// 兼容：直接操作 orders
	if (!updated && globalData.orders) {
		const orders = globalData.orders.value || globalData.orders
		const order = orders.find(item => item.id === orderId)
		if (order) {
			order.status = 'shipping'
			order.payTime = new Date().toLocaleString()
			console.log('直接修改订单状态为 shipping')
			updated = true
			try {
				uni.setStorageSync('orders', JSON.stringify(orders))
			} catch (e) {}
		}
	}
	
	if (!updated) {
		console.warn('⚠️ 未找到订单，状态更新失败')
	} else {
		console.log('✅ 订单状态已更新为待发货')
	}
}

// ---- 页面加载 ----
onLoad((options) => {
	console.log('===== 支付成功页接收参数 =====')
	console.log('options:', options)
	
	orderId.value = options.orderId || 'ORD' + Date.now()
	
	let amountValue = parseFloat(options.amount)
	if (isNaN(amountValue) || amountValue < 0) {
		amountValue = 0
	}
	amount.value = amountValue.toFixed(2)
	
	console.log('订单号:', orderId.value)
	console.log('金额:', amount.value)
	console.log('===============================')
	
	payTime.value = formatTime(Date.now())
	
	const now = new Date()
	const deliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
	deliveryInfo.value = formatTime(deliveryDate) + ' 前送达'
	
	// ⭐ 关键：更新订单状态为待发货
	updateOrderStatus(orderId.value)
	
	loadRecommend()
})

// ---- 方法 ----
const goHome = () => {
	uni.switchTab({
		url: '/pages/mall/mall'
	})
}

const goMall = () => {
	uni.switchTab({
		url: '/pages/mall/mall'
	})
}

const goOrders = () => {
	uni.navigateTo({
		url: '/pages/mine/my-orders/my-orders'
	})
}

const goGoodsDetail = (item) => {
	uni.navigateTo({
		url: `/pages/goods-detail/goods-detail?id=${item.id}`
	})
}

// ---- 复制订单号 ----
const copyOrderId = () => {
	uni.setClipboardData({
		data: orderId.value,
		success: () => {
			uni.showToast({
				title: '已复制订单号',
				icon: 'success'
			})
		}
	})
}

// ---- 分享 ----
const handleShare = () => {
	showShareModal.value = true
}

const closeShareModal = () => {
	showShareModal.value = false
}

const shareTo = (type) => {
	switch(type) {
		case 'wechat':
			uni.showToast({ title: '分享到微信好友', icon: 'none' })
			break
		case 'moment':
			uni.showToast({ title: '分享到朋友圈', icon: 'none' })
			break
		case 'copy':
			uni.setClipboardData({
				data: `我刚刚在宠物商城下单啦！订单号：${orderId.value}，金额：¥${amount.value}`,
				success: () => {
					uni.showToast({ title: '已复制分享内容', icon: 'success' })
				}
			})
			break
		default:
			uni.showToast({ title: '分享功能开发中', icon: 'none' })
	}
	closeShareModal()
}
</script>
<style lang="scss" scoped>
.success-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 40rpx;
}

/* ========== 顶部导航 ========== */
.nav-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 60rpx 32rpx 20rpx;
	background: #FFFFFF;
	position: sticky;
	top: 0;
	z-index: 10;
}

.nav-left {
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	cursor: pointer;
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
	font-weight: 700;
	color: #1A1A1A;
	flex: 1;
	text-align: center;
}

.nav-right {
	width: 72rpx;
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}

.share-icon {
	font-size: 36rpx;
	cursor: pointer;
	&:active {
		opacity: 0.6;
	}
}

/* ========== 成功动画 ========== */
.success-animation {
	display: flex;
	justify-content: center;
	padding: 60rpx 0 20rpx;
	position: relative;
}

.icon-circle {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #4ECDC4, #44B39D);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 32rpx rgba(78, 205, 196, 0.3);
	z-index: 2;
	animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
	0% { transform: scale(0); opacity: 0; }
	100% { transform: scale(1); opacity: 1; }
}

.icon-check {
	font-size: 72rpx;
	color: #fff;
	font-weight: 700;
}

/* ========== 彩带 ========== */
.confetti-container {
	position: absolute;
	top: 60rpx;
	left: 0;
	right: 0;
	height: 200rpx;
	overflow: hidden;
	pointer-events: none;
}

.confetti {
	position: absolute;
	top: -20rpx;
	animation: confettiFall 1.2s ease-in forwards;
	opacity: 0;
}

@keyframes confettiFall {
	0% {
		transform: translateY(0) rotate(0deg) scale(0);
		opacity: 1;
	}
	100% {
		transform: translateY(200rpx) rotate(720deg) scale(0.5);
		opacity: 0;
	}
}

/* ========== 成功信息 ========== */
.success-info {
	text-align: center;
	padding: 0 32rpx 40rpx;
}

.success-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 8rpx;
}

.success-desc {
	font-size: 26rpx;
	color: #999;
	display: block;
}

/* ========== 订单卡片 ========== */
.order-card {
	background: #FFFFFF;
	margin: 0 32rpx 24rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.order-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.order-label {
	font-size: 26rpx;
	color: #999;
	flex-shrink: 0;
}

.order-value {
	font-size: 26rpx;
	color: #333;
}

.order-value-wrap {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.copy-btn {
	font-size: 20rpx;
	color: #D49A55;
	background: #FFF5E4;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

/* ========== 推荐商品 ========== */
.recommend-section {
	background: #FFFFFF;
	margin: 0 32rpx 32rpx;
	padding: 24rpx 0 24rpx 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
}

.recommend-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 24rpx;
	margin-bottom: 16rpx;
}

.recommend-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
}

.recommend-more {
	font-size: 24rpx;
	color: #999;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

.recommend-scroll {
	white-space: nowrap;
}

.recommend-item {
	display: inline-block;
	width: 200rpx;
	margin-right: 16rpx;
	vertical-align: top;
	white-space: normal;
	cursor: pointer;
	&:active {
		opacity: 0.8;
	}
}

.recommend-img {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	object-fit: cover;
	background: #F0EDE8;
}

.recommend-name {
	font-size: 24rpx;
	color: #333;
	display: block;
	margin-top: 8rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.recommend-price {
	font-size: 28rpx;
	font-weight: 700;
	color: #D44C4C;
	display: block;
	margin-top: 4rpx;
}

/* ========== 按钮 ========== */
.btn-wrap {
	display: flex;
	gap: 16rpx;
	padding: 0 32rpx;
}

.btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 30rpx;
	font-weight: 600;
	transition: transform 0.2s;
	cursor: pointer;

	&:active {
		transform: scale(0.96);
	}
}

.btn-primary {
	background: linear-gradient(135deg, #D49A55, #B8860B);
	color: #fff;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.3);
}

.btn-secondary {
	background: #F5F4F0;
	color: #666;
}

/* ========== 分享弹窗 ========== */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 999;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	animation: fadeIn 0.25s;
}

@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}

.modal-content {
	background: #FFFFFF;
	width: 100%;
	border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx 32rpx 40rpx;
	animation: slideUp 0.3s;
}

@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.modal-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}

.modal-close {
	font-size: 40rpx;
	color: #999;
	padding: 8rpx;
	cursor: pointer;
}

.share-options {
	display: flex;
	justify-content: space-around;
}

.share-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

.share-icon-wrap {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	color: #fff;
}

.share-item text:last-child {
	font-size: 22rpx;
	color: #666;
}
</style>