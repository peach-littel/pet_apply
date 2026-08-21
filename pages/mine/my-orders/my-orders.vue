<template>
	<view class="my-orders-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">我的订单</text>
			<view class="nav-right" @click="toggleSearch">
				<image class="search-icon" src="/pages/static/tab/search.png"></image>
			</view>
		</view>

		<!-- 搜索栏 -->
		<view class="search-bar" v-if="showSearch">
			<view class="search-input-wrap">
				<image class="search-icon-small" src="/pages/static/tab/search.png"></image>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索订单号、商品名称" 
					confirm-type="search"
					@confirm="onSearch"
				/>
				<text class="search-clear" v-if="searchKeyword" @click="clearSearch">✕</text>
			</view>
			<text class="search-cancel-btn" @click="toggleSearch">取消</text>
		</view>

		<!-- 状态Tab -->
		<scroll-view class="filter-tabs" scroll-x show-scrollbar="false">
			<view class="filter-item" :class="{ active: currentStatus === 'all' }" @click="switchStatus('all')">全部</view>
			<view class="filter-item" :class="{ active: currentStatus === 'pending' }" @click="switchStatus('pending')">
				待付款
				<view class="status-badge" v-if="getStatusCount('pending') > 0">{{ getStatusCount('pending') }}</view>
			</view>
			<view class="filter-item" :class="{ active: currentStatus === 'shipping' }" @click="switchStatus('shipping')">
				待发货
				<view class="status-badge" v-if="getShippingCount() > 0">{{ getShippingCount() }}</view>
			</view>
			<view class="filter-item" :class="{ active: currentStatus === 'received' }" @click="switchStatus('received')">
				待收货
				<view class="status-badge" v-if="getStatusCount('received') > 0">{{ getStatusCount('received') }}</view>
			</view>
			<view class="filter-item" :class="{ active: currentStatus === 'comment' }" @click="switchStatus('comment')">
				待评价
				<view class="status-badge" v-if="getStatusCount('comment') > 0">{{ getStatusCount('comment') }}</view>
			</view>
			<view class="filter-item" :class="{ active: currentStatus === 'refund' }" @click="switchStatus('refund')">
				退款/售后
				<view class="status-badge" v-if="getRefundCount() > 0">{{ getRefundCount() }}</view>
			</view>
		</scroll-view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view class="order-card" v-for="order in filteredOrders" :key="order.id">
				<!-- 订单头部 -->
				<view class="order-header" @click="goDetail(order)">
					<text class="order-id">订单号：{{ order.id }}</text>
					<text class="order-status" :style="{ color: getStatusColor(order.status) }">
						{{ getStatusText(order.status) }}
					</text>
				</view>

				<!-- 商品信息 -->
				<view class="order-body" @click="goDetail(order)">
					<view class="order-item" v-for="(item, idx) in order.items" :key="idx">
						<image class="item-img" :src="item.image || defaultImage" mode="aspectFill" @error="onImageError" />
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

				<!-- 订单底部 -->
				<view class="order-footer">
					<text class="order-total">共{{ order.items.length }}件 实付</text>
					<text class="order-amount">¥{{ order.totalAmount }}</text>
				</view>

				<!-- 操作按钮 -->
				<view class="order-actions">
					<!-- 待付款：取消订单 + 去支付 -->
					<template v-if="order.status === 'pending'">
						<view class="action-btn secondary" @click="cancelOrder(order)">取消订单</view>
						<view class="action-btn primary" @click="goPay(order)">去支付</view>
					</template>

					<!-- ⭐ 已支付/待发货：提醒发货 + 申请退款 -->
					<template v-if="order.status === 'paid' || order.status === 'shipping'">
						<view class="action-btn secondary" @click="remindShip(order)">提醒发货</view>
						<view class="action-btn danger" @click="applyRefund(order)">申请退款</view>
					</template>

					<!-- 待收货：查看物流 + 确认收货 -->
					<template v-if="order.status === 'received'">
						<view class="action-btn secondary" @click="trackLogistics(order)">查看物流</view>
						<view class="action-btn primary" @click="confirmReceive(order)">确认收货</view>
					</template>

					<!-- 待评价：去评价 -->
					<template v-if="order.status === 'comment'">
						<view class="action-btn secondary" @click="deleteOrder(order)">删除订单</view>
						<view class="action-btn primary" @click="goComment(order)">去评价</view>
					</template>

					<!-- 退款/售后：查看售后 -->
					<template v-if="order.status === 'refunding'">
						<view class="action-btn secondary" @click="cancelRefundApply(order)">撤销申请</view>
						<view class="action-btn primary" @click="viewRefundDetail(order)">查看进度</view>
					</template>

					<!-- 已退款 -->
					<template v-if="order.status === 'refunded'">
						<view class="action-btn secondary" @click="deleteOrder(order)">删除订单</view>
						<view class="action-btn primary" @click="viewRefundDetail(order)">查看详情</view>
					</template>

					<!-- 已完成：删除订单 + 再次购买 -->
					<template v-if="order.status === 'completed'">
						<view class="action-btn secondary" @click="deleteOrder(order)">删除订单</view>
						<view class="action-btn primary" @click="buyAgain(order)">再次购买</view>
					</template>

					<!-- 已取消：删除订单 + 再次购买 -->
					<template v-if="order.status === 'cancelled'">
						<view class="action-btn secondary" @click="deleteOrder(order)">删除订单</view>
						<view class="action-btn primary" @click="buyAgain(order)">再次购买</view>
					</template>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredOrders.length === 0" class="empty-state">
			<text class="empty-icon">📦</text>
			<text class="empty-text">{{ searchKeyword ? '未找到相关订单' : '暂无订单' }}</text>
			<view class="empty-btn" @click="goShopping" v-if="!searchKeyword">去逛逛</view>
			<view class="empty-btn" @click="clearSearch" v-else>清除搜索</view>
		</view>

		<!-- 删除确认弹窗 -->
		<view class="modal-mask" v-if="showDeleteModal" @click="showDeleteModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">确认删除</view>
				<text class="modal-desc">删除后订单将无法恢复，确定删除吗？</text>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showDeleteModal = false">取消</view>
					<view class="modal-btn confirm" @click="confirmDelete">确定删除</view>
				</view>
			</view>
		</view>

		<!-- 取消订单确认弹窗 -->
		<view class="modal-mask" v-if="showCancelModal" @click="showCancelModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">取消订单</view>
				<text class="modal-desc">确定要取消该订单吗？取消后订单将无法恢复。</text>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showCancelModal = false">再想想</view>
					<view class="modal-btn confirm" @click="confirmCancel">确定取消</view>
				</view>
			</view>
		</view>

		<!-- 确认收货弹窗 -->
		<view class="modal-mask" v-if="showReceiveModal" @click="showReceiveModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">确认收货</view>
				<text class="modal-desc">请确认已收到商品，确认后无法撤销。</text>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showReceiveModal = false">稍后确认</view>
					<view class="modal-btn confirm" @click="confirmReceiveOrder">确认收货</view>
				</view>
			</view>
		</view>

		<!-- 撤销退款确认弹窗 -->
		<view class="modal-mask" v-if="showCancelRefundModal" @click="showCancelRefundModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-title">撤销退款申请</view>
				<text class="modal-desc">确定要撤销退款申请吗？撤销后订单将恢复正常状态。</text>
				<view class="modal-btns">
					<view class="modal-btn cancel" @click="showCancelRefundModal = false">再想想</view>
					<view class="modal-btn confirm" @click="confirmCancelRefund">确定撤销</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { onLoad, onShow } from '@dcloudio/uni-app'

	// ---- 获取全局数据 ----
	const app = getApp()
	const globalData = app.globalData || {}

	// ---- 默认图片 ----
	const defaultImage = 'https://via.placeholder.com/200/FFE5B4/8B5A2B?text=Pet'

	// ---- 状态 ----
	const currentStatus = ref('all')
	const orders = ref([])
	const searchKeyword = ref('')
	const showSearch = ref(false)

	// ---- 弹窗状态 ----
	const showDeleteModal = ref(false)
	const showCancelModal = ref(false)
	const showReceiveModal = ref(false)
	const showCancelRefundModal = ref(false)
	const targetOrder = ref(null)

	// ---- 从全局更新订单列表 ----
	const updateOrders = () => {
		orders.value = globalData.orders?.value || []
	}

	// ---- ⭐ 获取各状态订单数量 ----
	const getStatusCount = (status) => {
		return orders.value.filter(o => o.status === status).length
	}

	// ---- ⭐ 获取待发货数量（包含 paid 和 shipping） ----
	const getShippingCount = () => {
		return orders.value.filter(o => o.status === 'paid' || o.status === 'shipping').length
	}

	// ---- ⭐ 获取退款/售后数量 ----
	const getRefundCount = () => {
		return orders.value.filter(o => o.status === 'refunding' || o.status === 'refunded').length
	}

	// ---- 搜索 ----
	const onSearch = () => {}
	const toggleSearch = () => {
		showSearch.value = !showSearch.value
		if (!showSearch.value) {
			searchKeyword.value = ''
		}
	}
	const clearSearch = () => {
		searchKeyword.value = ''
	}

	// ---- 标记订单状态为已读 ----
	const markOrderStatusAsRead = (status) => {
		const orderList = globalData.orders?.value || []
		const readStatus = uni.getStorageSync('order_read_status') || {}
		
		let filteredOrders = []
		if (status === 'shipping') {
			// 待发货包含 paid 和 shipping
			filteredOrders = orderList.filter(o => o.status === 'paid' || o.status === 'shipping')
		} else if (status === 'refund') {
			filteredOrders = orderList.filter(o => o.status === 'refunding' || o.status === 'refunded')
		} else {
			filteredOrders = orderList.filter(o => o.status === status)
		}
		
		const orderIds = filteredOrders.map(o => o.id)
		if (orderIds.length === 0) return
		
		const existingRead = readStatus[status] || []
		const merged = [...new Set([...existingRead, ...orderIds])]
		
		readStatus[status] = merged
		uni.setStorageSync('order_read_status', readStatus)
	}

	// ---- 切换状态 ----
	const switchStatus = (status) => {
		currentStatus.value = status
		if (status !== 'all') {
			markOrderStatusAsRead(status)
		} else {
			const statuses = ['pending', 'shipping', 'received', 'comment', 'refund']
			statuses.forEach(s => markOrderStatusAsRead(s))
		}
	}

	// ---- ⭐ 筛选 ----
	const filteredOrders = computed(() => {
		let list = orders.value
		
		if (currentStatus.value !== 'all') {
			if (currentStatus.value === 'refund') {
				// 退款/售后：显示 refunding 和 refunded
				list = list.filter(o => o.status === 'refunding' || o.status === 'refunded')
			} else if (currentStatus.value === 'comment') {
				// 待评价：显示 comment 状态
				list = list.filter(o => o.status === 'comment')
			} else if (currentStatus.value === 'shipping') {
				// ⭐ 待发货：包含 paid 和 shipping
				list = list.filter(o => o.status === 'paid' || o.status === 'shipping')
			} else {
				list = list.filter(o => o.status === currentStatus.value)
			}
		}
		
		if (searchKeyword.value.trim()) {
			const keyword = searchKeyword.value.trim().toLowerCase()
			list = list.filter(o => 
				o.id.toLowerCase().includes(keyword) ||
				o.items.some(item => item.name.toLowerCase().includes(keyword))
			)
		}
		
		return list
	})

	// ---- ⭐ 状态映射（添加 paid） ----
	const getStatusText = (s) => ({
		pending: '待付款',
		paid: '已支付',
		shipping: '待发货',
		received: '待收货',
		comment: '待评价',
		completed: '已完成',
		cancelled: '已取消',
		refunding: '退款中',
		refunded: '已退款'
	}[s] || s)

	// ---- ⭐ 状态颜色（添加 paid） ----
	const getStatusColor = (s) => ({
		pending: '#FF6B6B',
		paid: '#4ECDC4',
		shipping: '#F5A623',
		received: '#4ECDC4',
		comment: '#F5A623',
		completed: '#999',
		cancelled: '#999',
		refunding: '#FF6B6B',
		refunded: '#999'
	}[s] || '#999')

	const onImageError = (e) => {
		e.target.src = defaultImage
	}

	const goDetail = (order) => {
		uni.navigateTo({
			url: `/pages/mine/my-orders/order-detail/order-detail?id=${order.id}`
		})
	}

	// ========== 订单操作 ==========

	// ---- 取消订单 ----
	const cancelOrder = (order) => {
		targetOrder.value = order
		showCancelModal.value = true
	}

	const confirmCancel = () => {
		if (!targetOrder.value) return
		if (globalData.updateOrderStatus) {
			globalData.updateOrderStatus(targetOrder.value.id, 'cancelled')
			uni.showToast({ title: '订单已取消', icon: 'success' })
		}
		showCancelModal.value = false
		targetOrder.value = null
		updateOrders()
	}

	// ---- 删除订单 ----
	const deleteOrder = (order) => {
		targetOrder.value = order
		showDeleteModal.value = true
	}

	const confirmDelete = () => {
		if (!targetOrder.value) return
		
		if (globalData.deleteOrder) {
			const result = globalData.deleteOrder(targetOrder.value.id)
			if (result) {
				uni.showToast({ title: '已删除', icon: 'success' })
			} else {
				uni.showToast({ title: '删除失败', icon: 'none' })
			}
		} else {
			const orderList = globalData.orders?.value || []
			const index = orderList.findIndex(o => o.id === targetOrder.value.id)
			if (index !== -1) {
				orderList.splice(index, 1)
				if (typeof globalData.orders.value !== 'undefined') {
					globalData.orders.value = [...orderList]
				}
				uni.showToast({ title: '已删除', icon: 'success' })
			}
		}
		
		showDeleteModal.value = false
		targetOrder.value = null
		updateOrders()
	}

	// ---- 去支付 ----
	const goPay = (order) => {
		uni.navigateTo({
			url: `/pages/pay/pay?order=${encodeURIComponent(JSON.stringify(order))}`
		})
	}

	// ---- 申请退款 ----
	const applyRefund = (order) => {
		uni.navigateTo({
			url: `/pages/refund/refund?order=${encodeURIComponent(JSON.stringify(order))}`
		})
	}

	// ---- 提醒发货 ----
	const remindShip = (order) => {
		uni.showLoading({ title: '发送中...' })
		setTimeout(() => {
			uni.hideLoading()
			uni.showToast({ title: '已提醒商家发货', icon: 'success' })
		}, 1000)
	}

	// ---- 查看物流 ----
	const trackLogistics = (order) => {
		uni.showToast({ title: '查看物流信息', icon: 'none' })
	}

	// ---- 确认收货 ----
	const confirmReceive = (order) => {
		targetOrder.value = order
		showReceiveModal.value = true
	}

	const confirmReceiveOrder = () => {
		if (!targetOrder.value) return
		if (globalData.updateOrderStatus) {
			globalData.updateOrderStatus(targetOrder.value.id, 'comment')
			uni.showToast({ title: '已确认收货', icon: 'success' })
		}
		showReceiveModal.value = false
		targetOrder.value = null
		updateOrders()
	}

	// ---- 去评价 ----
	const goComment = (order) => {
		uni.navigateTo({
			url: `/pages/mine/my-orders/order-comment/order-comment?order=${encodeURIComponent(JSON.stringify(order))}`
		})
	}

	// ---- 查看售后详情 ----
	const viewRefundDetail = (order) => {
		uni.navigateTo({
			url: `/pages/mine/my-orders/order-refund/order-refund?order=${encodeURIComponent(JSON.stringify(order))}`
		})
	}

	// ---- 撤销退款申请 ----
	const cancelRefundApply = (order) => {
		targetOrder.value = order
		showCancelRefundModal.value = true
	}

	const confirmCancelRefund = () => {
		if (!targetOrder.value) return
		if (globalData.updateOrderStatus) {
			globalData.updateOrderStatus(targetOrder.value.id, 'shipping')
			uni.showToast({ title: '已撤销退款申请', icon: 'success' })
		}
		showCancelRefundModal.value = false
		targetOrder.value = null
		updateOrders()
	}

	// ---- 再次购买 ----
	const buyAgain = (order) => {
		order.items.forEach(item => {
			if (globalData.addToCart) {
				globalData.addToCart({
					id: item.id || Date.now() + Math.random(),
					name: item.name,
					price: item.price,
					image: item.image,
					spec: item.spec || '默认规格',
					quantity: item.quantity
				})
			}
		})
		uni.showToast({ title: '已加入购物车', icon: 'success' })
		setTimeout(() => {
			uni.switchTab({ url: '/pages/mall/mall' })
		}, 500)
	}

	const goShopping = () => {
		uni.switchTab({ url: '/pages/mall/mall' })
	}

	// ---- 生命周期 ----
	onLoad((options) => {
		if (options.status) {
			currentStatus.value = options.status
		}
		updateOrders()
	})

	onShow(() => {
		updateOrders()
		if (currentStatus.value !== 'all') {
			markOrderStatusAsRead(currentStatus.value)
		}
	})

	const goBack = () => uni.navigateBack()
