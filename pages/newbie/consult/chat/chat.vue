<template>
	<view class="chat-page">
		<!-- 顶部导航 -->
		<view class="nav-bar" ref="navBarRef">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">{{ chatTitle }}</text>
			<view class="nav-right"></view>
		</view>
		<!-- 医生信息 -->
		<view class="doctor-info-bar" v-if="doctorName" ref="doctorBarRef">
			<view class="doctor-avatar">{{ doctorAvatar }}</view>
			<view class="doctor-detail">
				<text class="doctor-name">{{ doctorName }}</text>
				<text class="doctor-status">● 在线</text>
			</view>
			<view class="doctor-badge">专业</view>
		</view>
		<!-- 聊天消息列表 改用scroll-into-view锚点滚动，scroll-with-animation开滚动动画 -->
		<scroll-view
			class="message-list"
			scroll-y
			:scroll-into-view="scrollViewId"
			scroll-with-animation
			:style="{ height: scrollHeight + 'px' }"
		>
			<view
				class="message-item"
				v-for="(msg, idx) in messageList"
				:key="idx"
				:id="'msg-' + idx"
			>
				<view class="message-time" v-if="msg.showTime">{{ msg.time }}</view>
				<!-- 对方消息-->
				<view class="message-row message-row-other" v-if="!msg.isSelf">
					<view class="avatar avatar-other">
						<text class="avatar-text">🐱</text>
					</view>
					<view class="bubble bubble-other">
						<text class="bubble-text">{{ msg.content }}</text>
					</view>
				</view>
				<!-- 自己消息-->
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
					<input
						class="chat-input"
						v-model="inputText"
						placeholder="输入您的问题..."
						@confirm="sendMessage"
						confirm-type="send"
						@focus="handleInputFocus"
						@blur="handleInputBlur"
					/>
					<view class="send-btn" :class="{ 'send-active': inputText.trim().length > 0 }" @click="sendMessage">
						<text>发送</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref, nextTick, onMounted, watch, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const inputText = ref('')
const scrollViewId = ref('') // scroll-into-view目标id
const scrollHeight = ref(0)
const keyBoardHeight = ref(0)
const doctorName = ref('')
const doctorAvatar = ref('🐱')
const chatTitle = ref('在线咨询')
const navBarRef = ref(null)
const doctorBarRef = ref(null)
const bottomRef = ref(null)
let keyboardChangeHandler = null

// ---- 消息列表 ----
const messageList = ref([{
	content: '您好！我是宠物医生，请问有什么可以帮您？',
	isSelf: false,
	time: '09:00',
	showTime: true
}])
// ---- 快捷回复 ----
const quickReplies = ref([
	'描述症状',
	'咨询用药',
	'预约就诊',
	'常见问题'
])

// 动态查询dom，计算scroll‑view可用高度
const calcScrollViewHeight = () => {
	nextTick(() => {
		const query = uni.createSelectorQuery()
		query.select('.nav-bar').boundingClientRect()
		query.select('.doctor-info-bar').boundingClientRect()
		query.select('.bottom-fixed').boundingClientRect()
		query.exec(res => {
			const sys = uni.getSystemInfoSync()
			let navH = res[0]?.height || 0
			let doctorH = res[1]?.height || 0
			let bottomH = res[2]?.height || 0
			scrollHeight.value = sys.windowHeight - navH - doctorH - bottomH
		})
	})
}

/**
 * 滚动到最后一条消息，使用scroll-into-view锚点
 */
const scrollToBottom = () => {
	nextTick(() => {
		setTimeout(() => {
			const lastIndex = messageList.value.length - 1
			scrollViewId.value = `msg-${lastIndex}`
		}, 60)
	})
}

// 消息列表发生变化，自动滚动到最后一条
watch(messageList, () => {
	scrollToBottom()
}, { deep: true })

