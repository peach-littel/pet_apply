<template>
	<view class="goods-detail" v-if="goodsInfo">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<view class="nav-right">
				<view class="icon-btn" @click="handleMore">
					<text>⋯</text>
				</view>
			</view>
		</view>

		<!-- 商品大图轮播 -->
		<swiper class="goods-swiper" circular indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#D49A55">
			<swiper-item v-for="(img, idx) in (goodsInfo.images || [])" :key="idx">
				<image class="swiper-img" :src="img" mode="aspectFill" />
			</swiper-item>
		</swiper>

		<!-- 商品基本信息 -->
		<view class="goods-base">
			<view class="price-row">
				<view class="price-left">
					<text class="price-symbol">¥</text>
					<text class="price-num">{{ displayPrice }}</text>
					<text class="price-origin" v-if="displayOriginPrice && displayOriginPrice > displayPrice">¥{{ displayOriginPrice }}</text>
					<!-- 规格提示 -->
					<text class="spec-hint" v-if="hasMultipleSpecs">共{{ goodsInfo.specs.length }}种规格</text>
					<view class="sales-tag">已售{{ goodsInfo.sales }}件</view>
				</view>
				<!-- 收藏按钮 -->
				<view class="favorite-btn" @click="toggleFavorite">
					<view class="favorite-icon" :class="{ liked: isFavorite }">
						<text class="heart-icon">{{ isFavorite ? '♥' : '♡' }}</text>
					</view>
				</view>
			</view>
			<text class="goods-name">{{ goodsInfo.name }}</text>
			<text class="goods-desc">{{ goodsInfo.desc }}</text>
			<!-- ⭐ 已选规格展示 -->
			<view class="selected-spec" v-if="hasMultipleSpecs" @click="openSpecModal">
				<text class="selected-spec-label">已选</text>
				<text class="selected-spec-value">{{ currentSpecData ? currentSpecData.name : '请选择规格' }}</text>
				<text class="selected-spec-arrow">›</text>
			</view>
			<!-- 服务标签 -->
			<view class="service-row">
				<view class="service-item">
					<text class="service-icon">✓</text>
					<text>正品保障</text>
				</view>
				<view class="service-divider"></view>
				<view class="service-item">
					<text class="service-icon">✓</text>
					<text>七天退换</text>
				</view>
				<view class="service-divider"></view>
				<view class="service-item">
					<text class="service-icon">✓</text>
					<text>顺丰包邮</text>
				</view>
			</view>
		</view>

		<!-- 用户评价区域 -->
		<view class="review-section">
			<view class="review-header">
				<text class="review-title">用户评价</text>
				<view class="review-more" @click="viewAllReviews">
					<text>查看全部</text>
					<text class="arrow">›</text>
				</view>
			</view>
			<view class="review-stats">
				<text class="rating-score">{{ goodsInfo.rating }}</text>
				<view class="rating-stars">
					<text class="star" v-for="i in 5" :key="i">
						{{ i <= Math.floor(goodsInfo.rating) ? '★' : '☆' }}
					</text>
				</view>
				<text class="review-count">{{ goodsInfo.reviewCount }}条评价</text>
			</view>
			<view class="review-list">
				<view class="review-item" v-for="(review, idx) in displayReviews" :key="idx">
					<view class="review-user">
						<view class="user-avatar">
							<text>{{ review.userName.charAt(0) }}</text>
						</view>
						<view class="user-info">
							<text class="user-name">{{ review.userName }}</text>
							<view class="user-stars">
								<text class="star" v-for="i in 5" :key="i">
									{{ i <= review.rating ? '★' : '☆' }}
								</text>
							</view>
						</view>
						<text class="review-time">{{ review.time }}</text>
					</view>
					<text class="review-content">{{ review.content }}</text>
					<view class="review-images" v-if="review.images && review.images.length > 0">
						<image 
							class="review-img" 
							v-for="(img, imgIdx) in review.images" 
							:key="imgIdx"
							:src="img" 
							mode="aspectFill"
							@click="previewImage(review.images, imgIdx)"
						/>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品详情图文 -->
		<view class="detail-section">
			<view class="section-title">
				<text class="title-line"></text>
				<text class="title-text">商品详情</text>
				<text class="title-line"></text>
			</view>
			<view class="detail-content">
				<image 
					class="detail-img" 
					v-for="(img, idx) in goodsInfo.detailImages" 
					:key="idx" 
					:src="img" 
					mode="aspectFill" 
				/>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="bar-icon" @click="goHome">
				<text class="icon">🏠</text>
				<text class="icon-text">首页</text>
			</view>
			<view class="bar-icon" @click="goCart">
				<text class="icon">🛒</text>
				<text class="icon-text">购物车</text>
				<view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
			</view>
			<view class="btn-group">
				<view class="bar-btn btn-cart" @click="openSpecModal">加入购物车</view>
				<view class="bar-btn btn-buy" @click="buyNow">立即购买</view>
			</view>
		</view>

		<!-- ⭐ 规格选择弹窗（增强版：价格随规格变化） -->
		<view class="modal-mask" v-if="showModal" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择规格</text>
					<text class="modal-close" @click="closeModal">✕</text>
				</view>

				<!-- 商品信息 -->
				<view class="modal-goods-info">
					<image class="modal-goods-img" :src="(goodsInfo.images||[])[0] || goodsInfo.image" mode="aspectFill" />
					<view class="modal-goods-detail">
						<text class="modal-goods-name">{{ goodsInfo.name }}</text>
						<view class="modal-price-row">
							<text class="modal-goods-price">{{ modalPrice }}</text>
							<text class="modal-origin-price" v-if="modalOriginPrice && modalOriginPrice > modalPrice">¥{{ modalOriginPrice }}</text>
						</view>
						<text class="modal-stock" v-if="modalStock !== null">库存 {{ modalStock }} 件</text>
					</view>
				</view>

				<view class="modal-body">
					<!-- ⭐ 规格选择（每个规格独立价格） -->
					<view class="spec-group">
						<text class="spec-label">规格</text>
						<view class="spec-options" v-if="goodsInfo.specs && goodsInfo.specs.length">
							<view 
								class="spec-option" 
								:class="{ active: currentSpec === index }"
								v-for="(spec, index) in goodsInfo.specs" 
								:key="index"
								@click="selectSpec(index)"
							>
								<text class="spec-name">{{ spec.name }}</text>
								<view class="spec-price-info">
									<text class="spec-price">{{ spec.price }}</text>
									<text class="spec-origin-price" v-if="spec.originPrice && spec.originPrice > spec.price">¥{{ spec.originPrice }}</text>
								</view>
								<text class="spec-stock" v-if="spec.stock !== undefined && spec.stock < 10">仅剩{{ spec.stock }}件</text>
							</view>
						</view>
						<view class="spec-options" v-else>
							<view class="spec-option active">默认规格</view>
						</view>
					</view>

					<!-- 数量 -->
					<view class="qty-group">
						<text class="qty-label">数量</text>
						<view class="qty-control">
							<view class="qty-btn" @click="decreaseQty">-</view>
							<text class="qty-num">{{ quantity }}</text>
							<view class="qty-btn" @click="increaseQty">+</view>
						</view>
					</view>
				</view>

				<!-- ⭐ 底部合计 -->
				<view class="modal-footer">
					<view class="modal-total">
						<text class="total-label">合计</text>
						<text class="total-price">¥{{ (modalPrice * quantity).toFixed(2) }}</text>
					</view>
					<view class="modal-btn confirm" @click="confirmAddToCart">确定</view>
				</view>
			</view>
		</view>
	</view>
	
	<!-- 加载状态 -->
	<view v-else class="loading-container">
		<text class="loading-text">加载中...</text>
	</view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

