<template>
	<view class="consult-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">在线咨询</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询入口 -->
		<view class="consult-grid">
			<view class="consult-item" v-for="(item, idx) in consultList" :key="idx" @click="startConsult(item)">
				<view class="consult-icon" :style="{ background: item.bgColor }">
					<text>{{ item.icon }}</text>
				</view>
				<text class="consult-name">{{ item.name }}</text>
				<text class="consult-desc">{{ item.desc }}</text>
			</view>
		</view>

		<!-- 常见问题快速问答 -->
		<view class="quick-faq">
			<view class="faq-title">💡 常见问题快速解答</view>
			<view class="faq-item" v-for="(item, idx) in quickFaqList" :key="idx" @click="viewFaq(item)">
				<text class="faq-q">Q：</text>
				<text class="faq-text">{{ item.question }}</text>
				<text class="faq-arrow">›</text>
			</view>
		</view>

		<!-- 客服工作时间 -->
		<view class="service-time">
			<text class="time-title">🕐 客服工作时间</text>
			<text class="time-text">周一至周日 9:00 - 21:00</text>
			<text class="time-tip">非工作时间请留言，我们会在24小时内回复</text>
		</view>
	</view>
</template>

<script setup>
// ✅ 正确导入 ref
import { ref } from 'vue'

// ---- 咨询列表数据（添加跳转路径） ----
const consultList = ref([
	{
		icon: '🐱',
		name: '猫咪医生',
		desc: '猫咪健康问题咨询',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		path: '/pages/newbie/consult/cat-doctor/cat-doctor'
	},
	{
		icon: '🐶',
		name: '狗狗医生',
		desc: '狗狗健康问题咨询',
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		path: '/pages/newbie/consult/dog-doctor/dog-doctor'
	},
	{
		icon: '🦴',
		name: '营养师',
		desc: '宠物饮食营养咨询',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		path: '/pages/newbie/consult/nutritionist/nutritionist'
	},
	{
		icon: '🎓',
		name: '行为训练师',
		desc: '行为问题与训练咨询',
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)',
		path: '/pages/newbie/consult/behavior-trainer/behavior-trainer'
	}
])

// ---- 常见问题数据 ----
const quickFaqList = ref([
	{ question: '猫咪不吃东西怎么办？' },
	{ question: '狗狗呕吐是什么原因？' },
	{ question: '宠物疫苗多久打一次？' },
	{ question: '如何判断宠物是否生病？' }
])

// ---- 返回方法（兼容多种场景） ----
const goBack = () => {
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			// 有历史记录，正常返回
			uni.navigateBack()
		} else {
			// 没有历史记录（直接打开的页面），跳转到新手页
			uni.navigateTo({ url: '/pages/newbie/newbie' })
		}
	} catch (e) {
		// 异常情况，跳转到新手页
		uni.navigateTo({ url: '/pages/newbie/newbie' })
	}
}

// ---- 开始咨询（跳转到对应页面） ----
const startConsult = (item) => {
	if (item.path) {
		uni.navigateTo({ url: item.path })
	} else {
		uni.showToast({ title: `咨询 ${item.name}`, icon: 'none' })
	}
}

// ---- 查看常见问题（跳转到FAQ页面） ----
const viewFaq = (item) => {
	uni.navigateTo({ url: '/pages/newbie/faq/faq' })
}
</script>

<style lang="scss" scoped>
.consult-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 40rpx;
}

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
	flex-shrink: 0;
}

.consult-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20rpx;
	padding: 24rpx 32rpx;
}
.consult-item {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx 20rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.95);
	}
}
.consult-icon {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	margin: 0 auto 12rpx;
}
.consult-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
}
.consult-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-top: 4rpx;
}

.quick-faq {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx 28rpx;
	margin: 0 32rpx 20rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.faq-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}
.faq-item {
	display: flex;
	align-items: center;
	padding: 14rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	&:last-child {
		border-bottom: none;
	}
}
.faq-q {
	font-size: 26rpx;
	font-weight: 700;
	color: #D49A55;
	flex-shrink: 0;
	margin-right: 8rpx;
}
.faq-text {
	font-size: 26rpx;
	color: #333;
	flex: 1;
}
.faq-arrow {
	font-size: 28rpx;
	color: #B0A8A0;
}

.service-time {
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 24rpx 28rpx;
	margin: 0 32rpx;
	text-align: center;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.time-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 8rpx;
}
.time-text {
	font-size: 26rpx;
	color: #333;
	display: block;
}
.time-tip {
	font-size: 22rpx;
	color: #B0A8A0;
	display: block;
	margin-top: 6rpx;
}
</style>