<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🍖 饮食指导</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner" style="background:linear-gradient(135deg,#FFE8D0,#FDDCB5)">
			<text class="banner-icon">🍖</text>
			<text class="banner-title">科学喂养方案定制</text>
			<text class="banner-desc">根据宠物品种、年龄、体重定制专属饮食方案</text>
		</view>

		<!-- 宠物信息填写 -->
		<view class="form-section">
			<view class="section-title">📋 宠物基本信息</view>
			<view class="form-item">
				<text class="form-label">宠物名称</text>
				<input class="form-input" v-model="petName" placeholder="请输入宠物名称" />
			</view>
			<view class="form-item">
				<text class="form-label">宠物品种</text>
				<input class="form-input" v-model="petBreed" placeholder="请输入宠物品种" />
			</view>
			<view class="form-item">
				<text class="form-label">年龄</text>
				<view class="form-options">
					<view class="form-option" :class="{ active: petAge === '幼年' }" @click="petAge = '幼年'">幼年</view>
					<view class="form-option" :class="{ active: petAge === '成年' }" @click="petAge = '成年'">成年</view>
					<view class="form-option" :class="{ active: petAge === '老年' }" @click="petAge = '老年'">老年</view>
				</view>
			</view>
			<view class="form-item">
				<text class="form-label">体重 (kg)</text>
				<input class="form-input" v-model="petWeight" placeholder="请输入宠物体重" type="digit" />
			</view>
			<view class="form-item">
				<text class="form-label">活动量</text>
				<view class="form-options">
					<view class="form-option" :class="{ active: activityLevel === '低' }" @click="activityLevel = '低'">低
					</view>
					<view class="form-option" :class="{ active: activityLevel === '中' }" @click="activityLevel = '中'">中
					</view>
					<view class="form-option" :class="{ active: activityLevel === '高' }" @click="activityLevel = '高'">高
					</view>
				</view>
			</view>
			<view class="chat-btn" @click="submitDietGuide">
				<text>生成饮食方案</text>
			</view>
		</view>

		<!-- 饮食建议 -->
		<view class="tips-section" v-if="showResult">
			<view class="section-title">📝 饮食建议</view>
			<view class="tips-card">
				<text class="tips-title">每日推荐摄入量</text>
				<view class="tips-item" v-for="(tip, idx) in dietTips" :key="idx">
					<text class="tips-dot">•</text>
					<text class="tips-text">{{ tip }}</text>
				</view>
			</view>
		</view>

		<!-- 客服时间 -->
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

	const petName = ref('')
	const petBreed = ref('')
	const petAge = ref('成年')
	const petWeight = ref('')
	const activityLevel = ref('中')
	const showResult = ref(false)

	const dietTips = ref([
		'每日饲喂2-3次，定时定量',
		'保证充足清洁饮水',
		'避免喂食人类餐桌食物',
		'定期称重，监测体重变化'
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

	const submitDietGuide = () => {
		if (!petName.value || !petBreed.value || !petWeight.value) {
			uni.showToast({
				title: '请填写完整信息',
				icon: 'none'
			})
			return
		}
		showResult.value = true
		uni.showToast({
			title: '方案已生成',
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

	.form-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.form-item:last-child {
		margin-bottom: 0;
	}

	.form-label {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
		display: block;
		margin-bottom: 8rpx;
	}

	.form-input {
		width: 100%;
		height: 72rpx;
		background: #F9F7F4;
		border-radius: 12rpx;
		padding: 0 16rpx;
		font-size: 28rpx;
		color: #333;
		box-sizing: border-box;
	}

	.form-options {
		display: flex;
		gap: 12rpx;
	}

	.form-option {
		padding: 10rpx 28rpx;
		background: #F9F7F4;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
		border: 2rpx solid transparent;
		transition: all 0.2s;

		&.active {
			background: #FFF5E4;
			border-color: #D49A55;
			color: #D49A55;
		}
	}

	.chat-btn {
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

	.tips-section {
		margin: 0 32rpx 20rpx;
	}

	.tips-card {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.tips-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-bottom: 12rpx;
	}

	.tips-item {
		display: flex;
		align-items: flex-start;
		gap: 8rpx;
		padding: 6rpx 0;
	}

	.tips-dot {
		color: #D49A55;
		font-size: 20rpx;
	}

	.tips-text {
		font-size: 24rpx;
		color: #666;
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