<template>
	<view class="chat-page">
		<!-- 顶部导航 -->
		<view class="nav-bar" ref="navBarRef">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<view class="nav-user">
				<image class="nav-avatar" :src="avatar" mode="aspectFill" />
				<text class="nav-title">{{ chatName }}</text>
			</view>
			<view class="nav-right"></view>
		</view>
		<!-- 聊天消息列表 -->
		<scroll-view class="message-list" scroll-y :scroll-into-view="scrollViewId" scroll-with-animation
			:style="{ height: scrollHeight + 'px' }" @scroll="onScrollHandler">
			<view class="message-item" v-for="(msg, idx) in messageList" :key="idx" :id="'msg-' + idx">
				<view class="message-time" v-if="msg.showTime">{{ msg.time }}</view>
				<!-- 对方消息 -->
				<view class="message-row message-row-other" v-if="!msg.isSelf">
					<view class="avatar avatar-other">
						<image class="avatar-img" :src="avatar" mode="aspectFill" v-if="avatar" />
						<text class="avatar-text" v-else>🐱</text>
					</view>
					<view class="bubble bubble-other">
						<text class="bubble-text">{{ msg.content }}</text>
					</view>
				</view>
				<!-- 自己消息 -->
				<view class="message-row message-row-self" v-if="msg.isSelf">
					<view class="avatar avatar-self">
						<text class="avatar-text">我</text>
					</view>
					<view class="bubble bubble-self">
						<text class="bubble-text">{{ msg.content }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 底部固定区域 -->
		<view class="bottom-fixed" ref="bottomRef" :style="{ paddingBottom: keyBoardHeight + 'px' }">
			<!-- 快捷回复 -->
			<view class="quick-reply" v-if="quickReplies.length > 0">
				<view class="quick-item" v-for="(item, idx) in quickReplies" :key="idx" @click="sendQuickReply(item)">
					{{ item }}
				</view>
			</view>
			<!-- 底部输入框 -->
			<view class="input-bar">
				<view class="input-wrap">
					<input class="chat-input" v-model="inputText" placeholder="输入消息..." @confirm="sendMessage"
						confirm-type="send" @focus="handleInputFocus" @blur="handleInputBlur" />
					<view class="send-btn" :class="{ 'send-active': inputText.trim().length > 0 }" @click="sendMessage">
						<text>发送</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref,
		nextTick,
		onMounted,
		watch,
		onUnmounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	const inputText = ref('')
	const scrollViewId = ref('')
	const scrollHeight = ref(0)
	const keyBoardHeight = ref(0)
	const chatId = ref('')
	const chatName = ref('聊天')
	const avatar = ref('')
	const chatType = ref('')
	const navBarRef = ref(null)
	const bottomRef = ref(null)

	let keyboardChangeHandler = null
	// 用户是否手动向上滚动过（离开底部）
	const isUserScrollUp = ref(false)
	// scroll-view 距离底部阈值，单位px
	const SCROLL_BOTTOM_THRESHOLD = 80

	// ---- 消息列表 ----
	const messageList = ref([{
		content: '您好！请问有什么可以帮助您？',
		isSelf: false,
		time: '09:00',
		showTime: true
	}])
	// ---- 快捷回复 ----
	const quickReplies = ref([
		'查看订单', '咨询物流', '领养问题', '其他'
	])

	// ---- 监听scroll-view滚动，判断用户是否手动上滑 ----
	const onScrollHandler = (e) => {
	  const { scrollTop, scrollHeight } = e.detail
	  const distanceToBottom = scrollHeight - scrollTop
	  isUserScrollUp.value = distanceToBottom > SCROLL_BOTTOM_THRESHOLD
	}


	// ---- 计算滚动高度 ----
	const calcScrollViewHeight = () => {
		nextTick(() => {
			const query = uni.createSelectorQuery()
			query.select('.nav-bar').boundingClientRect()
			query.select('.bottom-fixed').boundingClientRect()
			query.exec(res => {
				const sys = uni.getSystemInfoSync()
				let navH = res[0]?.height || 80
				let bottomH = res[1]?.height || 120
				scrollHeight.value = sys.windowHeight - navH - bottomH
			})
		})
	}

	// ---- 滚动到底部 ----
	const scrollToBottom = async (force = false) => {
		// 用户手动上翻，非强制则不自动滚动
		if (!force && isUserScrollUp.value) return
		scrollViewId.value = ''
		await nextTick()
		const lastIndex = messageList.value.length - 1
		// 置空再赋值，触发小程序更新scroll‑into‑view
		setTimeout(() => {
			scrollViewId.value = `msg-${lastIndex}`
		}, 30)
	}

	// ---- 监听消息变化 ----
	watch(messageList, () => {
		scrollToBottom(false)
	}, {
		deep: true
	})

	// ---- 获取页面参数 ----
	onLoad((options) => {
		chatId.value = options.chatId || ''
		chatName.value = decodeURIComponent(options.name || '聊天')
		avatar.value = decodeURIComponent(options.avatar || '')
		chatType.value = options.type || ''
		// 根据类型设置快捷回复
		if (chatType.value === 'service') {
			quickReplies.value = ['咨询商品', '售后问题', '物流查询', '其他']
		} else if (chatType.value === 'adopt') {
			quickReplies.value = ['领养流程', '宠物情况', '申请进度', '其他']
		} else if (chatType.value === 'order') {
			quickReplies.value = ['订单查询', '物流信息', '退换货', '其他']
		}
	})

	// ---- 生命周期 ----
	onMounted(() => {
		calcScrollViewHeight()
		scrollToBottom(true)
		keyboardChangeHandler = (e) => {
			keyBoardHeight.value = e.height || 0
			if (e.height > 0) {
				setTimeout(() => scrollToBottom(true), 80)
			}
		}
		uni.onKeyboardHeightChange(keyboardChangeHandler)
	})
	onUnmounted(() => {
		if (keyboardChangeHandler) {
			uni.offKeyboardHeightChange(keyboardChangeHandler)
		}
	})

	// ---- 输入框事件 ----
	const handleInputFocus = () => {}
	const handleInputBlur = () => {
		keyBoardHeight.value = 0
	}

	// ---- 发送消息 ----
	const sendMessage = () => {
		const text = inputText.value.trim()
		if (!text) return
		const time = getCurrentTime()
		messageList.value.push({
			content: text,
			isSelf: true,
			time: time,
			showTime: shouldShowTime()
		})
		inputText.value = ''
		// 自己发消息强制滚到底
		scrollToBottom(true)

		setTimeout(() => {
			const reply = getAutoReply(text)
			messageList.value.push({
				content: reply,
				isSelf: false,
				time: getCurrentTime(),
				showTime: true
			})
		}, 800 + Math.random() * 500)
	}

	// ---- 快捷回复 ----
	const sendQuickReply = (text) => {
		inputText.value = text
		sendMessage()
	}

	// ---- 获取自动回复 ----
	const getAutoReply = (text) => {
		const replies = {
			'订单': '您好！您的订单正在处理中，如有问题请提供订单号。',
			'物流': '您好！正在为您查询物流信息，请稍候...',
			'领养': '您好！领养申请正在审核中，请耐心等待结果。',
			'你好': '您好！很高兴为您服务，请问有什么可以帮您？',
			'谢谢': '不客气！祝您生活愉快！'
		}
		for (const [key, value] of Object.entries(replies)) {
			if (text.includes(key)) return value
		}
		return '收到您的消息，我们会尽快回复您！'
	}

	// ---- 辅助方法 ----
	const getCurrentTime = () => {
		const now = new Date()
		return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0')
	}
	const shouldShowTime = () => {
		const last = messageList.value[messageList.value.length - 1]
		if (!last) return true
		return last.time !== getCurrentTime()
	}

	// ---- 返回 ----
	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}
