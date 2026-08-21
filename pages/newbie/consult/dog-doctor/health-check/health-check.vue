<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">🩺 健康体检</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#D5F0E8,#B8E0D2)">
			<text class="banner-icon">🩺</text>
			<text class="banner-title">狗狗健康体检</text>
			<text class="banner-desc">定期体检，预防胜于治疗</text>
		</view>

		<view class="checkup-section">
			<view class="section-title">📋 体检项目</view>
			<view class="checkup-item" v-for="(item, idx) in checkupList" :key="idx">
				<view class="checkup-left">
					<text class="checkup-icon">{{ item.icon }}</text>
					<text class="checkup-name">{{ item.name }}</text>
				</view>
				<text class="checkup-desc">{{ item.desc }}</text>
			</view>
		</view>

		<view class="frequency-section">
			<view class="section-title">📅 体检频率建议</view>
			<view class="frequency-card">
				<text class="frequency-age">0-1岁</text>
				<text class="frequency-desc">每3-6个月体检一次</text>
			</view>
			<view class="frequency-card">
				<text class="frequency-age">1-7岁</text>
				<text class="frequency-desc">每年体检一次</text>
			</view>
			<view class="frequency-card">
				<text class="frequency-age">7岁以上</text>
				<text class="frequency-desc">每6个月体检一次</text>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>预约体检咨询</text>
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

	const checkupList = ref([{
			icon: '⚖️',
			name: '体重测量',
			desc: '评估营养状况，监测体重变化'
		},
		{
			icon: '🌡️',
			name: '体温检查',
			desc: '正常体温37.5-39°C'
		},
		{
			icon: '👀',
			name: '眼部检查',
			desc: '检查眼睑、角膜、瞳孔'
		},
		{
			icon: '👂',
			name: '耳部检查',
			desc: '检查耳道、耳螨、感染'
		},
		{
			icon: '🦷',
			name: '口腔检查',
			desc: '检查牙齿、牙龈、口腔溃疡'
		},
		{
			icon: '❤️',
			name: '心肺听诊',
			desc: '检查心脏杂音、呼吸音'
		},
		{
			icon: '🧬',
			name: '血液检测',
			desc: '血常规、生化、传染病筛查'
		},
		{
			icon: '💩',
			name: '粪便检测',
			desc: '寄生虫、消化功能检查'
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

	const startConsult = () => {
		uni.navigateTo({
			url: '/pages/newbie/consult/chat/chat?type=health'
		})
	}
</script>

<style lang="scss" scoped>
	.consult-chat {
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

	.chat-banner {
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

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 16rpx;
	}

	.checkup-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.checkup-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.checkup-left {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.checkup-icon {
		font-size: 28rpx;
	}

	.checkup-name {
		font-size: 26rpx;
		font-weight: 500;
		color: #1A1A1A;
	}

	.checkup-desc {
		font-size: 22rpx;
		color: #999;
	}

	.frequency-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
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

	.frequency-age {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.frequency-desc {
		font-size: 24rpx;
		color: #666;
	}

	.consult-btn-wrap {
		padding: 0 32rpx;
		margin-bottom: 20rpx;
	}

	.consult-btn {
		width: 100%;
		height: 80rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.3);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
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