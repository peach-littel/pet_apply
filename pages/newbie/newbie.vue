<template>
	<view class="newbie-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">新手养宠入门包</text>
			<view class="nav-right" @click="sharePage">
				<text class="share-icon">⋯</text>
			</view>
		</view>

		<!-- Banner轮播 -->
		<view class="banner-wrap">
			<swiper class="banner-swiper" circular autoplay interval="4000" indicator-dots indicator-color="rgba(255,255,255,0.3)" indicator-active-color="#FFFFFF">
				<swiper-item v-for="(banner, idx) in bannerList" :key="idx">
					<image class="banner-img" :src="banner.image" mode="aspectFill" />
					<view class="banner-overlay">
						<text class="banner-title">{{ banner.title }}</text>
						<text class="banner-sub">{{ banner.sub }}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 快速入口 -->
		<view class="quick-entry">
			<view class="quick-item" v-for="(item, idx) in quickEntryList" :key="idx" @click="goQuickEntry(item)">
				<view class="quick-icon" :style="{ background: item.bgColor }">
					<text>{{ item.icon }}</text>
				</view>
				<text class="quick-name">{{ item.name }}</text>
			</view>
		</view>

		<!-- 套餐选择 -->
		<view class="package-section">
			<view class="section-header">
				<view class="header-left">
					<text class="section-title">🎯 选择入门套餐</text>
					<text class="section-sub">根据您的需求，推荐最合适的组合</text>
				</view>
				<view class="header-right" @click="viewAllPackages">
					<text>全部套餐 ›</text>
				</view>
			</view>
			<scroll-view class="package-scroll" scroll-x show-scrollbar="false">
				<view class="package-list">
					<view 
						class="package-card" 
						v-for="(pkg, index) in packageList" 
						:key="index"
						:class="{ active: currentPackage === index }"
						@click="goPackageDetail(pkg)"
					>
						<view class="package-tag" v-if="pkg.tag" :style="{ background: pkg.tagColor }">
							{{ pkg.tag }}
						</view>
						<text class="package-name">{{ pkg.name }}</text>
						<text class="package-desc">{{ pkg.desc }}</text>
						<view class="package-price">
							<text class="price-symbol">¥</text>
							<text class="price-num">{{ pkg.price }}</text>
							<text class="price-origin" v-if="pkg.originPrice">¥{{ pkg.originPrice }}</text>
						</view>
						<view class="package-items">
							<text class="item" v-for="(item, idx) in pkg.items" :key="idx">✓ {{ item }}</text>
						</view>
						<view class="package-btn" @click.stop="selectPackage(pkg)">
							立即选购
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 新手必备指南 -->
		<view class="guide-section">
			<view class="section-header">
				<view class="header-left">
					<text class="section-title">📖 新手必备指南</text>
					<text class="section-sub">看完这些，养宠不再迷茫</text>
				</view>
				<view class="header-right" @click="viewAllGuides">
					<text>全部指南 ›</text>
				</view>
			</view>
			<view class="guide-list">
				<view class="guide-item" v-for="(guide, index) in guideList" :key="index" @click="goGuide(guide)">
					<view class="guide-icon" :style="{ background: guide.bgColor }">
						<text>{{ guide.icon }}</text>
					</view>
					<view class="guide-info">
						<text class="guide-title">{{ guide.title }}</text>
						<text class="guide-desc">{{ guide.desc }}</text>
					</view>
					<text class="guide-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 热门商品推荐 -->
		<view class="hot-section">
			<view class="section-header">
				<view class="header-left">
					<text class="section-title">🔥 热门推荐</text>
					<text class="section-sub">新手家长都在买</text>
				</view>
				<view class="header-right" @click="viewAllHot">
					<text>更多 ›</text>
				</view>
			</view>
			<scroll-view class="hot-scroll" scroll-x show-scrollbar="false">
				<view class="hot-list">
					<view class="hot-item" v-for="(item, idx) in hotList" :key="idx" @click="goGoodsDetail(item)">
						<image class="hot-img" :src="item.image" mode="aspectFill" />
						<view class="hot-info">
							<text class="hot-name">{{ item.name }}</text>
							<view class="hot-meta">
								<text class="hot-price">¥{{ item.price }}</text>
								<text class="hot-sales">已售{{ item.sales }}件</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 常见问题 -->
		<view class="faq-section">
			<view class="section-header">
				<view class="header-left">
					<text class="section-title">💡 常见问题</text>
					<text class="section-sub">新手铲屎官最关心的问题</text>
				</view>
				<view class="header-right" @click="viewAllFaq">
					<text>全部 ›</text>
				</view>
			</view>
			<view class="faq-list">
				<view class="faq-item" v-for="(faq, index) in faqList" :key="index" @click="toggleFaq(index)">
					<view class="faq-question">
						<text class="faq-q">Q：</text>
						<text class="faq-text">{{ faq.question }}</text>
						<text class="faq-arrow">{{ faq.open ? '−' : '+' }}</text>
					</view>
					<view class="faq-answer" v-if="faq.open">
						<text class="faq-a">A：</text>
						<text class="faq-text">{{ faq.answer }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 养宠小贴士 -->
		<view class="tip-section">
			<view class="tip-card">
				<text class="tip-icon">💝</text>
				<view class="tip-content">
					<text class="tip-title">养宠小贴士</text>
					<text class="tip-desc">定期驱虫、按时疫苗、科学喂养、适量运动、耐心陪伴</text>
				</view>
			</view>
		</view>

		<!-- 底部 -->
		<view class="footer-section">
			<text class="footer-text">❤️ 用心呵护每一个小生命</text>
			<text class="footer-sub">如有疑问，请咨询在线客服</text>
		</view>

		<!-- 悬浮客服按钮 -->
		<view class="float-btn" @click="openCustomerService">
			<text>💬</text>
			<text class="float-text">客服</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const currentPackage = ref(0)

// ---- Banner数据 ----
const bannerList = ref([
	{
		image: '/static/image/pet.png',
		title: '🐾 新手养宠一站式解决方案',
		sub: '从零开始，轻松成为合格铲屎官'
	},
	{
		image: '/static/image/pet6.png',
		title: '🎁 精选入门套餐限时优惠',
		sub: '基础用品一次配齐，省心省力'
	},
	{
		image: '/static/image/pet8.png',
		title: '📚 养宠知识百科全书',
		sub: '科学养宠，让爱宠健康成长'
	}
])

// ---- 套餐数据 ----
const packageList = ref([
	{
		id: 101,
		name: '基础养宠包',
		tag: '热门',
		tagColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
		desc: '适合初次养宠，包含基础必需品',
		price: 299,
		originPrice: 399,
		items: ['优质猫粮/狗粮 5kg', '基础食盆套装', '宠物窝垫 1个', '梳毛工具 1套', '宠物指甲剪']
	},
	{
		id: 102,
		name: '进阶护理包',
		tag: '推荐',
		tagColor: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
		desc: '适合追求高品质养宠体验',
		price: 499,
		originPrice: 699,
		items: ['高端主粮 5kg', '智能饮水机', '宠物背包', '护理套装', '玩具大礼包']
	},
	{
		id: 103,
		name: '豪华全家桶',
		tag: '超值',
		tagColor: 'linear-gradient(135deg, #F5A623, #F7C948)',
		desc: '一站式配齐，性价比最高',
		price: 899,
		originPrice: 1299,
		items: ['豪华主粮 10kg', '智能喂食器', '猫爬架/狗围栏', '宠物推车', '年度驱虫套餐']
	}
])

// ---- 指南数据（添加 id） ----
const guideList = ref([
	{
		id: 1,
		icon: '🏠',
		title: '新宠到家第一周',
		desc: '如何快速让宠物适应新环境',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)'
	},
	{
		id: 2,
		icon: '🍖',
		title: '科学喂养指南',
		desc: '不同年龄段宠物的饮食建议',
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)'
	},
	{
		id: 3,
		icon: '💉',
		title: '免疫与驱虫',
		desc: '疫苗接种时间表与驱虫计划',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)'
	},
	{
		id: 4,
		icon: '🎓',
		title: '基础训练教程',
		desc: '定点排便、坐下、握手等训练方法',
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)'
	}
])

