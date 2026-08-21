<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">💊 营养补充</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner" style="background:linear-gradient(135deg,#D5F0E8,#B8E0D2)">
			<text class="banner-icon">💊</text>
			<text class="banner-title">保健品选择建议</text>
			<text class="banner-desc">科学选择宠物保健品，让营养更全面</text>
		</view>

		<!-- 保健品分类 -->
		<view class="supplement-section">
			<view class="section-title">📋 保健品分类</view>
			<view class="supplement-card" v-for="(item, idx) in supplementList" :key="idx">
				<view class="supplement-header">
					<text class="supplement-icon">{{ item.icon }}</text>
					<text class="supplement-name">{{ item.name }}</text>
				</view>
				<text class="supplement-desc">{{ item.desc }}</text>
				<text class="supplement-recommend">推荐：{{ item.recommend }}</text>
			</view>
		</view>

		<!-- 选择建议 -->
		<view class="tips-section">
			<view class="section-title">💡 选择建议</view>
			<view class="tips-card">
				<view class="tips-item" v-for="(tip, idx) in tipsList" :key="idx">
					<text class="tips-num">{{ idx + 1 }}</text>
					<text class="tips-text">{{ tip }}</text>
				</view>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>咨询保健品方案</text>
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

	const supplementList = ref([{
			icon: '🦴',
			name: '关节保健',
			desc: '保护关节，缓解关节炎症状',
			recommend: '老年犬猫、大型犬'
		},
		{
			icon: '🐟',
			name: '鱼油/Omega-3',
			desc: '美毛护肤，抗炎，支持心脏健康',
			recommend: '所有宠物'
		},
		{
			icon: '🦷',
			name: '口腔护理',
			desc: '预防牙结石，清新口气',
			recommend: '口腔问题宠物'
		},
		{
			icon: '💩',
			name: '益生菌',
			desc: '改善肠道健康，促进消化吸收',
			recommend: '肠胃敏感宠物'
		},
		{
			icon: '🧬',
			name: '维生素矿物质',
			desc: '补充日常营养不足',
			recommend: '挑食、老年宠物'
		},
		{
			icon: '😿',
			name: '免疫增强',
			desc: '提高免疫力，抵抗疾病',
			recommend: '体弱、康复期宠物'
		}
	])

	const tipsList = ref([
		'根据宠物年龄和健康状况选择',
		'选择正规品牌，注意成分和含量',
		'首次使用前咨询兽医',
		'注意剂量，不可过量使用'
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
			url: '/pages/newbie/consult/chat/chat?type=supplement'
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

	.supplement-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.supplement-card {
		padding: 14rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.supplement-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.supplement-icon {
		font-size: 28rpx;
	}

	.supplement-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.supplement-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-top: 4rpx;
		margin-left: 44rpx;
	}

	.supplement-recommend {
		font-size: 20rpx;
		color: #D49A55;
		display: block;
		margin-top: 4rpx;
		margin-left: 44rpx;
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
		gap: 12rpx;
		padding: 8rpx 0;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}
	}

	.tips-num {
		width: 36rpx;
		height: 36rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		font-weight: 600;
		flex-shrink: 0;
	}

	.tips-text {
		font-size: 24rpx;
		color: #555;
		flex: 1;
		line-height: 1.5;
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