// ---- 获取页面参数 ----
onLoad((options) => {
	const type = options.type || ''
	const symptoms = options.symptoms || ''
	const desc = options.desc || ''
	const disease = options.disease || ''
	const doctor = options.doctor || ''
	if (doctor) {
		doctorName.value = doctor
		chatTitle.value = `${doctor} · 咨询`
		doctorAvatar.value = '🐱'
		messageList.value.push({
			content: `您好！我是${doctor}，请问有什么可以帮您？`,
			isSelf: false,
			time: getCurrentTime(),
			showTime: true
		})
	} else if (disease) {
		chatTitle.value = `${disease} · 咨询`
		messageList.value.push({
			content: `您好！我注意到您在查看"${disease}"的相关信息，请问您需要了解哪些方面？`,
			isSelf: false,
			time: getCurrentTime(),
			showTime: true
		})
		quickReplies.value = ['症状判断', '治疗方案', '预防措施', '就医建议']
	} else if (symptoms || desc) {
		chatTitle.value = '症状咨询'
		const symptomText = symptoms ? `症状：${symptoms.replace(/,/g, '、')}` : ''
		const descText = desc ? `\n描述：${desc}` : ''
		messageList.value.push({
			content: `您好！我收到了您的咨询信息。${symptomText}${descText}\n\n我会尽快为您分析，请稍候...`,
			isSelf: false,
			time: getCurrentTime(),
			showTime: true
		})
	}
})
// 监听快捷回复显示隐藏，重新算高度
watch(quickReplies, () => {
	calcScrollViewHeight()
}, { deep: true })

onMounted(() => {
	calcScrollViewHeight()
	scrollToBottom()
	// 监听键盘高度变化
	keyboardChangeHandler = (e) => {
		keyBoardHeight.value = e.height || 0
		if (e.height > 0) {
			setTimeout(() => scrollToBottom(), 80)
		}
	}
	uni.onKeyboardHeightChange(keyboardChangeHandler)
})

onUnmounted(() => {
	if (keyboardChangeHandler) {
		uni.offKeyboardHeightChange(keyboardChangeHandler)
	}
})

const handleInputFocus = () => { }
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

	setTimeout(() => {
		const reply = getAutoReply(text)
		messageList.value.push({
			content: reply,
			isSelf: false,
			time: getCurrentTime(),
			showTime: true
		})
	}, 1000 + Math.random() * 500)
}
// ---- 快捷回复 ----
const sendQuickReply = (text) => {
	inputText.value = text
	sendMessage()
}
// ---- 获取自动回复 ----
const getAutoReply = (text) => {
	const keywords = {
		'症状': '请详细描述您的宠物出现的症状，包括：\n1. 出现时间\n2. 具体表现\n3. 频率\n4. 是否有其他异常',
		'用药': '用药建议需要根据具体情况制定，请先描述宠物的症状，由医生评估后给出建议。切勿自行用药！',
		'预约': '您可以通过以下方式预约就诊：\n1. 电话预约：400‑888‑8888\n2. 在线预约：点击下方按钮\n3. 现场挂号',
		'疫苗': '宠物疫苗建议：\n• 幼宠：3针基础疫苗\n• 成宠：每年加强1针\n• 狂犬疫苗：每年1针',
		'驱虫': '驱虫建议：\n• 体内驱虫：每3‑6个月一次\n• 体外驱虫：每月一次\n• 幼宠需更频繁驱虫',
		'谢谢': '不客气！祝您的宠物早日康复！如果还有其他问题，随时可以问我。',
		'你好': '您好！很高兴为您服务，请问有什么可以帮您？'
	}
	for (const [key, value] of Object.entries(keywords)) {
		if (text.includes(key)) {
			return value
		}
	}
	return '已收到您的消息，我会尽快为您解答。请问您能提供更多关于宠物症状的详细信息吗？'
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
	margin-top: -6rpx;
}
.nav-title {
	font-size: 34rpx;
	font-weight: 700;
	color: #1A1A1A;
	flex: 1;
	text-align: center;
}
.nav-right {
	width: 72rpx;
}
/* ========== 医生信息栏 ========== */
.doctor-info-bar {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx 32rpx;
	background: #FFFFFF;
	border-bottom: 1rpx solid #F0EDE8;
}
.doctor-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	background: linear-gradient(135deg, #D5F0E8, #B8E0D2);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	border: 2rpx solid #E8E5E0;
}
.doctor-detail {
	flex: 1;
}
.doctor-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
}
.doctor-status {
	font-size: 22rpx;
	color: #4ECDC4;
}
.doctor-badge {
	padding: 4rpx 16rpx;
	background: #FFF5E4;
	color: #D49A55;
	font-size: 20rpx;
	border-radius: 20rpx;
	font-weight: 500;
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
	margin-bottom:8rpx;
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
}
.avatar-other {
	background: linear-gradient(135deg, #D5F0E8, #B8E0D2);
}
.avatar-self {
	background: linear-gradient(135deg, #D49A55, #B8860B);
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
