<template>
	<view class="mall-page">
		<!-- 头部区域 -->
		<view class="header-wrap">
			<view class="header-row">
				<view class="header-placeholder"></view>
				<text class="page-title">宠物好物精选</text>
				<view class="header-right" @click="goMessage">
					<image class="msg-icon" src="/pages/static/tab/message.png"></image>
					<view class="msg-dot" v-if="hasNewMsg"></view>
				</view>
			</view>
			<view class="search-wrap">
				<view class="search-box">
					<image class="search-icon" src="/pages/static/tab/search.png"></image>
					<input 
						class="search-input" 
						placeholder="搜索猫粮、狗粮、玩具、猫砂" 
						placeholder-class="search-placeholder"
						placeholder-style="color: rgba(255,255,255,0.7)"
					/>
				</view>
			</view>
		</view>

		<!-- 分类图标 -->
		<view class="category-list">
			<view class="category-item" v-for="item in categoryList" :key="item.id" @click="goCategoryGoods(item.name)">
				<view class="cate-icon" :style="{ background: item.bgColor }">
					<text class="icon-text">{{ item.icon }}</text>
				</view>
				<text class="cate-name">{{ item.name }}</text>
			</view>
		</view>

		<!-- Banner -->
		<view class="beginner-banner" @click="goNewbie">
			<view class="banner-content">
				<text class="banner-title">🎁 新手养宠入门包</text>
				<text class="banner-sub">基础用品一次备齐</text>
				<view class="check-btn">立即查看</view>
			</view>
			<view class="banner-img">
				<view class="goods-demo">
					<view class="bowl"><text>🐾</text></view>
					<view class="jar"><text>🦴</text></view>
					<view class="stick"></view>
				</view>
			</view>
		</view>

		<!-- ⭐ 商品列表 - 添加调试信息 -->
		<view class="goods-grid" v-if="goodsList.length > 0">
			<view class="goods-card" v-for="item in goodsList" :key="item.id" @click="goGoodsDetail(item)">
				<view class="goods-img-wrap">
					<image class="goods-img" :src="item.image" mode="aspectFill" />
					<view class="goods-tag">{{ item.category }}</view>
					<view class="more-btn" @click.stop="handleMore(item)">
						<image class="more" src="/pages/static/tab/more.png"></image>
					</view>
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

		<!-- ⭐ 空状态 -->
		<view class="empty-state" v-else>
			<text class="empty-icon">🛒</text>
			<text class="empty-text">暂无商品</text>
		</view>

		<!-- 可拖拽悬浮购物车 -->
		<view 
			class="float-cart" 
			:style="cartStyle"
			@touchstart="onTouchStart"
			@touchmove="onTouchMove"
			@touchend="onTouchEnd"
			@click="goCart"
		>
			<text>🛒</text>
			<view class="cart-badge" v-if="cartTotalCount > 0">{{ cartTotalCount }}</view>
		</view>

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
						<view class="modal-price-row">
							<text class="modal-goods-price">{{ currentPrice }}</text>
							<text class="modal-origin-price" v-if="currentOriginPrice">¥{{ currentOriginPrice }}</text>
						</view>
						<text class="modal-stock" v-if="currentStock">库存 {{ currentStock }} 件</text>
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
								@click="selectSpec(index)"
							>
								<view class="spec-name">{{ spec.name }}</view>
								<view class="spec-price">¥{{ spec.price }}</view>
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
					<view class="modal-total">
						<text class="total-label">合计</text>
						<text class="total-price">¥{{ (currentPrice * qty).toFixed(2) }}</text>
					</view>
					<view class="modal-btn confirm" @click="confirmAddToCart">确定加入</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// ---- 安全获取 globalData ----
const getGlobal = () => {
  const app = getApp()
  if (app && app.globalData) {
    return app.globalData
  }
  return null
}

// ---- 状态 ----
const hasNewMsg = ref(true)
const cartX = ref(0)
const cartY = ref(0)
const cartSize = 50
const screenInfo = ref({ width: 0, height: 0, bottomHeight: 0, cartSize: 0 })
const showModal = ref(false)
const selectedGoods = ref(null)
const currentSpec = ref(0)
const qty = ref(1)
const goodsList = ref([])  // ⭐ 改为 ref，不再使用 computed

