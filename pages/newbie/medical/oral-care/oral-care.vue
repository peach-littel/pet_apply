<template>
	<view class="medical-detail">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">口腔护理须知</text>
			<view class="nav-right"></view>
		</view>

		<view class="banner" style="background:linear-gradient(135deg,#FFE8D0,#FDDCB5)">
			<text class="banner-icon">🦷</text>
			<!-- <text class="banner-title">口腔护理须知</text> -->
			<text class="banner-desc">保持口腔健康，预防牙齿疾病</text>
		</view>

		<!-- 护理方法 -->
		<view class="section">
			<view class="section-title">📋 口腔护理方法</view>
			<view class="step-item" v-for="(item, idx) in careSteps" :key="idx">
				<view class="step-header">
					<view class="step-num">{{ idx + 1 }}</view>
					<text class="step-title">{{ item.title }}</text>
				</view>
				<text class="step-desc">{{ item.desc }}</text>
			</view>
		</view>

		<!-- 预防措施 -->
		<view class="section">
			<view class="section-title">💡 预防措施</view>
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

	const careSteps = ref([{
			title: '定期刷牙',
			desc: '使用宠物专用牙膏和牙刷，每周2-3次'
		},
		{
			title: '使用口腔清洁液',
			desc: '添加至饮水中，帮助清新口气'
		},
		{
			title: '提供洁齿玩具',
			desc: '磨牙棒、洁齿球等帮助清洁牙齿'
		},
		{
			title: '定期检查',
			desc: '每月检查口腔，发现异常及时就医'
		}
	])

	const tipsList = ref([
		'注意观察口臭、流口水、进食困难等异常',
		'牙结石严重时需专业洗牙',
		'避免喂食过硬食物损伤牙齿',
		'幼年时期开始培养刷牙习惯'
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
	/* 复用前面样式，此处从简 */
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

	.step-item {
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.step-num {
		width: 40rpx;
		height: 40rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-title {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.step-desc {
		font-size: 22rpx;
		color: #666;
		margin-left: 52rpx;
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