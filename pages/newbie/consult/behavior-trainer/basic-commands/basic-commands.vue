<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🪑 基础指令</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner" style="background:linear-gradient(135deg,#F8D7DF,#F0B8C8)">
			<text class="banner-icon">🪑</text>
			<text class="banner-title">基础指令训练</text>
			<text class="banner-desc">坐下、趴下、等待、随行等基础指令训练</text>
		</view>

		<!-- 指令列表 -->
		<view class="command-section">
			<view class="section-title">📋 基础指令</view>
			<view class="command-card" v-for="(item, idx) in commandList" :key="idx">
				<view class="command-header">
					<text class="command-icon">{{ item.icon }}</text>
					<text class="command-name">{{ item.name }}</text>
					<view class="command-tag" :class="item.difficulty">{{ item.difficulty }}</view>
				</view>
				<text class="command-desc">{{ item.desc }}</text>
				<view class="command-steps">
					<text class="steps-title">训练步骤：</text>
					<text class="steps-text">{{ item.steps }}</text>
				</view>
				<view class="command-tips">
					<text class="tips-label">💡 小贴士：</text>
					<text class="tips-text">{{ item.tips }}</text>
				</view>
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

	const commandList = ref([{
			icon: '🪑',
			name: '坐下',
			difficulty: '简单',
			desc: '让狗狗听到指令后原地坐下',
			steps: '1. 手持零食放在狗狗头顶\n2. 慢慢向后移动，狗狗自然坐下\n3. 说"坐"并给予奖励',
			tips: '每天训练5-10分钟，保持耐心'
		},
		{
			icon: '🛏️',
			name: '趴下',
			difficulty: '简单',
			desc: '让狗狗从坐姿趴下',
			steps: '1. 让狗狗坐下\n2. 手持零食从狗狗面前向下移动\n3. 狗狗趴下时说"趴"并给予奖励',
			tips: '先学会坐下再学趴下会更容易'
		},
		{
			icon: '⏳',
			name: '等待',
			difficulty: '中等',
			desc: '让狗狗在指定位置保持不动',
			steps: '1. 让狗狗坐下\n2. 用手势示意"等"\n3. 逐步增加等待时间\n4. 说"好"解除指令并奖励',
			tips: '从3秒开始，逐步延长等待时间'
		},
		{
			icon: '🚶',
			name: '随行',
			difficulty: '中等',
			desc: '让狗狗跟随在主人身边行走',
			steps: '1. 让狗狗在左侧坐下\n2. 说"走"同时迈步\n3. 保持牵引绳松弛\n4. 偏离时轻轻纠正',
			tips: '先在家中练习，再过渡到户外'
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
			url: '/pages/newbie/consult/chat/chat?type=training'
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
		font-size:70rpx;
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

	.command-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.command-card {
		padding: 18rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 14rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.command-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 6rpx;
	}

	.command-icon {
		font-size: 28rpx;
	}

	.command-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		flex: 1;
	}

	.command-tag {
		font-size: 18rpx;
		padding: 2rpx 16rpx;
		border-radius: 20rpx;

		&.简单 {
			background: #D5F0E8;
			color: #2C7A6B;
		}

		&.中等 {
			background: #FFE8D0;
			color: #B8860B;
		}

		&.困难 {
			background: #F8D7DF;
			color: #C0392B;
		}
	}

	.command-desc {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-bottom: 8rpx;
	}

	.command-steps {
		margin-bottom: 6rpx;
	}

	.steps-title {
		font-size: 22rpx;
		font-weight: 600;
		color: #D49A55;
	}

	.steps-text {
		font-size: 22rpx;
		color: #555;
		display: block;
		margin-top: 2rpx;
		white-space: pre-line;
	}

	.command-tips {
		background: rgba(212, 154, 85, 0.08);
		padding: 8rpx 12rpx;
		border-radius: 8rpx;
	}

	.tips-label {
		font-size: 22rpx;
		font-weight: 600;
		color: #D49A55;
	}

	.tips-text {
		font-size: 22rpx;
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