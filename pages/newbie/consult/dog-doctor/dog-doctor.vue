<template>
	<view class="consult-detail">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🐶 狗狗医生</text>
			<view class="nav-right"></view>
		</view>

		<!-- 医生简介 -->
		<view class="doctor-profile">
			<view class="doctor-avatar">🐶</view>
			<view class="doctor-info">
				<text class="doctor-name">狗狗医生</text>
				<text class="doctor-title">资深宠物医师 · 10年临床经验</text>
				<view class="doctor-rating">⭐ 4.8 (203条评价)</view>
			</view>
		</view>

		<!-- 咨询类别 -->
		<view class="service-section">
			<view class="section-title">选择咨询类型</view>
			<view class="service-grid">
				<view class="service-item" v-for="(item, idx) in serviceList" :key="idx" @click="startChat(item)">
					<text class="service-icon">{{ item.icon }}</text>
					<text class="service-name">{{ item.name }}</text>
					<text class="service-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 常见狗狗问题 -->
		<view class="faq-section">
			<view class="section-title">常见狗狗问题</view>
			<view class="faq-item" v-for="(item, idx) in dogFaqList" :key="idx" @click="viewFaq(item)">
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
			icon: '😿',
			name: '疾病咨询',
			desc: '感冒、呕吐、腹泻等',
			path: '/pages/newbie/consult/dog-doctor/disease/disease'
		},
		{
			icon: '💉',
			name: '疫苗驱虫',
			desc: '疫苗接种、驱虫计划',
			path: '/pages/newbie/consult/dog-doctor/vaccine/vaccine'
		},
		{
			icon: '🩺',
			name: '健康体检',
			desc: '日常体检、预防保健',
			path: '/pages/newbie/consult/dog-doctor/health-check/health-check'
		},
		{
			icon: '🏥',
			name: '急诊指导',
			desc: '突发状况应急处理',
			path: '/pages/newbie/consult/dog-doctor/emergency/emergency'
		}
	])

	const dogFaqList = ref([{
			question: '狗狗呕吐是什么原因？'
		},
		{
			question: '狗狗不吃东西怎么办？'
		},
		{
			question: '狗狗多久遛一次？'
		},
		{
			question: '狗狗需要打哪些疫苗？'
		}
	])

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

	const viewFaq = (item) => {
		uni.navigateTo({
			url: '/pages/newbie/faq/faq'
		})
	}
</script>

<style lang="scss" scoped>
	/* 样式与 cat-doctor 相同，可提取为公共样式 */
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