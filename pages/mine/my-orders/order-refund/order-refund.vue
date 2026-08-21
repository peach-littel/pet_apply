<template>
	<view class="refund-detail-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">退款/售后</text>
			<view class="nav-right"></view>
		</view>

		<!-- 订单状态 -->
		<view class="status-section" :style="{ background: statusBgColor }">
			<view class="status-icon">{{ statusIcon }}</view>
			<view class="status-info">
				<text class="status-text">{{ statusText }}</text>
				<text class="status-desc">{{ statusDesc }}</text>
			</view>
		</view>

		<!-- 订单商品 -->
		<view class="goods-section">
			<view class="goods-item" v-for="(item, idx) in orderInfo.items" :key="idx">
				<image class="goods-img" :src="item.image || defaultImage" mode="aspectFill" />
				<view class="goods-detail">
					<text class="goods-name">{{ item.name }}</text>
					<text class="goods-spec">{{ item.spec || '默认规格' }}</text>
					<text class="goods-price">¥{{ item.price }} × {{ item.quantity }}</text>
				</view>
			</view>
		</view>

		<!-- 售后信息 -->
		<view class="info-section">
			<view class="info-row">
				<text class="info-label">订单编号</text>
				<text class="info-value">{{ orderInfo.id }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">申请时间</text>
				<text class="info-value">{{ orderInfo.createTime || '2024-01-01 00:00' }}</text>
			</view>
			<view class="info-row">
				<text class="info-label">退款金额</text>
				<text class="info-value" style="color:#D44C4C;font-weight:700;">¥{{ orderInfo.totalAmount }}</text>
			</view>
			<view class="info-row" v-if="refundReason">
				<text class="info-label">退款原因</text>
				<text class="info-value">{{ refundReason }}</text>
			</view>
			<view class="info-row" v-if="refundDesc">
				<text class="info-label">退款说明</text>
				<text class="info-value">{{ refundDesc }}</text>
			</view>
		</view>

		<!-- 进度追踪 -->
		<view class="progress-section">
			<view class="section-title">处理进度</view>
			<view class="progress-steps">
				<view class="step" :class="{ active: progressStep >= 1 }">
					<view class="step-dot"><text v-if="progressStep >= 1">✓</text></view>
					<text class="step-label">提交申请</text>
				</view>
				<view class="step-line" :class="{ active: progressStep >= 2 }"></view>
				<view class="step" :class="{ active: progressStep >= 2 }">
					<view class="step-dot"><text v-if="progressStep >= 2">✓</text></view>
					<text class="step-label">商家审核</text>
				</view>
				<view class="step-line" :class="{ active: progressStep >= 3 }"></view>
				<view class="step" :class="{ active: progressStep >= 3 }">
					<view class="step-dot"><text v-if="progressStep >= 3">✓</text></view>
					<text class="step-label">退款完成</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="btn-group">
				<view class="btn btn-secondary" @click="contactService">联系客服</view>
				<view class="btn btn-danger" @click="cancelRefund" v-if="isRefunding">撤销申请</view>
				<view class="btn btn-primary" @click="goOrderDetail">查看订单</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

const defaultImage = 'https://via.placeholder.com/200/FFE5B4/8B5A2B?text=Pet'

const orderInfo = ref({
	id: '',
	totalAmount: 0,
	items: []
})

const refundReason = ref('')
const refundDesc = ref('')
const progressStep = ref(1)

// ---- 状态判断 ----
const isRefunding = computed(() => orderInfo.value.status === 'refunding')
const isRefunded = computed(() => orderInfo.value.status === 'refunded')

// ---- 状态显示 ----
const statusIconMap = {
	'refunding': '⏳',
	'refunded': '✅',
	'rejected': '❌'
}

const statusTextMap = {
	'refunding': '退款处理中',
	'refunded': '已退款',
	'rejected': '已拒绝'
}

const statusDescMap = {
	'refunding': '商家正在审核您的退款申请，请耐心等待',
	'refunded': '退款已完成，金额已原路返回',
	'rejected': '退款申请已被拒绝，如有疑问请联系客服'
}

const statusBgMap = {
	'refunding': 'linear-gradient(135deg, #FFF3CD, #FFE082)',
	'refunded': 'linear-gradient(135deg, #D4EDDA, #81C784)',
	'rejected': 'linear-gradient(135deg, #FFE0E0, #EF9A9A)'
}

const statusIcon = computed(() => statusIconMap[orderInfo.value.status] || '📋')
const statusText = computed(() => statusTextMap[orderInfo.value.status] || '退款/售后')
const statusDesc = computed(() => statusDescMap[orderInfo.value.status] || '')
const statusBgColor = computed(() => statusBgMap[orderInfo.value.status] || '#F5F5F5')

onLoad((options) => {
	if (options.order) {
		try {
			const data = JSON.parse(decodeURIComponent(options.order))
			orderInfo.value = data
			refundReason.value = data.refundReason || '商品质量问题'
			refundDesc.value = data.refundDesc || ''
			// 根据状态设置进度
			if (data.status === 'refunding') progressStep.value = 2
			else if (data.status === 'refunded') progressStep.value = 3
			else progressStep.value = 1
		} catch (e) {
			uni.showToast({ title: '订单信息错误', icon: 'none' })
		}
	}
})

const goBack = () => {
	uni.navigateBack()
}

const contactService = () => {
	uni.showToast({ title: '连接客服中...', icon: 'none' })
}

const cancelRefund = () => {
	uni.showModal({
		title: '撤销申请',
		content: '确定要撤销退款申请吗？',
		success: (res) => {
			if (res.confirm) {
				const app = getApp()
				const globalData = app.globalData || {}
				if (globalData.updateOrderStatus) {
					globalData.updateOrderStatus(orderInfo.value.id, 'shipping')
				}
				uni.showToast({ title: '已撤销申请', icon: 'success' })
				setTimeout(() => {
					uni.navigateBack()
				}, 500)
			}
		}
	})
}

const goOrderDetail = () => {
	uni.navigateTo({
		url: `/pages/mine/my-orders/order-detail/order-detail?id=${orderInfo.value.id}`
	})
}
</script>

<style lang="scss" scoped>
.refund-detail-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 140rpx;
}

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

