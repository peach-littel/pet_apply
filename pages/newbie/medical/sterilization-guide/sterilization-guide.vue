<template>
	<view class="medical-detail">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">绝育手术指南</text>
			<view class="nav-right"></view>
		</view>

		<view class="banner" style="background:linear-gradient(135deg,#D5F0E8,#B8E0D2)">
			<text class="banner-icon">❤️</text>
			<!-- <text class="banner-title">绝育手术指南</text> -->
			<text class="banner-desc">术前准备、手术流程、术后护理全指南</text>
		</view>

		<!-- 术前准备 -->
		<view class="section">
			<view class="section-title">📋 术前准备</view>
			<view class="prep-item" v-for="(item, idx) in prepList" :key="idx">
				<text class="prep-icon">{{ item.icon }}</text>
				<view class="prep-content">
					<text class="prep-title">{{ item.title }}</text>
					<text class="prep-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 术后护理 -->
		<view class="section">
			<view class="section-title">🩹 术后护理</view>
			<view class="care-item" v-for="(item, idx) in careList" :key="idx">
				<text class="care-icon">{{ item.icon }}</text>
				<view class="care-content">
					<text class="care-title">{{ item.title }}</text>
					<text class="care-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 注意事项 -->
		<view class="section">
			<view class="section-title">⚠️ 注意事项</view>
			<view class="tips-list">
				<view class="tip-item" v-for="(tip, idx) in tipsList" :key="idx">
					<text class="tip-dot">●</text>
					<text class="tip-text">{{ tip }}</text>
				</view>
			</view>
		</view>

		<view class="service-time">
			<text class="time-title">💬 在线客服</text>
			<text class="time-text">工作日 9:00 - 21:00</text>
			<text class="time-tip">非工作时间请留言，24小时内回复</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const prepList = ref([{
			icon: '📋',
			title: '术前检查',
			desc: '血常规、生化检查，确保宠物身体状况适合手术'
		},
		{
			icon: '⏰',
			title: '禁食禁水',
			desc: '术前8-12小时禁食，4小时禁水'
		},
		{
			icon: '🧺',
			title: '准备用品',
			desc: '伊丽莎白圈、宠物垫、保暖毯等'
		},
		{
			icon: '🏥',
			title: '选择医院',
			desc: '选择正规宠物医院，有资质和经验'
		}
	])

	const careList = ref([{
			icon: '🛏️',
			title: '休息环境',
			desc: '提供安静温暖的环境，避免打扰'
		},
		{
			icon: '🍖',
			title: '饮食恢复',
			desc: '术后6-8小时开始少量喂水，逐步恢复饮食'
		},
		{
			icon: '🩹',
			title: '伤口护理',
			desc: '保持伤口干燥清洁，按时用药'
		},
		{
			icon: '🏃',
			title: '限制活动',
			desc: '术后1周内避免剧烈运动和跳跃'
		}
	])

	const tipsList = ref([
		'术后需佩戴伊丽莎白圈7-10天，防止舔舐伤口',
		'观察伤口有无红肿、渗液等异常',
		'按时复诊拆线（通常7-10天）',
		'绝育后注意控制饮食，防止肥胖'
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

	.prep-item,
	.care-item {
		display: flex;
		gap: 16rpx;
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.prep-icon,
	.care-icon {
		font-size: 28rpx;
		flex-shrink: 0;
		margin-top: 2rpx;
	}

	.prep-content,
	.care-content {
		flex: 1;
	}

	.prep-title,
	.care-title {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
	}

	.prep-desc,
	.care-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-top: 2rpx;
	}

	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.tip-item {
		display: flex;
		gap: 8rpx;
	}

	.tip-dot {
		color: #D49A55;
		font-size: 16rpx;
	}

	.tip-text {
		font-size: 24rpx;
		color: #555;
		flex: 1;
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