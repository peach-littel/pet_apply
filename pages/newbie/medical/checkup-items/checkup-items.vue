<template>
	<view class="medical-detail">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">定期体检项目</text>
			<view class="nav-right"></view>
		</view>

		<view class="banner" style="background:linear-gradient(135deg,#D4E7F7,#A4C7E8)">
			<text class="banner-icon">🏥</text>
			<!-- <text class="banner-title">定期体检项目</text> -->
			<text class="banner-desc">早发现早预防，守护宠物健康</text>
		</view>

		<!-- 体检项目列表 -->
		<view class="section">
			<view class="section-title">📋 体检项目清单</view>
			<view class="checkup-item" v-for="(item, idx) in checkupItems" :key="idx">
				<view class="checkup-header">
					<text class="checkup-icon">{{ item.icon }}</text>
					<text class="checkup-name">{{ item.name }}</text>
					<text class="checkup-tag" :style="{ background: item.tagColor }">{{ item.tag }}</text>
				</view>
				<text class="checkup-desc">{{ item.desc }}</text>
			</view>
		</view>

		<!-- 频率建议 -->
		<view class="section">
			<view class="section-title">📅 体检频率建议</view>
			<view class="frequency-card" v-for="(item, idx) in frequencyList" :key="idx">
				<text class="freq-age">{{ item.age }}</text>
				<text class="freq-desc">{{ item.desc }}</text>
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

	const checkupItems = ref([{
			icon: '⚖️',
			name: '体重测量',
			desc: '评估营养状况，监测体重变化',
			tag: '基础',
			tagColor: '#4ECDC4'
		},
		{
			icon: '🌡️',
			name: '体温检查',
			desc: '正常体温猫38-39.2°C / 狗37.5-39°C',
			tag: '基础',
			tagColor: '#4ECDC4'
		},
		{
			icon: '👀',
			name: '眼部检查',
			desc: '检查眼睑、角膜、瞳孔是否异常',
			tag: '常规',
			tagColor: '#F5A623'
		},
		{
			icon: '👂',
			name: '耳部检查',
			desc: '检查耳道、耳螨、感染情况',
			tag: '常规',
			tagColor: '#F5A623'
		},
		{
			icon: '🦷',
			name: '口腔检查',
			desc: '检查牙齿、牙龈、口腔溃疡',
			tag: '常规',
			tagColor: '#F5A623'
		},
		{
			icon: '❤️',
			name: '心肺听诊',
			desc: '检查心脏杂音、呼吸音异常',
			tag: '深度',
			tagColor: '#FF6B6B'
		},
		{
			icon: '🧬',
			name: '血液检测',
			desc: '血常规、生化、传染病筛查',
			tag: '深度',
			tagColor: '#FF6B6B'
		},
		{
			icon: '💩',
			name: '粪便检测',
			desc: '寄生虫、消化功能检查',
			tag: '深度',
			tagColor: '#FF6B6B'
		}
	])

	const frequencyList = ref([{
			age: '0-1岁',
			desc: '每3-6个月体检一次（生长发育期）'
		},
		{
			age: '1-7岁',
			desc: '每年体检一次（成年期）'
		},
		{
			age: '7岁以上',
			desc: '每6个月体检一次（老年期）'
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

	.checkup-item {
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.checkup-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.checkup-icon {
		font-size: 28rpx;
	}

	.checkup-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		flex: 1;
	}

	.checkup-tag {
		font-size: 18rpx;
		padding: 2rpx 16rpx;
		border-radius: 20rpx;
		color: #fff;
	}

	.checkup-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-left: 44rpx;
	}

	.frequency-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.freq-age {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.freq-desc {
		font-size: 24rpx;
		color: #666;
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