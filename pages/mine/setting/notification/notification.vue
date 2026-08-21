<template>
	<view class="notification-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">消息通知</text>
			<view class="nav-right"></view>
		</view>

		<view class="notification-list">
			<view class="notification-item" v-for="item in notifyList" :key="item.id">
				<view class="notify-info">
					<text class="notify-icon">{{ item.icon }}</text>
					<view class="notify-detail">
						<text class="notify-title">{{ item.title }}</text>
						<text class="notify-desc">{{ item.desc }}</text>
					</view>
				</view>
				<view class="notify-switch" @click="toggleSwitch(item)">
					<view class="switch-track" :class="{ active: item.enabled }">
						<view class="switch-thumb" :class="{ active: item.enabled }"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const notifyList = ref([{
			id: 1,
			icon: '📢',
			title: '系统通知',
			desc: '平台公告、活动推送',
			enabled: true
		},
		{
			id: 2,
			icon: '🐾',
			title: '领养动态',
			desc: '领养申请进度通知',
			enabled: true
		},
		{
			id: 3,
			icon: '📦',
			title: '订单消息',
			desc: '订单状态变更提醒',
			enabled: true
		},
		{
			id: 4,
			icon: '💬',
			title: '客服消息',
			desc: '客服回复通知',
			enabled: false
		},
		{
			id: 5,
			icon: '🎉',
			title: '活动推送',
			desc: '优惠活动、福利通知',
			enabled: false
		}
	])

	const goBack = () => uni.navigateBack()

	const toggleSwitch = (item) => {
		item.enabled = !item.enabled
		uni.showToast({
			title: item.enabled ? '已开启' : '已关闭',
			icon: 'none'
		})
	}
</script>

<style lang="scss" scoped>
	.notification-page {
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
		font-size:70rpx;
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

	.notification-list {
		margin: 20rpx 32rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.notification-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 24rpx;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.notify-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
		flex: 1;
	}

	.notify-icon {
		font-size: 32rpx;
	}

	.notify-detail {
		flex: 1;
	}

	.notify-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #1A1A1A;
		display: block;
	}

	.notify-desc {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	.notify-switch {
		flex-shrink: 0;
	}

	.switch-track {
		width: 88rpx;
		height: 48rpx;
		background: #E0E0E0;
		border-radius: 24rpx;
		position: relative;
		transition: background 0.3s;

		&.active {
			background: #D49A55;
		}
	}

	.switch-thumb {
		width: 40rpx;
		height: 40rpx;
		background: #FFFFFF;
		border-radius: 50%;
		position: absolute;
		top: 4rpx;
		left: 4rpx;
		transition: left 0.3s;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

		&.active {
			left: 44rpx;
		}
	}
</style>