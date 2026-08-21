<template>
	<view class="package-detail-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">套餐详情</text>
			<view class="nav-right" @click="sharePackage">
				<text class="share-icon">⋯</text>
			</view>
		</view>

		<!-- 套餐Banner -->
		<view class="package-banner">
			<image class="banner-img" src="https://picsum.photos/id/1062/750/480" mode="aspectFill" />
			<view class="banner-overlay">
				<view class="banner-tag" v-if="packageInfo.tag" :style="{ background: packageInfo.tagColor }">
					{{ packageInfo.tag }}
				</view>
				<text class="banner-name">{{ packageInfo.name }}</text>
				<text class="banner-desc">{{ packageInfo.desc }}</text>
			</view>
		</view>

		<!-- 价格信息 -->
		<view class="price-section">
			<view class="price-row">
				<text class="price-symbol">¥</text>
				<text class="price-num">{{ packageInfo.price }}</text>
				<text class="price-origin" v-if="packageInfo.originPrice">¥{{ packageInfo.originPrice }}</text>
			</view>
			<view class="price-tag">限时优惠</view>
		</view>

		<!-- 套餐包含 -->
		<view class="items-section">
			<view class="section-title">📦 套餐包含</view>
			<view class="items-grid">
				<view class="item-chip" v-for="(item, idx) in packageInfo.items" :key="idx">
					<text class="item-check">✓</text>
					<text class="item-name">{{ item }}</text>
				</view>
			</view>
		</view>

		<!-- 套餐详情 -->
		<view class="detail-section">
			<view class="section-title">📋 套餐详情</view>
			<view class="detail-card">
				<text class="detail-text">{{ packageInfo.detail || '精选优质宠物用品组合，一站式配齐养宠所需，省心省力更省钱！' }}</text>
			</view>
		</view>

		<!-- 适合人群 -->
		<view class="suitable-section">
			<view class="section-title">👥 适合人群</view>
			<view class="suitable-tags">
				<text class="suitable-tag" v-for="(tag, idx) in suitableTags" :key="idx">{{ tag }}</text>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="price-wrap">
				<text class="price-label">套餐价</text>
				<text class="price-amount">¥{{ packageInfo.price }}</text>
			</view>
			<view class="btn-group">
				<view class="btn btn-cart" @click="addToCart">
					<text>加入购物车</text>
				</view>
				<view class="btn btn-buy" @click="buyNow">
					<text>立即购买</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

const packageInfo = ref({
	id: 101,
	name: '基础养宠包',
	tag: '热门',
	tagColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
	desc: '适合初次养宠，包含基础必需品',
	price: 299,
	originPrice: 399,
	items: ['优质猫粮/狗粮 5kg', '基础食盆套装', '宠物窝垫 1个', '梳毛工具 1套', '宠物指甲剪'],
	detail: '精选高品质宠物用品，专为初次养宠的家长设计。所有产品均经过严格筛选，确保安全无害，让您和毛孩子都能安心使用。'
})

// 套餐数据（与 newbie 页保持一致）
const packageData = {
	101: {
		id: 101,
		name: '基础养宠包',
		tag: '热门',
		tagColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
		desc: '适合初次养宠，包含基础必需品',
		price: 299,
		originPrice: 399,
		items: ['优质猫粮/狗粮 5kg', '基础食盆套装', '宠物窝垫 1个', '梳毛工具 1套', '宠物指甲剪'],
		detail: '精选高品质宠物用品，专为初次养宠的家长设计。所有产品均经过严格筛选，确保安全无害，让您和毛孩子都能安心使用。',
		image: 'https://picsum.photos/id/1062/400/400'
	},
	102: {
		id: 102,
		name: '进阶护理包',
		tag: '推荐',
		tagColor: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
		desc: '适合追求高品质养宠体验',
		price: 499,
		originPrice: 699,
		items: ['高端主粮 5kg', '智能饮水机', '宠物背包', '护理套装', '玩具大礼包'],
		detail: '为追求高品质养宠体验的家长精心打造。涵盖智能设备、高端护理用品和丰富玩具，让宠物享受更优质的生活。',
		image: 'https://picsum.photos/id/1074/400/400'
	},
	103: {
		id: 103,
		name: '豪华全家桶',
		tag: '超值',
		tagColor: 'linear-gradient(135deg, #F5A623, #F7C948)',
		desc: '一站式配齐，性价比最高',
		price: 899,
		originPrice: 1299,
		items: ['豪华主粮 10kg', '智能喂食器', '猫爬架/狗围栏', '宠物推车', '年度驱虫套餐'],
		detail: '一站式配齐所有养宠必需品，性价比极高。从日常饮食到智能设备，从居家用品到健康保障，一应俱全。',
		image: 'https://picsum.photos/id/1069/400/400'
	}
}

const suitableTags = ref(['初次养宠', '想要一站式配齐', '追求高性价比'])

onLoad((options) => {
	const id = Number(options.id) || 101
	const data = packageData[id]
	if (data) {
		packageInfo.value = data
	}
})

const goBack = () => uni.navigateBack()

