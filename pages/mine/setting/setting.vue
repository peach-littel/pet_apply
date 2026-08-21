<template>
	<view class="setting-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">设置</text>
			<view class="nav-right"></view>
		</view>

		<view class="setting-list">
			<view class="setting-item" @click="goEditProfile">
				<text class="item-icon">👤</text>
				<text class="item-label">个人资料</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="setting-item" @click="goAddress">
				<text class="item-icon">📍</text>
				<text class="item-label">收货地址管理</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="setting-item" @click="goNotification">
				<text class="item-icon">🔔</text>
				<text class="item-label">消息通知</text>
				<view class="item-switch"><text class="switch-on">开</text></view>
			</view>
			<view class="setting-item" @click="goPrivacy">
				<text class="item-icon">🔒</text>
				<text class="item-label">隐私设置</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="setting-item" @click="goClearCache">
				<text class="item-icon">🧹</text>
				<text class="item-label">清除缓存</text>
				<text class="item-value">12.5MB</text>
				<text class="item-arrow">›</text>
			</view>
			<view class="setting-item" @click="goAbout">
				<text class="item-icon">ℹ️</text>
				<text class="item-label">关于我们</text>
				<text class="item-arrow">›</text>
			</view>
		</view>

		<view class="logout-btn" @click="handleLogout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script setup>
const goBack = () => uni.navigateBack()

const goEditProfile = () => uni.navigateTo({
	url: '/pages/mine/setting/profile/profile'
})

const goAddress = () => uni.navigateTo({
	url: '/pages/mine/address/address'
})

const goNotification = () => uni.navigateTo({
	url: '/pages/mine/setting/notification/notification'
})

const goPrivacy = () => uni.navigateTo({
	url: '/pages/mine/setting/privacy/privacy'
})

const goClearCache = () => uni.showToast({
	title: '缓存已清除',
	icon: 'success'
})

const goAbout = () => uni.navigateTo({
	url: '/pages/mine/about/about'
})

// ---- 退出登录 ----
const handleLogout = () => {
	uni.showModal({
		title: '确认退出',
		content: '确定要退出登录吗？',
		success: (res) => {
			if (res.confirm) {
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				})
				// ✅ 使用 reLaunch 跳转到登录页
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 1500)
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.setting-page {
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

.setting-list {
	margin: 20rpx 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
}

.setting-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.item-icon {
	font-size: 32rpx;
	margin-right: 16rpx;
}

.item-label {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.item-value {
	font-size: 24rpx;
	color: #999;
	margin-right: 8rpx;
}

.item-arrow {
	font-size: 32rpx;
	color: #CCC;
}

.item-switch {
	font-size: 24rpx;
	color: #4ECDC4;
}

.logout-btn {
	margin: 40rpx 32rpx;
	height: 88rpx;
	background: #FFFFFF;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #FF6B6B;
	font-size: 30rpx;
	font-weight: 600;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
</style>