// ---- 热门推荐（图片使用更大的尺寸） ----
const hotList = ref([
	{
		id: 1,
		name: '鸭肉冻干狗粮',
		price: 32,
		sales: 2341,
		image: '/static/image/food2.png'
	},
	{
		id: 2,
		name: '罐装三文鱼猫粮',
		price: 48,
		sales: 1856,
		image: '/static/image/catfood2.png'
	},
	{
		id: 3,
		name: '宠物梳子套装',
		price: 39,
		sales: 723,
		image: '/static/image/tool3.png'
	},
	{
		id: 4,
		name: '加长版猫窝',
		price: 89,
		sales: 456,
		image: '/static/image/catbed3.png'
	}
])

// ---- 常见问题 ----
const faqList = ref([
	{
		question: '新手养猫应该准备哪些东西？',
		answer: '猫粮、猫砂盆、猫砂、食盆水盆、猫窝、猫抓板、梳毛工具、指甲剪、玩具等。建议一次性配齐基础用品。',
		open: false
	},
	{
		question: '狗狗刚到家晚上一直叫怎么办？',
		answer: '这是正常的分离焦虑。建议将狗窝放在卧室附近，给一些安抚玩具，白天多陪伴互动，逐渐建立安全感。',
		open: false
	},
	{
		question: '宠物疫苗多久打一次？',
		answer: '幼宠第一年需要打3针基础疫苗（每针间隔3-4周），之后每年加强1针。狂犬疫苗每年1针。具体请咨询兽医。',
		open: false
	},
	{
		question: '第一次养宠需要准备多少钱？',
		answer: '基础装备约300-500元，疫苗约200-400元，绝育约500-1500元，每月口粮约100-300元。建议初始预算2000元左右。',
		open: false
	}
])