// ---- 当前选中的规格信息 ----
const currentSpecData = computed(() => {
	if (!selectedGoods.value) return null
	const specs = selectedGoods.value.specs || []
	return specs[currentSpec.value] || null
})

// ---- 当前价格 ----
const currentPrice = computed(() => {
	if (currentSpecData.value) {
		return currentSpecData.value.price
	}
	return selectedGoods.value?.price || 0
})

const currentOriginPrice = computed(() => {
	if (currentSpecData.value && currentSpecData.value.originPrice) {
		return currentSpecData.value.originPrice
	}
	return selectedGoods.value?.originPrice || null
})

const currentStock = computed(() => {
	if (currentSpecData.value) {
		return currentSpecData.value.stock || 999
	}
	return selectedGoods.value?.stock || 999
})

// ---- 购物车数据 ----
const cartTotalCount = computed(() => {
  const g = getGlobal()
  return g?.cartTotalCount?.value || 0
})

// ---- 分类数据 ----
const categoryList = ref([
	{ id: 1, name: '主粮', icon: '🍚', bgColor: '#F2C89C' },
	{ id: 2, name: '零食', icon: '🦴', bgColor: '#A4C7E8' },
	{ id: 3, name: '清洁', icon: '🧴', bgColor: '#FFE08A' },
	{ id: 4, name: '护理', icon: '🪥', bgColor: '#B8E0D2' },
	{ id: 5, name: '窝具', icon: '⚽', bgColor: '#F0B8C8' }
])

// ---- ⭐ 加载商品数据 ----
const loadGoodsData = () => {
  const g = getGlobal()
  console.log('🔄 loadGoodsData 被调用, globalData:', g)
  
  if (g && g.goodsData) {
    // 如果 goodsData 是 ref，需要取 .value
    const data = g.goodsData.value || g.goodsData
    console.log('📦 获取到商品数据:', data)
    if (data && data.length > 0) {
      goodsList.value = data
      console.log('✅ goodsList 已更新，长度:', goodsList.value.length)
    } else {
      console.warn('⚠️ goodsData 为空或长度为0')
      // 尝试直接获取
      if (g.getGoodsList) {
        const list = g.getGoodsList()
        console.log('📦 通过 getGoodsList 获取:', list)
        if (list && list.length > 0) {
          goodsList.value = list
        }
      }
    }
  } else {
    console.warn('⚠️ globalData 或 goodsData 不存在')
  }
}

// ---- 收藏状态 ----
const favoriteStatus = ref({})

// ---- 初始化收藏状态 ----
const initFavoriteStatus = () => {
	const g = getGlobal()
	const favorites = g?.favorites?.value || []
	goodsList.value.forEach(goods => {
		favoriteStatus.value[goods.id] = favorites.some(f => f.id === goods.id && f.type === 'goods')
	})
}

// ---- 页面显示时加载数据 ----
onShow(() => {
	console.log('📱 mall onShow')
	loadGoodsData()
	initFavoriteStatus()
})

// ---- 计算购物车样式 ----
const cartStyle = computed(() => ({
	position: 'fixed',
	left: cartX.value + 'px',
	top: cartY.value + 'px',
	width: cartSize + 'px',
	height: cartSize + 'px',
	zIndex: 99,
}))

// ---- 触摸拖拽 ----
let startX = 0, startY = 0
let startCartX = 0, startCartY = 0
const onTouchStart = (e) => {
	const touch = e.touches[0]
	startX = touch.clientX
	startY = touch.clientY
	startCartX = cartX.value
	startCartY = cartY.value
}
const onTouchMove = (e) => {
	const touch = e.touches[0]
	const deltaX = touch.clientX - startX
	const deltaY = touch.clientY - startY
	let newX = startCartX + deltaX
	let newY = startCartY + deltaY
	const info = screenInfo.value
	const maxX = Math.max(0, info.width - info.cartSize)
	const maxY = Math.max(0, info.height - info.bottomHeight - info.cartSize)
	newX = Math.max(0, Math.min(newX, maxX))
	newY = Math.max(0, Math.min(newY, maxY))
	cartX.value = newX
	cartY.value = newY
}
const onTouchEnd = () => {}

