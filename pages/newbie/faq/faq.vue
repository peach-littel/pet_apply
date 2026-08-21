<template>
	<view class="faq-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">常见问题</text>
			<view class="nav-right"></view>
		</view>

		<!-- 分类筛选 -->
		<view class="filter-tabs">
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'all' }"
				@click="currentFilter = 'all'"
			>
				全部
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'cat' }"
				@click="currentFilter = 'cat'"
			>
				🐱 猫咪
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'dog' }"
				@click="currentFilter = 'dog'"
			>
				🐶 狗狗
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'health' }"
				@click="currentFilter = 'health'"
			>
				💉 健康
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'train' }"
				@click="currentFilter = 'train'"
			>
				🎓 训练
			</view>
		</view>

		<!-- 问题列表 -->
		<view class="faq-list">
			<view class="faq-item" v-for="(item, index) in filteredFaqList" :key="index">
				<view class="faq-question" @click="toggleFaq(index)">
					<view class="faq-left">
						<view class="faq-category" :style="{ background: getCategoryColor(item.category) }">
							<text>{{ getCategoryIcon(item.category) }}</text>
						</view>
						<text class="faq-text">{{ item.question }}</text>
					</view>
					<text class="faq-arrow">{{ item.open ? '−' : '+' }}</text>
				</view>
				<view class="faq-answer" v-if="item.open">
					<text class="faq-a">A：</text>
					<text class="faq-text">{{ item.answer }}</text>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredFaqList.length === 0" class="empty">
			<text class="empty-icon">📋</text>
			<text class="empty-text">暂无相关问题</text>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentFilter = ref('all')

// ---- 完整常见问题数据 ----
const faqList = ref([
	// 猫咪相关
	{
		question: '新手养猫应该准备哪些东西？',
		answer: '猫粮、猫砂盆、猫砂、食盆水盆、猫窝、猫抓板、梳毛工具、指甲剪、玩具等。建议一次性配齐基础用品，让猫咪到家后能快速适应。',
		category: 'cat',
		open: false
	},
	{
		question: '猫咪到家后躲起来怎么办？',
		answer: '这是正常现象，猫咪需要时间适应新环境。不要强行把它拖出来，准备好食物、水和猫砂盆，让它自己探索。通常2-3天会慢慢出来活动。',
		category: 'cat',
		open: false
	},
	{
		question: '猫咪不吃猫粮怎么办？',
		answer: '可能是对新环境不适应或者猫粮不合口味。可以尝试换一种猫粮，或者将猫粮用温水泡软。如果持续不吃超过24小时，建议咨询兽医。',
		category: 'cat',
		open: false
	},
	{
		question: '猫咪多久需要打一次疫苗？',
		answer: '幼猫第一年需要打3针基础疫苗（8周、12周、16周各一针），之后每年加强1针。狂犬疫苗每年1针。具体时间请咨询兽医。',
		category: 'cat',
		open: false
	},
	{
		question: '猫咪需要洗澡吗？多久洗一次？',
		answer: '猫咪是爱干净的动物，一般不需要频繁洗澡。短毛猫每3-6个月洗一次，长毛猫每1-2个月洗一次。使用宠物专用沐浴露，注意水温。',
		category: 'cat',
		open: false
	},
	// 狗狗相关
	{
		question: '狗狗刚到家晚上一直叫怎么办？',
		answer: '这是正常的分离焦虑。建议将狗窝放在卧室附近，给一些安抚玩具，白天多陪伴互动，逐渐建立安全感。通常1-2周会改善。',
		category: 'dog',
		open: false
	},
	{
		question: '狗狗多久遛一次比较好？',
		answer: '小型犬每天2-3次，每次15-30分钟；中型犬每天2次，每次30-45分钟；大型犬每天2次，每次45-60分钟。根据品种和年龄适当调整。',
		category: 'dog',
		open: false
	},
	{
		question: '狗狗到处乱咬东西怎么办？',
		answer: '狗狗在换牙期（3-6个月）特别爱咬东西。准备专门的磨牙玩具和咬胶，把不想被咬的物品收好。发现咬不该咬的东西时，用玩具替换。',
		category: 'dog',
		open: false
	},
	{
		question: '狗狗乱叫怎么纠正？',
		answer: '先找出原因（陌生人、声音、分离焦虑等）。可以使用"安静"指令训练，在狗狗安静时给予奖励。严重时建议寻求专业训练师帮助。',
		category: 'dog',
		open: false
	},
	// 健康相关
	{
		question: '宠物疫苗多久打一次？',
		answer: '幼宠第一年需要打3针基础疫苗（每针间隔3-4周），之后每年加强1针。狂犬疫苗每年1针。具体请咨询兽医。',
		category: 'health',
		open: false
	},
	{
		question: '宠物需要定期驱虫吗？多久一次？',
		answer: '幼宠每2-3周驱虫一次至12周龄，之后每月一次至6月龄。成年后每3-6个月驱虫一次。体外驱虫每月一次。',
		category: 'health',
		open: false
	},
	{
		question: '如何判断宠物是否生病？',
		answer: '常见症状包括：食欲下降、精神萎靡、呕吐腹泻、异常咳嗽、体温升高、行为改变等。如有上述症状，请及时咨询兽医。',
		category: 'health',
		open: false
	},
	{
		question: '第一次养宠需要准备多少钱？',
		answer: '基础装备约300-500元，疫苗约200-400元，绝育约500-1500元，每月口粮约100-300元。建议初始预算2000元左右。',
		category: 'health',
		open: false
	},
	// 训练相关
	{
		question: '如何训练狗狗定点排便？',
		answer: '选择固定地点，使用诱导剂或尿垫。在狗狗吃饭后、睡醒后、玩耍后带去指定地点。成功后立即给予零食奖励和表扬。',
		category: 'train',
		open: false
	},
	{
		question: '如何训练狗狗坐下？',
		answer: '手持零食放在狗狗头顶，慢慢向后移动，狗狗自然坐下时说"坐"，给予奖励。每天训练5-10分钟，保持耐心。',
		category: 'train',
		open: false
	},
	{
		question: '训练宠物需要多长时间？',
		answer: '基础指令（坐下、趴下、握手）通常需要2-4周，每天坚持训练5-10分钟。复杂行为训练需要1-3个月。关键是耐心和一致性。',
		category: 'train',
		open: false
	}
])

