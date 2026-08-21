<template>
	<view class="order-detail-page" v-if="orderInfo">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">订单详情</text>
			<view class="nav-right"></view>
		</view>

		<!-- 订单状态 -->
		<view class="status-section" :style="{ background: statusBgColor }">
			<view class="status-icon">
				<text>{{ statusIcon }}</text>
			</view>
			<view class="status-info">
				<text class="status-text">{{ getStatusText(orderInfo.status) }}</text>
				<text class="status-desc">{{ getStatusDesc(orderInfo.status) }}</text>
			</view>
		</view>

		<!-- 收货地址 -->
		<view class="address-section" v-if="orderInfo.address">
			<view class="address-header">
				<text class="address-label">📦 收货地址</text>
			</view>
			<view class="address-content">
				<view class="address-info">
					<text class="address-name">{{ orderInfo.address.name }}</text>
					<text class="address-phone">{{ orderInfo.address.phone }}</text>
				</view>
				<text class="address-detail">{{ orderInfo.address.detail }}</text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="items-section">
			<view class="section-title">商品清单</view>
			<view class="item-card" v-for="(item, idx) in orderInfo.items" :key="idx">
				<image class="item-img" :src="item.image" mode="aspectFill" />
				<view class="item-info">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-spec">{{ item.spec || '默认规格' }}</text>
					<view class="item-bottom">
						<text class="item-price">¥{{ item.price }}</text>
						<text class="item-qty">×{{ item.quantity }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-section">
			<view class="section-title">订单信息</view>
			<view class="order-row">
				<text class="order-label">订单编号</text>
				<text class="order-value">{{ orderInfo.id }}</text>
			</view>
			<view class="order-row">
				<text class="order-label">下单时间</text>
				<text class="order-value">{{ orderInfo.createTime }}</text>
			</view>
			<view class="order-row" v-if="orderInfo.payTime">
				<text class="order-label">支付时间</text>
				<text class="order-value">{{ orderInfo.payTime }}</text>
			</view>
			<view class="order-row">
				<text class="order-label">商品金额</text>
				<text class="order-value">¥{{ orderInfo.subtotal?.toFixed(2) || orderInfo.totalAmount }}</text>
			</view>
			<view class="order-row" v-if="orderInfo.shippingFee">
				<text class="order-label">运费</text>
				<text class="order-value">¥{{ orderInfo.shippingFee }}</text>
			</view>
			<view class="order-row" v-if="orderInfo.discount">
				<text class="order-label">优惠</text>
				<text class="order-value" style="color:#D49A55;">-¥{{ orderInfo.discount }}</text>
			</view>
			<view class="order-row total-row">
				<text class="order-label">实付金额</text>
				<text class="order-value total-price">¥{{ orderInfo.totalAmount?.toFixed(2) || orderInfo.totalAmount }}</text>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="bottom-bar">
			<view class="btn-group">
				<view class="btn btn-secondary" @click="contactService">联系客服</view>
				<view class="btn btn-primary" @click="handleOrderAction">{{ actionBtnText }}</view>
			</view>
		</view>
	</view>

	<!-- 加载状态 -->
	<view v-else class="loading-container">
		<text class="loading-text">加载中...</text>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 状态 ----
const orderInfo = ref(null)
const orderId = ref('')

// ---- ⭐ 状态图标映射（包含 paid） ----
const statusIconMap = {
	'pending': '⏳',
	'paid': '💰',
	'shipping': '📦',
	'received': '🚚',
	'completed': '✅',
	'cancelled': '❌',
	'refunded': '🔄'
}

// ---- ⭐ 状态背景色映射 ----
const statusBgColorMap = {
	'pending': 'linear-gradient(135deg, #FFF3CD, #FFE082)',
	'paid': 'linear-gradient(135deg, #D1ECF1, #81D4FA)',
	'shipping': 'linear-gradient(135deg, #D1ECF1, #81D4FA)',
	'received': 'linear-gradient(135deg, #D4EDDA, #81C784)',
	'completed': 'linear-gradient(135deg, #E8E8E8, #BDBDBD)',
	'cancelled': 'linear-gradient(135deg, #FFE0E0, #EF9A9A)',
	'refunded': 'linear-gradient(135deg, #FFE0E0, #EF9A9A)'
}

// ---- ⭐ 计算属性 ----
const statusIcon = computed(() => {
	return statusIconMap[orderInfo.value?.status] || '📋'
})

const statusBgColor = computed(() => {
	return statusBgColorMap[orderInfo.value?.status] || '#F5F5F5'
})

// ---- ⭐ 状态文本（包含 paid） ----
const getStatusText = (status) => {
	const map = {
		'pending': '待付款',
		'paid': '已支付',
		'shipping': '待发货',
		'received': '待收货',
		'completed': '已完成',
		'cancelled': '已取消',
		'refunded': '已退款'
	}
	return map[status] || status
}

// ---- ⭐ 状态描述（包含 paid） ----
const getStatusDesc = (status) => {
	const map = {
		'pending': '请尽快完成支付，订单即将为您保留',
		'paid': '订单已支付成功，商家正在准备发货',
		'shipping': '商家正在准备发货，请耐心等待',
		'received': '商品已送达，请确认收货',
		'completed': '订单已完成，感谢您的购买',
		'cancelled': '订单已取消',
		'refunded': '订单已退款'
	}
	return map[status] || ''
}

// ---- ⭐ 底部按钮文本（包含 paid） ----
const actionBtnText = computed(() => {
	const map = {
		'pending': '去支付',
		'paid': '提醒发货',
		'shipping': '提醒发货',
		'received': '确认收货',
		'completed': '再次购买',
		'cancelled': '删除订单',
		'refunded': '删除订单'
	}
	return map[orderInfo.value?.status] || '查看订单'
})

// ---- 加载订单数据 ----
onLoad((options) => {
	console.log('===== 订单详情页加载 =====')
	console.log('接收参数:', options)
	
	orderId.value = options.id || ''
	
	if (!orderId.value) {
		uni.showToast({ title: '订单不存在', icon: 'none' })
		return
	}
	
	// ⭐ 修复：正确获取 orders 数据
	let orders = []
	if (globalData.orders) {
		// 如果 orders 是 ref，取 .value
		if (typeof globalData.orders.value !== 'undefined') {
			orders = globalData.orders.value
		} else {
			orders = globalData.orders
		}
	}
	
	console.log('当前订单列表:', orders)
	
	const found = orders.find(o => o.id === orderId.value)
	console.log('查找结果:', found)
	
	if (found) {
		orderInfo.value = found
		console.log('✅ 订单详情加载成功')
	} else {
		uni.showToast({ title: '订单不存在', icon: 'none' })
		console.warn('⚠️ 未找到订单:', orderId.value)
	}
})

// ---- 方法 ----
const goBack = () => {
	uni.navigateBack()
}

// ---- ⭐ 处理订单操作 ----
const handleOrderAction = () => {
	if (!orderInfo.value) return
	
	const status = orderInfo.value.status
	
	switch (status) {
		case 'pending':
			// 去支付
			uni.showToast({ title: '跳转支付页', icon: 'none' })
			break
			
		case 'paid':
		case 'shipping':
			// 提醒发货
			uni.showToast({ title: '已提醒商家发货', icon: 'success' })
			break
			
		case 'received':
			// 确认收货
			uni.showModal({
				title: '确认收货',
				content: '确认已收到商品？',
				success: (res) => {
					if (res.confirm) {
						if (globalData.updateOrderStatus) {
							globalData.updateOrderStatus(orderInfo.value.id, 'completed')
							orderInfo.value.status = 'completed'
							uni.showToast({ title: '已确认收货', icon: 'success' })
						}
					}
				}
			})
			break
			
		case 'completed':
		case 'cancelled':
		case 'refunded':
			// 删除订单
			uni.showModal({
				title: '删除订单',
				content: '确定要删除此订单吗？',
				success: (res) => {
					if (res.confirm) {
						const orders = globalData.orders?.value || []
						const index = orders.findIndex(o => o.id === orderInfo.value.id)
						if (index !== -1) {
							orders.splice(index, 1)
							if (typeof globalData.orders.value !== 'undefined') {
								globalData.orders.value = [...orders]
							}
							uni.showToast({ title: '已删除', icon: 'success' })
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						}
					}
				}
			})
			break
			
		default:
			uni.showToast({ title: '功能开发中', icon: 'none' })
	}
}

// ---- 联系客服 ----
const contactService = () => {
	uni.showToast({ title: '连接客服中...', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.order-detail-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 140rpx;
}

/* ========== 加载状态 ========== */
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
}
.loading-text {
	font-size: 28rpx;
	color: #B0A8A0;
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
}

/* ========== 订单状态 ========== */
.status-section {
	margin: 20rpx 32rpx;
	padding: 32rpx 28rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	gap: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.status-icon {
	font-size: 56rpx;
	flex-shrink: 0;
}

.status-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
}

.status-text {
	font-size: 32rpx;
	font-weight: 700;
	color: #1A1A1A;
}

.status-desc {
	font-size: 24rpx;
	color: #666;
}

/* ========== 收货地址 ========== */
.address-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.address-header {
	margin-bottom: 12rpx;
}

.address-label {
	font-size: 26rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.address-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.address-info {
	display: flex;
	gap: 20rpx;
}

.address-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.address-phone {
	font-size: 26rpx;
	color: #666;
}

.address-detail {
	font-size: 24rpx;
	color: #999;
}

/* ========== 商品列表 ========== */
.items-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}

.item-card {
	display: flex;
	gap: 16rpx;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	&:last-child {
		border-bottom: none;
	}
}

.item-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.item-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.item-spec {
	font-size: 22rpx;
	color: #999;
}

.item-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-price {
	font-size: 28rpx;
	font-weight: 700;
	color: #D44C4C;
}

.item-qty {
	font-size: 24rpx;
	color: #999;
}

/* ========== 订单信息 ========== */
.order-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.order-row {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
}

.order-label {
	font-size: 26rpx;
	color: #666;
	flex-shrink: 0;
}

.order-value {
	font-size: 26rpx;
	color: #333;
	text-align: right;
	word-break: break-all;
}

.total-row {
	padding-top: 16rpx;
	margin-top: 8rpx;
	border-top: 1rpx solid #F5F4F0;
}

.total-row .order-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.total-price {
	font-size: 34rpx;
	font-weight: 800;
	color: #D44C4C;
}

/* ========== 底部按钮 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #FFFFFF;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
	z-index: 99;
}

.btn-group {
	display: flex;
	gap: 16rpx;
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
</style>