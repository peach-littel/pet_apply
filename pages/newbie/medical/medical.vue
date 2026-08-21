<template>
	<view class="medical-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">宠物医疗</text>
			<view class="nav-right"></view>
		</view>

		<!-- 分类Tab -->
		<scroll-view class="tab-scroll" scroll-x show-scrollbar="false">
			<view class="tab-list">
				<view 
					class="tab-item" 
					:class="{ active: currentTab === item.value }"
					v-for="item in tabList" 
					:key="item.value"
					@click="currentTab = item.value"
				>
					{{ item.label }}
				</view>
			</view>
		</scroll-view>

		<!-- 内容列表 -->
		<view class="content-list">
			<view class="medical-card" v-for="(item, idx) in filteredList" :key="idx" @click="goDetail(item)">
				<view class="card-icon" :style="{ background: item.bgColor }">
					<text>{{ item.icon }}</text>
				</view>
				<view class="card-info">
					<text class="card-title">{{ item.title }}</text>
					<text class="card-desc">{{ item.desc }}</text>
				</view>
				<text class="card-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentTab = ref('all')

const tabList = ref([
	{ label: '全部', value: 'all' },
	{ label: '疫苗', value: 'vaccine' },
	{ label: '驱虫', value: 'deworm' },
	{ label: '体检', value: 'checkup' },
	{ label: '急救', value: 'emergency' }
])

const medicalList = ref([
	{
		icon: '💉',
		title: '疫苗接种指南',
		desc: '幼宠第一年需要打3针基础疫苗',
		category: 'vaccine',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		path: '/pages/newbie/medical/vaccine-guide/vaccine-guide'
	},
	{
		icon: '🐛',
		title: '驱虫计划安排',
		desc: '体内外驱虫时间表与用药建议',
		category: 'deworm',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		path: '/pages/newbie/medical/deworm-plan/deworm-plan'
	},
	{
		icon: '🏥',
		title: '定期体检项目',
		desc: '不同年龄段体检项目清单',
		category: 'checkup',
		bgColor: 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		path: '/pages/newbie/medical/checkup-items/checkup-items'
	},
	{
		icon: '🚨',
		title: '常见急救处理',
		desc: '烫伤、骨折、中毒等应急措施',
		category: 'emergency',
		bgColor: 'linear-gradient(135deg, #F8D7DF, #F0B8C8)',
		path: '/pages/newbie/medical/emergency-treatment/emergency-treatment'
	},
	{
		icon: '🦷',
		title: '口腔护理须知',
		desc: '牙齿清洁与口腔疾病预防',
		category: 'checkup',
		bgColor: 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		path: '/pages/newbie/medical/oral-care/oral-care'
	},
	{
		icon: '❤️',
		title: '绝育手术指南',
		desc: '手术前后注意事项与恢复护理',
		category: 'checkup',
		bgColor: 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		path: '/pages/newbie/medical/sterilization-guide/sterilization-guide'
	}
])

const filteredList = computed(() => {
	if (currentTab.value === 'all') return medicalList.value
	return medicalList.value.filter(item => item.category === currentTab.value)
})


const goBack = () => {
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) { uni.navigateBack() } 
		else { uni.switchTab({ url: '/pages/index/index' }) }
	} catch (e) { uni.switchTab({ url: '/pages/index/index' }) }
}

const goDetail = (item) => {
	if (item.path) {
		uni.navigateTo({ url: item.path })
	} else {
		uni.showToast({ title: `查看：${item.title}`, icon: 'none' })
	}
}
</script>

<style lang="scss" scoped>
.medical-page {
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

/* Tab切换 */
.tab-scroll {
	background: #FFFFFF;
	padding: 16rpx 32rpx 20rpx;
	white-space: nowrap;
	border-bottom: 1rpx solid #F0EDE8;
}
.tab-list {
	display: flex;
	gap: 32rpx;
}
.tab-item {
	font-size: 28rpx;
	color: #666;
	padding: 8rpx 4rpx;
	position: relative;
	flex-shrink: 0;
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

/* 内容列表 */
.content-list {
	padding: 24rpx 32rpx;
}
.medical-card {
	display: flex;
	align-items: center;
	gap: 20rpx;
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 20rpx 24rpx;
	margin-bottom: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.97);
	}
}
.card-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	flex-shrink: 0;
}
.card-info {
	flex: 1;
}
.card-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
}
.card-desc {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-top: 4rpx;
}
.card-arrow {
	font-size: 32rpx;
	color: #B0A8A0;
}
</style>