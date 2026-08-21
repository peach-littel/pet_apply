<template>
	<view class="dynamic-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">领养动态</text>
			<view class="nav-right"></view>
		</view>

		<!-- 状态筛选 -->
		<view class="filter-tabs">
			<view class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">全部
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'pending' }"
				@click="currentFilter = 'pending'">待审核</view>
			<view class="filter-item" :class="{ active: currentFilter === 'approved' }"
				@click="currentFilter = 'approved'">已通过</view>
			<view class="filter-item" :class="{ active: currentFilter === 'rejected' }"
				@click="currentFilter = 'rejected'">已拒绝</view>
		</view>

		<view class="dynamic-list">
			<view class="dynamic-item" v-for="(item, idx) in filteredList" :key="idx">
				<view class="dynamic-header">
					<view class="dynamic-pet">
						<image class="pet-avatar" :src="item.petAvatar" mode="aspectFill" />
						<text class="pet-name">{{ item.petName }}</text>
					</view>
					<view class="dynamic-status" :style="{ color: getStatusColor(item.status) }">
						{{ getStatusText(item.status) }}
					</view>
				</view>
				<text class="dynamic-desc">{{ item.desc }}</text>
				<text class="dynamic-time">{{ item.time }}</text>
			</view>
		</view>

		<view v-if="filteredList.length === 0" class="empty-state">
			<text class="empty-icon">🐾</text>
			<text class="empty-text">暂无领养动态</text>
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

	// ---- 从全局获取领养申请数据 ----
	const getAdoptData = () => {
		const app = getApp()
		const globalData = app.globalData || {}
		return globalData.adoptApplications || []
	}

	const dynamicList = ref([])

	// ---- 更新动态列表 ----
	const updateList = () => {
		const data = getAdoptData()
		dynamicList.value = data.map(item => ({
			id: item.id,
			petName: item.petName,
			petAvatar: item.petAvatar || 'https://picsum.photos/id/40/100/100',
			status: item.status || 'pending',
			desc: item.desc || `申请领养 ${item.petName}`,
			time: item.time || new Date().toLocaleString(),
			applicant: item.applicant || '用户'
		}))
	}

	const filteredList = computed(() => {
		if (currentFilter.value === 'all') return dynamicList.value
		return dynamicList.value.filter(item => item.status === currentFilter.value)
	})

	const getStatusText = (status) => {
		const map = {
			pending: '审核中',
			approved: '已通过',
			rejected: '已拒绝'
		}
		return map[status] || status
	}

	const getStatusColor = (status) => {
		const map = {
			pending: '#F5A623',
			approved: '#4ECDC4',
			rejected: '#FF6B6B'
		}
		return map[status] || '#999'
	}

	const goBack = () => uni.navigateBack()

	onShow(() => {
		updateList()
	})
</script>

<style lang="scss" scoped>
	.dynamic-page {
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

	.dynamic-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.dynamic-item {
		background: #FFFFFF;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.dynamic-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	.dynamic-pet {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.pet-avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		object-fit: cover;
	}

	.pet-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.dynamic-status {
		font-size: 22rpx;
		font-weight: 500;
	}

	.dynamic-desc {
		font-size: 24rpx;
		color: #666;
		display: block;
	}

	.dynamic-time {
		font-size: 20rpx;
		color: #999;
		display: block;
		margin-top: 6rpx;
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