const getGlobal = () => {
  const app = getApp()
  return app?.globalData || {}
}

const goodsId = ref(0)
const currentSpec = ref(0)
const quantity = ref(1)
const cartCount = ref(0)
const showModal = ref(false)
const displayReviews = ref([])
const goodsInfo = ref(null)
const isFavorite = ref(false)
let favLock = false

// ---- ⭐ 判断是否多规格 ----
const hasMultipleSpecs = computed(() => {
	return goodsInfo.value?.specs && goodsInfo.value.specs.length > 1
})

// ---- ⭐ 当前规格数据 ----
const currentSpecData = computed(() => {
	if (!goodsInfo.value) return null
	const specs = goodsInfo.value.specs || []
	if (specs.length === 0) return null
	const spec = specs[currentSpec.value]
	if (typeof spec === 'string') {
		return { name: spec, price: goodsInfo.value.price, originPrice: goodsInfo.value.originPrice, stock: goodsInfo.value.stock }
	}
	return spec
})

// ---- ⭐ 详情页显示的价格（与弹窗选中规格联动） ----
const displayPrice = computed(() => {
	if (hasMultipleSpecs.value && currentSpecData.value) {
		return currentSpecData.value.price
	}
	return goodsInfo.value?.price || 0
})

const displayOriginPrice = computed(() => {
	if (hasMultipleSpecs.value && currentSpecData.value && currentSpecData.value.originPrice) {
		return currentSpecData.value.originPrice
	}
	return goodsInfo.value?.originPrice || null
})

