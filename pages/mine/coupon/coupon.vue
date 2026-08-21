<template>
	<view class="coupon-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">优惠券</text>
			<view class="nav-right"></view>
		</view>

		<view class="coupon-tabs">
			<view class="tab-item" :class="{ active: currentTab === 'available' }" @click="currentTab = 'available'">可用
			</view>
			<view class="tab-item" :class="{ active: currentTab === 'used' }" @click="currentTab = 'used'">已使用</view>
			<view class="tab-item" :class="{ active: currentTab === 'expired' }" @click="currentTab = 'expired'">已过期
			</view>
		</view>

		<view class="coupon-list">
			<view class="coupon-card" v-for="item in filteredCoupons" :key="item.id">
				<view class="coupon-left">
					<text class="coupon-amount">¥{{ item.amount }}</text>
					<text class="coupon-condition">{{ item.condition }}</text>
				</view>
				<view class="coupon-right">
					<text class="coupon-name">{{ item.name }}</text>
					<text class="coupon-time">有效期至 {{ item.expire }}</text>
					<view class="coupon-status" :class="item.status">{{ getStatusText(item.status) }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	const currentTab = ref('available')

	const couponList = ref([{
			id: 1,
			amount: 20,
			condition: '满100可用',
			name: '新用户专享券',
			expire: '2024-12-31',
			status: 'available'
		},
		{
			id: 2,
			amount: 10,
			condition: '满50可用',
			name: '宠物用品券',
			expire: '2024-12-20',
			status: 'available'
		},
		{
			id: 3,
			amount: 30,
			condition: '满200可用',
			name: '领养大礼包券',
			expire: '2024-12-10',
			status: 'used'
		},
		{
			id: 4,
			amount: 50,
			condition: '满300可用',
			name: '双十二狂欢券',
			expire: '2024-12-01',
			status: 'expired'
		}
	])

	const filteredCoupons = computed(() => {
		if (currentTab.value === 'available') return couponList.value.filter(c => c.status === 'available')
		if (currentTab.value === 'used') return couponList.value.filter(c => c.status === 'used')
		return couponList.value.filter(c => c.status === 'expired')
	})

	const getStatusText = (status) => {
		const map = {
			available: '可使用',
			used: '已使用',
			expired: '已过期'
		}
		return map[status] || status
	}

	const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
	.coupon-page {
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

	.coupon-tabs {
		display: flex;
		background: #FFFFFF;
		padding: 16rpx 32rpx;
		gap: 32rpx;
		border-bottom: 1rpx solid #F0EDE8;
	}

	.tab-item {
		font-size: 28rpx;
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
				width: 24rpx;
				height: 4rpx;
				background: #D49A55;
				border-radius: 4rpx;
			}
		}
	}

	.coupon-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.coupon-card {
		display: flex;
		background: #FFFFFF;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.coupon-left {
		width: 160rpx;
		background: linear-gradient(135deg, #FFE8D0, #FDDCB5);
		padding: 24rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.coupon-amount {
		font-size: 48rpx;
		font-weight: 800;
		color: #D44C4C;
	}

	.coupon-condition {
		font-size: 20rpx;
		color: #666;
		margin-top: 4rpx;
	}

	.coupon-right {
		flex: 1;
		padding: 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.coupon-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.coupon-time {
		font-size: 22rpx;
		color: #999;
		margin-top: 4rpx;
	}

	.coupon-status {
		align-self: flex-start;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
		margin-top: 8rpx;

		&.available {
			background: #D4EDDA;
			color: #155724;
		}

		&.used {
			background: #D1ECF1;
			color: #0C5460;
		}

		&.expired {
			background: #F8D7DA;
			color: #721C24;
		}
	}
</style>