<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">📊 体重管理</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner" style="background:linear-gradient(135deg,#F8D7DF,#F0B8C8)">
			<text class="banner-icon">📊</text>
			<text class="banner-title">健康体重控制方案</text>
			<text class="banner-desc">科学管理宠物体重，预防肥胖相关疾病</text>
		</view>

		<!-- BMI计算器 -->
		<view class="bmi-section">
			<view class="section-title">📐 体重评估</view>
			<view class="bmi-card">
				<view class="bmi-row">
					<text class="bmi-label">体重 (kg)</text>
					<input class="bmi-input" v-model="weight" placeholder="请输入体重" type="digit" />
				</view>
				<view class="bmi-row">
					<text class="bmi-label">体型</text>
					<view class="bmi-options">
						<view class="bmi-option" :class="{ active: bodyType === '小型' }" @click="bodyType = '小型'">小型
						</view>
						<view class="bmi-option" :class="{ active: bodyType === '中型' }" @click="bodyType = '中型'">中型
						</view>
						<view class="bmi-option" :class="{ active: bodyType === '大型' }" @click="bodyType = '大型'">大型
						</view>
					</view>
				</view>
				<view class="chat-btn" @click="calculateBMI">
					<text>评估体重</text>
				</view>
				<view class="bmi-result" v-if="bmiResult">
					<text class="result-title">评估结果</text>
					<text class="result-text">{{ bmiResult }}</text>
				</view>
			</view>
		</view>

		<!-- 体重管理建议 -->
		<view class="tips-section">
			<view class="section-title">💡 体重管理建议</view>
			<view class="tips-card">
				<view class="tips-item" v-for="(tip, idx) in tipsList" :key="idx">
					<text class="tips-dot">●</text>
					<text class="tips-text">{{ tip }}</text>
				</view>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>咨询体重管理方案</text>
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

	const weight = ref('')
	const bodyType = ref('中型')
	const bmiResult = ref('')

	const tipsList = ref([
		'控制每日食量，避免过量喂食',
		'选择低热量、高营养的宠粮',
		'增加运动量，每天保证充足活动',
		'定期称重，监测体重变化',
		'减少零食投喂，选择健康零食'
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

	const calculateBMI = () => {
		if (!weight.value) {
			uni.showToast({
				title: '请输入体重',
				icon: 'none'
			})
			return
		}
		const w = parseFloat(weight.value)
		if (w < 1) {
			bmiResult.value = '体重偏低，建议增加营养摄入'
		} else if (w >= 1 && w <= 5) {
			if (bodyType.value === '小型') {
				bmiResult.value = '体重正常，继续保持'
			} else {
				bmiResult.value = '体重偏低，建议适当增加营养'
			}
		} else if (w > 5 && w <= 15) {
			if (bodyType.value === '中型') {
				bmiResult.value = '体重正常，继续保持'
			} else if (bodyType.value === '小型') {
				bmiResult.value = '体重偏重，建议控制饮食增加运动'
			} else {
				bmiResult.value = '体重正常，继续保持'
			}
		} else if (w > 15 && w <= 30) {
			if (bodyType.value === '大型') {
				bmiResult.value = '体重正常，继续保持'
			} else {
				bmiResult.value = '体重偏重，建议控制饮食增加运动'
			}
		} else {
			bmiResult.value = '体重偏重，建议咨询营养师制定减重方案'
		}
		uni.showToast({
			title: '评估完成',
			icon: 'success'
		})
	}

	const startConsult = () => {
		uni.navigateTo({
			url: '/pages/newbie/consult/chat/chat?type=weight'
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

	.bmi-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.bmi-card {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.bmi-row {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.bmi-label {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
		width: 120rpx;
		flex-shrink: 0;
	}

	.bmi-input {
		flex: 1;
		height: 64rpx;
		background: #F9F7F4;
		border-radius: 12rpx;
		padding: 0 16rpx;
		font-size: 28rpx;
		color: #333;
	}

	.bmi-options {
		display: flex;
		gap: 12rpx;
		flex: 1;
	}

	.bmi-option {
		padding: 8rpx 20rpx;
		background: #F9F7F4;
		border-radius: 30rpx;
		font-size: 22rpx;
		color: #666;
		border: 2rpx solid transparent;
		transition: all 0.2s;

		&.active {
			background: #FFF5E4;
			border-color: #D49A55;
			color: #D49A55;
		}
	}

	.bmi-result {
		margin-top: 8rpx;
		padding: 16rpx;
		background: #FFF5E4;
		border-radius: 16rpx;
	}

	.result-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #D49A55;
		display: block;
	}

	.result-text {
		font-size: 24rpx;
		color: #555;
		display: block;
		margin-top: 4rpx;
	}

	.chat-btn {
		width: 100%;
		height: 72rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 26rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.3);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}

	.tips-section {
		margin: 0 32rpx 20rpx;
	}

	.tips-card {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.tips-item {
		display: flex;
		align-items: flex-start;
		gap: 8rpx;
		padding: 6rpx 0;
	}

	.tips-dot {
		color: #D49A55;
		font-size: 16rpx;
	}

	.tips-text {
		font-size: 24rpx;
		color: #555;
		flex: 1;
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