// ---- 方法 ----
const goBack = () => uni.navigateBack()

const sharePage = () => {
	uni.showToast({ title: '分享功能', icon: 'none' })
}

// ---- 获取全局购物车方法 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 点击套餐卡片（跳转到套餐详情页） ----
const goPackageDetail = (pkg) => {
	uni.navigateTo({
		url: `/pages/newbie/package-detail/package-detail?id=${pkg.id}`
	})
}

// ---- 立即选购套餐（加入购物车） ----
const selectPackage = (pkg) => {
	const cartItem = {
		id: pkg.id || Date.now(),
		name: pkg.name,
		price: pkg.price,
		image: 'https://picsum.photos/id/1062/400/400',
		spec: '套餐包',
		quantity: 1,
		isPackage: true,
		items: pkg.items
	}
	
	if (globalData && typeof globalData.addToCart === 'function') {
		globalData.addToCart(cartItem)
		uni.showToast({
			title: `已加入购物车：${pkg.name}`,
			icon: 'success',
			duration: 1500
		})
	} else {
		uni.showToast({
			title: '购物车服务未初始化',
			icon: 'none'
		})
	}
}

// ---- 点击单个指南 ----
const goGuide = (guide) => {
	uni.navigateTo({ 
		url: `/pages/newbie/guide-detail/guide-detail?id=${guide.id}` 
	})
}

