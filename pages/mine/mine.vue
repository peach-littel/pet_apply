<template>
	<view class="mine-page">
		<!-- 顶部用户信息区 -->
		<view class="user-header">
			<view class="header-bg"></view>
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
				<view class="user-detail">
					<text class="user-name">{{ userInfo.nickname }}</text>
					<text class="user-id">ID: 88520666</text>
				</view>
				<view class="setting-btn" @click="goSetting">
					<text>⚙️</text>
				</view>
			</view>
			<!-- 数据统计（动态获取） -->
			<view class="stats-row">
				<view class="stat-item" @click="goMyAdopt">
					<text class="stat-num">{{ userStats.adopt }}</text>
					<text class="stat-label">我的领养</text>
				</view>
				<view class="stat-item" @click="goMyFavorite">
					<text class="stat-num">{{ userStats.favorite }}</text>
					<text class="stat-label">我的收藏</text>
				</view>
				<view class="stat-item" @click="goMyOrder">
					<text class="stat-num">{{ userStats.order }}</text>
					<text class="stat-label">我的订单</text>
				</view>
				<view class="stat-item" @click="goMyPoints">
					<text class="stat-num">{{ userStats.points }}</text>
					<text class="stat-label">积分</text>
				</view>
			</view>
		</view>

		<!-- 我的订单 -->
		<view class="order-section">
			<view class="section-header">
				<text class="section-title">我的订单</text>
				<view class="section-more" @click="goMyOrder">
					<text>全部订单</text>
					<text class="arrow">›</text>
				</view>
			</view>
			<view class="order-tabs">
				<view class="order-tab" v-for="item in orderTabs" :key="item.value" @click="goOrderList(item.value)">
					<view class="tab-icon">
						<text>{{ item.icon }}</text>
						<view class="badge" v-if="item.badge > 0">{{ item.badge }}</view>
					</view>
					<text class="tab-label">{{ item.label }}</text>
				</view>
			</view>
		</view>

		<!-- 我的领养 -->
		<view class="adopt-section">
			<view class="section-header">
				<text class="section-title">我的领养</text>
				<view class="section-more" @click="goMyAdopt">
					<text>查看全部</text>
					<text class="arrow">›</text>
				</view>
			</view>
			<view class="adopt-list">
				<view class="adopt-card" v-for="item in myAdoptList" :key="item.id">
					<image class="adopt-img" :src="item.avatar" mode="aspectFill" />
					<view class="adopt-info">
						<text class="adopt-name">{{ item.name }}</text>
						<text class="adopt-status" :class="item.statusClass">{{ item.status }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-item" v-for="item in menuList" :key="item.id" @click="handleMenu(item)">
				<text class="menu-icon">{{ item.icon }}</text>
				<text class="menu-text">{{ item.name }}</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue'
	import { onShow } from '@dcloudio/uni-app'

	//  获取全局数据 
	const app = getApp()
	const globalData = app.globalData || {}

	//  用户信息（从全局读取） 
	const userInfo = ref({
		avatar: '/pages/static/image/user.png',
		nickname: '铲屎官小雅'
	})

	//  更新用户信息 
	const updateUserInfo = () => {
		if (globalData.userInfo) {
			userInfo.value = {
				...userInfo.value,
				...globalData.userInfo.value
			}
		}
	}

	//  统计数据（动态计算） 
	const userStats = ref({
		adopt: 0,
		favorite: 0,
		order: 0,
		points: 1280
	})

	// 更新统计数据（排除已取消和已拒绝） 
	const updateStats = () => {
		// 1. 领养统计：统计所有有效申请（排除已取消和已拒绝）
		const adoptApps = globalData.adoptApplications?.value || []
		const validAdopts = adoptApps.filter(item => 
			item.status !== 'cancelled' && item.status !== 'rejected'
		)
		userStats.value.adopt = validAdopts.length

		// 2. 收藏统计
		const favorites = globalData.favorites?.value || []
		userStats.value.favorite = favorites.length

		// 3. 订单统计
		const orders = globalData.orders?.value || []
		const validOrders = orders.filter(item =>
			item.status !== 'cancelled' && item.status !== 'refunded'
		)
		userStats.value.order = validOrders.length
	}

	//  页面显示时更新 
	onShow(() => {
		updateUserInfo()
		updateStats()
	})

	//  订单Tab（动态显示徽标） 
	const orderTabs = ref([
		{ label: '待付款', value: 'pending', icon: '💰', badge: 0 },
		{ label: '待发货', value: 'shipping', icon: '📦', badge: 0 },
		{ label: '待收货', value: 'received', icon: '🚚', badge: 0 },
		{ label: '待评价', value: 'comment', icon: '⭐', badge: 0 },
		{ label: '退款/售后', value: 'refund', icon: '🔄', badge: 0 }
	])

	//  更新订单徽标 
	const updateOrderBadges = () => {
		const orders = globalData.orders?.value || []
		const readStatus = uni.getStorageSync('order_read_status') || {}
		
		orderTabs.value.forEach(tab => {
			const totalCount = orders.filter(o => o.status === tab.value).length
			const readIds = readStatus[tab.value] || []
			const unreadCount = totalCount - readIds.length
			tab.badge = unreadCount > 0 ? unreadCount : 0
		})
	}

	//  标记订单状态为已读 
	const markOrderStatusAsRead = (status) => {
		const orders = globalData.orders?.value || []
		const readStatus = uni.getStorageSync('order_read_status') || {}
		
		const orderIds = orders
			.filter(o => o.status === status)
			.map(o => o.id)
		
		const existingRead = readStatus[status] || []
		const merged = [...new Set([...existingRead, ...orderIds])]
		
		readStatus[status] = merged
		uni.setStorageSync('order_read_status', readStatus)
		updateOrderBadges()
	}

	//  点击订单Tab时标记为已读 
	const goOrderList = (type) => {
		markOrderStatusAsRead(type)
		uni.navigateTo({
			url: `/pages/mine/my-orders/my-orders?status=${type}`
		})
	}

	//  我的领养列表（从全局获取，显示前3个有效申请） 
	const myAdoptList = ref([])

	// 更新领养列表（排除已取消和已拒绝） 
	const updateAdoptList = () => {
		const adoptApps = globalData.adoptApplications?.value || []
		// 排除已取消和已拒绝的
		const validApps = adoptApps.filter(item => 
			item.status !== 'cancelled' && item.status !== 'rejected'
		)
		const displayItems = validApps.slice(0, 3)
		myAdoptList.value = displayItems.map(item => ({
			id: item.id,
			name: item.petName,
			status: item.status === 'pending' ? '审核中' : 
					item.status === 'approved' ? '领养中' : 
					item.status === 'active' ? '领养中' : '已完成',
			statusClass: item.status === 'pending' ? 'status-pending' : 
						 item.status === 'approved' ? 'status-active' : 
						 item.status === 'active' ? 'status-active' : 'status-completed',
			avatar: item.petAvatar || 'https://picsum.photos/id/40/200/200'
		}))
	}

	//  页面显示时更新所有数据 
	onShow(() => {
		updateUserInfo()
		updateStats()
		updateOrderBadges()
		updateAdoptList()
	})

	//  跳转方法 
	const goSetting = () => {
		uni.navigateTo({ url: '/pages/mine/setting/setting' })
	}
	const goMyAdopt = () => {
		uni.navigateTo({ url: '/pages/mine/my-adopt/my-adopt' })
	}
	const goMyFavorite = () => {
		uni.navigateTo({ url: '/pages/mine/my-favorite/my-favorite' })
	}
	const goMyOrder = () => {
		const statuses = ['pending', 'shipping', 'received', 'comment', 'refund']
		statuses.forEach(status => markOrderStatusAsRead(status))
		uni.navigateTo({ url: '/pages/mine/my-orders/my-orders' })
	}
	const goMyPoints = () => {
		uni.navigateTo({ url: '/pages/mine/points-center/points-center' })
	}

	const handleMenu = (item) => {
		if (item.path) {
			uni.navigateTo({ url: item.path })
		} else {
			uni.showToast({ title: item.name, icon: 'none' })
		}
	}

	//  功能菜单 
	const menuList = ref([
		{ id: 1, name: '收货地址', icon: '📍', path: '/pages/mine/address/address' },
		{ id: 2, name: '优惠券', icon: '🎫', path: '/pages/mine/coupon/coupon' },
		{ id: 3, name: '帮助中心', icon: '❓', path: '/pages/mine/help-center/help-center' },
		{ id: 4, name: '关于我们', icon: 'ℹ️', path: '/pages/mine/about/about' },
		{ id: 5, name: '设置', icon: '⚙️', path: '/pages/mine/setting/setting' }
	])
</script>

<style lang="scss" scoped>
	.mine-page {
		background: #F5F5F5;
		min-height: 100vh;
		padding-bottom: 40rpx;
	}

	.user-header {
		position: relative;
		padding-bottom: 40rpx;
	}

	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 360rpx;
		background: linear-gradient(135deg, #E8B880 0%, #D49A55 100%);
		border-radius: 0 0 40rpx 40rpx;
	}

	.user-info {
		position: relative;
		display: flex;
		align-items: center;
		padding: 80rpx 32rpx 40rpx;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid #fff;
		margin-right: 24rpx;
	}

	.user-detail {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.user-name {
		font-size: 38rpx;
		font-weight: bold;
		color: #fff;
	}

	.user-id {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.setting-btn {
		width: 72rpx;
		height: 72rpx;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
	}

	.stats-row {
		position: relative;
		display: flex;
		margin: 0 32rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 26rpx 0;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
		margin-bottom: -16px;
	}

	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
	}

	.stat-num {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999;
	}

	.order-section,
	.adopt-section,
	.menu-section {
		margin: 24rpx 32rpx;
		background: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.section-more {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #999;
	}

	.arrow {
		margin-left: 4rpx;
		font-size: 32rpx;
	}

	.order-tabs {
		display: flex;
		justify-content: space-around;
	}

	.order-tab {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12rpx;
	}

	.tab-icon {
		position: relative;
		font-size: 44rpx;
	}

	.badge {
		position: absolute;
		top: -8rpx;
		right: -16rpx;
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

	.tab-label {
		font-size: 24rpx;
		color: #666;
	}

	.adopt-list {
		display: flex;
		gap: 20rpx;
	}

	.adopt-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #F9F5EE;
		border-radius: 20rpx;
		padding: 24rpx;
	}

	.adopt-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		margin-bottom: 16rpx;
	}

	.adopt-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8rpx;
	}

	.adopt-name {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
	}

	.adopt-status {
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}

	.status-active {
		background: #D4EDDA;
		color: #155724;
	}

	.status-pending {
		background: #FFF3CD;
		color: #856404;
	}

	.menu-section {
		padding: 0;
		overflow: hidden;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 32rpx;
		border-bottom: 1rpx solid #F5F5F5;

		&:last-child {
			border-bottom: none;
		}
	}

	.menu-icon {
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.menu-text {
		flex: 1;
		font-size: 30rpx;
		color: #333;
	}

	.menu-arrow {
		font-size: 36rpx;
		color: #CCC;
	}
</style>