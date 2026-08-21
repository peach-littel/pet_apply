<template>
	<view class="checkout-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">确认订单</text>
			<view class="nav-right"></view>
		</view>

		<!-- 收货地址 -->
		<view class="address-section" @click="selectAddress">
			<view class="address-content" v-if="address">
				<view class="address-info">
					<text class="address-name">{{ address.name }}</text>
					<text class="address-phone">{{ address.phone }}</text>
					<view class="address-tag" v-if="address.isDefault">默认</view>
				</view>
				<text class="address-detail">{{ address.detail }}</text>
				<view class="address-arrow-wrap">
					<text class="address-arrow">›</text>
				</view>
			</view>
			<view class="address-empty" v-else>
				<text class="address-tip">请选择收货地址</text>
				<text class="address-arrow">›</text>
			</view>
		</view>

		<!-- 商品列表 -->
		<view class="items-section">
			<view class="section-title">
				<text>商品</text>
				<text class="section-count">共{{ itemsList.length }}件</text>
			</view>
			<view class="item-card" v-for="(item, idx) in itemsList" :key="idx">
				<image class="item-img" :src="item.image" mode="aspectFill" />
				<view class="item-info">
					<text class="item-name">{{ item.name }}</text>
					<text class="item-spec">{{ item.spec || '默认规格' }}</text>
					<view class="item-bottom">
						<text class="item-price">¥{{ item.price }}</text>
						<text class="item-qty">×{{ item.quantity }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 配送方式 -->
		<view class="delivery-section" @click="selectDelivery">
			<view class="section-row">
				<text class="row-label">配送方式</text>
				<view class="row-right">
					<text class="row-value">{{ deliveryMethod }}</text>
					<text class="row-arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 订单信息 -->
		<view class="order-section">
			<view class="section-title">订单信息</view>
			<view class="order-row">
				<text class="order-label">商品金额</text>
				<text class="order-value">¥{{ subtotal.toFixed(2) }}</text>
			</view>
			<view class="order-row">
				<text class="order-label">运费</text>
				<text class="order-value">¥{{ shippingFee.toFixed(2) }}</text>
			</view>
			<view class="order-row" @click="selectCoupon">
				<text class="order-label">优惠券</text>
				<view class="order-value coupon-value">
					<text v-if="selectedCoupon" style="color:#D49A55;">-¥{{ selectedCoupon.amount }}</text>
					<text v-else style="color:#999;">暂无可用</text>
					<text class="row-arrow">›</text>
				</view>
			</view>
			<view class="order-row">
				<text class="order-label">积分抵扣</text>
				<view class="order-value" style="display:flex;align-items:center;gap:8rpx;">
					<text v-if="usePoints">-¥{{ pointsDiscount.toFixed(2) }}</text>
					<text v-else style="color:#999;">不使用</text>
					<switch :checked="usePoints" @change="togglePoints" style="transform:scale(0.7);" />
				</view>
			</view>
			<view class="order-row total-row">
				<text class="order-label">合计</text>
				<text class="order-value total-price">¥{{ total.toFixed(2) }}</text>
			</view>
		</view>

		<!-- 备注 -->
		<view class="remark-section">
			<text class="remark-label">备注</text>
			<input 
				class="remark-input" 
				v-model="remark" 
				placeholder="选填：给商家的留言" 
				placeholder-class="remark-placeholder"
				maxlength="100"
			/>
		</view>

		<!-- 底部 -->
		<view class="bottom-bar">
			<view class="total-wrap">
				<text class="total-label">实付</text>
				<text class="total-amount">¥{{ total.toFixed(2) }}</text>
			</view>
			<view class="pay-btn" @click="submitOrder">
				<text>立即支付</text>
			</view>
		</view>

		<!-- 地址选择弹窗 -->
		<view class="modal-mask" v-if="showAddressModal" @click="closeAddressModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择收货地址</text>
					<text class="modal-close" @click="closeAddressModal">✕</text>
				</view>
				<view class="modal-body">
					<view 
						class="address-item" 
						v-for="(addr, idx) in addressList" 
						:key="idx"
						@click="selectAddressItem(idx)"
					>
						<view class="address-item-info">
							<view class="address-item-name">
								<text class="addr-name">{{ addr.name }}</text>
								<text class="addr-phone">{{ addr.phone }}</text>
							</view>
							<text class="addr-detail">{{ addr.detail }}</text>
						</view>
						<view class="address-item-right">
							<view class="addr-tag" v-if="addr.isDefault">默认</view>
							<view class="addr-check" :class="{ checked: selectedAddressIndex === idx }">
								<text v-if="selectedAddressIndex === idx">✓</text>
							</view>
						</view>
					</view>
					<view class="add-address-btn" @click="goAddAddress">
						<text>+ 新增地址</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 优惠券选择弹窗 -->
		<view class="modal-mask" v-if="showCouponModal" @click="closeCouponModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择优惠券</text>
					<text class="modal-close" @click="closeCouponModal">✕</text>
				</view>
				<view class="modal-body">
					<view 
						class="coupon-item" 
						v-for="(coupon, idx) in couponList" 
						:key="idx"
						:class="{ disabled: coupon.minAmount > subtotal }"
						@click="selectCouponItem(idx)"
					>
						<view class="coupon-left">
							<text class="coupon-amount">¥{{ coupon.amount }}</text>
							<text class="coupon-desc">{{ coupon.desc }}</text>
						</view>
						<view class="coupon-right">
							<text class="coupon-condition">满{{ coupon.minAmount }}可用</text>
							<view class="coupon-check" :class="{ checked: selectedCouponIndex === idx && coupon.minAmount <= subtotal }">
								<text v-if="selectedCouponIndex === idx && coupon.minAmount <= subtotal">✓</text>
							</view>
						</view>
					</view>
					<view class="no-coupon" v-if="couponList.length === 0">
						<text>暂无可用优惠券</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 配送方式弹窗 -->
		<view class="modal-mask" v-if="showDeliveryModal" @click="closeDeliveryModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">选择配送方式</text>
					<text class="modal-close" @click="closeDeliveryModal">✕</text>
				</view>
				<view class="modal-body">
					<view 
						class="delivery-item" 
						v-for="(item, idx) in deliveryList" 
						:key="idx"
						@click="selectDeliveryItem(idx)"
					>
						<view class="delivery-left">
							<text class="delivery-name">{{ item.name }}</text>
							<text class="delivery-desc">{{ item.desc }}</text>
						</view>
						<view class="delivery-right">
							<text class="delivery-fee">¥{{ item.fee }}</text>
							<view class="delivery-check" :class="{ checked: selectedDeliveryIndex === idx }">
								<text v-if="selectedDeliveryIndex === idx">✓</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 数据 ----
const itemsList = ref([])
const address = ref(null)
const remark = ref('')
const usePoints = ref(false)
const userPoints = ref(1000)

// ---- 地址相关 ----
const addressList = ref([
	{
		name: '张三',
		phone: '138****8888',
		detail: '北京市朝阳区建国路88号SOHO现代城A座101室',
		isDefault: true
	},
	{
		name: '李四',
		phone: '139****6666',
		detail: '上海市浦东新区世纪大道100号环球金融中心B2层',
		isDefault: false
	}
])
const showAddressModal = ref(false)
const selectedAddressIndex = ref(0)

// ---- 优惠券相关 ----
const couponList = ref([
	{ id: 1, amount: 20, desc: '满200减20', minAmount: 200 },
	{ id: 2, amount: 10, desc: '满100减10', minAmount: 100 },
	{ id: 3, amount: 5, desc: '满50减5', minAmount: 50 }
])
const showCouponModal = ref(false)
const selectedCouponIndex = ref(-1)

// ---- 配送方式相关 ----
const deliveryList = ref([
	{ name: '普通快递', desc: '预计3-5天送达', fee: 0 },
	{ name: '顺丰速运', desc: '预计1-2天送达', fee: 15 },
	{ name: '同城急送', desc: '预计2-4小时送达', fee: 25 }
])
const showDeliveryModal = ref(false)
const selectedDeliveryIndex = ref(0)

// ---- 计算属性 ----
const subtotal = computed(() => {
	return itemsList.value.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
})

const shippingFee = computed(() => {
	const fee = deliveryList.value[selectedDeliveryIndex.value]?.fee || 0
	return subtotal.value > 100 ? 0 : fee
})

const couponDiscount = computed(() => {
	if (selectedCouponIndex.value === -1) return 0
	const coupon = couponList.value[selectedCouponIndex.value]
	if (!coupon || coupon.minAmount > subtotal.value) return 0
	return coupon.amount
})

const pointsDiscount = computed(() => {
	if (!usePoints.value) return 0
	const maxPoints = Math.min(userPoints.value, 500)
	return Math.min(maxPoints / 100, subtotal.value * 0.2)
})

const discount = computed(() => {
	return couponDiscount.value + pointsDiscount.value
})

const total = computed(() => {
	return Math.max(0, subtotal.value + shippingFee.value - discount.value)
})

const deliveryMethod = computed(() => {
	return deliveryList.value[selectedDeliveryIndex.value]?.name || '普通快递'
})

// ---- 加载数据 ----
onLoad((options) => {
	if (options.items) {
		try {
			const decoded = decodeURIComponent(options.items)
			itemsList.value = JSON.parse(decoded)
			console.log('📦 订单商品:', itemsList.value)
		} catch (e) {
			console.error('解析商品数据失败:', e)
			itemsList.value = []
		}
	}
	
	loadAddressFromStorage()
})

// ---- 地址相关方法 ----
const loadAddressFromStorage = () => {
	try {
		const saved = uni.getStorageSync('checkout_address')
		if (saved) {
			const parsed = JSON.parse(saved)
			address.value = parsed
			const idx = addressList.value.findIndex(a => a.detail === parsed.detail)
			if (idx !== -1) selectedAddressIndex.value = idx
			return
		}
	} catch (e) {}
	
	if (addressList.value.length > 0) {
		const defaultAddr = addressList.value.find(a => a.isDefault) || addressList.value[0]
		address.value = defaultAddr
		selectedAddressIndex.value = addressList.value.indexOf(defaultAddr)
	}
}

const saveAddressToStorage = (addr) => {
	try {
		uni.setStorageSync('checkout_address', JSON.stringify(addr))
	} catch (e) {}
}

const selectAddress = () => {
	showAddressModal.value = true
}

const closeAddressModal = () => {
	showAddressModal.value = false
}

const selectAddressItem = (idx) => {
	selectedAddressIndex.value = idx
	address.value = addressList.value[idx]
	saveAddressToStorage(address.value)
	closeAddressModal()
	uni.showToast({ title: '已选择该地址', icon: 'success' })
}

const goAddAddress = () => {
	closeAddressModal()
	uni.navigateTo({
		url: '/pages/mine/address/address'
	})
}

// ---- 优惠券相关方法 ----
const selectCoupon = () => {
	showCouponModal.value = true
}

const closeCouponModal = () => {
	showCouponModal.value = false
}

const selectCouponItem = (idx) => {
	const coupon = couponList.value[idx]
	if (coupon.minAmount > subtotal.value) {
		uni.showToast({ 
			title: `满${coupon.minAmount}元可用`, 
			icon: 'none' 
		})
		return
	}
	if (selectedCouponIndex.value === idx) {
		selectedCouponIndex.value = -1
	} else {
		selectedCouponIndex.value = idx
	}
	closeCouponModal()
	uni.showToast({ 
		title: selectedCouponIndex.value !== -1 ? '已选择优惠券' : '已取消优惠券', 
		icon: 'success' 
	})
}

// ---- 配送方式相关方法 ----
const selectDelivery = () => {
	showDeliveryModal.value = true
}

const closeDeliveryModal = () => {
	showDeliveryModal.value = false
}

const selectDeliveryItem = (idx) => {
	selectedDeliveryIndex.value = idx
	closeDeliveryModal()
	uni.showToast({ title: `已选择${deliveryList.value[idx].name}`, icon: 'success' })
}

// ---- 积分相关 ----
const togglePoints = (e) => {
	usePoints.value = e.detail.value
}

// ---- 提交订单 ----
const submitOrder = () => {
	if (!address.value) {
		uni.showToast({
			title: '请选择收货地址',
			icon: 'none'
		})
		return
	}
	
	// ⭐ 打印调试信息
	console.log('===== 订单金额明细 =====')
	console.log('subtotal:', subtotal.value)
	console.log('shippingFee:', shippingFee.value)
	console.log('couponDiscount:', couponDiscount.value)
	console.log('pointsDiscount:', pointsDiscount.value)
	console.log('discount:', discount.value)
	console.log('total:', total.value)
	console.log('========================')
	
	const orderId = 'ORD' + Date.now()
	
	const orderData = {
		id: orderId,
		status: 'pending',
		totalAmount: total.value,
		subtotal: subtotal.value,
		shippingFee: shippingFee.value,
		discount: discount.value,
		createTime: new Date().toLocaleString(),
		createTimestamp: Date.now(),
		items: itemsList.value.map(item => ({
			id: item.id || 0,
			name: item.name,
			image: item.image,
			quantity: item.quantity,
			price: item.price,
			spec: item.spec || '默认规格'
		})),
		address: address.value,
		remark: remark.value,
		deliveryMethod: deliveryMethod.value,
		usedCoupon: selectedCouponIndex.value !== -1 ? couponList.value[selectedCouponIndex.value] : null,
		usedPoints: usePoints.value ? Math.round(pointsDiscount.value * 100) : 0
	}
	
	if (globalData.addOrder) {
		globalData.addOrder(orderData)
	} else {
		if (globalData.orders) {
			if (typeof globalData.orders.value !== 'undefined') {
				globalData.orders.value = [orderData, ...globalData.orders.value]
			} else {
				globalData.orders.unshift(orderData)
			}
		}
	}
	
	const selectedIds = itemsList.value.map(item => ({ 
		id: item.id, 
		spec: item.spec || '' 
	}))
	if (globalData.removeFromCart) {
		selectedIds.forEach(({ id, spec }) => {
			globalData.removeFromCart(id, spec)
		})
	}
	
	uni.showLoading({ title: '提交订单中...' })
	
	setTimeout(() => {
		uni.hideLoading()
		const amountStr = total.value.toFixed(2)
		console.log('跳转支付成功页，金额:', amountStr)
		uni.redirectTo({
			url: `/pages/pay-success/pay-success?amount=${amountStr}&orderId=${orderId}`
		})
	}, 1500)
}

const goBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.checkout-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 140rpx;
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
	cursor: pointer;
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

/* ========== 地址 ========== */
.address-section {
	background: #FFFFFF;
	margin: 20rpx 32rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	cursor: pointer;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.98);
	}
}

