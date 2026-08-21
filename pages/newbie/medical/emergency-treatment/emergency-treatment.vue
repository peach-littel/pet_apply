<template>
	<view class="medical-detail">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">常见急救处理</text>
			<view class="nav-right"></view>
		</view>

		<view class="banner" style="background:linear-gradient(135deg,#F8D7DF,#F0B8C8)">
			<text class="banner-icon">🚨</text>
			<!-- <text class="banner-title">常见急救处理</text> -->
			<text class="banner-desc">紧急情况应急处理指南</text>
		</view>

		<!-- 急救项目 -->
		<view class="section">
			<view class="section-title">📋 急救处理指南</view>
			<view class="emergency-item" v-for="(item, idx) in emergencyList" :key="idx">
				<view class="emergency-header">
					<text class="emergency-icon">{{ item.icon }}</text>
					<text class="emergency-name">{{ item.name }}</text>
				</view>
				<text class="emergency-desc">{{ item.desc }}</text>
				<view class="emergency-action" :style="{ background: item.bgColor }">
					<text>📌 {{ item.action }}</text>
				</view>
			</view>
		</view>

		<!-- 急救包建议 -->
		<view class="section">
			<view class="section-title">🩹 家庭急救包建议</view>
			<view class="kit-grid">
				<view class="kit-item" v-for="(item, idx) in kitList" :key="idx">
					<text class="kit-icon">{{ item.icon }}</text>
					<text class="kit-name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view class="service-time">
			<text class="time-title">💬 在线客服</text>
			<text class="time-text">工作日 9:00 - 21:00</text>
			<text class="time-tip">紧急情况请拨打24小时宠物医院</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const emergencyList = ref([{
			icon: '🤒',
			name: '中暑',
			desc: '体温过高、呼吸困难、流口水、精神萎靡',
			action: '立即移至阴凉处，用冷水擦拭身体，及时就医',
			bgColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)'
		},
		{
			icon: '🩸',
			name: '外伤出血',
			desc: '割伤、擦伤、咬伤导致出血',
			action: '用干净纱布按压止血，包扎后立即送医',
			bgColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)'
		},
		{
			icon: '☠️',
			name: '中毒',
			desc: '误食有毒物品、药物、巧克力等',
			action: '记录中毒物，立即送医，不要随意催吐',
			bgColor: 'linear-gradient(135deg, #F5A623, #E8951A)'
		},
		{
			icon: '🦴',
			name: '骨折',
			desc: '肢体变形、疼痛、无法站立',
			action: '不要随意移动，用木板固定后送医',
			bgColor: 'linear-gradient(135deg, #F5A623, #E8951A)'
		}
	])

	const kitList = ref([{
			icon: '🩹',
			name: '纱布'
		},
		{
			icon: '🧻',
			name: '绷带'
		},
		{
			icon: '🧴',
			name: '消毒水'
		},
		{
			icon: '✂️',
			name: '剪刀'
		},
		{
			icon: '📋',
			name: '急救手册'
		}
	])

	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.medical-detail {
		min-height: 100vh;
		background: #F9F7F4;
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
	
	.back-icon {
		font-size: 70rpx;
		font-weight: 300;
		color: #333;
		line-height: 1;
		margin-bottom: 10px;
	}

	.banner {
		margin: 20rpx 32rpx;
		padding: 32rpx;
		border-radius: 24rpx;
		text-align: center;
	}

	.banner-icon {
		font-size: 56rpx;
		display: block;
	}

	.banner-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-top: 12rpx;
	}

	.banner-desc {
		font-size: 24rpx;
		color: #555;
		display: block;
		margin-top: 6rpx;
	}

	.section {
		background: #FFFFFF;
		margin: 0 32rpx 16rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 16rpx;
	}

	.emergency-item {
		padding: 16rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.emergency-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.emergency-icon {
		font-size: 28rpx;
	}

	.emergency-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.emergency-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-left: 44rpx;
	}

	.emergency-action {
		margin-top: 8rpx;
		margin-left: 44rpx;
		padding: 8rpx 16rpx;
		border-radius: 12rpx;
		color: #fff;
		font-size: 22rpx;
	}

	.kit-grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 12rpx;
	}

	.kit-item {
		background: #F9F7F4;
		padding: 16rpx;
		border-radius: 16rpx;
		text-align: center;
	}

	.kit-icon {
		font-size: 32rpx;
		display: block;
	}

	.kit-name {
		font-size: 20rpx;
		color: #555;
		display: block;
		margin-top: 4rpx;
	}

	.service-time {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx 28rpx;
		margin: 0 32rpx;
		text-align: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.time-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-bottom: 8rpx;
	}

	.time-text {
		font-size: 26rpx;
		color: #333;
		display: block;
	}

	.time-tip {
		font-size: 22rpx;
		color: #B0A8A0;
		display: block;
		margin-top: 6rpx;
	}
</style>