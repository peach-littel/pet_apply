<template>
	<view class="service-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">客服消息</text>
			<view class="nav-right"></view>
		</view>

		<view class="service-list">
			<view class="service-item" v-for="(item, idx) in serviceList" :key="idx" @click="goChat(item)">
				<image class="service-avatar" :src="item.avatar" mode="aspectFill" />
				<view class="service-info">
					<view class="service-header">
						<text class="service-name">{{ item.name }}</text>
						<text class="service-time">{{ item.time }}</text>
					</view>
					<text class="service-last">{{ item.lastMsg }}</text>
				</view>
				<view class="service-badge" v-if="item.unread > 0">{{ item.unread }}</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const serviceList = ref([{
			id: 1,
			name: '在线客服',
			avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
			lastMsg: '您好，请问有什么可以帮您？',
			time: '10:30',
			unread: 1
		},
		{
			id: 2,
			name: '售后客服',
			avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
			lastMsg: '您的退换货申请已处理',
			time: '昨天',
			unread: 0
		}
	])

	const goBack = () => uni.navigateBack()

	const goChat = (item) => {
		uni.navigateTo({
			url: `/pages/message/chat/chat?chatId=${item.id}&name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.avatar)}&type=service`
		})
	}
</script>

<style lang="scss" scoped>
	.service-page {
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

	.service-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.service-item {
		display: flex;
		align-items: center;
		gap: 16rpx;
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		position: relative;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}
	}

	.service-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		object-fit: cover;
		background: #F0EDE8;
	}

	.service-info {
		flex: 1;
	}

	.service-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.service-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.service-time {
		font-size: 20rpx;
		color: #999;
	}

	.service-last {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-top: 4rpx;
	}

	.service-badge {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		min-width: 32rpx;
		height: 32rpx;
		background: #E64340;
		color: #fff;
		font-size: 20rpx;
		border-radius: 16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 8rpx;
	}
</style>