<template>
	<view class="consult-chat">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">🏥 急诊指导</text>
			<view class="nav-right"></view>
		</view>

		<view class="chat-banner" style="background:linear-gradient(135deg,#F8D7DF,#F0B8C8)">
			<text class="banner-icon">🚨</text>
			<text class="banner-title">猫咪急诊指导</text>
			<text class="banner-desc">紧急情况识别与应急处理指南</text>
		</view>

		<view class="emergency-section">
			<view class="section-title">🚨 紧急情况识别</view>
			<view class="emergency-item" v-for="(item, idx) in emergencyList" :key="idx">
				<view class="emergency-header">
					<text class="emergency-icon">{{ item.icon }}</text>
					<text class="emergency-name">{{ item.name }}</text>
				</view>
				<text class="emergency-desc">{{ item.desc }}</text>
				<view class="emergency-action" :style="{ background: item.bgColor }">
					<text>{{ item.action }}</text>
				</view>
			</view>
		</view>

		<view class="emergency-tips">
			<view class="tips-title">💡 急诊注意事项</view>
			<text class="tips-text">• 保持冷静，不要惊慌</text>
			<text class="tips-text">• 不要随意给猫咪喂药</text>
			<text class="tips-text">• 如需送医，提前联系医院</text>
			<text class="tips-text">• 记住最近的24小时宠物医院地址</text>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn emergency-btn" @click="callEmergency">
				<text>📞 紧急求助</text>
			</view>
		</view>

		<view class="service-time">
			<text class="time-title">💬 在线客服</text>
			<text class="time-text">工作日 9:00 - 21:00</text>
			<text class="time-tip">紧急情况请拨打24小时宠物医院电话</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const emergencyList = ref([{
			icon: '😰',
			name: '呼吸困难',
			desc: '张口呼吸、喘息、呼吸急促、舌头发紫',
			action: '立即就医，保持空气流通',
			bgColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)'
		},
		{
			icon: '🤮',
			name: '频繁呕吐/腹泻',
			desc: '24小时内呕吐超过3次，或出现血便',
			action: '禁食4-6小时，观察状态，及时就医',
			bgColor: 'linear-gradient(135deg, #F5A623, #E8951A)'
		},
		{
			icon: '🚗',
			name: '意外受伤/车祸',
			desc: '出血、骨折、意识不清、无法站立',
			action: '不要随意移动，用毛巾包裹，立即送医',
			bgColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)'
		},
		{
			icon: '☠️',
			name: '中毒迹象',
			desc: '流口水、抽搐、瞳孔异常、呕吐白沫',
			action: '记录可能的中毒物，立即送医',
			bgColor: 'linear-gradient(135deg, #F5A623, #E8951A)'
		},
		{
			icon: '😿',
			name: '排尿困难',
			desc: '频繁进出猫砂盆、发出叫声、尿血',
			action: '立即就医（可能是尿道堵塞，危及生命）',
			bgColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)'
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

	const callEmergency = () => {
		uni.showModal({
			title: '紧急求助',
			content: '请立即拨打最近的24小时宠物医院电话，或前往附近宠物医院急诊室。',
			confirmText: '我知道了',
			showCancel: false
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

	.emergency-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.emergency-item {
		padding: 16rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.emergency-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 4rpx;
	}

	.emergency-icon {
		font-size: 28rpx;
	}

	.emergency-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.emergency-desc {
		font-size: 24rpx;
		color: #666;
		display: block;
		margin-left: 44rpx;
	}

	.emergency-action {
		margin-top: 8rpx;
		margin-left: 44rpx;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		display: inline-block;
		color: #fff;
		font-size: 22rpx;
		font-weight: 500;
	}

	.emergency-tips {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.tips-title {
		font-size: 28rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 12rpx;
	}

	.tips-text {
		font-size: 24rpx;
		color: #666;
		display: block;
		padding: 4rpx 0;
	}

	.consult-btn-wrap {
		padding: 0 32rpx;
		margin-bottom: 20rpx;
	}

	.consult-btn {
		width: 100%;
		height: 80rpx;
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

	.emergency-btn {
		background: linear-gradient(135deg, #FF6B6B, #EE4444);
		box-shadow: 0 4rpx 12rpx rgba(238, 68, 68, 0.3);
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