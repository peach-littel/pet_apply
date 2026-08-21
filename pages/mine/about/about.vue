<template>
	<view class="about-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">关于我们</text>
			<view class="nav-right"></view>
		</view>

		<view class="about-content">
			<view class="about-logo">🐾</view>
			<text class="app-name">宠物领养平台</text>
			<text class="app-version">版本 1.0.0</text>
			<view class="about-desc">
				<text>致力于为流浪动物寻找温暖的家</text>
				<text>让每一只毛孩子都能被温柔以待</text>
			</view>
		</view>

		<view class="about-list">
			<view class="about-item" @click="goService">
				<text class="item-label">用户协议</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="about-item" @click="goPrivacy">
				<text class="item-label">隐私政策</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="about-item" @click="goFeedback">
				<text class="item-label">意见反馈</text>
				<text class="item-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	const goBack = () => uni.navigateBack()
	const goService = () => uni.showToast({
		title: '用户协议',
		icon: 'none'
	})
	const goPrivacy = () => uni.showToast({
		title: '隐私政策',
		icon: 'none'
	})
	const goFeedback = () => uni.showToast({
		title: '意见反馈',
		icon: 'none'
	})
</script>

<style lang="scss" scoped>
	.about-page {
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

	.about-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 32rpx;
	}

	.about-logo {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.app-name {
		font-size: 40rpx;
		font-weight: 700;
		color: #1A1A1A;
	}

	.app-version {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.about-desc {
		text-align: center;
		margin-top: 40rpx;
	}

	.about-desc text {
		display: block;
		font-size: 28rpx;
		color: #666;
		line-height: 2;
	}

	.about-list {
		margin: 20rpx 32rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.about-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 24rpx;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}

		&:active {
			background: #F9F7F4;
		}
	}

	.item-label {
		font-size: 28rpx;
		color: #333;
	}

	.item-arrow {
		font-size: 32rpx;
		color: #CCC;
	}
</style>