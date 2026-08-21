<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">🚽 定点排便</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#D5F0E8,#B8E0D2)">
			<text class="banner-icon">🚽</text>
			<text class="banner-title">定点排便训练</text>
			<text class="banner-desc">让狗狗学会在指定地点排便</text>
		</view>

		<!-- 训练步骤 -->
		<view class="step-section">
			<view class="section-title">📋 训练步骤</view>
			<view class="step-card" v-for="(step, idx) in stepList" :key="idx">
				<view class="step-header">
					<view class="step-num">{{ idx + 1 }}</view>
					<text class="step-title">{{ step.title }}</text>
				</view>
				<text class="step-desc">{{ step.desc }}</text>
			</view>
		</view>

		<!-- 常见问题 -->
		<view class="faq-section">
			<view class="section-title">💡 常见问题</view>
			<view class="faq-item" v-for="(item, idx) in faqList" :key="idx">
				<text class="faq-q">Q：</text>
				<text class="faq-text">{{ item.q }}</text>
				<text class="faq-a-text">A：{{ item.a }}</text>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>💬 咨询训练方案</text>
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

	const stepList = ref([{
			title: '选择固定地点',
			desc: '选择阳台、卫生间或使用狗厕所/尿垫作为固定排便点'
		},
		{
			title: '掌握排便时机',
			desc: '饭后、睡醒后、玩耍后是排便高峰期，及时带去指定地点'
		},
		{
			title: '引导与等待',
			desc: '带狗狗到指定地点，用口令"嘘嘘"或"便便"引导，耐心等待'
		},
		{
			title: '及时奖励',
			desc: '在指定地点排便后，立即给予零食奖励和表扬'
		},
		{
			title: '耐心坚持',
			desc: '训练需要1-4周时间，保持耐心，不要惩罚错误'
		}
	])

	const faqList = ref([{
			q: '狗狗老在不该拉的地方拉怎么办？',
			a: '立即清理干净，用除味剂消除气味。缩短时间间隔，更频繁地带它去指定地点。'
		},
		{
			q: '训练需要多长时间？',
			a: '通常需要1-4周，因狗狗年龄和品种而异。幼犬学习更快，成年犬需要更多耐心。'
		},
		{
			q: '晚上狗狗会乱拉吗？',
			a: '幼犬晚上需要2-3次起夜，逐渐延长间隔。成年犬一般可以睡整夜，睡前减少饮水。'
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
			url: '/pages/newbie/consult/chat/chat?type=potty'
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

	.step-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.step-card {
		display: flex;
		flex-direction: column;
		padding: 14rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
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

	.faq-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.faq-item {
		padding: 14rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.faq-q {
		font-size: 24rpx;
		font-weight: 700;
		color: #D49A55;
		display: block;
	}

	.faq-text {
		font-size: 24rpx;
		color: #333;
		display: block;
		margin-bottom: 4rpx;
	}

	.faq-a-text {
		font-size: 22rpx;
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