const goGoodsDetail = (item) => {
	uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${item.id}` })
}

const toggleFaq = (index) => {
	faqList.value[index].open = !faqList.value[index].open
}

// ---- 快速入口 ----
const quickEntryList = ref([
	{ 
		icon: '📋', 
		name: '养宠清单', 
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)', 
		path: '/pages/newbie/checklist/checklist'
	},
	{ 
		icon: '🏥', 
		name: '宠物医疗', 
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)', 
		path: '/pages/newbie/medical/medical'
	},
	{ 
		icon: '🛒', 
		name: '用品商城', 
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)', 
		path: '/pages/mall/mall'
	},
	{ 
		icon: '📞', 
		name: '在线咨询', 
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)', 
		path: '/pages/newbie/consult/consult'
	}
])

// ---- 跳转方法 ----
const goQuickEntry = (item) => {
	if (item.path) {
		// 用品商城使用 switchTab，其他使用 navigateTo
		if (item.path === '/pages/mall/mall') {
			uni.switchTab({ url: item.path })
		} else {
			uni.navigateTo({ url: item.path })
		}
	} else {
		uni.showToast({ 
			title: `进入：${item.name}`,
			icon: 'none' 
		})
	}
}

// ---- 查看全部套餐 ----
const viewAllPackages = () => {
	uni.navigateTo({ url: '/pages/newbie/allpackages/allpackages' })
}

// ---- 查看全部指南 ----
const viewAllGuides = () => {
	uni.navigateTo({ url: '/pages/newbie/guides/guides' })
}

// ---- 查看更多商品 ----
const viewAllHot = () => {
	uni.navigateTo({ url: '/pages/newbie/hot/hot' })
}

// ---- 查看全部问题 ----
const viewAllFaq = () => {
	uni.navigateTo({ url: '/pages/newbie/faq/faq' })
}

const openCustomerService = () => {
	uni.showToast({ title: '连接客服中...', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.newbie-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 120rpx;
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

/* ========== Banner轮播 ========== */
.banner-wrap {
	width: 100%;
	height: 380rpx;
	overflow: hidden;
	position: relative;
}
.banner-swiper {
	width: 100%;
	height: 100%;
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
.banner-title {
	display: block;
	font-size: 36rpx;
	font-weight: 700;
	color: #FFFFFF;
	margin-bottom: 6rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.2);
}
.banner-sub {
	font-size: 24rpx;
	color: rgba(255,255,255,0.85);
}

/* ========== 快速入口 ========== */
.quick-entry {
	display: flex;
	justify-content: space-around;
	padding: 30rpx 16rpx 24rpx;
	background: #FFFFFF;
	margin: 30rpx 24rpx 0;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	position: relative;
	z-index: 2;
}
.quick-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.94);
	}
}
.quick-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
}
.quick-name {
	font-size: 24rpx;
	color: #333;
	font-weight: 500;
}

/* ========== 通用Section ========== */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx 32rpx 16rpx;
}
.header-left {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}
.header-right {
	font-size: 24rpx;
	color: #999;
	flex-shrink: 0;
}
.section-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1A1A1A;
}
.section-sub {
	font-size: 24rpx;
	color: #999;
}

/* ========== 套餐选择 ========== */
.package-section {
	margin: 8rpx 0;
}
.package-scroll {
	white-space: nowrap;
	padding: 0 16rpx 16rpx;
}
.package-list {
	display: flex;
	gap: 20rpx;
	padding: 0 16rpx;
}
.package-card {
	background: #FFFFFF;
	border-radius: 28rpx;
	padding: 24rpx 28rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	position: relative;
	transition: all 0.3s;
	border: 3rpx solid transparent;
	min-width: 420rpx;
	max-width: 500rpx;
	&.active {
		border-color: #D49A55;
		box-shadow: 0 8rpx 24rpx rgba(212, 154, 85, 0.15);
	}
}
.package-tag {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	padding: 4rpx 18rpx;
	color: #fff;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 30rpx;
}
.package-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 4rpx;
}
.package-desc {
	font-size: 24rpx;
	color: #999;
	display: block;
	margin-bottom: 10rpx;
}
.package-price {
	display: flex;
	align-items: baseline;
	gap: 10rpx;
	margin-bottom: 12rpx;
}
.price-symbol {
	font-size: 24rpx;
	color: #D44C4C;
	font-weight: 600;
}
.price-num {
	font-size: 40rpx;
	font-weight: 800;
	color: #D44C4C;
}
.price-origin {
	font-size: 22rpx;
	color: #B0A8A0;
	text-decoration: line-through;
}
.package-items {
	display: flex;
	flex-wrap: wrap;
	gap: 6rpx 14rpx;
	margin-bottom: 16rpx;
}
.package-items .item {
	font-size: 22rpx;
	color: #666;
}
.package-btn {
	width: 100%;
	height: 66rpx;
	background: linear-gradient(135deg, #E8B880, #D49A55);
	border-radius: 33rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 26rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.2);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.96);
	}
}
.package-card.active .package-btn {
	background: linear-gradient(135deg, #D49A55, #B8860B);
}

/* ========== 新手指南 ========== */
.guide-section {
	margin: 8rpx 0;
}
.guide-list {
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}
.guide-item {
	display: flex;
	align-items: center;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 18rpx 22rpx;
	gap: 18rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.97);
	}
}
.guide-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	flex-shrink: 0;
}
.guide-info {
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
.guide-arrow {
	font-size: 32rpx;
	color: #B0A8A0;
}

/* ========== 热门推荐（左右滑动 + 宽卡片） ========== */
.hot-section {
	margin: 8rpx 0;
}
.hot-scroll {
	white-space: nowrap;
	padding: 0 16rpx 16rpx;
}
.hot-list {
	display: flex;
	gap: 20rpx;
	padding: 0 16rpx;
}
.hot-item {
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
	width: 260rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.06);
	transition: transform 0.2s;
	flex-shrink: 0;
	&:active {
		transform: scale(0.95);
	}
}
.hot-img {
	width: 260rpx;
	height: 260rpx;
	object-fit: cover;
	background: #F0EDE8;
}
.hot-info {
	padding: 16rpx 18rpx 20rpx;
	white-space: normal;
}
.hot-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.hot-meta {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
}
.hot-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #D44C4C;
}
.hot-price::before {
	content: '¥';
	font-size: 22rpx;
}
.hot-sales {
	font-size: 22rpx;
	color: #B0A8A0;
}

/* ========== 常见问题 ========== */
.faq-section {
	margin: 8rpx 0;
}
.faq-list {
	padding: 0 32rpx;
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}
.faq-item {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 18rpx 22rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}
.faq-question {
	display: flex;
	align-items: center;
	gap: 8rpx;
}
.faq-q {
	font-size: 26rpx;
	font-weight: 700;
	color: #D49A55;
	flex-shrink: 0;
}
.faq-text {
	font-size: 26rpx;
	color: #1A1A1A;
	flex: 1;
	line-height: 1.5;
}
.faq-arrow {
	font-size: 30rpx;
	color: #999;
	flex-shrink: 0;
}
.faq-answer {
	display: flex;
	gap: 8rpx;
	padding-top: 14rpx;
	margin-top: 14rpx;
	border-top: 1rpx solid #F5F4F0;
}
.faq-a {
	font-size: 26rpx;
	font-weight: 700;
	color: #D49A55;
	flex-shrink: 0;
}
.faq-answer .faq-text {
	color: #666;
	font-weight: 400;
}

/* ========== 养宠小贴士 ========== */
.tip-section {
	padding: 16rpx 32rpx 8rpx;
}
.tip-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	background: linear-gradient(135deg, #FFF5E4, #FFECD2);
	border-radius: 20rpx;
	padding: 24rpx 28rpx;
	border: 1rpx solid rgba(212, 154, 85, 0.15);
}
.tip-icon {
	font-size: 48rpx;
	flex-shrink: 0;
}
.tip-content {
	flex: 1;
}
.tip-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #5D4037;
	display: block;
	margin-bottom: 4rpx;
}
.tip-desc {
	font-size: 24rpx;
	color: #8D6E63;
	line-height: 1.5;
}

/* ========== 底部 ========== */
.footer-section {
	padding: 32rpx 0 20rpx;
	text-align: center;
}
.footer-text {
	font-size: 26rpx;
	color: #B0A8A0;
	letter-spacing: 2rpx;
	display: block;
}
.footer-sub {
	font-size: 22rpx;
	color: #CCC;
	display: block;
	margin-top: 6rpx;
}

/* ========== 悬浮客服按钮 ========== */
.float-btn {
	position: fixed;
	right: 32rpx;
	bottom: 200rpx;
	width: 88rpx;
	height: 88rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 24rpx rgba(212, 154, 85, 0.3);
	z-index: 99;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.9);
	}
}
.float-btn text:first-child {
	font-size: 32rpx;
	color: #fff;
}
.float-text {
	font-size: 18rpx;
	color: #fff;
	margin-top: 2rpx;
}
</style>