.goods-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.goods-item {
	display: flex;
	gap: 16rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.goods-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 8rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.goods-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4rpx;
}

.goods-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.goods-spec {
	font-size: 22rpx;
	color: #999;
}

.goods-price {
	font-size: 24rpx;
	color: #D44C4C;
}

.info-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.info-row {
	display: flex;
	justify-content: space-between;
	padding: 10rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 26rpx;
	color: #999;
}

.info-value {
	font-size: 26rpx;
	color: #333;
}

.progress-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 20rpx;
}

.progress-steps {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8rpx;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	flex: 1;
}

.step-dot {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border: 3rpx solid #D0D0D0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: #D0D0D0;
	transition: all 0.3s;
}

.step.active .step-dot {
	background: #D49A55;
	border-color: #D49A55;
	color: #fff;
}

.step-label {
	font-size: 22rpx;
	color: #999;
	text-align: center;
}

.step.active .step-label {
	color: #D49A55;
	font-weight: 500;
}

.step-line {
	flex: 1;
	height: 3rpx;
	background: #D0D0D0;
	margin: 0 8rpx;
	transform: translateY(-20rpx);
}

.step-line.active {
	background: #D49A55;
}

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
	font-size: 28rpx;
	font-weight: 600;
	transition: transform 0.2s;

	&:active {
		transform: scale(0.96);
	}
}

.btn-primary {
	background: linear-gradient(135deg, #D49A55, #B8860B);
	color: #fff;
}

.btn-secondary {
	background: #F5F4F0;
	color: #666;
}

.btn-danger {
	background: #FFF0F0;
	color: #E64340;
	border: 1rpx solid #FFCDD2;
}
</style>