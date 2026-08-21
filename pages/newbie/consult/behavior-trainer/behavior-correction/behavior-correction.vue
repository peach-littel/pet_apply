<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">😰 行为矫正</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#F8D7DF,#F0B8C8)">
			<text class="banner-icon">😰</text>
			<text class="banner-title">行为矫正</text>
			<text class="banner-desc">分离焦虑、攻击行为、恐惧等行为问题矫正</text>
		</view>

		<!-- 问题列表 -->
		<view class="issue-section">
			<view class="section-title">📋 常见行为问题</view>
			<view class="issue-card" v-for="(item, idx) in issueList" :key="idx">
				<view class="issue-header">
					<text class="issue-icon">{{ item.icon }}</text>
					<text class="issue-name">{{ item.name }}</text>
				</view>
				<text class="issue-desc">{{ item.desc }}</text>
				<view class="issue-solution">
					<text class="solution-label">💡 解决方案：</text>
					<text class="solution-text">{{ item.solution }}</text>
				</view>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>💬 咨询行为矫正</text>
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

	const issueList = ref([{
			icon: '😰',
			name: '分离焦虑',
			desc: '主人离开时表现出焦虑、吠叫、破坏物品等行为',
			solution: '逐步适应独处，留下安抚玩具，使用脱敏训练'
		},
		{
			icon: '😤',
			name: '攻击行为',
			desc: '对人或其他动物表现出威胁、咬人、攻击等行为',
			solution: '识别触发因素，使用正向训练，避免惩罚'
		},
		{
			icon: '😨',
			name: '恐惧/胆小',
			desc: '对特定声音、环境或事物表现出过度恐惧',
			solution: '缓慢暴露，正面关联，建立安全感'
		},
		{
			icon: '🗣️',
			name: '过度吠叫',
			desc: '对陌生人、声音或分离时不停吠叫',
			solution: '寻找原因，用"安静"指令训练，增加运动量'
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
			url: '/pages/newbie/consult/chat/chat?type=behavior'
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

	.issue-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.issue-card {
		padding: 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.issue-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.issue-icon {
		font-size: 28rpx;
	}

	.issue-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.issue-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-bottom: 6rpx;
	}

	.issue-solution {
		background: #FFF5E4;
		padding: 8rpx 12rpx;
		border-radius: 8rpx;
	}

	.solution-label {
		font-size: 22rpx;
		font-weight: 600;
		color: #D49A55;
	}

	.solution-text {
		font-size: 22rpx;
		color: #555;
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