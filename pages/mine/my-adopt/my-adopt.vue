<template>
	<view class="my-adopt-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">我的领养</text>
			<view class="nav-right"></view>
		</view>

		<!-- 状态筛选 -->
		<view class="filter-tabs">
			<view class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">全部</view>
			<view class="filter-item" :class="{ active: currentFilter === 'active' }" @click="currentFilter = 'active'">领养中</view>
			<view class="filter-item" :class="{ active: currentFilter === 'pending' }" @click="currentFilter = 'pending'">审核中</view>
			<view class="filter-item" :class="{ active: currentFilter === 'completed' }" @click="currentFilter = 'completed'">已完成</view>
		</view>

		<view class="adopt-list">
			<view class="adopt-card" v-for="item in filteredList" :key="item.id" @click="goDetail(item)">
				<image class="adopt-img" :src="item.avatar" mode="aspectFill" />
				<view class="adopt-info">
					<view class="adopt-header">
						<text class="adopt-name">{{ item.name }}</text>
						<text class="adopt-status" :class="item.statusClass">{{ item.status }}</text>
					</view>
					<text class="adopt-desc">{{ item.desc }}</text>
					<text class="adopt-time">{{ item.time }}</text>
				</view>
				<text class="adopt-arrow">›</text>
			</view>
		</view>

		<view v-if="filteredList.length === 0" class="empty-state">
			<text class="empty-icon">🐾</text>
			<text class="empty-text">暂无领养记录</text>
			<view class="empty-btn" @click="goAdopt">去领养</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { onShow } from '@dcloudio/uni-app'
	
	// ---- 获取全局数据 ----
	const app = getApp()
	const globalData = app.globalData || {}

	// ---- 状态 ----
	const currentFilter = ref('all')
	const adoptList = ref([])

	// ---- ⭐ 从全局更新领养列表（排除已取消和已拒绝） ----
	const updateAdoptList = () => {
		const adoptApps = globalData.adoptApplications?.value || []
		// 过滤掉已取消和已拒绝的申请
		const validApps = adoptApps.filter(item => 
			item.status !== 'cancelled' && item.status !== 'rejected'
		)
		adoptList.value = validApps.map(item => ({
			id: item.id,
			name: item.petName,
			status: item.status === 'pending' ? '审核中' : 
					item.status === 'approved' ? '领养中' : 
					item.status === 'active' ? '领养中' : '已完成',
			statusClass: item.status === 'pending' ? 'status-pending' : 
						 item.status === 'approved' ? 'status-active' : 
						 item.status === 'active' ? 'status-active' : 'status-completed',
			avatar: item.petAvatar || 'https://picsum.photos/id/40/200/200',
			desc: item.desc || '领养申请',
			time: item.time || new Date().toLocaleDateString(),
			rawData: item
		}))
	}

	// ---- 筛选 ----
	const filteredList = computed(() => {
		if (currentFilter.value === 'all') return adoptList.value
		const map = {
			active: '领养中',
			pending: '审核中',
			completed: '已完成'
		}
		return adoptList.value.filter(item => item.status === map[currentFilter.value])
	})

	// ---- 页面显示时更新 ----
	onShow(() => {
		updateAdoptList()
	})

	// ---- 点击卡片进入详情页 ----
	const goDetail = (item) => {
		const app = getApp()
		app.globalData.selectedPet = item.rawData || {
			id: item.id,
			petName: item.name,
			petAvatar: item.avatar,
			status: item.status,
			desc: item.desc,
			time: item.time
		}
		
		uni.navigateTo({
			url: `/pages/mine/my-adopt/my-adopt-detail/my-adopt-detail?id=${item.id}`
		})
	}

	const goBack = () => uni.navigateBack()
	const goAdopt = () => uni.switchTab({ url: '/pages/adopt/adopt' })
</script>

<style lang="scss" scoped>
	.my-adopt-page {
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

	.adopt-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.adopt-card {
		display: flex;
		gap: 16rpx;
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s;
		align-items: center;

		&:active {
			transform: scale(0.98);
		}
	}

	.adopt-img {
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		object-fit: cover;
		flex-shrink: 0;
	}

	.adopt-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;
		min-width: 0;
	}

	.adopt-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.adopt-name {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.adopt-status {
		font-size: 20rpx;
		padding: 2rpx 16rpx;
		border-radius: 20rpx;
		flex-shrink: 0;
	}

	.status-active {
		background: #D4EDDA;
		color: #155724;
	}

	.status-pending {
		background: #FFF3CD;
		color: #856404;
	}

	.status-completed {
		background: #D1ECF1;
		color: #0C5460;
	}

	.adopt-desc {
		font-size: 24rpx;
		color: #666;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.adopt-time {
		font-size: 20rpx;
		color: #999;
	}

	.adopt-arrow {
		font-size: 36rpx;
		color: #CCC;
		flex-shrink: 0;
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
		margin-bottom: 32rpx;
	}

	.empty-btn {
		padding: 16rpx 60rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		font-size: 28rpx;
		border-radius: 30rpx;

		&:active {
			transform: scale(0.94);
		}
	}
</style>