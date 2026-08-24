<template>
	<view class="category-goods">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">{{ categoryName }}</text>
			<view class="nav-right" @click="showSearch">
				<image class="search-icon" src="/static/tab/search.png"></image>
			</view>
		</view>

		<!-- 搜索栏 -->
		<view class="search-bar-wrap" v-if="searchVisible">
			<view class="search-bar">
				<image class="search-icon" src="/static/tab/search.png"></image>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索商品名称、分类..." 
					placeholder-class="search-placeholder"
					@confirm="onSearchConfirm"
					confirm-type="search"
				/>
				<text class="search-clear" v-if="searchKeyword" @click="clearSearch">✕</text>
			</view>
			<text class="search-cancel" @click="hideSearch">取消</text>
		</view>

		<!-- 二级分类Tab -->
		<scroll-view class="tab-scroll" scroll-x show-scrollbar="false" v-show="!searchVisible">
			<view class="tab-list">
				<view 
					class="tab-item" 
					:class="{ active: currentTab === item.value }"
					v-for="item in tabList" 
					:key="item.value"
					@click="switchTab(item.value)"
				>
					{{ item.label }}
				</view>
			</view>
		</scroll-view>

		<!-- 搜索结果统计 -->
		<view class="search-result-stats" v-if="searchVisible && searchKeyword">
			<text>共找到 {{ filteredGoods.length }} 件商品</text>
		</view>

		<!-- 商品列表 -->
		<scroll-view 
			class="goods-scroll" 
			scroll-y 
			:style="{ height: scrollHeight + 'px' }"
			@scrolltolower="loadMore"
		>
			<view class="goods-grid">
				<view class="goods-card" v-for="item in displayList" :key="item.id" @click="goDetail(item)">
					<view class="goods-img-wrap">
						<image class="goods-img" :src="item.image" mode="aspectFill" />
						<view class="goods-tag">{{ item.category }}</view>
						<view class="more-btn" @click.stop="handleMore(item)">⋯</view>
						<view class="goods-badge" v-if="item.badge">{{ item.badge }}</view>
					</view>
					<view class="goods-info">
						<text class="goods-name">{{ item.name }}</text>
						<text class="goods-desc">{{ item.desc }}</text>
						<view class="goods-footer">
							<text class="goods-price">{{ item.price }}</text>
							<view class="add-cart-btn" @click.stop="openSpecModal(item)">加入购物车</view>
						</view>
					</view>
				</view>
			</view>
			<view class="load-more" v-if="displayList.length > 0">
				<text v-if="loading">加载中...</text>
				<text v-else-if="!hasMore">— 已加载全部 —</text>
				<text v-else>上拉加载更多</text>
			</view>
			<view v-if="displayList.length === 0" class="empty">
				<text>暂无相关商品</text>
			</view>
		</scroll-view>

		<!-- 规格选择弹窗 -->
		<view class="modal-mask" v-if="showModal" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择规格</text>
					<text class="modal-close" @click="closeModal">✕</text>
				</view>
				<view class="modal-goods-info" v-if="selectedGoods">
					<image class="modal-goods-img" :src="selectedGoods.image" mode="aspectFill" />
					<view class="modal-goods-detail">
						<text class="modal-goods-name">{{ selectedGoods.name }}</text>
						<text class="modal-goods-price">{{ selectedGoods.price }}</text>
					</view>
				</view>
				<view class="modal-body">
					<view class="spec-group" v-if="selectedGoods">
						<text class="spec-label">规格</text>
						<view class="spec-options">
							<view 
								class="spec-option" 
								:class="{ active: currentSpec === index }"
								v-for="(spec, index) in selectedGoods.specs" 
								:key="index"
								@click="currentSpec = index"
							>
								{{ spec }}
							</view>
						</view>
					</view>
					<view class="qty-group">
						<text class="qty-label">数量</text>
						<view class="qty-control">
							<view class="qty-btn" @click="qty > 1 && qty--">-</view>
							<text class="qty-num">{{ qty }}</text>
							<view class="qty-btn" @click="qty++">+</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="modal-btn confirm" @click="confirmAddToCart">确定加入</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 获取全局购物车方法
const app = getApp()
const { addToCart: addToGlobalCart } = app.globalData

// ---- 状态 ----
const categoryName = ref('')
const currentTab = ref('all')
const loading = ref(false)
const hasMore = ref(true)
const scrollHeight = ref(0)

const searchVisible = ref(false)
const searchKeyword = ref('')

// 弹窗
const showModal = ref(false)
const selectedGoods = ref(null)
const currentSpec = ref(0)
const qty = ref(1)

