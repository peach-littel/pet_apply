<template>
	<view class="privacy-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">隐私设置</text>
			<view class="nav-right"></view>
		</view>

		<view class="privacy-list">
			<view class="privacy-item" v-for="item in privacyList" :key="item.id">
				<view class="privacy-info">
					<text class="privacy-icon">{{ item.icon }}</text>
					<view class="privacy-detail">
						<text class="privacy-title">{{ item.title }}</text>
						<text class="privacy-desc">{{ item.desc }}</text>
					</view>
				</view>
				<view class="privacy-switch" @click="toggleSwitch(item)">
					<view class="switch-track" :class="{ active: item.enabled }">
						<view class="switch-thumb" :class="{ active: item.enabled }"></view>
					</view>
				</view>
			</view>

			<view class="privacy-item" @click="clearData">
				<text class="privacy-icon">🗑️</text>
				<view class="privacy-detail">
					<text class="privacy-title">清除个人数据</text>
					<text class="privacy-desc">清除所有个人数据和缓存</text>
				</view>
				<text class="privacy-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const privacyList = ref([{
			id: 1,
			icon: '👤',
			title: '公开个人资料',
			desc: '允许其他人查看您的公开资料',
			enabled: true
		},
		{
			id: 2,
			icon: '📱',
			title: '允许搜索到我的账号',
			desc: '通过手机号可以搜索到您',
			enabled: true
		},
		{
			id: 3,
			icon: '🤝',
			title: '领养信息可见',
			desc: '允许其他人查看您的领养记录',
			enabled: false
		},
		{
			id: 4,
			icon: '🛒',
			title: '购物记录可见',
			desc: '允许其他人查看您的购物记录',
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

	const clearData = () => {
		uni.showModal({
			title: '确认清除',
			content: '确定要清除所有个人数据吗？此操作不可恢复。',
			success: (res) => {
				if (res.confirm) {
					uni.showToast({
						title: '已清除',
						icon: 'success'
					})
				}
			}
		})
	}
</script>

<style lang="scss" scoped>
	.privacy-page {
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

	.privacy-list {
		margin: 20rpx 32rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.privacy-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24rpx 24rpx;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.privacy-info {
		display: flex;
		align-items: center;
		gap: 16rpx;
		flex: 1;
	}

	.privacy-icon {
		font-size: 32rpx;
	}

	.privacy-detail {
		flex: 1;
	}

	.privacy-title {
		font-size: 28rpx;
		font-weight: 500;
		color: #1A1A1A;
		display: block;
	}

	.privacy-desc {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	.privacy-arrow {
		font-size: 32rpx;
		color: #CCC;
	}

	.privacy-switch {
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