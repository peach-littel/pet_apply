<template>
	<view class="consult-detail">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🦴 营养师</text>
			<view class="nav-right"></view>
		</view>

		<!-- 营养师简介 -->
		<view class="doctor-profile">
			<view class="doctor-avatar" style="background:linear-gradient(135deg,#FFE8D0,#FDDCB5)">🦴</view>
			<view class="doctor-info">
				<text class="doctor-name">宠物营养师</text>
				<text class="doctor-title">国家认证营养师 · 6年经验</text>
				<view class="doctor-rating">⭐ 4.7 (98条评价)</view>
			</view>
		</view>

		<!-- 咨询服务 -->
		<view class="service-section">
			<view class="section-title">选择咨询服务</view>
			<view class="service-grid">
				<view class="service-item" v-for="(item, idx) in serviceList" :key="idx" @click="startChat(item)">
					<text class="service-icon">{{ item.icon }}</text>
					<text class="service-name">{{ item.name }}</text>
					<text class="service-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 营养科普 -->
		<view class="faq-section">
			<view class="section-title">营养知识科普</view>
			<view class="faq-item" v-for="(item, idx) in nutritionFaqList" :key="idx" @click="viewFaq(item)">
				<text class="faq-q">Q：</text>
				<text class="faq-text">{{ item.question }}</text>
				<text class="faq-arrow">›</text>
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

	const serviceList = ref([{
			icon: '🍖',
			name: '饮食指导',
			desc: '科学喂养方案定制',
			path: '/pages/newbie/consult/nutritionist/diet-guide/diet-guide'
		},
		{
			icon: '🥩',
			name: '营养配比',
			desc: '自制食品营养搭配',
			path: '/pages/newbie/consult/nutritionist/nutrition-ratio/nutrition-ratio'
		},
		{
			icon: '💊',
			name: '营养补充',
			desc: '保健品选择建议',
			path: '/pages/newbie/consult/nutritionist/supplement/supplement'
		},
		{
			icon: '📊',
			name: '体重管理',
			desc: '健康体重控制方案',
			path: '/pages/newbie/consult/nutritionist/weight-management/weight-management'
		}
	])

	const nutritionFaqList = ref([{
			question: '猫咪应该吃什么粮？'
		},
		{
			question: '狗狗需要补充什么营养？'
		},
		{
			question: '自制宠物食品安全吗？'
		},
		{
			question: '如何控制宠物体重？'
		}
	])

	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/newbie/newbie'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/newbie/newbie'
			})
		}
	}

	const startChat = (item) => {
		if (item.path) {
			uni.navigateTo({
				url: item.path
			})
		} else {
			uni.showToast({
				title: `咨询：${item.name}`,
				icon: 'none'
			})
		}
	}

	const viewFaq = (item) => {
		uni.navigateTo({
			url: '/pages/newbie/faq/faq'
		})
	}
</script>

<style lang="scss" scoped>
	/* 与 cat-doctor 样式相同，可复用 */
	.consult-detail {
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

	.doctor-profile {
		display: flex;
		align-items: center;
		gap: 24rpx;
		background: #FFFFFF;
		margin: 20rpx 32rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.doctor-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 48rpx;
		flex-shrink: 0;
	}

	.doctor-info {
		flex: 1;
	}

	.doctor-name {
		font-size: 32rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
	}

	.doctor-title {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
	}

	.doctor-rating {
		font-size: 24rpx;
		color: #F5A623;
		display: block;
		margin-top: 4rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 16rpx;
	}

	.service-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.service-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16rpx;
	}

	.service-item {
		background: #F9F7F4;
		padding: 20rpx;
		border-radius: 16rpx;
		text-align: center;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.95);
		}
	}

	.service-icon {
		font-size: 32rpx;
		display: block;
	}

	.service-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-top: 6rpx;
	}

	.service-desc {
		font-size: 20rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	.faq-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.faq-item {
		display: flex;
		align-items: center;
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.faq-q {
		font-size: 26rpx;
		font-weight: 700;
		color: #D49A55;
		flex-shrink: 0;
		margin-right: 8rpx;
	}

	.faq-text {
		font-size: 26rpx;
		color: #333;
		flex: 1;
	}

	.faq-arrow {
		font-size: 28rpx;
		color: #B0A8A0;
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