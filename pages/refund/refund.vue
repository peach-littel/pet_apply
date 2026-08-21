<template>
	<view class="refund-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">申请退款</text>
			<view class="nav-right"></view>
		</view>

		<!-- 订单商品 -->
		<view class="order-info">
			<view class="order-item" v-for="(item, idx) in orderInfo.items" :key="idx">
				<image class="item-img" :src="item.image || defaultImage" mode="aspectFill" />
				<view class="item-detail">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-spec">{{ item.spec || '默认规格' }}</text>
					<text class="item-price">¥{{ item.price }} × {{ item.quantity }}</text>
				</view>
			</view>
			<view class="order-total">
				<text class="total-label">订单金额：</text>
				<text class="total-amount">¥{{ orderInfo.totalAmount }}</text>
			</view>
		</view>

		<!-- 退款原因 -->
		<view class="form-section">
			<view class="section-title">退款原因</view>
			<view class="reason-list">
				<view 
					class="reason-item" 
					v-for="reason in reasonOptions" 
					:key="reason"
					:class="{ active: selectedReason === reason }"
					@click="selectedReason = reason"
				>
					<text>{{ reason }}</text>
				</view>
			</view>
		</view>

		<!-- 退款说明 -->
		<view class="form-section">
			<view class="section-title">退款说明</view>
			<textarea 
				class="refund-desc" 
				v-model="refundDesc" 
				placeholder="请详细描述退款原因（选填）"
				maxlength="200"
			/>
			<text class="char-count">{{ refundDesc.length }}/200</text>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="submit-btn" @click="submitRefund">
				<text>提交退款申请</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad} from '@dcloudio/uni-app'

const defaultImage = 'https://via.placeholder.com/200/FFE5B4/8B5A2B?text=Pet'

const orderInfo = ref({
	id: '',
	totalAmount: 0,
	items: []
})

const reasonOptions = ref([
	'不想要了',
	'商品与描述不符',
	'质量问题',
	'发错商品',
	'物流太慢',
	'其他原因'
])

const selectedReason = ref('')
const refundDesc = ref('')

onLoad((options) => {
	if (options.order) {
		try {
			orderInfo.value = JSON.parse(decodeURIComponent(options.order))
		} catch (e) {
			uni.showToast({ title: '订单信息错误', icon: 'none' })
		}
	}
})

const submitRefund = () => {
	if (!selectedReason.value) {
		uni.showToast({ title: '请选择退款原因', icon: 'none' })
		return
	}

	uni.showLoading({ title: '提交中...' })
	setTimeout(() => {
		uni.hideLoading()
		
		// 更新订单状态为退款中
		const app = getApp()
		const globalData = app.globalData || {}
		if (globalData.updateOrderStatus) {
			globalData.updateOrderStatus(orderInfo.value.id, 'refunding')
		}
		
		uni.showModal({
			title: '申请已提交',
			content: '退款申请已提交，请耐心等待商家处理。',
			showCancel: false,
			success: () => {
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
.refund-page {
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
	padding: 24rpx;
	border-radius: 16rpx;
}

.order-item {
	display: flex;
	gap: 16rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-of-type {
		border-bottom: none;
	}
}

.item-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 8rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.item-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4rpx;
}

.item-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.item-spec {
	font-size: 22rpx;
	color: #999;
}

.item-price {
	font-size: 24rpx;
	color: #D44C4C;
}

.order-total {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding-top: 16rpx;
	margin-top: 12rpx;
	border-top: 1rpx solid #F5F4F0;
}

.total-label {
	font-size: 26rpx;
	color: #666;
}

.total-amount {
	font-size: 32rpx;
	font-weight: 700;
	color: #D44C4C;
}

.form-section {
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
	margin-bottom: 16rpx;
}

.reason-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.reason-item {
	padding: 12rpx 28rpx;
	background: #F5F5F5;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.2s;

	&.active {
		background: #FFF5E4;
		border-color: #D49A55;
		color: #D49A55;
	}
}

.refund-desc {
	width: 100%;
	height: 160rpx;
	background: #F8F8F8;
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	font-size: 28rpx;
	color: #333;
	box-sizing: border-box;
}

.char-count {
	display: block;
	text-align: right;
	font-size: 22rpx;
	color: #999;
	margin-top: 8rpx;
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

.submit-btn {
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