// ---- ⭐ 弹窗中的价格 ----
const modalPrice = computed(() => {
	if (currentSpecData.value && currentSpecData.value.price) {
		return currentSpecData.value.price
	}
	return goodsInfo.value?.price || 0
})

const modalOriginPrice = computed(() => {
	if (currentSpecData.value && currentSpecData.value.originPrice) {
		return currentSpecData.value.originPrice
	}
	return goodsInfo.value?.originPrice || null
})

const modalStock = computed(() => {
	if (currentSpecData.value && currentSpecData.value.stock !== undefined) {
		return currentSpecData.value.stock
	}
	return goodsInfo.value?.stock ?? null
})

// ---- 检查收藏状态 ----
const checkFavoriteStatus = () => {
	if (!goodsInfo.value) return
	const g = getGlobal()
	const favorites = g.favorites?.value || []
	isFavorite.value = favorites.some(f => f.id === goodsInfo.value.id && f.type === 'goods')
}

// ---- 切换收藏 ----
const toggleFavorite = () => {
	if(favLock || !goodsInfo.value) return
	favLock = true
	const g = getGlobal()
	const favoriteItem = {
		id: goodsInfo.value.id,
		name: goodsInfo.value.name,
		price: goodsInfo.value.price,
		image: goodsInfo.value.images?.[0] || goodsInfo.value.image || '',
		type: 'goods'
	}

	if (isFavorite.value) {
		if (g.removeFavorite) {
			const result = g.removeFavorite(goodsInfo.value.id, 'goods')
			if (result) {
				isFavorite.value = false
				uni.showToast({ title: '已取消收藏', icon: 'none' })
			}
		}
	} else {
		if (g.addFavorite) {
			const result = g.addFavorite(favoriteItem)
			if (result) {
				isFavorite.value = true
				uni.showToast({ title: '收藏成功 ❤️', icon: 'success' })
			} else {
				uni.showToast({ title: '已收藏过了', icon: 'none' })
			}
		}
	}
	favLock = false
}

// ---- 更多操作 ----
const handleMore = () => {
	uni.showActionSheet({
		itemList: ['分享', isFavorite.value ? '取消收藏' : '收藏', '举报'],
		success: (res) => {
			if (res.tapIndex === 0) {
				uni.showToast({ title: '分享功能', icon: 'none' })
			} else if (res.tapIndex === 1) {
				toggleFavorite()
			} else if (res.tapIndex === 2) {
				uni.showToast({ title: '已举报', icon: 'none' })
			}
		}
	})
}

// ---- ⭐ 增强规格数据（为每个规格绑定独立价格） ----
const enhanceSpecs = (goods) => {
	if (!goods.specs || goods.specs.length === 0) {
		return goods
	}
	
	// 如果 specs 已经是对象数组且有 price，直接返回
	if (typeof goods.specs[0] === 'object' && goods.specs[0].price !== undefined) {
		return goods
	}
	
	// 否则根据规格名称生成价格
	const basePrice = goods.price || 0
	const specs = goods.specs.map((name, index) => {
		let priceMultiplier = 1
		const nameLower = String(name).toLowerCase()
		
		// 根据规格名称关键词推断价格档次
		if (nameLower.includes('豪华') || nameLower.includes('旗舰') || nameLower.includes('大') || 
			nameLower.includes('家庭') || nameLower.includes('3kg') || nameLower.includes('500') ||
			nameLower.includes('5kg') || nameLower.includes('10kg')) {
			priceMultiplier = 1.5 + (index * 0.1)
		} else if (nameLower.includes('标准') || nameLower.includes('中') || nameLower.includes('1.5') || 
				   nameLower.includes('200') || nameLower.includes('300') || nameLower.includes('400')) {
			priceMultiplier = 1.2 + (index * 0.05)
		} else if (nameLower.includes('小') || nameLower.includes('尝鲜') || nameLower.includes('50') || 
				   nameLower.includes('100') || nameLower.includes('试用')) {
			priceMultiplier = 0.8 + (index * 0.05)
		} else {
			priceMultiplier = 1 + (index * 0.08)
		}
		
		const price = Math.round(basePrice * priceMultiplier)
		return {
			name: String(name),
			price: price,
			originPrice: Math.round(price * 1.3),
			stock: Math.floor(Math.random() * 500) + 30
		}
	})
	
	return {
		...goods,
		specs: specs
	}
}

