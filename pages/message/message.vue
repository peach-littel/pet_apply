<template>
	<view class="message-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<text class="nav-title">消息</text>
		</view>
		<!-- 功能入口 -->
		<view class="entry-row">
			<view class="entry-item" v-for="item in entryList" :key="item.id" @click="goEntry(item)">
				<view class="entry-icon" :style="{ background: item.bgColor }">
					<text>{{ item.icon }}</text>
				</view>
				<text class="entry-name">{{ item.name }}</text>
				<view class="entry-badge" v-if="item.badge > 0">{{ formatBadge(item.badge) }}</view>
			</view>
		</view>
		<!-- 消息列表 -->
		<view class="msg-list">
			<view class="msg-item" v-for="item in msgList" :key="item.id" @click="goChat(item)">
				<view class="msg-avatar-wrap">
					<image 
						class="msg-avatar" 
						:src="item.avatar" 
						mode="aspectFill"
						@error="handleImgError($event)"
					/>
					<view class="msg-badge" v-if="item.unread > 0">{{ formatBadge(item.unread) }}</view>
				</view>
				<view class="msg-content">
					<view class="msg-header">
						<text class="msg-name">{{ item.name }}</text>
						<text class="msg-time">{{ item.time }}</text>
					</view>
					<text class="msg-text">{{ item.lastMsg }}</text>
				</view>
			</view>
			<!-- 空状态 -->
			<view class="empty-wrap" v-if="msgList.length === 0">
				<text class="empty-icon">💬</text>
				<text class="empty-tip">暂无消息</text>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// ---- 获取全局数据，增加异常捕获兜底 ----
let globalData = {}
try {
	const app = getApp()
	globalData = app.globalData || {}
} catch (e) {
	globalData = {}
}

/**角标格式化，大于99显示99+ */
const formatBadge = (num) => {
	return Number(num) > 99 ? '99+' : String(num)
}

/**图片加载失败兜底 */
const handleImgError = (e) => {
	e.target.src = '/static/images/default-avatar.png'
}

// ---- 计算未读数量，全部数组安全判断 Array.isArray 防止filter报错 ----
const getUnreadCount = () => {
	// 领养申请
	const adoptList = Array.isArray(globalData.adoptApplications) ? globalData.adoptApplications : []
	const adoptUnread = adoptList.filter(item => item.status === 'pending').length

	// 订单
	const orders = Array.isArray(globalData.orders) ? globalData.orders : []
	const orderUnread = orders.filter(item =>
		item.status === 'pending' || item.status === 'shipping' || item.status === 'received'
	).length

	// 系统通知未读
	const systemNoticeList = Array.isArray(globalData.systemNotices) ? globalData.systemNotices : []
	const systemUnread = systemNoticeList.filter(n => !n.read).length

	// 客服消息未读总和 type=service
	const serviceUnread = msgList.value
		.filter(i => i.type === 'service')
		.reduce((sum, cur) => sum + (cur.unread || 0), 0)

	return { adoptUnread, orderUnread, systemUnread, serviceUnread }
}

// ---- 功能入口 ----
const entryList = ref([
	{ id: 1, name: '系统通知', icon: '🔔', bgColor: '#FFE08A', badge: 0, path: '/pages/message/system-notice/system-notice' },
	{ id: 2, name: '领养动态', icon: '🐾', bgColor: '#F2C89C', badge: 0, path: '/pages/message/adopt-dynamic/adopt-dynamic' },
	{ id: 3, name: '订单消息', icon: '📦', bgColor: '#A4C7E8', badge: 0, path: '/pages/message/order-message/order-message' },
	{ id: 4, name: '客服消息', icon: '💬', bgColor: '#B8E0D2', badge: 0, path: '/pages/message/customer-service/customer-service' }
])