// ---- 初始化位置 ----
onMounted(() => {
	console.log('🔄 mall onMounted')
	// 先加载数据
	loadGoodsData()
	initFavoriteStatus()
	
	const sys = uni.getSystemInfoSync()
	const windowWidth = sys.windowWidth
	const windowHeight = sys.windowHeight
	const safeAreaBottom = sys.safeAreaInsets ? sys.safeAreaInsets.bottom : 0
	let tabHeight = 50
	// #ifdef H5
	try {
		const query = uni.createSelectorQuery().in(getCurrentInstance().proxy)
		query.select('.uni-tabbar').boundingClientRect((rect) => {
			if (rect) {
				tabHeight = rect.height
			}
		}).exec()
	} catch(e) {}
	// #endif
	const bottomHeight = tabHeight + safeAreaBottom
	const cartSizePx = cartSize * windowWidth / 750
	screenInfo.value = {
		width: windowWidth,
		height: windowHeight,
		bottomHeight: bottomHeight,
		cartSize: cartSizePx
	}
	const initialX = windowWidth - cartSizePx - 10
	const initialY = windowHeight - bottomHeight - cartSizePx - 10
	cartX.value = initialX
	cartY.value = initialY
})

// ---- 跳转方法 ----
const goMessage = () => {
	uni.switchTab({ url: '/pages/message/message' })
}
const goNewbie = () => {
	uni.navigateTo({ url: '/pages/newbie/newbie' })
}
const goCategoryGoods = (category) => {
	uni.navigateTo({ url: `/pages/category-goods/category-goods?category=${encodeURIComponent(category)}` })
}

