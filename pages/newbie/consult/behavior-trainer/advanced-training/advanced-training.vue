<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">🎯 进阶训练</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#D4E7F7,#A4C7E8)">
			<text class="banner-icon">🎯</text>
			<text class="banner-title">进阶训练</text>
			<text class="banner-desc">敏捷、飞盘、高级指令等技能训练</text>
		</view>

		<!-- 训练项目 -->
		<view class="advanced-section">
			<view class="section-title">📋 进阶训练项目</view>
			<view class="advanced-card" v-for="(item, idx) in advancedList" :key="idx">
				<view class="advanced-header">
					<text class="advanced-icon">{{ item.icon }}</text>
					<text class="advanced-name">{{ item.name }}</text>
					<view class="level-tag">{{ item.level }}</view>
				</view>
				<text class="advanced-desc">{{ item.desc }}</text>
				<text class="advanced-tips">💡 {{ item.tips }}</text>
			</view>
		</view>

		<!-- 训练准备 -->
		<view class="prep-section">
			<view class="section-title">🛠️ 训练准备</view>
			<view class="prep-grid">
				<view class="prep-item" v-for="(item, idx) in prepList" :key="idx">
					<text class="prep-icon">{{ item.icon }}</text>
					<text class="prep-name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>💬 咨询进阶训练</text>
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

	const advancedList = ref([{
			icon: '🏃',
			name: '敏捷训练',
			level: '中级',
			desc: '穿越障碍、绕杆、跳跃等敏捷性训练',
			tips: '建议6个月以上健康犬只参与，从简单障碍开始'
		},
		{
			icon: '🥏',
			name: '飞盘训练',
			level: '中级',
			desc: '接飞盘、空中抓取、花式技巧',
			tips: '选择适合犬种的飞盘，注意保护关节'
		},
		{
			icon: '🧠',
			name: '高级指令',
			level: '高级',
			desc: '后退、转圈、装死、物品衔取等',
			tips: '在基础指令稳固后再进行高级指令训练'
		}
	])

	const prepList = ref([{
			icon: '🍖',
			name: '训练零食'
		},
		{
			icon: '🧸',
			name: '玩具'
		},
		{
			icon: '⏱️',
			name: '耐心'
		},
		{
			icon: '📝',
			name: '训练计划'
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
			url: '/pages/newbie/consult/chat/chat?type=advanced'
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

	.advanced-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.advanced-card {
		padding: 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.advanced-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.advanced-icon {
		font-size: 28rpx;
	}

	.advanced-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		flex: 1;
	}

	.level-tag {
		font-size: 18rpx;
		padding: 2px 16rpx;
		border-radius: 20rpx;
		background: #FFE8D0;
		color: #B8860B;
	}

	.advanced-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
	}

	.advanced-tips {
		font-size: 22rpx;
		color: #D49A55;
		display: block;
		margin-top: 4rpx;
	}

	.prep-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.prep-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 12rpx;
	}

	.prep-item {
		background: #F9F7F4;
		padding: 16rpx 8rpx;
		border-radius: 16rpx;
		text-align: center;
	}

	.prep-icon {
		font-size: 32rpx;
		display: block;
	}

	.prep-name {
		font-size: 20rpx;
		color: #555;
		display: block;
		margin-top: 4rpx;
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