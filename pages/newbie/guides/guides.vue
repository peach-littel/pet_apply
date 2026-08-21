<template>
	<view class="guides-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">全部指南</text>
			<view class="nav-right"></view>
		</view>

		<!-- 分类筛选 -->
		<view class="filter-tabs">
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'all' }"
				@click="currentFilter = 'all'"
			>
				全部
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'home' }"
				@click="currentFilter = 'home'"
			>
				🏠 到家准备
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'feed' }"
				@click="currentFilter = 'feed'"
			>
				🍖 喂养
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'health' }"
				@click="currentFilter = 'health'"
			>
				💉 健康
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'train' }"
				@click="currentFilter = 'train'"
			>
				🎓 训练
			</view>
		</view>

		<!-- 指南列表 -->
		<view class="guides-list">
			<view class="guide-card" v-for="item in filteredGuides" :key="item.id" @click="goDetail(item)">
				<view class="guide-cover" :style="{ background: item.bgColor }">
					<text class="guide-icon">{{ item.icon }}</text>
				</view>
				<view class="guide-content">
					<text class="guide-title">{{ item.title }}</text>
					<text class="guide-desc">{{ item.desc }}</text>
					<view class="guide-meta">
						<text class="guide-read">阅读 {{ item.readCount || 0 }}</text>
						<text class="guide-time">{{ item.time || '2024-12-01' }}</text>
					</view>
				</view>
				<text class="guide-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentFilter = ref('all')

// ---- 全部指南数据 ----
const guideList = ref([
	{
		id: 1,
		icon: '🏠',
		title: '新宠到家第一周',
		desc: '如何快速让宠物适应新环境',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		category: 'home',
		readCount: 2341,
		time: '2024-12-15'
	},
	{
		id: 2,
		icon: '🍖',
		title: '科学喂养指南',
		desc: '不同年龄段宠物的饮食建议',
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		category: 'feed',
		readCount: 1856,
		time: '2024-12-12'
	},
	{
		id: 3,
		icon: '💉',
		title: '免疫与驱虫',
		desc: '疫苗接种时间表与驱虫计划',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		category: 'health',
		readCount: 1567,
		time: '2024-12-10'
	},
	{
		id: 4,
		icon: '🎓',
		title: '基础训练教程',
		desc: '定点排便、坐下、握手等训练方法',
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)',
		category: 'train',
		readCount: 1234,
		time: '2024-12-08'
	},
	{
		id: 5,
		icon: '🛏️',
		title: '宠物睡眠指南',
		desc: '如何为宠物打造舒适的睡眠环境',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		category: 'home',
		readCount: 987,
		time: '2024-12-05'
	},
	{
		id: 6,
		icon: '🍲',
		title: '自制宠物食品指南',
		desc: '安全健康的自制宠物食品配方',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		category: 'feed',
		readCount: 876,
		time: '2024-12-03'
	},
	{
		id: 7,
		icon: '🏃',
		title: '宠物运动指南',
		desc: '不同品种宠物的运动需求',
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)',
		category: 'health',
		readCount: 765,
		time: '2024-12-01'
	},
	{
		id: 8,
		icon: '🧠',
		title: '宠物心理与行为',
		desc: '了解宠物的心理需求与行为语言',
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		category: 'train',
		readCount: 654,
		time: '2024-11-28'
	}
])

// ---- 筛选逻辑 ----
const filteredGuides = computed(() => {
	if (currentFilter.value === 'all') return guideList.value
	return guideList.value.filter(item => item.category === currentFilter.value)
})

// ---- 方法 ----
const goBack = () => {
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack()
		} else {
			uni.switchTab({ url: '/pages/index/index' })
		}
	} catch (e) {
		uni.switchTab({ url: '/pages/index/index' })
	}
}

const goDetail = (item) => {
	uni.navigateTo({ url: `/pages/newbie/guide-detail/guide-detail?id=${item.id}` })
}
</script>

<style lang="scss" scoped>
.guides-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 40rpx;
}

/* ========== 顶部导航 ========== */
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

/* ========== 筛选标签 ========== */
.filter-tabs {
	display: flex;
	background: #FFFFFF;
	padding: 16rpx 32rpx 20rpx;
	gap: 20rpx;
	border-bottom: 1rpx solid #F0EDE8;
	overflow-x: auto;
}
.filter-item {
	font-size: 26rpx;
	color: #666;
	padding: 8rpx 4rpx;
	white-space: nowrap;
	position: relative;
	transition: all 0.3s;
	&.active {
		color: #D49A55;
		font-weight: 600;
		&::after {
			content: '';
			position: absolute;
			bottom: -20rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 24rpx;
			height: 4rpx;
			background: #D49A55;
			border-radius: 4rpx;
		}
	}
}

/* ========== 指南列表 ========== */
.guides-list {
	padding: 20rpx 32rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.guide-card {
	display: flex;
	align-items: center;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx 22rpx;
	gap: 18rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.97);
	}
}
.guide-cover {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.guide-icon {
	font-size: 36rpx;
}
.guide-content {
	flex: 1;
}
.guide-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
}
.guide-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-top: 2rpx;
}
.guide-meta {
	display: flex;
	gap: 20rpx;
	margin-top: 6rpx;
}
.guide-read {
	font-size: 20rpx;
	color: #B0A8A0;
}
.guide-time {
	font-size: 20rpx;
	color: #B0A8A0;
}
.guide-arrow {
	font-size: 32rpx;
	color: #B0A8A0;
}
</style>