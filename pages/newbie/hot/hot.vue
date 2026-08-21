<template>
	<view class="hot-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">🔥 热门推荐</text>
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
				:class="{ active: currentFilter === '零食' }"
				@click="currentFilter = '零食'"
			>
				🦴 零食
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === '主粮' }"
				@click="currentFilter = '主粮'"
			>
				🍚 主粮
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === '护理' }"
				@click="currentFilter = '护理'"
			>
				🪥 护理
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === '窝具' }"
				@click="currentFilter = '窝具'"
			>
				⚽ 窝具
			</view>
		</view>

		<!-- 商品列表 -->
		<scroll-view 
			class="goods-scroll" 
			scroll-y 
			:style="{ height: scrollHeight + 'px' }"
			@scrolltolower="loadMore"
		>
			<view class="goods-grid">
				<view class="goods-card" v-for="item in displayList" :key="item.id" @click="goGoodsDetail(item)">
					<view class="goods-img-wrap">
						<image class="goods-img" :src="item.image" mode="aspectFill" />
						<view class="goods-tag">{{ item.category }}</view>
						<view class="goods-badge" v-if="item.badge">{{ item.badge }}</view>
					</view>
					<view class="goods-info">
						<text class="goods-name">{{ item.name }}</text>
						<text class="goods-desc">{{ item.desc }}</text>
						<view class="goods-footer">
							<text class="goods-price">¥{{ item.price }}</text>
							<text class="goods-sales">已售{{ item.sales }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 加载更多 -->
			<view class="load-more" v-if="displayList.length > 0">
				<text v-if="loading">加载中...</text>
				<text v-else-if="!hasMore">— 已加载全部 —</text>
				<text v-else>上拉加载更多</text>
			</view>
			<!-- 空状态 -->
			<view v-if="displayList.length === 0 && !loading" class="empty">
				<text class="empty-icon">📦</text>
				<text class="empty-text">暂无相关商品</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const currentFilter = ref('all')
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 6
const scrollHeight = ref(0)

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 热门商品数据（从全局获取，只显示有 badge 的商品） ----
const allGoods = computed(() => {
  const list = globalData.goodsData ? globalData.goodsData.value : []
  return list.filter(item => item.badge)
})

// ---- 筛选逻辑 ----
const filteredGoods = computed(() => {
	let list = [...allGoods.value]
	if (currentFilter.value !== 'all') {
		list = list.filter(item => item.category === currentFilter.value)
	}
	return list
})

// ---- 分页显示 ----
const displayList = computed(() => {
	const end = currentPage.value * pageSize
	return filteredGoods.value.slice(0, end)
})

// ---- 加载更多 ----
const loadMore = () => {
	if (loading.value || !hasMore.value) return
	if (displayList.value.length >= filteredGoods.value.length) {
		hasMore.value = false
		return
	}
	loading.value = true
	setTimeout(() => {
		currentPage.value += 1
		loading.value = false
		if (displayList.value.length >= filteredGoods.value.length) {
			hasMore.value = false
		}
	}, 500)
}

// ---- 切换筛选 ----
const switchFilter = (filter) => {
	currentFilter.value = filter
	currentPage.value = 1
	hasMore.value = true
}

// ---- 跳转方法 ----
const goBack = () => {
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack()
		} else {
			uni.switchTab({ url: '/pages/newbie/newbie' })
		}
	} catch (e) {
		uni.switchTab({ url: '/pages/newbie/newbie' })
	}
}

const goGoodsDetail = (item) => {
	uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${item.id}` })
}

// ---- 计算滚动高度 ----
onMounted(() => {
	const sys = uni.getSystemInfoSync()
	const statusBarHeight = sys.statusBarHeight || 0
	// 导航栏 ~90px + 筛选栏 ~80px = 170px
	scrollHeight.value = sys.windowHeight - statusBarHeight - 170
})
</script>

<style lang="scss" scoped>
.hot-page {
	min-height: 100vh;
	background: #F9F7F4;
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
	gap: 24rpx;
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

/* ========== 商品列表 ========== */
.goods-scroll {
	padding: 20rpx 16rpx 0;
	box-sizing: border-box;
}

.goods-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
	padding-bottom: 16rpx;
}

.goods-card {
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s;
	display: flex;
	flex-direction: column;
	&:active {
		transform: scale(0.96);
	}
}

.goods-img-wrap {
	position: relative;
	width: 100%;
	height: 280rpx;
	overflow: hidden;
	background: #F0EDE8;
	flex-shrink: 0;
}
.goods-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
}
.goods-tag {
	position: absolute;
	top: 12rpx;
	left: 12rpx;
	padding: 4rpx 16rpx;
	background: rgba(139, 111, 71, 0.9);
	color: #fff;
	font-size: 20rpx;
	font-weight: 500;
	border-radius: 20rpx;
	z-index: 2;
	backdrop-filter: blur(4rpx);
}
.goods-badge {
	position: absolute;
	bottom: 12rpx;
	right: 12rpx;
	padding: 4rpx 16rpx;
	background: linear-gradient(135deg, #FF6B6B, #EE4444);
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 20rpx;
	z-index: 2;
	box-shadow: 0 2rpx 8rpx rgba(238, 68, 68, 0.3);
}

.goods-info {
	padding: 14rpx 16rpx 18rpx;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.goods-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.goods-desc {
	font-size: 22rpx;
	color: #999;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	min-height: 60rpx;
	margin-top: 4rpx;
}
.goods-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
	padding-top: 10rpx;
	border-top: 1rpx solid #F5F4F0;
}
.goods-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #D44C4C;
}
.goods-price::before {
	content: '¥';
	font-size: 22rpx;
	font-weight: 600;
	margin-right: 2rpx;
}
.goods-sales {
	font-size: 20rpx;
	color: #B0A8A0;
}

/* ========== 加载更多 ========== */
.load-more {
	text-align: center;
	padding: 24rpx 0 40rpx;
	font-size: 24rpx;
	color: #B0A8A0;
	letter-spacing: 2rpx;
}

/* ========== 空状态 ========== */
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80rpx 0;
}
.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
	opacity: 0.5;
}
.empty-text {
	font-size: 28rpx;
	color: #B0A8A0;
}
</style>