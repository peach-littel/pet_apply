<template>
	<view class="order-msg-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">订单消息</text>
			<view class="nav-right"></view>
		</view>

		<!-- 状态筛选 -->
		<view class="filter-tabs">
			<view class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">全部
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'pending' }"
				@click="currentFilter = 'pending'">待付款</view>
			<view class="filter-item" :class="{ active: currentFilter === 'shipping' }"
				@click="currentFilter = 'shipping'">待发货</view>
			<view class="filter-item" :class="{ active: currentFilter === 'received' }"
				@click="currentFilter = 'received'">待收货</view>
		</view>

		<view class="order-list">
			<view class="order-item" v-for="(item, idx) in filteredList" :key="idx" @click="goOrderDetail(item)">
				<view class="order-header">
					<text class="order-id">订单号：{{ item.orderId }}</text>
					<text class="order-status" :style="{ color: getStatusColor(item.status) }">
						{{ getStatusText(item.status) }}
					</text>
				</view>
				<view class="order-product">
					<image class="product-img" :src="item.productImage" mode="aspectFill" />
					<view class="product-info">
						<text class="product-name">{{ item.productName }}</text>
						<text class="product-qty">×{{ item.quantity }}</text>
					</view>
				</view>
				<view class="order-footer">
					<text class="order-amount">¥{{ item.totalAmount }}</text>
					<text class="order-time">{{ item.time }}</text>
				</view>
			</view>
		</view>

		<view v-if="filteredList.length === 0" class="empty-state">
			<text class="empty-icon">📦</text>
			<text class="empty-text">暂无订单消息</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'

	const currentFilter = ref('all')

	// ---- 从全局获取订单数据 ----
	const getOrderData = () => {
		const app = getApp()
		const globalData = app.globalData || {}
		return globalData.orders || []
	}

	const orderList = ref([])

	const updateList = () => {
		const data = getOrderData()
		orderList.value = data.map(item => ({
			orderId: item.id,
			status: item.status,
			productName: item.items && item.items.length > 0 ? item.items[0].name : '商品',
			productImage: item.items && item.items.length > 0 ? item.items[0].image :
				'https://picsum.photos/id/292/100/100',
			quantity: item.items ? item.items.reduce((sum, i) => sum + i.quantity, 0) : 1,
			totalAmount: item.totalAmount,
			time: item.createTime || new Date().toLocaleString()
		}))
	}

	const filteredList = computed(() => {
		if (currentFilter.value === 'all') return orderList.value
		return orderList.value.filter(item => item.status === currentFilter.value)
	})

	const getStatusText = (status) => {
		const map = {
			pending: '待付款',
			shipping: '待发货',
			received: '待收货',
			completed: '已完成'
		}
		return map[status] || status
	}

	const getStatusColor = (status) => {
		const map = {
			pending: '#FF6B6B',
			shipping: '#F5A623',
			received: '#4ECDC4',
			completed: '#999'
		}
		return map[status] || '#999'
	}

	const goBack = () => uni.navigateBack()

	const goOrderDetail = (item) => {
		uni.navigateTo({
			url: `/pages/orders/order-detail/order-detail?id=${item.orderId}`
		})
	}

	onShow(() => {
		updateList()
	})
</script>

<style lang="scss" scoped>
	.order-msg-page {
		min-height: 100vh;
		background: #F5F5F5;
		padding-bottom: 40rpx;
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

	.filter-tabs {
		display: flex;
		background: #FFFFFF;
		padding: 16rpx 32rpx;
		gap: 24rpx;
		border-bottom: 1rpx solid #F0EDE8;
	}

	.filter-item {
		font-size: 26rpx;
		color: #666;
		padding: 8rpx 4rpx;
		position: relative;

		&.active {
			color: #D49A55;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				bottom: -4rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 20rpx;
				height: 4rpx;
				background: #D49A55;
				border-radius: 4rpx;
			}
		}
	}

	.order-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.order-item {
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.order-id {
		font-size: 24rpx;
		color: #999;
	}

	.order-status {
		font-size: 22rpx;
		font-weight: 500;
	}

	.order-product {
		display: flex;
		gap: 12rpx;
		align-items: center;
	}

	.product-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 8rpx;
		object-fit: cover;
		background: #F0EDE8;
	}

	.product-info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-name {
		font-size: 26rpx;
		color: #333;
	}

	.product-qty {
		font-size: 22rpx;
		color: #999;
	}

	.order-footer {
		display: flex;
		justify-content: space-between;
		margin-top: 12rpx;
		padding-top: 12rpx;
		border-top: 1rpx solid #F5F4F0;
	}

	.order-amount {
		font-size: 28rpx;
		font-weight: 700;
		color: #D44C4C;
	}

	.order-time {
		font-size: 20rpx;
		color: #999;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 0;
	}

	.empty-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
		opacity: 0.5;
	}

	.empty-text {
		font-size: 28rpx;
		color: #B0A8A0;
	}
</style>