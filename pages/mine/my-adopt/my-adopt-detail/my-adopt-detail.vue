<template>
	<view class="adopt-detail-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">领养详情</text>
			<view class="nav-right"></view>
		</view>

		<!-- 宠物信息 -->
		<view class="pet-section" v-if="petInfo">
			<image class="pet-avatar" :src="petInfo.petAvatar || petInfo.avatar || defaultImage" mode="aspectFill" />
			<view class="pet-info">
				<view class="pet-header">
					<text class="pet-name">{{ petInfo.petName || petInfo.name }}</text>
					<text class="pet-status" :class="statusClass">{{ statusText }}</text>
				</view>
				<text class="pet-desc">{{ petInfo.desc || '领养申请' }}</text>
				<text class="pet-time">申请时间：{{ petInfo.time || '未知' }}</text>
			</view>
		</view>

		<!-- 申请信息（完整显示） -->
		<view class="info-section">
			<view class="section-title">📋 申请信息</view>
			
			<view class="info-row">
				<text class="info-label">申请人</text>
				<text class="info-value">{{ petInfo.applicant || '未知' }}</text>
			</view>
			
			<view class="info-row">
				<text class="info-label">联系电话</text>
				<text class="info-value">{{ petInfo.phone || '未知' }}</text>
			</view>
			
			<view class="info-row">
				<text class="info-label">居住城市</text>
				<text class="info-value">{{ petInfo.city || '未知' }}</text>
			</view>
			
			<view class="info-row">
				<text class="info-label">居住情况</text>
				<text class="info-value">{{ housingMap[petInfo.housing] || '未知' }}</text>
			</view>
			
			<view class="info-row">
				<text class="info-label">养宠经验</text>
				<text class="info-value">{{ petInfo.hasExperience === 'yes' ? '有' : '无' }}</text>
			</view>
			
			<view class="info-row" v-if="petInfo.experience">
				<text class="info-label">养宠经历</text>
				<text class="info-value experience-text">{{ petInfo.experience }}</text>
			</view>
			
			<view class="info-row">
				<text class="info-label">领养原因</text>
				<text class="info-value reason-text">{{ petInfo.reason || '未填写' }}</text>
			</view>
			
			<view class="info-row" v-if="petInfo.remark">
				<text class="info-label">备注</text>
				<text class="info-value">{{ petInfo.remark }}</text>
			</view>
		</view>

		<!-- 进度追踪 -->
		<view class="progress-section">
			<view class="section-title">📌 申请进度</view>
			<view class="progress-steps">
				<view class="step" :class="{ active: progressStep >= 1 }">
					<view class="step-dot"><text v-if="progressStep >= 1">✓</text></view>
					<text class="step-label">提交申请</text>
				</view>
				<view class="step-line" :class="{ active: progressStep >= 2 }"></view>
				<view class="step" :class="{ active: progressStep >= 2 }">
					<view class="step-dot"><text v-if="progressStep >= 2">✓</text></view>
					<text class="step-label">审核中</text>
				</view>
				<view class="step-line" :class="{ active: progressStep >= 3 }"></view>
				<view class="step" :class="{ active: progressStep >= 3 }">
					<view class="step-dot"><text v-if="progressStep >= 3">✓</text></view>
					<text class="step-label">领养成功</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="btn-group">
				<view class="btn btn-secondary" @click="contactService">联系客服</view>
				<view class="btn btn-primary" @click="goAdopt">去领养更多</view>
				<view class="btn btn-danger" @click="cancelApplication" v-if="canCancel">取消申请</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const petInfo = ref({
	id: '',
	petName: '',
	petAvatar: '',
	status: '',
	desc: '',
	time: '',
	applicant: '',
	phone: '',
	city: '',
	housing: '',
	hasExperience: '',
	experience: '',
	reason: '',
	remark: ''
})

const defaultImage = 'https://via.placeholder.com/200/FFE5B4/8B5A2B?text=Pet'

const housingMap = {
	'own': '自有住房',
	'rent': '租房',
	'family': '与家人同住'
}

// ---- 状态判断 ----
const statusText = computed(() => {
	const status = petInfo.value?.status
	const map = {
		'pending': '审核中',
		'approved': '领养中',
		'active': '领养中',
		'completed': '已完成',
		'cancelled': '已取消',
		'rejected': '已拒绝'
	}
	return map[status] || '未知'
})

const statusClass = computed(() => {
	const status = petInfo.value?.status
	const map = {
		'pending': 'status-pending',
		'approved': 'status-active',
		'active': 'status-active',
		'completed': 'status-completed',
		'cancelled': 'status-cancelled',
		'rejected': 'status-cancelled'
	}
	return map[status] || 'status-pending'
})