.address-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	position: relative;
}

.address-info {
	display: flex;
	align-items: center;
	gap: 20rpx;
	flex-wrap: wrap;
}

.address-name {
	font-size: 30rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.address-phone {
	font-size: 28rpx;
	color: #666;
}

.address-tag {
	font-size: 20rpx;
	color: #D49A55;
	background: #FFF5E4;
	padding: 2rpx 16rpx;
	border-radius: 20rpx;
	border: 1rpx solid #D49A55;
}

.address-detail {
	font-size: 26rpx;
	color: #999;
	padding-right: 40rpx;
}

.address-arrow-wrap {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
}

.address-arrow {
	font-size: 40rpx;
	color: #B0A8A0;
}

.address-empty {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.address-tip {
	font-size: 28rpx;
	color: #D49A55;
	font-weight: 500;
}

/* ========== 商品 ========== */
.items-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}

.section-count {
	font-size: 24rpx;
	font-weight: 400;
	color: #999;
}

.item-card {
	display: flex;
	gap: 16rpx;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	&:last-child {
		border-bottom: none;
	}
}

.item-img {
	width: 120rpx;
	height: 120rpx;
	border-radius: 12rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.item-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.item-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.item-spec {
	font-size: 22rpx;
	color: #999;
}

.item-bottom {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.item-price {
	font-size: 28rpx;
	font-weight: 700;
	color: #D44C4C;
}

.item-qty {
	font-size: 24rpx;
	color: #999;
}

/* ========== 配送方式 ========== */
.delivery-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

.section-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.row-label {
	font-size: 28rpx;
	color: #333;
}

.row-right {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.row-value {
	font-size: 26rpx;
	color: #666;
}

.row-arrow {
	font-size: 32rpx;
	color: #B0A8A0;
}

/* ========== 订单信息 ========== */
.order-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.order-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx 0;
}

.order-label {
	font-size: 26rpx;
	color: #666;
}

.order-value {
	font-size: 26rpx;
	color: #333;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.coupon-value {
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

.total-row {
	padding-top: 16rpx;
	margin-top: 8rpx;
	border-top: 1rpx solid #F0EDE8;
}

.total-row .order-label {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.total-price {
	font-size: 32rpx;
	font-weight: 800;
	color: #D44C4C;
}

/* ========== 备注 ========== */
.remark-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.remark-label {
	font-size: 28rpx;
	color: #333;
	flex-shrink: 0;
}

.remark-input {
	flex: 1;
	font-size: 26rpx;
	color: #333;
}

.remark-placeholder {
	color: #B0A8A0;
	font-size: 24rpx;
}

/* ========== 底部 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	background: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx 20rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.total-wrap {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
}

.total-label {
	font-size: 28rpx;
	color: #666;
}

.total-amount {
	font-size: 40rpx;
	font-weight: 800;
	color: #D44C4C;
}

.pay-btn {
	padding: 16rpx 48rpx;
	height: 80rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 30rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.3);
	transition: transform 0.2s;
	cursor: pointer;
	&:active {
		transform: scale(0.96);
	}
}

/* ========== 弹窗通用 ========== */
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
	cursor: pointer;
}

.modal-body {
	max-height: 50vh;
	overflow-y: auto;
}

/* ========== 地址选择 ========== */
.address-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
	&:last-child {
		border-bottom: none;
	}
}

.address-item-info {
	flex: 1;
}

.address-item-name {
	display: flex;
	gap: 20rpx;
	margin-bottom: 4rpx;
}

.addr-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.addr-phone {
	font-size: 26rpx;
	color: #666;
}

.addr-detail {
	font-size: 24rpx;
	color: #999;
}

.address-item-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8rpx;
	flex-shrink: 0;
}

.addr-tag {
	font-size: 18rpx;
	color: #D49A55;
	background: #FFF5E4;
	padding: 2rpx 12rpx;
	border-radius: 12rpx;
}

.addr-check {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #D0C8C0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
	&.checked {
		background: #D49A55;
		border-color: #D49A55;
	}
}

.add-address-btn {
	text-align: center;
	padding: 24rpx 0;
	color: #D49A55;
	font-size: 28rpx;
	font-weight: 500;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
}

/* ========== 优惠券选择 ========== */
.coupon-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
	&.disabled {
		opacity: 0.5;
	}
}

.coupon-left {
	display: flex;
	align-items: baseline;
	gap: 12rpx;
}

.coupon-amount {
	font-size: 40rpx;
	font-weight: 800;
	color: #D44C4C;
}

.coupon-desc {
	font-size: 24rpx;
	color: #666;
}

.coupon-right {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.coupon-condition {
	font-size: 20rpx;
	color: #999;
}

.coupon-check {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #D0C8C0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
	&.checked {
		background: #D49A55;
		border-color: #D49A55;
	}
}

.no-coupon {
	text-align: center;
	padding: 60rpx 0;
	color: #999;
	font-size: 28rpx;
}

/* ========== 配送方式选择 ========== */
.delivery-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	cursor: pointer;
	&:active {
		opacity: 0.7;
	}
	&:last-child {
		border-bottom: none;
	}
}

.delivery-left {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.delivery-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
}

.delivery-desc {
	font-size: 22rpx;
	color: #999;
}

.delivery-right {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.delivery-fee {
	font-size: 26rpx;
	font-weight: 600;
	color: #D44C4C;
}

.delivery-check {
	width: 40rpx;
	height: 40rpx;
	border-radius: 50%;
	border: 2rpx solid #D0C8C0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #fff;
	&.checked {
		background: #D49A55;
		border-color: #D49A55;
	}
}
</style>