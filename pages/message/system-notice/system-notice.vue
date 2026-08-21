<template>
	<view class="notice-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">系统通知</text>
			<view class="nav-right"></view>
		</view>

		<view class="notice-list">
			<view class="notice-item" v-for="(item, idx) in noticeList" :key="idx">
				<view class="notice-icon" :style="{ background: item.bgColor }">
					<text>{{ item.icon }}</text>
				</view>
				<view class="notice-content">
					<text class="notice-title">{{ item.title }}</text>
					<text class="notice-desc">{{ item.desc }}</text>
					<text class="notice-time">{{ item.time }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const noticeList = ref([{
			icon: '🎉',
			title: '欢迎加入宠物领养平台',
			desc: '感谢您注册宠物领养平台，让我们一起为毛孩子寻找温暖的家',
			time: '2024-12-15 10:00',
			bgColor: '#FFE08A'
		},
		{
			icon: '📢',
			title: '平台服务升级通知',
			desc: '宠物领养平台将于12月20日进行系统升级，届时部分功能可能受影响',
			time: '2024-12-14 14:30',
			bgColor: '#A4C7E8'
		},
		{
			icon: '💡',
			title: '养宠小贴士',
			desc: '冬季宠物保暖注意事项：室内温度保持22-25°C，外出注意保暖',
			time: '2024-12-13 09:00',
			bgColor: '#B8E0D2'
		}
	])

	const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
	.notice-page {
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

	.notice-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.notice-item {
		display: flex;
		align-items: flex-start;
		gap: 16rpx;
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.notice-icon {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		flex-shrink: 0;
	}

	.notice-content {
		flex: 1;
	}

	.notice-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
	}

	.notice-desc {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-top: 4rpx;
	}

	.notice-time {
		font-size: 20rpx;
		color: #999;
		display: block;
		margin-top: 8rpx;
	}
</style>