// ---- Tab数据 ----
const tabList = ref([
	{ label: '综合', value: 'all' },
	{ label: '销量', value: 'sales' },
	{ label: '价格', value: 'price' },
	{ label: '上新', value: 'new' }
])

// ---- 商品数据 ----
const allGoods = ref([
	{
		id: 1,
		name: '鸭肉冻干狗粮',
		category: '主粮',
		desc: '新鲜鸭肉制作，无任何添加剂，放心给毛孩子食用...',
		price: 32,
		image: '/static/image/food2.png',
		specs: ['50g 尝鲜装', '150g 标准装', '300g 家庭装'],
		sales: 2341,
		badge: '热销'
	},
	{
		id: 2,
		name: '罐装三文鱼猫粮',
		category: '主粮',
		desc: '新鲜三文鱼制作，无任何添加剂，放心给毛孩子食用...',
		price: 48,
		image:  '/static/image/catfood2.png',
		specs: ['400g 装', '1.5kg 装', '3kg 装'],
		sales: 1856,
		badge: ''
	},
	{
		id: 3,
		name: '洗发水',
		category: '清洁',
		desc: '天然植物制作，无任何添加剂，放心给毛孩子使用...',
		price: 25,
		image: '/static/image/bath3.png',
		specs: ['200ml', '500ml'],
		sales: 723,
		badge: '新品'
	},
	{
		id: 4,
		name: '加长版猫窝',
		category: '窝具',
		desc: '新疆棉花手工制作，无任何有害物质，放心给毛孩子使用...',
		price: 89,
		image: '/static/image/catbed2.png',
		specs: ['S', 'M', 'L'],
		sales: 456,
		badge: ''
	},
	{
		id: 5,
		name: '鸡肉冻干零食',
		category: '零食',
		desc: '优质鸡胸肉冻干，营养丰富，适口性极佳',
		price: 28,
		image: '/static/image/chicken4.png',
		specs: ['100g', '200g', '500g'],
		sales: 3120,
		badge: ''
	},
	{
		id: 6,
		name: '海洋鱼猫粮',
		category: '主粮',
		desc: '多种深海鱼混合，补充Omega‑3，呵护皮毛',
		price: 56,
		image: '/static/image/fish3.png',
		specs: ['1kg', '3kg', '5kg'],
		sales: 932,
		badge: '新品'
	},
	{
		id: 7,
		name: '宠物指甲剪套装',
		category: '护理',
		desc: '静音设计，安全防滑，新手也能轻松操作',
		price: 35,
		image: '/static/image/tool1.png',
		specs: ['标准款', '豪华款'],
		sales: 567,
		badge: '热销'
	}
])

// ---- 搜索 + 筛选 + 排序 ----
const filteredGoods = computed(() => {
	let list = [...allGoods.value]
	if (categoryName.value) {
		list = list.filter(item => item.category === categoryName.value)
	}
	if (searchKeyword.value.trim()) {
		const keyword = searchKeyword.value.trim().toLowerCase()
		list = list.filter(item => {
			return item.name.toLowerCase().includes(keyword) ||
				   item.desc.toLowerCase().includes(keyword) ||
				   item.category.toLowerCase().includes(keyword)
		})
	}
	switch (currentTab.value) {
		case 'sales':
			list.sort((a, b) => (b.sales || 0) - (a.sales || 0))
			break
		case 'price':
			list.sort((a, b) => a.price - b.price)
			break
		case 'new':
			list.sort((a, b) => b.id - a.id)
			break
		default:
			break
	}
	return list
})

// ---- 分页 ----
const pageSize = 6
const currentPage = ref(1)

const displayList = computed(() => {
	const end = currentPage.value * pageSize
	return filteredGoods.value.slice(0, end)
})

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

// ---- 切换Tab ----
const switchTab = (value) => {
	currentTab.value = value
	currentPage.value = 1
	hasMore.value = true
}

// ---- 搜索方法 ----
const showSearch = () => {
	searchVisible.value = true
	nextTick(() => {
		const input = document.querySelector('.search-input')
		if (input) input.focus()
	})
}
const hideSearch = () => {
	searchVisible.value = false
	searchKeyword.value = ''
	currentPage.value = 1
	hasMore.value = true
}
const clearSearch = () => {
	searchKeyword.value = ''
	currentPage.value = 1
	hasMore.value = true
}
const onSearchConfirm = () => {
	currentPage.value = 1
	hasMore.value = true
}

watch(searchKeyword, () => {
	currentPage.value = 1
	hasMore.value = true
})

