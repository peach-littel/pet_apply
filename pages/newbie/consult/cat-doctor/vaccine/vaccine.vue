<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">💉 疫苗驱虫</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#D4E7F7,#A4C7E8)">
			<text class="banner-icon">💉</text>
			<text class="banner-title">疫苗与驱虫计划</text>
			<text class="banner-desc">科学制定疫苗接种和驱虫方案，保护猫咪健康</text>
		</view>

		<view class="plan-section">
			<view class="section-title">📋 疫苗计划</view>
			<view class="plan-card" v-for="(item, idx) in vaccineList" :key="idx">
				<view class="plan-header">
					<text class="plan-age">{{ item.age }}</text>
					<text class="plan-status" :class="item.status">{{ item.status }}</text>
				</view>
				<text class="plan-desc">{{ item.desc }}</text>
			</view>
		</view>

		<view class="plan-section">
			<view class="section-title">🪱 驱虫计划</view>
			<view class="plan-card" v-for="(item, idx) in dewormList" :key="idx">
				<view class="plan-header">
					<text class="plan-age">{{ item.age }}</text>
					<text class="plan-status" :class="item.status">{{ item.status }}</text>
				</view>
				<text class="plan-desc">{{ item.desc }}</text>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>咨询疫苗/驱虫方案</text>
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

	const vaccineList = ref([{
			age: '8周',
			status: '建议',
			desc: '猫三联疫苗第一针（猫瘟、猫鼻支、猫杯状）'
		},
		{
			age: '12周',
			status: '建议',
			desc: '猫三联疫苗第二针（加强免疫）'
		},
		{
			age: '16周',
			status: '建议',
			desc: '猫三联疫苗第三针 + 狂犬疫苗'
		},
		{
			age: '1年',
			status: '每年',
			desc: '猫三联加强针 + 狂犬疫苗加强针'
		}
	])

	const dewormList = ref([{
			age: '2-8周',
			status: '建议',
			desc: '体内驱虫（每2-3周一次）'
		},
		{
			age: '8周-6月',
			status: '建议',
			desc: '体内驱虫（每月一次）+ 体外驱虫（每月一次）'
		},
		{
			age: '6月以上',
			status: '每季',
			desc: '体内驱虫（每3-6个月一次）+ 体外驱虫（每月一次）'
		}
	])

	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/cat-doctor/cat-doctor'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/cat-doctor/cat-doctor'
			})
		}
	}

	const startConsult = () => {
		uni.showToast({
			title: '已提交咨询，医生将为您定制方案',
			icon: 'success'
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

	.plan-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.plan-card {
		padding: 16rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 4rpx;
	}

	.plan-age {
		font-size: 26rpx;
		font-weight: 700;
		color: #1A1A1A;
	}

	.plan-status {
		font-size: 20rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;

		&.建议 {
			background: #D5F0E8;
			color: #2C7A6B;
		}

		&.每年 {
			background: #FFE8D0;
			color: #B8860B;
		}

		&.每季 {
			background: #D4E7F7;
			color: #2C5F8A;
		}
	}

	.plan-desc {
		font-size: 24rpx;
		color: #666;
		display: block;
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