// ---- 加载数据 ----
onLoad((options) => {
  const id = Number(options.id) || 1
  console.log('商品详情页接收ID:', id)
  const g = getGlobal()
  if (g.getGoodsById) {
    let data = g.getGoodsById(id)
    console.log('获取到的商品数据:', data)
    if (data) {
      // ⭐ 增强规格数据
      data = enhanceSpecs(data)
      goodsInfo.value = data
      if (Array.isArray(data.reviews)) {
        displayReviews.value = data.reviews.slice(0, 2)
      } else {
        displayReviews.value = []
      }
      checkFavoriteStatus()
    } else {
      uni.showToast({ title: '商品不存在', icon: 'none' })
    }
  }
})

// ---- 页面显示 ----
onShow(() => {
	checkFavoriteStatus()
	const g = getGlobal()
	if (g.cartTotalCount) {
		cartCount.value = g.cartTotalCount.value
	}
})

// ---- 方法 ----
const goBack = () => uni.navigateBack()
const goHome = () => uni.switchTab({ url: '/pages/index/index' })
const goCart = () => uni.navigateTo({ url: '/pages/cart/cart' })

const decreaseQty = () => {
	if (quantity.value > 1) quantity.value--
}
const increaseQty = () => {
	if (modalStock.value !== null && quantity.value >= modalStock.value) {
		uni.showToast({ title: '库存不足', icon: 'none' })
		return
	}
	quantity.value++
}

// ---- ⭐ 打开规格弹窗 ----
const openSpecModal = () => {
	// 如果有规格，默认选中第一个
	if (goodsInfo.value?.specs?.length > 0) {
		currentSpec.value = 0
	} else {
		currentSpec.value = -1
	}
	quantity.value = 1
	showModal.value = true
}

// ---- ⭐ 选择规格 ----
const selectSpec = (index) => {
	currentSpec.value = index
	quantity.value = 1
}

// ---- 关闭弹窗 ----
const closeModal = () => {
	showModal.value = false
}

// ---- ⭐ 确认加入购物车 ----
const confirmAddToCart = () => {
	if (!goodsInfo.value) return
	const g = getGlobal()
	const specList = goodsInfo.value.specs || []
	
	let specName = '默认规格'
	let specPrice = goodsInfo.value.price
	
	if (specList.length > 0 && currentSpec.value >= 0) {
		const specData = specList[currentSpec.value]
		if (typeof specData === 'string') {
			specName = specData
		} else if (typeof specData === 'object') {
			specName = specData.name || '默认规格'
			specPrice = specData.price || goodsInfo.value.price
		}
	}
	
	// 检查库存
	if (modalStock.value !== null && quantity.value > modalStock.value) {
		uni.showToast({ title: '库存不足', icon: 'none' })
		return
	}
	
	if (g && typeof g.addToCart === 'function') {
		g.addToCart({
			id: goodsInfo.value.id,
			name: goodsInfo.value.name,
			price: specPrice,
			image: goodsInfo.value.images?.[0] || goodsInfo.value.image,
			spec: specName,
			quantity: quantity.value
		})
		if(g.cartTotalCount) cartCount.value = g.cartTotalCount.value
	}
	uni.showToast({
		title: `已加入 ${goodsInfo.value.name} ×${quantity.value}`,
		icon: 'success',
		duration: 1500
	})
	closeModal()
}

// ---- 立即购买 ----
const buyNow = () => {
	openSpecModal()
}

// ---- 查看全部评价 ----
const viewAllReviews = () => {
	uni.showToast({ title: '查看全部评价', icon: 'none' })
}

// ---- 预览图片 ----
const previewImage = (images, index) => {
	if(!images || !images.length) return
	uni.previewImage({
		urls: images,
		current: index
	})
}
</script>

<style lang="scss" scoped>
.goods-detail {
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 160rpx;
}