</script>
<style lang="scss" scoped>
	.chat-page {
		background: #EDEDED;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* ========== 顶部导航 ========== */
	.nav-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 60rpx 32rpx 20rpx;
		background: #FFFFFF;
		z-index: 10;
		border-bottom: 1rpx solid #F0EDE8;
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
		// margin-top: -6rpx;
		margin-bottom: 10px;
	}

	.nav-user {
		display: flex;
		align-items: center;
		gap: 12rpx;
		flex: 1;
		justify-content: center;
	}

	.nav-avatar {
		width: 48rpx;
		height: 48rpx;
		border-radius: 50%;
		object-fit: cover;
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 700;
		color: #1A1A1A;
	}

	.nav-right {
		width: 72rpx;
		flex-shrink: 0;
	}

	/* ========== 消息列表 ========== */
	.message-list {
		padding: 20rpx 32rpx 16rpx;
		background: #EDEDED;
		box-sizing: border-box;
	}

	.message-item {
		margin-bottom: 20rpx;
	}

	.message-time {
		text-align: center;
		font-size: 22rpx;
		color: #B0A8A0;
		margin-bottom: 16rpx;
	}

	/* ===== 消息行 ===== */
	.message-row {
		display: flex;
		align-items: flex-start;
		gap: 12rpx;
		width: 100%;
		box-sizing: border-box;
		margin-bottom: 8rpx;
	}

	.message-row-other {
		flex-direction: row;
	}

	.message-row-self {
		flex-direction: row-reverse;
	}

	/* ===== 头像 ===== */
	.avatar {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		overflow: hidden;
	}

	.avatar-other {
		background: linear-gradient(135deg, #D5F0E8, #B8E0D2);
	}

	.avatar-self {
		background: linear-gradient(135deg, #D49A55, #B8860B);
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-text {
		font-size: 28rpx;
	}

	.avatar-self .avatar-text {
		color: #fff;
		font-size: 24rpx;
		font-weight: 600;
	}

	/* ===== 消息气泡 ===== */
	.bubble {
		max-width: 62%;
		padding: 16rpx 24rpx;
		border-radius: 24rpx;
		font-size: 28rpx;
		line-height: 1.6;
		word-break: break-word;
	}

	.bubble-other {
		background: #FFFFFF;
		color: #333;
		border-top-left-radius: 4rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.bubble-self {
		background: #95EC69;
		color: #1A1A1A;
		border-top-right-radius: 4rpx;
		box-shadow: 0 2rpx 8rpx rgba(149, 236, 105, 0.25);
	}

	.bubble-text {
		display: block;
		white-space: pre-wrap;
	}

	/* ========== 底部固定区域 ========== */
	.bottom-fixed {
		background: #FFFFFF;
		border-top: 1rpx solid #F0EDE8;
	}

	/* ========== 快捷回复 ========== */
	.quick-reply {
		display: flex;
		gap: 12rpx;
		padding: 12rpx 32rpx 14rpx;
		background: #FFFFFF;
		flex-wrap: wrap;
		border-bottom: 1rpx solid #F5F4F0;
	}

	.quick-item {
		padding: 8rpx 24rpx;
		background: #F5F4F0;
		border: 1rpx solid #E8E5E0;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
		transition: all 0.2s;

		&:active {
			background: #FFF5E4;
			border-color: #D49A55;
			color: #D49A55;
		}
	}

	/* ========== 底部输入框 ========== */
	.input-bar {
		padding: 12rpx 32rpx 20rpx;
		background: #FFFFFF;
	}

	.input-wrap {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	.chat-input {
		flex: 1;
		height: 72rpx;
		background: #F5F4F0;
		border-radius: 36rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		color: #333;
		border: 2rpx solid transparent;
		transition: border-color 0.3s;

		&:focus {
			border-color: #D49A55;
			background: #FFFFFF;
		}
	}

	.send-btn {
		width: 80rpx;
		height: 72rpx;
		background: #E8E5E0;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
		font-size: 26rpx;
		font-weight: 500;
		transition: all 0.3s;

		&.send-active {
			background: linear-gradient(135deg, #D49A55, #B8860B);
			color: #fff;
			box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.25);
		}

		&:active {
			transform: scale(0.92);
		}
	}
</style>