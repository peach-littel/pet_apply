<template>
	<view class="pay-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">确认支付</text>
			<view class="nav-right"></view>
		</view>

		<!-- 订单信息 -->
		<view class="order-info">
			<view class="order-amount">
				<text class="amount-label">需支付</text>
				<text class="amount-value">¥{{ orderInfo.totalAmount }}</text>
			</view>
			<view class="order-detail">
				<text class="detail-item">订单号：{{ orderInfo.id }}</text>
				<text class="detail-item">商品：{{ orderInfo.items[0]?.name }} 等{{ orderInfo.items.length }}件商品</text>
			</view>
		</view>

		<!-- 支付方式 -->
		<view class="pay-methods">
			<view class="section-title">选择支付方式</view>
			<view 
				class="pay-method" 
				v-for="method in payMethods" 
				:key="method.id"
				@click="selectMethod(method.id)"
			>
				<view class="method-left">
					<text class="method-icon">{{ method.icon }}</text>
					<view class="method-info">
						<text class="method-name">{{ method.name }}</text>
						<text class="method-desc">{{ method.desc }}</text>
					</view>
				</view>
				<view class="method-check">
					<view class="radio" :class="{ checked: selectedMethod === method.id }">
						<text v-if="selectedMethod === method.id">✓</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="pay-btn" @click="confirmPay">
				<text>确认支付 ¥{{ orderInfo.totalAmount }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad} from '@dcloudio/uni-app'

const orderInfo = ref({
	id: '',
	totalAmount: 0,
	items: []
})

const payMethods = ref([
	{ id: 'wechat', name: '微信支付', icon: '💰', desc: '微信支付安全便捷' },
	{ id: 'alipay', name: '支付宝支付', icon: '💰', desc: '支付宝支付安全便捷' },
	{ id: 'balance', name: '余额支付', icon: '💰', desc: '当前余额 ¥0.00' }
])

const selectedMethod = ref('wechat')

onLoad((options) => {
	if (options.order) {
		try {
			orderInfo.value = JSON.parse(decodeURIComponent(options.order))
		} catch (e) {
			uni.showToast({ title: '订单信息错误', icon: 'none' })
		}
	}
})

const selectMethod = (id) => {
	selectedMethod.value = id
}

const confirmPay = () => {
	uni.showLoading({ title: '支付中...' })
	setTimeout(() => {
		uni.hideLoading()
		uni.showModal({
			title: '支付成功',
			content: '订单已支付成功，感谢您的购买！',
			showCancel: false,
			success: () => {
				// 更新订单状态
				const app = getApp()
				const globalData = app.globalData || {}
				if (globalData.updateOrderStatus) {
					globalData.updateOrderStatus(orderInfo.value.id, 'shipping')
				}
				uni.navigateBack()
			}
		})
	}, 1500)
}

const goBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.pay-page {
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

.order-info {
	background: #FFFFFF;
	margin: 20rpx 32rpx;
	padding: 32rpx;
	border-radius: 16rpx;
	text-align: center;
}

.order-amount {
	margin-bottom: 16rpx;
}

.amount-label {
	font-size: 28rpx;
	color: #666;
	display: block;
}

.amount-value {
	font-size: 56rpx;
	font-weight: 700;
	color: #D44C4C;
	display: block;
	margin-top: 8rpx;
}

.order-detail {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.detail-item {
	font-size: 24rpx;
	color: #999;
}

.pay-methods {
	background: #FFFFFF;
	margin: 0 32rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}

.pay-method {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.method-left {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.method-icon {
	font-size: 40rpx;
}

.method-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.method-name {
	font-size: 28rpx;
	color: #333;
}

.method-desc {
	font-size: 22rpx;
	color: #999;
}

.radio {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #D0D0D0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: #fff;

	&.checked {
		background: #D49A55;
		border-color: #D49A55;
	}
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

.pay-btn {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.3);
	transition: transform 0.2s;

	&:active {
		transform: scale(0.96);
	}
}
</style>