/* ========== 加载状态 ========== */
.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
}
.loading-text {
	font-size: 28rpx;
	color: #B0A8A0;
}

/* ========== 顶部导航 ========== */
.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
	display: flex;
	justify-content: space-between;
	padding: 60rpx 32rpx 20rpx;
}
.back-btn, .icon-btn {
	width: 72rpx;
	height: 72rpx;
	background: rgba(0,0,0,0.4);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
}
.back-icon {
	font-size: 70rpx;
	font-weight: 300;
	color: #ffffff;
	line-height: 1;
	margin-bottom: 10px;
}
.icon-btn {
	font-size: 32rpx;
}

/* ========== 商品轮播 ========== */
.goods-swiper {
	width: 100%;
	height: 550rpx;
}
.swiper-img {
	width: 100%;
	height: 100%;
}

/* ========== 商品基本信息 ========== */
.goods-base {
	background: #fff;
	padding: 32rpx;
	margin-bottom: 20rpx;
}
.price-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}
.price-left {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
	flex-wrap: wrap;
}
.price-symbol {
	font-size: 32rpx;
	color: #E64340;
	font-weight: bold;
}
.price-num {
	font-size: 56rpx;
	color: #E64340;
	font-weight: bold;
	line-height: 1;
}
.price-origin {
	font-size: 28rpx;
	color: #999;
	text-decoration: line-through;
	margin-left: 4rpx;
}
.spec-hint {
	font-size: 22rpx;
	color: #999;
	background: #F5F5F5;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
	margin-left: 8rpx;
}
.sales-tag {
	font-size: 24rpx;
	color: #999;
	background: #F5F5F5;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

/* ========== 收藏按钮 ========== */
.favorite-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	padding: 0;
	cursor: pointer;
}
.favorite-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	background: #F5F5F5;
	transition: all 0.3s ease;
}
.favorite-icon:active {
	transform: scale(0.85);
}
.favorite-icon .heart-icon {
	font-size: 44rpx;
	color: #999;
	transition: all 0.3s ease;
	line-height: 1;
}
.favorite-icon.liked {
	background: #FFF0F0;
}
.favorite-icon.liked .heart-icon {
	color: #E64340;
	animation: heartBeat 0.4s ease;
}
@keyframes heartBeat {
	0% { transform: scale(1); }
	25% { transform: scale(1.3); }
	50% { transform: scale(0.9); }
	75% { transform: scale(1.15); }
	100% { transform: scale(1); }
}

.goods-name {
	display: block;
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	line-height: 1.4;
	margin-bottom: 12rpx;
}
.goods-desc {
	display: block;
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
	margin-bottom: 20rpx;
}

/* ========== 已选规格展示 ========== */
.selected-spec {
	display: flex;
	align-items: center;
	padding: 18rpx 24rpx;
	background: #F8F6F2;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
	cursor: pointer;
	transition: background 0.2s;
	&:active {
		background: #EFEBE4;
	}
}
.selected-spec-label {
	font-size: 24rpx;
	color: #999;
	margin-right: 12rpx;
}
.selected-spec-value {
	flex: 1;
	font-size: 26rpx;
	color: #333;
}
.selected-spec-arrow {
	font-size: 32rpx;
	color: #B0A8A0;
}

/* ========== 服务标签 ========== */
.service-row {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	gap: 0;
	padding: 26rpx 0 0;
	border-top: 1rpx solid #F0F0F0;
}
.service-item {
	display: flex;
	align-items: center;
	gap: 6rpx;
	font-size: 24rpx;
	color: #666;
	padding: 0 16rpx;
}
.service-item:first-child {
	padding-left: 0;
}
.service-icon {
	color: #D49A55;
	font-weight: bold;
	font-size: 22rpx;
}
.service-divider {
	width: 1rpx;
	height: 24rpx;
	background: #E0E0E0;
}

/* ========== 用户评价区域 ========== */
.review-section {
	background: #fff;
	padding: 32rpx;
	margin-bottom: 20rpx;
}
.review-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}
.review-title {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
}
.review-more {
	display: flex;
	align-items: center;
	gap: 4rpx;
	font-size: 26rpx;
	color: #999;
}
.review-more .arrow {
	font-size: 28rpx;
}

.review-stats {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx 0 24rpx;
	border-bottom: 1rpx solid #F5F5F5;
}
.rating-score {
	font-size: 48rpx;
	font-weight: bold;
	color: #F5A623;
}
.rating-stars {
	display: flex;
	gap: 4rpx;
}
.rating-stars .star {
	font-size: 32rpx;
	color: #F5A623;
}
.review-count {
	font-size: 24rpx;
	color: #999;
	margin-left: auto;
}