// ---- 弹窗方法 ----
const openSpecModal = (item) => {
	selectedGoods.value = item
	currentSpec.value = 0
	qty.value = 1
	showModal.value = true
}
const closeModal = () => {
	showModal.value = false
	selectedGoods.value = null
}
const confirmAddToCart = () => {
	if (!selectedGoods.value) return
	const spec = selectedGoods.value.specs[currentSpec.value] || '默认规格'
	addToGlobalCart({
		id: selectedGoods.value.id,
		name: selectedGoods.value.name,
		price: selectedGoods.value.price,
		image: selectedGoods.value.image,
		spec: spec,
		quantity: qty.value
	})
	uni.showToast({
		title: `已加入 ${selectedGoods.value.name} ×${qty.value}`,
		icon: 'success',
		duration: 1500
	})
	closeModal()
}

// ---- 交互方法 ----
const goBack = () => uni.navigateBack()
const goDetail = (item) => {
	uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${item.id}` })
}
const handleMore = (item) => {
	uni.showActionSheet({
		itemList: ['分享', '收藏', '举报'],
		success: (res) => {
			uni.showToast({ title: `已${['分享','收藏','举报'][res.tapIndex]}`, icon: 'none' })
		}
	})
}

// ---- 计算滚动高度 ----
onMounted(() => {
	const sys = uni.getSystemInfoSync()
	const statusBarHeight = sys.statusBarHeight || 0
	scrollHeight.value = sys.windowHeight - statusBarHeight - 170
})

onLoad((options) => {
	categoryName.value = decodeURIComponent(options.category || '')
})
</script>

<style lang="scss" scoped>
.category-goods {
	min-height: 100vh;
	background: #F5F4F0;
}

/* ========== 顶部导航栏 ========== */
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
	font-weight: 600;
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
}
.search-icon {
	width: 20px;
	height: 20px;
	margin-right: 14rpx;
	opacity: 0.5;
}

/* ========== 搜索栏 ========== */
.search-bar-wrap {
	background: #FFFFFF;
	padding: 0 32rpx 20rpx;
	display: flex;
	align-items: center;
	gap: 16rpx;
}
.search-bar {
	flex: 1;
	display: flex;
	align-items: center;
	background: #F5F4F0;
	border-radius: 30rpx;
	padding: 12rpx 20rpx;
	border: 2rpx solid transparent;
	transition: border-color 0.3s;
	&:focus-within {
		border-color: #D49A55;
		background: #FFFFFF;
	}
}
.search-bar .search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	height: 48rpx;
}
.search-bar .search-placeholder {
	color: #B0A8A0;
}
.search-bar .search-clear {
	font-size: 28rpx;
	color: #999;
	padding: 4rpx 8rpx;
}
.search-cancel {
	font-size: 28rpx;
	color: #D49A55;
	flex-shrink: 0;
	font-weight: 500;
}

/* ========== 搜索结果统计 ========== */
.search-result-stats {
	background: #FFFFFF;
	padding: 8rpx 32rpx 16rpx;
	font-size: 24rpx;
	color: #999;
	border-bottom: 1rpx solid #F0EDE8;
}

/* ========== 二级Tab ========== */
.tab-scroll {
	background: #FFFFFF;
	padding: 0 32rpx 16rpx;
	border-bottom: 1rpx solid #F0EDE8;
	white-space: nowrap;
}
.tab-list {
	display: flex;
	align-items: center;
	gap: 40rpx;
}
.tab-item {
	font-size: 28rpx;
	color: #666;
	padding: 8rpx 4rpx;
	position: relative;
	transition: all 0.3s;
	flex-shrink: 0;
}
.tab-item.active {
	color: #D49A55;
	font-weight: 600;
}
.tab-item.active::after {
	content: '';
	position: absolute;
	bottom: -16rpx;
	left: 50%;
	transform: translateX(-50%);
	width: 28rpx;
	height: 4rpx;
	background: #D49A55;
	border-radius: 4rpx;
}

/* ========== 商品列表 ========== */
.goods-scroll {
	background: #F5F4F0;
	padding: 24rpx 16rpx 0;
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
	border-radius: 28rpx;
	padding: 16rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s;
	display: flex;
	flex-direction: column;
	&:active {
		transform: scale(0.97);
	}
}

/* ===== 图片区域 ===== */
.goods-img-wrap {
	position: relative;
	width: 100%;
	border-radius: 20rpx;
	overflow: hidden;
	background: #F0EDE8;
	flex-shrink: 0;
}
.goods-img {
	width: 100%;
	height: 280rpx;
	object-fit: cover;
	display: block;
}
.goods-tag {
	position: absolute;
	top: 14rpx;
	left: 14rpx;
	padding: 4rpx 16rpx;
	background: rgba(139, 111, 71, 0.9);
	color: #fff;
	font-size: 20rpx;
	font-weight: 500;
	border-radius: 24rpx;
	z-index: 2;
	backdrop-filter: blur(4rpx);
	-webkit-backdrop-filter: blur(4rpx);
}
.more-btn {
	position: absolute;
	top: 14rpx;
	right: 14rpx;
	width: 44rpx;
	height: 44rpx;
	background: rgba(255,255,255,0.85);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #666;
	font-size: 26rpx;
	font-weight: 600;
	z-index: 2;
	backdrop-filter: blur(4rpx);
	-webkit-backdrop-filter: blur(4rpx);
}
.goods-badge {
	position: absolute;
	bottom: 14rpx;
	right: 14rpx;
	padding: 4rpx 16rpx;
	background: linear-gradient(135deg, #FF6B6B, #EE4444);
	color: #FFFFFF;
	font-size: 20rpx;
	font-weight: 600;
	border-radius: 20rpx;
	z-index: 2;
	box-shadow: 0 2rpx 8rpx rgba(238, 68, 68, 0.3);
}

/* ===== 商品信息 ===== */
.goods-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	padding-top: 14rpx;
	flex: 1;
}

.goods-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #2C2C2C;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.goods-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	min-height: 60rpx;
}

.goods-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10rpx;
	padding-top: 10rpx;
	border-top: 1rpx solid #F0EDE8;
}

.goods-price {
	font-size: 34rpx;
	font-weight: 800;
	color: #D44C4C;
}
.goods-price::before {
	content: '¥';
	font-size: 26rpx;
	font-weight: 600;
	margin-right: 2rpx;
}

.add-cart-btn {
	padding: 10rpx 22rpx;
	background: #E8B880;
	color: #FFFFFF;
	font-size: 22rpx;
	font-weight: 500;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.2);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.92);
	}
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
	text-align: center;
	padding: 120rpx 0;
	font-size: 28rpx;
	color: #B0A8A0;
	background: #F5F4F0;
}

/* ========== 弹窗（与 mall.vue 完全一致） ========== */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.4);
	z-index: 999;
	display: flex;
	align-items: flex-end;
	justify-content: center;
	animation: fadeIn 0.25s;
}
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
.modal-content {
	background: #FFFFFF;
	width: 100%;
	border-radius: 32rpx 32rpx 0 0;
	padding: 32rpx 32rpx 48rpx;
	max-height: 70vh;
	animation: slideUp 0.3s;
}
@keyframes slideUp {
	from { transform: translateY(100%); }
	to { transform: translateY(0); }
}
.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}
.modal-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #333;
}
.modal-close {
	font-size: 40rpx;
	color: #999;
	padding: 8rpx;
}

/* 商品信息展示区（含图片） */
.modal-goods-info {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 20rpx 0 24rpx;
	border-bottom: 1rpx solid #F0EDE8;
	margin-bottom: 24rpx;
}
.modal-goods-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 16rpx;
	object-fit: cover;
	background: #F0EDE8;
	flex-shrink: 0;
}
.modal-goods-detail {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
}
.modal-goods-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #2C2C2C;
	line-height: 1.3;
}
.modal-goods-price {
	font-size: 32rpx;
	font-weight: 700;
	color: #D44C4C;
}
.modal-goods-price::before {
	content: '¥';
	font-size: 26rpx;
	font-weight: 600;
	margin-right: 2rpx;
}

.modal-body {
	display: flex;
	flex-direction: column;
	gap: 28rpx;
}
.spec-group, .qty-group {
	display: flex;
	align-items: center;
}
.spec-label, .qty-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	width: 100rpx;
	flex-shrink: 0;
}
.spec-options {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	flex: 1;
}
.spec-option {
	padding: 10rpx 28rpx;
	background: #F5F5F5;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.2s;
}
.spec-option.active {
	background: #FFF5E4;
	border-color: #D49A55;
	color: #D49A55;
}
.qty-control {
	display: flex;
	align-items: center;
	border: 1rpx solid #E0E0E0;
	border-radius: 8rpx;
	overflow: hidden;
}
.qty-btn {
	width: 56rpx;
	height: 56rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #333;
	background: #F8F8F8;
}
.qty-num {
	width: 80rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}
.modal-footer {
	margin-top: 40rpx;
}
.modal-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #E8B880, #D49A55);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.25);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.96);
	}
}
</style>