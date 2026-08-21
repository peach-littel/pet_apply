<template>
	<view class="checklist-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">养宠清单</text>
			<view class="nav-right"></view>
		</view>

		<!-- 宠物类型切换 -->
		<view class="pet-type-tabs">
			<view 
				class="tab-item" 
				:class="{ active: petType === 'cat' }"
				@click="switchPetType('cat')"
			>
				<text>🐱 猫咪</text>
			</view>
			<view 
				class="tab-item" 
				:class="{ active: petType === 'dog' }"
				@click="switchPetType('dog')"
			>
				<text>🐶 狗狗</text>
			</view>
		</view>

		<!-- 清单列表 -->
		<view class="list-content">
			<view class="list-section" v-for="(section, idx) in currentChecklist" :key="idx">
				<text class="section-title">{{ section.title }}</text>
				<view class="section-items">
					<view class="list-item" v-for="(item, i) in section.items" :key="i">
						<view class="item-check" :class="{ checked: item.checked }" @click="toggleItem(idx, i)">
							<text v-if="item.checked">✓</text>
						</view>
						<text class="item-name" :class="{ done: item.checked }">{{ item.name }}</text>
						<text class="item-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部进度 -->
		<view class="bottom-bar">
			<text class="progress-text">已完成 {{ completedCount }}/{{ totalCount }}</text>
			<view class="progress-bar">
				<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, reactive, toRaw } from 'vue'

const petType = ref('cat')

// ---- 清单数据（使用 reactive 确保深层响应） ----
const checklistData = reactive({
	cat: [
		{
			title: '🛏️ 生活必需品',
			items: [
				{ name: '猫粮', desc: '选择优质猫粮，注意成分', checked: false },
				{ name: '猫砂盆', desc: '建议选择封闭式，减少异味', checked: false },
				{ name: '猫砂', desc: '推荐豆腐砂或膨润土砂', checked: false },
				{ name: '食盆水盆', desc: '不锈钢或陶瓷材质更卫生', checked: false },
				{ name: '猫窝', desc: '温暖舒适的休息空间', checked: false }
			]
		},
		{
			title: '🎮 娱乐用品',
			items: [
				{ name: '猫抓板', desc: '保护家具，满足磨爪需求', checked: false },
				{ name: '逗猫棒', desc: '互动玩具，增进感情', checked: false },
				{ name: '猫爬架', desc: '满足攀爬天性', checked: false }
			]
		},
		{
			title: '🧴 护理用品',
			items: [
				{ name: '梳毛工具', desc: '定期梳理，减少掉毛', checked: false },
				{ name: '指甲剪', desc: '定期修剪，防止抓伤', checked: false },
				{ name: '宠物专用沐浴露', desc: '温和不刺激', checked: false }
			]
		}
	],
	dog: [
		{
			title: '🛏️ 生活必需品',
			items: [
				{ name: '狗粮', desc: '选择适合年龄的狗粮', checked: false },
				{ name: '食盆水盆', desc: '建议选择不锈钢材质', checked: false },
				{ name: '狗窝', desc: '温暖舒适的休息空间', checked: false },
				{ name: '牵引绳', desc: '外出必备，保障安全', checked: false },
				{ name: '项圈/胸背带', desc: '舒适耐用的款式', checked: false }
			]
		},
		{
			title: '🎮 训练用品',
			items: [
				{ name: '狗厕所/尿垫', desc: '定点排便训练工具', checked: false },
				{ name: '训练零食', desc: '正向激励，高效训练', checked: false },
				{ name: '发声玩具', desc: '满足啃咬需求', checked: false }
			]
		},
		{
			title: '🧴 护理用品',
			items: [
				{ name: '梳毛工具', desc: '定期梳理，减少掉毛', checked: false },
				{ name: '指甲剪', desc: '定期修剪，防止抓伤', checked: false },
				{ name: '宠物专用沐浴露', desc: '温和不刺激', checked: false }
			]
		}
	]
})

// ---- 当前显示的清单（直接引用 reactive 数据） ----
const currentChecklist = computed(() => {
	return checklistData[petType.value] || []
})

// ---- 统计 ----
const totalCount = computed(() => {
	return currentChecklist.value.reduce((sum, section) => sum + section.items.length, 0)
})

const completedCount = computed(() => {
	return currentChecklist.value.reduce((sum, section) => {
		return sum + section.items.filter(item => item.checked).length
	}, 0)
})

const progressPercent = computed(() => {
	if (totalCount.value === 0) return 0
	return Math.round((completedCount.value / totalCount.value) * 100)
})

// ---- 切换宠物类型（重置所有项为未勾选） ----
const switchPetType = (type) => {
	petType.value = type
}

// ---- 切换勾选状态（强制触发响应式） ----
const toggleItem = (sectionIdx, itemIdx) => {
	const section = currentChecklist.value[sectionIdx]
	if (!section) return
	const item = section.items[itemIdx]
	if (!item) return
	
	// 切换勾选状态
	item.checked = !item.checked
	
	// ✅ 强制触发响应式更新：重新赋值整个 items 数组
	section.items = [...section.items]
}

const goBack = () => {
	// 尝试返回上一页
	try {
		const pages = getCurrentPages()
		if (pages.length > 1) {
			// 有历史记录，正常返回
			uni.navigateBack()
		} else {
			// 没有历史记录（直接打开的页面），跳转到首页
			uni.switchTab({ url: '/pages/newbie/newbie' })
		}
	} catch (e) {
		// 异常情况，跳转到首页
		uni.switchTab({ url: '/pages/newbie/newbie' })
	}
}
</script>

<style lang="scss" scoped>
.checklist-page {
	min-height: 100vh;
	background: #F9F7F4;
	padding-bottom: 140rpx;
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

/* 宠物类型切换 */
.pet-type-tabs {
	display: flex;
	background: #FFFFFF;
	padding: 20rpx 32rpx;
	gap: 20rpx;
	margin-bottom: 20rpx;
}
.tab-item {
	flex: 1;
	padding: 16rpx 0;
	text-align: center;
	font-size: 28rpx;
	color: #999;
	border-radius: 12rpx;
	background: #F5F4F0;
	transition: all 0.3s;
	&.active {
		background: #D49A55;
		color: #fff;
	}
}

/* 清单列表 */
.list-content {
	padding: 0 32rpx;
}
.list-section {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}
.section-title {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}
.section-items {
	display: flex;
	flex-direction: column;
	gap: 14rpx;
}
.list-item {
	display: flex;
	align-items: center;
	gap: 14rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;
	&:last-child {
		border-bottom: none;
	}
}
.item-check {
	width: 40rpx;
	height: 40rpx;
	border: 2rpx solid #D0D0D0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	font-size: 20rpx;
	color: #fff;
	transition: all 0.2s;
	&.checked {
		background: #D49A55;
		border-color: #D49A55;
	}
}
.item-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
	&.done {
		text-decoration: line-through;
		color: #B0A8A0;
	}
}
.item-desc {
	font-size: 22rpx;
	color: #B0A8A0;
	margin-left: auto;
	flex-shrink: 0;
}

/* 底部进度 */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 32rpx 40rpx;
	background: #FFFFFF;
	box-shadow: 0 -2rpx 12rpx rgba(0,0,0,0.04);
}
.progress-text {
	font-size: 26rpx;
	color: #666;
	display: block;
	margin-bottom: 12rpx;
}
.progress-bar {
	width: 100%;
	height: 8rpx;
	background: #F0EDE8;
	border-radius: 4rpx;
	overflow: hidden;
}
.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #D49A55, #B8860B);
	border-radius: 4rpx;
	transition: width 0.3s;
}
</style>