// ---- 消息列表 ----
const msgList = ref([
	{
		id: 1,
		name: '布丁的救助站',
		avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100',
		lastMsg: '您好，您的领养申请已通过审核，请尽快联系我们...',
		time: '10:30',
		unread: 0,
		type: 'adopt',
		chatId: 'adopt_1'
	},
	{
		id: 2,
		name: '宠物好物旗舰店',
		avatar: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100',
		lastMsg: '您的订单已发货，顺丰速运 SF1234567890',
		time: '昨天',
		unread: 0,
		type: 'order',
		chatId: 'order_1'
	},
	{
		id: 3,
		name: '可乐的领养人',
		avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100',
		lastMsg: '可乐今天特别活泼，吃了好多罐头~',
		time: '昨天',
		unread: 0,
		type: 'chat',
		chatId: 'user_1'
	},
	{
		id: 4,
		name: '在线客服',
		avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
		lastMsg: '感谢您的咨询，祝您生活愉快！',
		time: '周一',
		unread: 0,
		type: 'service',
		chatId: 'service'
	}
])

// ---- 更新未读数量 ----
const updateBadges = () => {
	const { adoptUnread, orderUnread, systemUnread, serviceUnread } = getUnreadCount()
	entryList.value.forEach(item => {
		if (item.name === '系统通知') item.badge = systemUnread
		if (item.name === '领养动态') item.badge = adoptUnread
		if (item.name === '订单消息') item.badge = orderUnread
		if (item.name === '客服消息') item.badge = serviceUnread
	})
}

// ---- 跳转方法 ----
const goEntry = (item) => {
	if (item.path) {
		uni.navigateTo({ url: item.path })
	} else {
		uni.showToast({ title: `${item.name}`, icon: 'none' })
	}
}

const goChat = (item) => {
	// 点击会话，清空本条未读
	if (item.unread > 0) {
		item.unread = 0
		updateBadges()
	}
	uni.navigateTo({
		url: `/pages/message/chat/chat?chatId=${item.chatId}&name=${encodeURIComponent(item.name)}&avatar=${encodeURIComponent(item.avatar)}&type=${item.type}`
	})
}

// ---- 页面显示时更新 ----
onShow(() => {
	updateBadges()
})
</script>
<style lang="scss" scoped>
.message-page {
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: env(safe-area-inset-bottom);
}
.nav-bar {
	padding: calc(60rpx + env(safe-area-inset-top)) 32rpx 24rpx;
	background: #fff;
}
.nav-title {
	font-size: 38rpx;
	font-weight: bold;
	color: #333;
}
.entry-row {
	display: flex;
	justify-content: space-around;
	background: #fff;
	padding: 32rpx 0;
	margin-bottom: 20rpx;
}
.entry-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	position: relative;
	transition: transform 0.2s;
	&:active {
		transform: scale(0.94);
	}
}
.entry-icon {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
}
.entry-name {
	font-size: 24rpx;
	color: #666;
}
.entry-badge {
	position: absolute;
	top: -4rpx;
	right: 12rpx;
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
.msg-list {
	background: #fff;
}
.msg-item {
	display: flex;
	align-items: center;
	padding: 28rpx 32rpx;
	border-bottom: 1rpx solid #F5F5F5;
	transition: background 0.2s;
	&:active {
		background: #F9F7F4;
	}
}
.msg-avatar-wrap {
	position: relative;
	margin-right: 20rpx;
}
.msg-avatar {
	width: 96rpx;
	height: 96rpx;
	border-radius: 50%;
	background: #F0EDE8;
}
.msg-badge {
	position: absolute;
	top: -4rpx;
	right: -4rpx;
	min-width: 36rpx;
	height: 36rpx;
	background: #E64340;
	color: #fff;
	font-size: 22rpx;
	border-radius: 18rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 10rpx;
}
.msg-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}
.msg-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.msg-name {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}
.msg-time {
	font-size: 24rpx;
	color: #999;
}
.msg-text {
	font-size: 26rpx;
	color: #999;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 500rpx;
}

.empty-wrap {
	padding: 120rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap:16rpx;
	.empty-icon {
		font-size:80rpx;
		opacity:0.5;
	}
	.empty-tip {
		font-size:28rpx;
		color:#999;
	}
}
</style>