const progressStep = computed(() => {
	const status = petInfo.value?.status
	const map = {
		'pending': 2,
		'approved': 3,
		'active': 3,
		'completed': 3,
		'cancelled': 1,
		'rejected': 1
	}
	return map[status] || 1
})

const canCancel = computed(() => {
	return petInfo.value?.status === 'pending'
})

// ---- 加载数据 ----
onLoad((options) => {
	const app = getApp()
	const globalData = app.globalData || {}
	
	if (globalData.selectedPet) {
		petInfo.value = globalData.selectedPet
		globalData.selectedPet = null
		return
	}
	
	const id = Number(options.id)
	if (id) {
		const adoptApps = globalData.adoptApplications?.value || []
		const found = adoptApps.find(item => item.id === id)
		if (found) {
			petInfo.value = found
		}
	}
})

// ---- ⭐ 取消申请 ----
const cancelApplication = () => {
	uni.showModal({
		title: '取消申请',
		content: '确定要取消该领养申请吗？取消后无法恢复。',
		success: (res) => {
			if (res.confirm) {
				const app = getApp()
				const globalData = app.globalData || {}
				if (globalData.updateAdoptApplication) {
					const result = globalData.updateAdoptApplication(petInfo.value.id, 'cancelled')
					if (result) {
						petInfo.value.status = 'cancelled'
						uni.showToast({ title: '已取消申请', icon: 'success' })
						setTimeout(() => {
							uni.navigateBack()
						}, 500)
					} else {
						uni.showToast({ title: '取消失败，请重试', icon: 'none' })
					}
				}
			}
		}
	})
}

// ---- 方法 ----
const goBack = () => uni.navigateBack()

const contactService = () => {
	uni.showToast({ title: '连接客服中...', icon: 'none' })
}

const goAdopt = () => {
	uni.switchTab({ url: '/pages/adopt/adopt' })
}
</script>

<style lang="scss" scoped>
.adopt-detail-page {
	min-height: 100vh;
	background: #F5F5F5;
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

.pet-section {
	background: #FFFFFF;
	margin: 20rpx 32rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	display: flex;
	gap: 20rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.pet-avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 16rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.pet-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	justify-content: center;
}

.pet-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.pet-name {
	font-size: 32rpx;
	font-weight: 700;
	color: #1A1A1A;
}

.pet-status {
	font-size: 22rpx;
	padding: 4rpx 16rpx;
	border-radius: 20rpx;
}

.status-active {
	background: #D4EDDA;
	color: #155724;
}

.status-pending {
	background: #FFF3CD;
	color: #856404;
}

.status-completed {
	background: #D1ECF1;
	color: #0C5460;
}

.status-cancelled {
	background: #F5F5F5;
	color: #999;
}

.pet-desc {
	font-size: 26rpx;
	color: #666;
}

.pet-time {
	font-size: 22rpx;
	color: #999;
}

.info-section,
.progress-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}

.info-row {
	display: flex;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.info-label {
	font-size: 26rpx;
	color: #999;
	width: 140rpx;
	flex-shrink: 0;
}

.info-value {
	font-size: 26rpx;
	color: #333;
	flex: 1;
	text-align: right;
	word-break: break-all;
	line-height: 1.6;
}

.experience-text,
.reason-text {
	text-align: right;
	line-height: 1.8;
}

.progress-steps {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8rpx;
}

.step {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	flex: 1;
}

.step-dot {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	border: 3rpx solid #D0D0D0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: #D0D0D0;
	transition: all 0.3s;
}

.step.active .step-dot {
	background: #D49A55;
	border-color: #D49A55;
	color: #fff;
}

.step-label {
	font-size: 22rpx;
	color: #999;
	text-align: center;
}

.step.active .step-label {
	color: #D49A55;
	font-weight: 500;
}

.step-line {
	flex: 1;
	height: 3rpx;
	background: #D0D0D0;
	margin: 0 8rpx;
	transform: translateY(-20rpx);
}

.step-line.active {
	background: #D49A55;
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 32rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	background: #FFFFFF;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
	z-index: 99;
}

.btn-group {
	display: flex;
	gap: 12rpx;
	flex-wrap: wrap;
}

.btn {
	flex: 1;
	min-width: 100rpx;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	font-weight: 600;
	transition: transform 0.2s;

	&:active {
		transform: scale(0.96);
	}
}

.btn-primary {
	background: linear-gradient(135deg, #D49A55, #B8860B);
	color: #fff;
}

.btn-secondary {
	background: #F5F4F0;
	color: #666;
}

.btn-danger {
	background: #FFF0F0;
	color: #E64340;
	border: 1rpx solid #FFCDD2;
}
</style>