<template>
	<view class="medical-detail">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title"> 疫苗接种指南</text>
			<view class="nav-right"></view>
		</view>

		<!-- Banner -->
		<view class="banner" style="background:linear-gradient(135deg,#D5F0E8,#B8E0D2)">
			<text class="banner-icon">💉</text>
			<!-- <text class="banner-title">疫苗接种指南</text> -->
			<text class="banner-desc">科学接种疫苗，守护宠物健康</text>
		</view>

		<!-- 疫苗时间表 -->
		<view class="section">
			<view class="section-title">📋 疫苗接种时间表</view>
			<view class="timeline">
				<view class="timeline-item" v-for="(item, idx) in vaccineSchedule" :key="idx">
					<view class="timeline-dot" :style="{ background: item.color }"></view>
					<view class="timeline-content">
						<text class="timeline-age">{{ item.age }}</text>
						<text class="timeline-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 疫苗类型 -->
		<view class="section">
			<view class="section-title">💊 疫苗类型</view>
			<view class="card-grid">
				<view class="info-card" v-for="(item, idx) in vaccineTypes" :key="idx">
					<text class="card-icon">{{ item.icon }}</text>
					<text class="card-title">{{ item.name }}</text>
					<text class="card-desc">{{ item.desc }}</text>
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

		<!-- 在线客服 -->
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

	const vaccineSchedule = ref([{
			age: '6-8周',
			desc: '猫三联/DHPP 第一针',
			color: '#4ECDC4'
		},
		{
			age: '9-11周',
			desc: '猫三联/DHPP 第二针（加强）',
			color: '#F5A623'
		},
		{
			age: '12-14周',
			desc: '猫三联/DHPP 第三针 + 狂犬疫苗',
			color: '#FF6B6B'
		},
		{
			age: '16周',
			desc: '狂犬疫苗（首次接种）',
			color: '#D49A55'
		},
		{
			age: '每年',
			desc: '加强针（猫三联/DHPP + 狂犬）',
			color: '#4ECDC4'
		}
	])

	const vaccineTypes = ref([{
			icon: '😺',
			name: '猫三联',
			desc: '预防猫瘟、猫鼻支、猫杯状'
		},
		{
			icon: '🐶',
			name: 'DHPP',
			desc: '预防犬瘟、细小、肝炎、副流感'
		},
		{
			icon: '💉',
			name: '狂犬疫苗',
			desc: '预防狂犬病，法定接种'
		}
	])

	const tipsList = ref([
		'接种前确保宠物身体健康',
		'接种后观察30分钟，确认无过敏反应',
		'接种后1周内避免洗澡和剧烈运动',
		'严格按照时间表接种，不可提前或延后',
		'保存好疫苗接种记录本'
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

	.timeline {
		position: relative;
		padding-left: 20rpx;
	}

	.timeline-item {
		display: flex;
		gap: 20rpx;
		padding-bottom: 20rpx;
		position: relative;

		&:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 4rpx;
			top: 20rpx;
			width: 2rpx;
			height: calc(100% - 10rpx);
			background: #E0E0E0;
		}
	}

	.timeline-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 6rpx;
	}

	.timeline-content {
		flex: 1;
	}

	.timeline-age {
		font-size: 24rpx;
		font-weight: 600;
		color: #D49A55;
		display: block;
	}

	.timeline-desc {
		font-size: 24rpx;
		color: #555;
		display: block;
	}

	.card-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12rpx;
	}

	.info-card {
		background: #F9F7F4;
		padding: 16rpx;
		border-radius: 16rpx;
		text-align: center;
	}

	.card-icon {
		font-size: 32rpx;
		display: block;
	}

	.card-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-top: 4rpx;
	}

	.card-desc {
		font-size: 18rpx;
		color: #999;
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