<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🥩 营养配比</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner" style="background:linear-gradient(135deg,#D4E7F7,#A4C7E8)">
			<text class="banner-icon">🥩</text>
			<text class="banner-title">自制食品营养搭配</text>
			<text class="banner-desc">科学配比，让自制宠物食品营养均衡</text>
		</view>

		<!-- 营养配比指南 -->
		<view class="ratio-section">
			<view class="section-title">📊 营养配比原则</view>
			<view class="ratio-card">
				<view class="ratio-item">
					<view class="ratio-bar" style="width:55%;background:linear-gradient(135deg,#FF6B6B,#EE4444)"></view>
					<view class="ratio-label">
						<text class="ratio-name">蛋白质</text>
						<text class="ratio-value">50-60%</text>
					</view>
				</view>
				<view class="ratio-item">
					<view class="ratio-bar" style="width:25%;background:linear-gradient(135deg,#4ECDC4,#44B39D)"></view>
					<view class="ratio-label">
						<text class="ratio-name">蔬菜</text>
						<text class="ratio-value">20-30%</text>
					</view>
				</view>
				<view class="ratio-item">
					<view class="ratio-bar" style="width:15%;background:linear-gradient(135deg,#F5A623,#F7C948)"></view>
					<view class="ratio-label">
						<text class="ratio-name">碳水</text>
						<text class="ratio-value">10-20%</text>
					</view>
				</view>
				<view class="ratio-item">
					<view class="ratio-bar" style="width:5%;background:linear-gradient(135deg,#D49A55,#B8860B)"></view>
					<view class="ratio-label">
						<text class="ratio-name">脂肪/维生素</text>
						<text class="ratio-value">5%</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 食材推荐 -->
		<view class="food-section">
			<view class="section-title">🛒 食材推荐</view>
			<view class="food-grid">
				<view class="food-item" v-for="(item, idx) in foodList" :key="idx">
					<text class="food-icon">{{ item.icon }}</text>
					<text class="food-name">{{ item.name }}</text>
					<text class="food-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 食谱示例 -->
		<view class="recipe-section">
			<view class="section-title">📝 食谱示例</view>
			<view class="recipe-card" v-for="(recipe, idx) in recipeList" :key="idx">
				<text class="recipe-name">{{ recipe.name }}</text>
				<text class="recipe-desc">{{ recipe.desc }}</text>
			</view>
		</view>

		<view class="consult-btn-wrap">
			<view class="consult-btn" @click="startConsult">
				<text>咨询营养配比方案</text>
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

	const foodList = ref([{
			icon: '🐔',
			name: '鸡胸肉',
			desc: '优质蛋白来源'
		},
		{
			icon: '🐟',
			name: '三文鱼',
			desc: '富含Omega-3'
		},
		{
			icon: '🥕',
			name: '胡萝卜',
			desc: '富含维生素A'
		},
		{
			icon: '🎃',
			name: '南瓜',
			desc: '富含膳食纤维'
		},
		{
			icon: '🥦',
			name: '西兰花',
			desc: '富含维生素C'
		},
		{
			icon: '🌾',
			name: '燕麦',
			desc: '优质碳水来源'
		}
	])

	const recipeList = ref([{
			name: '鸡胸肉南瓜饭',
			desc: '鸡胸肉50% + 南瓜20% + 燕麦15% + 蔬菜15%'
		},
		{
			name: '三文鱼蔬菜餐',
			desc: '三文鱼45% + 胡萝卜20% + 西兰花20% + 燕麦15%'
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
			url: '/pages/newbie/consult/chat/chat?type=nutrition'
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

	.ratio-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.ratio-card {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.ratio-item {
		position: relative;
	}

	.ratio-bar {
		height: 16rpx;
		border-radius: 8rpx;
	}

	.ratio-label {
		display: flex;
		justify-content: space-between;
		margin-top: 4rpx;
	}

	.ratio-name {
		font-size: 22rpx;
		color: #555;
	}

	.ratio-value {
		font-size: 22rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.food-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.food-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 12rpx;
	}

	.food-item {
		background: #F9F7F4;
		padding: 16rpx;
		border-radius: 16rpx;
		text-align: center;
	}

	.food-icon {
		font-size: 32rpx;
		display: block;
	}

	.food-name {
		font-size: 22rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-top: 4rpx;
	}

	.food-desc {
		font-size: 18rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	.recipe-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.recipe-card {
		padding: 14rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		margin-bottom: 12rpx;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.recipe-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
	}

	.recipe-desc {
		font-size: 22rpx;
		color: #666;
		display: block;
		margin-top: 2rpx;
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