// ---- 筛选逻辑 ----
const filteredFaqList = computed(() => {
	if (currentFilter.value === 'all') return faqList.value
	return faqList.value.filter(item => item.category === currentFilter.value)
})

// ---- 切换展开/收起 ----
const toggleFaq = (index) => {
	filteredFaqList.value[index].open = !filteredFaqList.value[index].open
}

// ---- 获取分类颜色 ----
const getCategoryColor = (category) => {
	const colors = {
		cat: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		dog: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		health: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		train: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)'
	}
	return colors[category] || '#F5F4F0'
}

// ---- 获取分类图标 ----
const getCategoryIcon = (category) => {
	const icons = {
		cat: '🐱',
		dog: '🐶',
		health: '💉',
		train: '🎓'
	}
	return icons[category] || '📋'
}

// ---- 返回 ----
const goBack = () => {
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			uni.navigateBack()
		} else {
			uni.switchTab({ url: '/pages/index/index' })
		}
	} catch (e) {
		uni.switchTab({ url: '/pages/index/index' })
	}
}
</script>

<style lang="scss" scoped>
.faq-page {
	min-height: 100vh;
	background: #F9F7F4;
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
	flex-shrink: 0;
}

/* ========== 筛选标签 ========== */
.filter-tabs {
	display: flex;
	background: #FFFFFF;
	padding: 16rpx 32rpx 20rpx;
	gap: 24rpx;
	border-bottom: 1rpx solid #F0EDE8;
	overflow-x: auto;
}
.filter-item {
	font-size: 26rpx;
	color: #666;
	padding: 8rpx 4rpx;
	white-space: nowrap;
	position: relative;
	transition: all 0.3s;
	&.active {
		color: #D49A55;
		font-weight: 600;
		&::after {
			content: '';
			position: absolute;
			bottom: -20rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 24rpx;
			height: 4rpx;
			background: #D49A55;
			border-radius: 4rpx;
		}
	}
}

/* ========== 问题列表 ========== */
.faq-list {
	padding: 20rpx 32rpx;
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}

.faq-item {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 18rpx 22rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.98);
	}
}

.faq-question {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12rpx;
	cursor: pointer;
}
.faq-left {
	display: flex;
	align-items: center;
	gap: 14rpx;
	flex: 1;
}
.faq-category {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	flex-shrink: 0;
}
.faq-text {
	font-size: 26rpx;
	color: #1A1A1A;
	flex: 1;
	line-height: 1.5;
}
.faq-arrow {
	font-size: 32rpx;
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

/* ========== 空状态 ========== */
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
}
</style>