.review-list {
	margin-top: 20rpx;
}
.review-item {
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
}
.review-item:last-child {
	border-bottom: none;
}
.review-user {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 12rpx;
}
.user-avatar {
	width: 60rpx;
	height: 60rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #E8C9A0, #D49A55);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
	flex-shrink: 0;
}
.user-info {
	flex: 1;
}
.user-name {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}
.user-stars {
	display: flex;
	gap: 2rpx;
	margin-top: 4rpx;
}
.user-stars .star {
	font-size: 24rpx;
	color: #F5A623;
}
.review-time {
	font-size: 22rpx;
	color: #999;
	flex-shrink: 0;
}
.review-content {
	font-size: 28rpx;
	color: #333;
	line-height: 1.6;
	display: block;
}
.review-images {
	display: flex;
	gap: 12rpx;
	margin-top: 16rpx;
	flex-wrap: wrap;
}
.review-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	object-fit: cover;
	background: #F0EDE8;
}

/* ========== 商品详情图片 ========== */
.detail-section {
	background: #fff;
	padding: 32rpx;
	margin-top: 20rpx;
}
.section-title {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24rpx;
	margin-bottom: 32rpx;
}
.title-line {
	width: 60rpx;
	height: 2rpx;
	background: #E0E0E0;
}
.title-text {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}
.detail-content {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}
.detail-img {
	width: 100%;
	height: 500rpx;
	border-radius: 16rpx;
	object-fit: cover;
}

/* ========== 底部操作栏 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #fff;
	display: flex;
	align-items: center;
	padding: 0 16rpx;
	padding-bottom: max(env(safe-area-inset-bottom), 16rpx);
	box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.05);
	z-index: 99;
	gap: 8rpx;
}
.bar-icon {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 80rpx;
	position: relative;
	flex-shrink: 0;
}
.bar-icon .icon {
	font-size: 40rpx;
}
.bar-icon .icon-text {
	font-size: 20rpx;
	color: #666;
	margin-top: 4rpx;
}
.cart-badge {
	position: absolute;
	top: -4rpx;
	right: 8rpx;
	min-width: 32rpx;
	height: 32rpx;
	background: #E64340;
	color: #fff;
	font-size: 20rpx;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 8rpx;
}
.btn-group {
	flex: 1;
	display: flex;
	height: 88rpx;
	border-radius: 44rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.25);
}
.bar-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	font-weight: bold;
	color: #fff;
}
.btn-cart {
	background: linear-gradient(90deg, #F6C667, #E8B880);
	color: #8B5A2B;
}
.btn-buy {
	background: linear-gradient(90deg, #D49A55, #B8860B);
	color: #fff;
}

/* ========== ⭐ 规格选择弹窗 ========== */
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
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
	max-height: 80vh;
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

/* ===== 商品信息 ===== */
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
	margin-top: 2rpx;
}

/* ===== 规格选择（增强版） ===== */
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
	padding: 16rpx 20rpx;
	background: #F5F5F5;
	border-radius: 12rpx;
	border: 2rpx solid transparent;
	transition: all 0.2s;
	min-width: 120rpx;
	text-align: center;
	cursor: pointer;
	position: relative;
	&.active {
		background: #FFF5E4;
		border-color: #D49A55;
		box-shadow: 0 2rpx 8rpx rgba(212, 154, 85, 0.15);
	}
	&:active {
		transform: scale(0.96);
	}
}
.spec-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	display: block;
}
.spec-price-info {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 6rpx;
	margin-top: 4rpx;
}
.spec-price {
	font-size: 24rpx;
	color: #D44C4C;
	font-weight: 600;
}
.spec-price::before {
	content: '¥';
	font-size: 18rpx;
}
.spec-origin-price {
	font-size: 18rpx;
	color: #B0A8A0;
	text-decoration: line-through;
}
.spec-stock {
	font-size: 18rpx;
	color: #FF6B35;
	display: block;
	margin-top: 2rpx;
}
.spec-option.active .spec-name {
	color: #D49A55;
}

/* ===== 数量 ===== */
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

/* ===== 底部合计 ===== */
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
	cursor: pointer;
	&:active {
		transform: scale(0.96);
	}
}
</style>