</script>

<style lang="scss" scoped>
	.my-orders-page {
		min-height: 100vh;
		background: #F5F5F5;
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
		height: 72rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		cursor: pointer;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		align-items: center;
		line-height: 20px;
	}

	/* ========== 搜索栏 ========== */
	.search-bar {
		display: flex;
		align-items: center;
		padding: 12rpx 32rpx 16rpx;
		background: #FFFFFF;
		gap: 16rpx;
		border-bottom: 1rpx solid #F0EDE8;
	}

	.search-input-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		background: #F5F5F5;
		border-radius: 30rpx;
		padding: 12rpx 20rpx;
	}

	.search-icon-small {
		color: #999;
		margin-right: 12rpx;
		width: 16px;
		height: 16px;
		align-items: center;
		line-height: 16px;
	}

	.search-input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		height: 44rpx;
	}

	.search-clear {
		font-size: 28rpx;
		color: #999;
		padding: 4rpx 8rpx;
	}

	.search-cancel-btn {
		font-size: 28rpx;
		color: #D49A55;
		flex-shrink: 0;
	}

	/* ========== 状态Tab ========== */
	.filter-tabs {
		display: flex;
		background: #FFFFFF;
		padding: 16rpx 32rpx;
		gap: 12rpx;
		border-bottom: 1rpx solid #F0EDE8;
		white-space: nowrap;
		overflow-x: auto;
	}

	.filter-item {
		display: inline-flex;
		align-items: center;
		gap: 6rpx;
		font-size: 26rpx;
		color: #666;
		padding: 8rpx 12rpx;
		position: relative;
		flex-shrink: 0;

		&.active {
			color: #D49A55;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				bottom: -4rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 28rpx;
				height: 4rpx;
				background: #D49A55;
				border-radius: 4rpx;
			}
		}
	}

	.status-badge {
		min-width: 32rpx;
		height: 32rpx;
		background: #E64340;
		color: #fff;
		font-size: 18rpx;
		border-radius: 16rpx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0 8rpx;
	}

	/* ========== 订单列表 ========== */
	.order-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.order-card {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 20rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 12rpx;
		border-bottom: 1rpx solid #F5F4F0;
		cursor: pointer;
	}

	.order-id {
		font-size: 24rpx;
		color: #999;
	}

	.order-status {
		font-size: 24rpx;
		font-weight: 500;
	}

	.order-body {
		padding: 12rpx 0;
		cursor: pointer;
	}

	.order-item {
		display: flex;
		gap: 12rpx;
		padding: 8rpx 0;
		align-items: center;

		&:not(:last-child) {
			border-bottom: 1rpx solid #F9F7F4;
		}
	}

	.item-img {
		width: 80rpx;
		height: 80rpx;
		border-radius: 8rpx;
		object-fit: cover;
		flex-shrink: 0;
		background: #F0EDE8;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4rpx;
		min-width: 0;
	}

	.item-name {
		font-size: 26rpx;
		color: #333;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		font-size: 26rpx;
		font-weight: 600;
		color: #D44C4C;
	}

	.item-qty {
		font-size: 22rpx;
		color: #999;
	}

	.order-footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-top: 12rpx;
		border-top: 1rpx solid #F5F4F0;
		gap: 8rpx;
	}

	.order-total {
		font-size: 24rpx;
		color: #666;
	}

	.order-amount {
		font-size: 32rpx;
		font-weight: 700;
		color: #D44C4C;
	}

	/* ========== 操作按钮 ========== */
	.order-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12rpx;
		margin-top: 16rpx;
		padding-top: 16rpx;
		border-top: 1rpx solid #F5F4F0;
	}

	.action-btn {
		padding: 10rpx 28rpx;
		font-size: 24rpx;
		font-weight: 500;
		border-radius: 30rpx;
		transition: transform 0.2s;
		cursor: pointer;

		&:active {
			transform: scale(0.94);
		}

		&.primary {
			background: linear-gradient(135deg, #D49A55, #B8860B);
			color: #fff;
		}

		&.secondary {
			background: #F5F4F0;
			color: #666;
		}

		&.danger {
			background: #FFF0F0;
			color: #E64340;
			border: 1rpx solid #FFCDD2;
		}
	}

	/* ========== 空状态 ========== */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
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
		margin-bottom: 32rpx;
	}

	.empty-btn {
		padding: 16rpx 60rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		font-size: 28rpx;
		border-radius: 30rpx;
		cursor: pointer;

		&:active {
			transform: scale(0.94);
		}
	}

	/* ========== 弹窗 ========== */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: fadeIn 0.25s;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal-content {
		background: #FFFFFF;
		width: 560rpx;
		border-radius: 24rpx;
		padding: 40rpx 32rpx 32rpx;
		animation: slideUp 0.3s;
	}

	@keyframes slideUp {
		from { transform: translateY(40rpx); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.modal-title {
		font-size: 34rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		text-align: center;
		margin-bottom: 16rpx;
	}

	.modal-desc {
		font-size: 28rpx;
		color: #666;
		display: block;
		text-align: center;
		line-height: 1.6;
		margin-bottom: 32rpx;
	}

	.modal-btns {
		display: flex;
		gap: 16rpx;
	}

	.modal-btn {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		font-weight: 600;
		cursor: pointer;

		&:active {
			transform: scale(0.96);
		}

		&.cancel {
			background: #F5F4F0;
			color: #666;
		}

		&.confirm {
			background: linear-gradient(135deg, #D49A55, #B8860B);
			color: #fff;
		}
	}
</style>