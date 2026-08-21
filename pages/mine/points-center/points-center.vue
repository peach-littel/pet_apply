<template>
	<view class="points-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">积分中心</text>
			<view class="nav-right"></view>
		</view>

		<view class="points-header">
			<text class="points-num">{{ totalPoints }}</text>
			<text class="points-label">总积分</text>
		</view>

		<view class="points-list">
			<view class="points-item" v-for="item in pointsList" :key="item.id">
				<view class="points-info">
					<text class="points-desc">{{ item.desc }}</text>
					<text class="points-time">{{ item.time }}</text>
				</view>
				<text class="points-change" :class="{ positive: item.change > 0 }">
					{{ item.change > 0 ? '+' : '' }}{{ item.change }}
				</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const totalPoints = ref(1280)

	const pointsList = ref([{
			id: 1,
			desc: '每日签到',
			change: 5,
			time: '2024-12-15 10:30'
		},
		{
			id: 2,
			desc: '分享宠物动态',
			change: 10,
			time: '2024-12-14 14:20'
		},
		{
			id: 3,
			desc: '领养成功奖励',
			change: 100,
			time: '2024-12-13 16:45'
		},
		{
			id: 4,
			desc: '消费积分',
			change: 50,
			time: '2024-12-12 09:00'
		}
	])

	const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
	.points-page {
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

	.points-header {
		margin: 20rpx 32rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		padding: 40rpx;
		border-radius: 24rpx;
		text-align: center;
	}

	.points-num {
		font-size: 72rpx;
		font-weight: 800;
		color: #fff;
		display: block;
	}

	.points-label {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
		display: block;
		margin-top: 8rpx;
	}

	.points-list {
		margin: 0 32rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.points-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.points-desc {
		font-size: 26rpx;
		color: #333;
		display: block;
	}

	.points-time {
		font-size: 20rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
	}

	.points-change {
		font-size: 28rpx;
		font-weight: 700;
		color: #999;
	}

	.points-change.positive {
		color: #4ECDC4;
	}
</style>