// ---- 跳转商品详情 ----
const goGoodsDetail = (item) => {
  uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${item.id}` })
}

// ---- 更多操作 ----
const handleMore = (item) => {
	const isFav = favoriteStatus.value[item.id] || false
	uni.showActionSheet({
		itemList: ['分享', isFav ? '取消收藏' : '收藏', '举报'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.showToast({ title: '分享功能', icon: 'none' })
			} else if (res.tapIndex === 1) {
				toggleFavorite(item)
			} else if (res.tapIndex === 2) {
				uni.showToast({ title: '已举报', icon: 'none' })
			}
		}
	})
}

// ---- 切换收藏 ----
let favLock = false
const toggleFavorite = async (item) => {
	if(favLock) return
	favLock = true
	const g = getGlobal()
	const favoriteItem = {
		id: item.id,
		name: item.name,
		price: item.price,
		image: item.image,
		type: 'goods'
	}
	const isCurrentlyFav = favoriteStatus.value[item.id] || false
	if (isCurrentlyFav) {
		if (g.removeFavorite) {
			const result = g.removeFavorite(item.id, 'goods')
			if (result) {
				favoriteStatus.value[item.id] = false
				uni.showToast({ title: '已取消收藏', icon: 'none' })
			}
		}
	} else {
		if (g.addFavorite) {
			const result = g.addFavorite(favoriteItem)
			if (result) {
				favoriteStatus.value[item.id] = true
				uni.showToast({ title: '收藏成功', icon: 'success' })
			} else {
				uni.showToast({ title: '已收藏过了', icon: 'none' })
			}
		}
	}
	favLock = false
}

// ---- 跳转购物车 ----
const goCart = () => {
	uni.navigateTo({ url: '/pages/cart/cart' })
}

// ---- 打开规格弹窗 ----
const openSpecModal = (item) => {
	selectedGoods.value = item
	currentSpec.value = 0
	qty.value = 1
	showModal.value = true
}

// ---- 选择规格 ----
const selectSpec = (index) => {
	currentSpec.value = index
	qty.value = 1
}

// ---- 关闭弹窗 ----
const closeModal = () => {
	showModal.value = false
	selectedGoods.value = null
}

// ---- 确认加入购物车 ----
const confirmAddToCart = () => {
	if (!selectedGoods.value) {
		console.warn('selectedGoods is null')
		return
	}
	const g = getGlobal()
	const specList = selectedGoods.value.specs || []
	const specData = specList[currentSpec.value]
	const specName = specData ? specData.name : '默认规格'
	const specPrice = specData ? specData.price : selectedGoods.value.price
	
	if (g && typeof g.addToCart === 'function') {
		g.addToCart({
			id: selectedGoods.value.id,
			name: selectedGoods.value.name,
			price: specPrice,
			image: selectedGoods.value.image,
			spec: specName,
			quantity: qty.value
		})
		uni.showToast({
			title: `已加入 ${selectedGoods.value.name} ×${qty.value}`,
			icon: 'success',
			duration: 1500
		})
	} else {
		uni.showToast({
			title: '购物车服务未初始化',
			icon: 'none'
		})
	}
	closeModal()
}
</script>

<style lang="scss" scoped>
.mall-page {
	background: #F5F4F0;
	min-height: 100vh;
	padding-bottom: 160rpx;
}

/* ========== 头部 ========== */
.header-wrap {
	background: linear-gradient(135deg, #E8C9A0 0%, #D49A55 100%);
	padding: 64rpx 32rpx 36rpx;
	border-radius: 0 0 44rpx 44rpx;
}

.header-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 28rpx;
}
.header-placeholder {
	width: 48rpx;
	flex-shrink: 0;
}
.page-title {
	font-size: 46rpx;
	font-weight: 700;
	color: #4A2C1A;
	letter-spacing: 3rpx;
	flex: 1;
	text-align: center;
}
.header-right {
	position: relative;
	width: 48rpx;
	height: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.msg-icon {
	width: 20px;
	height: 20px;
}
.msg-dot {
	position: absolute;
	top: 0;
	right: 0;
	width: 16rpx;
	height: 16rpx;
	background: #FF4D4F;
	border-radius: 50%;
	border: 2rpx solid #D49A55;
}

/* ========== 搜索框 ========== */
.search-wrap {
	display: flex;
	align-items: center;
	gap: 16rpx;
}
.search-box {
	flex: 1;
	display: flex;
	align-items: center;
	background: rgba(255, 255, 255, 0.15);
	border: 2rpx solid rgba(255, 255, 255, 0.5);
	border-radius: 60rpx;
	padding: 16rpx 28rpx;
	backdrop-filter: blur(8rpx);
	-webkit-backdrop-filter: blur(8rpx);
	transition: all 0.3s;
	&:focus-within {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.8);
	}
}
.search-icon {
	width: 20px;
	height: 20px;
	margin-right: 14rpx;
	opacity: 0.5;
}
.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #FFFFFF;
	height: 44rpx;
}
.search-placeholder {
	color: rgba(255, 255, 255, 0.6);
	font-size: 26rpx;
}

/* ========== 分类图标 ========== */
.category-list {
	display: flex;
	justify-content: space-around;
	padding: 32rpx 16rpx 12rpx;
}
.category-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	flex: 1;
}
.cate-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}
.icon-text {
	font-size: 36rpx;
}
.cate-name {
	font-size: 22rpx;
	color: #4A3A2A;
	font-weight: 500;
}

/* ========== Banner ========== */
.beginner-banner {
	margin: 16rpx 32rpx 36rpx;
	background: linear-gradient(135deg, #FFE8D0 0%, #FDDCB5 100%);
	border-radius: 28rpx;
	padding: 32rpx 36rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	overflow: hidden;
	position: relative;
	box-shadow: 0 8rpx 32rpx rgba(184, 134, 11, 0.2);
	transition: box-shadow 0.3s;
	&:active {
		box-shadow: 0 4rpx 16rpx rgba(184, 134, 11, 0.15);
	}
}
.banner-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	z-index: 1;
}
.banner-title {
	font-size: 38rpx;
	font-weight: 700;
	color: #5D4037;
}
.banner-sub {
	font-size: 24rpx;
	color: #8D6E63;
}
.check-btn {
	margin-top: 16rpx;
	align-self: flex-start;
	padding: 12rpx 32rpx;
	background: #B8860B;
	color: #fff;
	font-size: 24rpx;
	font-weight: 600;
	border-radius: 60rpx;
	box-shadow: 0 4rpx 12rpx rgba(184, 134, 11, 0.25);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.95);
	}
}
.banner-img {
	width: 180rpx;
	height: 150rpx;
	position: relative;
	z-index: 1;
}
.goods-demo {
	position: relative;
	width: 100%;
	height: 100%;
}
.bowl {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 90rpx;
	height: 64rpx;
	background: #81D4FA;
	border-radius: 0 0 44rpx 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
}
.jar {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 74rpx;
	height: 110rpx;
	background: #FFFFFF;
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	border: 2rpx solid #E0D5C8;
}
.stick {
	position: absolute;
	right: 16rpx;
	top: 8rpx;
	width: 14rpx;
	height: 72rpx;
	background: #FFB74D;
	border-radius: 8rpx;
	transform: rotate(-10deg);
}

/* ========== 商品列表 ========== */
.goods-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
	padding: 0 32rpx;
}
.goods-card {
	background: #FFFFFF;
	border-radius: 28rpx;
	padding: 16rpx 16rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s, box-shadow 0.2s;
	&:active {
		transform: scale(0.97);
	}
}
.goods-img-wrap {
	position: relative;
	width: 100%;
	border-radius: 20rpx;
	overflow: hidden;
}
.goods-img {
	width: 100%;
	height: 280rpx;
	object-fit: cover;
	display: block;
	background: #F0EDE8;
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
.more{
	width: 16px;
	height: 16px;
}

.goods-info {
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	padding-top: 14rpx;
}
.goods-name {
	font-size: 30rpx;
	font-weight: 700;
	color: #2C2C2C;
	line-height: 1.3;
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

/* ========== 空状态 ========== */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 120rpx 0;
}
.empty-icon {
	font-size: 80rpx;
	margin-bottom: 24rpx;
}
.empty-text {
	font-size: 28rpx;
	color: #999;
}

/* ========== 可拖拽购物车 ========== */
.float-cart {
	background: linear-gradient(135deg, #F2C89C, #E8B880);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	box-shadow: 0 8rpx 24rpx rgba(212, 154, 85, 0.3);
	transition: box-shadow 0.2s;
	user-select: none;
	-webkit-user-select: none;
	&:active {
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.2);
	}
}
.cart-badge {
	position: absolute;
	top: -4rpx;
	right: -4rpx;
	min-width: 30rpx;
	height: 30rpx;
	background: #FF4D4F;
	color: #fff;
	font-size: 18rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 6rpx;
}

/* ========== 弹窗 ========== */
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
	padding: 32rpx 32rpx 40rpx;
	max-height: 75vh;
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
	margin-bottom: 20rpx;
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

.modal-goods-info {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 16rpx 0 20rpx;
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
	gap: 4rpx;
	flex: 1;
}
.modal-goods-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #2C2C2C;
	line-height: 1.3;
}
.modal-price-row {
	display: flex;
	align-items: baseline;
	gap: 10rpx;
}
.modal-goods-price {
	font-size: 34rpx;
	font-weight: 700;
	color: #D44C4C;
}
.modal-goods-price::before {
	content: '¥';
	font-size: 22rpx;
	font-weight: 600;
	margin-right: 2rpx;
}
.modal-origin-price {
	font-size: 22rpx;
	color: #B0A8A0;
	text-decoration: line-through;
}
.modal-stock {
	font-size: 22rpx;
	color: #999;
}

.modal-body {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}
.spec-group, .qty-group {
	display: flex;
	align-items: flex-start;
}
.spec-label, .qty-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	width: 100rpx;
	flex-shrink: 0;
	padding-top: 6rpx;
}
.spec-options {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	flex: 1;
}
.spec-option {
	padding: 12rpx 20rpx;
	background: #F5F5F5;
	border-radius: 12rpx;
	border: 2rpx solid transparent;
	transition: all 0.2s;
	min-width: 100rpx;
	text-align: center;
	&.active {
		background: #FFF5E4;
		border-color: #D49A55;
	}
}
.spec-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}
.spec-price {
	font-size: 22rpx;
	color: #D44C4C;
	font-weight: 600;
	margin-top: 2rpx;
}
.spec-option.active .spec-name {
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
	width: 60rpx;
	height: 60rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #333;
	background: #F8F8F8;
	cursor: pointer;
	&:active {
		background: #EEEEEE;
	}
}
.qty-num {
	width: 80rpx;
	text-align: center;
	font-size: 28rpx;
	color: #333;
}

.modal-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 28rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #F0EDE8;
}
.modal-total {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}
.total-label {
	font-size: 26rpx;
	color: #666;
}
.total-price {
	font-size: 36rpx;
	font-weight: 700;
	color: #D44C4C;
}
.total-price::before {
	content: '¥';
	font-size: 24rpx;
	font-weight: 600;
	margin-right: 2rpx;
}
.modal-btn {
	padding: 16rpx 48rpx;
	background: linear-gradient(135deg, #E8B880, #D49A55);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 30rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.25);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.96);
	}
}
</style>