const sharePackage = () => {
	uni.showToast({ title: '分享功能', icon: 'none' })
}

// ---- 加入购物车 ----
const addToCart = () => {
	const cartItem = {
		id: packageInfo.value.id,
		name: packageInfo.value.name,
		price: packageInfo.value.price,
		image: packageInfo.value.image || 'https://picsum.photos/id/1062/400/400',
		spec: '套餐包',
		quantity: 1,
		isPackage: true,
		items: packageInfo.value.items,
		originPrice: packageInfo.value.originPrice
	}
	
	if (globalData && typeof globalData.addToCart === 'function') {
		globalData.addToCart(cartItem)
		uni.showToast({
			title: `已加入购物车：${packageInfo.value.name}`,
			icon: 'success',
			duration: 1500
		})
	} else {
		uni.showToast({ title: '购物车服务未初始化', icon: 'none' })
	}
}

// ---- 立即购买（跳转到结算页） ----
const buyNow = () => {
	// 构造套餐商品数据
	const cartItem = {
		id: packageInfo.value.id,
		name: packageInfo.value.name,
		price: packageInfo.value.price,
		image: packageInfo.value.image || 'https://picsum.photos/id/1062/400/400',
		spec: '套餐包',
		quantity: 1,
		isPackage: true,
		items: packageInfo.value.items,
		originPrice: packageInfo.value.originPrice,
		checked: true
	}
	
	// 将套餐商品作为选中项传递给结算页
	const selectedItems = [cartItem]
	uni.navigateTo({
		url: `/pages/checkout/checkout?items=${encodeURIComponent(JSON.stringify(selectedItems))}`
	})
}
</script>

<style lang="scss" scoped>
.package-detail-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 160rpx;
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
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.share-icon {
	font-size: 36rpx;
	color: #666;
}

/* ========== Banner ========== */
.package-banner {
	position: relative;
	width: 100%;
	height: 380rpx;
	overflow: hidden;
}
.banner-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.banner-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 40rpx 32rpx 32rpx;
	background: linear-gradient(180deg, transparent, rgba(0,0,0,0.6));
}
.banner-tag {
	display: inline-block;
	padding: 4rpx 18rpx;
	color: #fff;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 30rpx;
	margin-bottom: 8rpx;
}
.banner-name {
	display: block;
	font-size: 40rpx;
	font-weight: 700;
	color: #FFFFFF;
	margin-bottom: 6rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}
.banner-desc {
	font-size: 24rpx;
	color: rgba(255,255,255,0.85);
}

/* ========== 价格 ========== */
.price-section {
	margin: 20rpx 32rpx;
	padding: 24rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.price-row {
	display: flex;
	align-items: baseline;
	gap: 10rpx;
}
.price-symbol {
	font-size: 24rpx;
	color: #D44C4C;
	font-weight: 600;
}
.price-num {
	font-size: 44rpx;
	font-weight: 800;
	color: #D44C4C;
}
.price-origin {
	font-size: 22rpx;
	color: #B0A8A0;
	text-decoration: line-through;
}
.price-tag {
	padding: 6rpx 20rpx;
	background: linear-gradient(135deg, #FF6B6B, #EE4444);
	color: #fff;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 30rpx;
}

/* ========== 套餐包含 ========== */
.items-section {
	margin: 0 32rpx 20rpx;
	padding: 24rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.section-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}
.items-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}
.item-chip {
	display: flex;
	align-items: center;
	gap: 6rpx;
	padding: 10rpx 20rpx;
	background: #F9F7F4;
	border-radius: 30rpx;
}
.item-check {
	color: #D49A55;
	font-size: 18rpx;
	font-weight: 700;
}
.item-name {
	font-size: 24rpx;
	color: #555;
}

/* ========== 套餐详情 ========== */
.detail-section {
	margin: 0 32rpx 20rpx;
	padding: 24rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.detail-card {
	padding: 16rpx;
	background: #F9F7F4;
	border-radius: 16rpx;
}
.detail-text {
	font-size: 26rpx;
	color: #555;
	line-height: 1.8;
}

/* ========== 适合人群 ========== */
.suitable-section {
	margin: 0 32rpx 20rpx;
	padding: 24rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.suitable-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}
.suitable-tag {
	padding: 8rpx 24rpx;
	background: #FFF5E4;
	color: #D49A55;
	font-size: 24rpx;
	border-radius: 30rpx;
}

/* ========== 底部操作栏 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 32rpx 32rpx;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.04);
	z-index: 99;
}
.price-wrap {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}
.price-label {
	font-size: 24rpx;
	color: #999;
}
.price-amount {
	font-size: 40rpx;
	font-weight: 800;
	color: #D44C4C;
}
.btn-group {
	display: flex;
	gap: 12rpx;
}
.btn {
	padding: 0 32rpx;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: 600;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.96);
	}
}
.btn-cart {
	background: linear-gradient(90deg, #F6C667, #E8B880);
	color: #8B5A2B;
}
.btn-buy {
	background: linear-gradient(90deg, #D49A55, #B8860B);
	color: #fff;
}
</style>