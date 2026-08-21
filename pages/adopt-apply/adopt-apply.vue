<template>
	<view class="apply-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">领养申请</text>
			<view class="placeholder"></view>
		</view>

		<!-- 宠物信息卡（与详情页一致） -->
		<view class="info-card" v-if="petInfo">
			<image class="pet-avatar" :src="petInfo.avatar" mode="aspectFill" />
			<view class="pet-base">
				<view class="name-row">
					<text class="pet-name">{{ petInfo.name }}</text>
					<text class="pet-age">{{ petInfo.age }}</text>
				</view>
				<text class="pet-breed">{{ petInfo.breed || (petInfo.type === 'cat' ? '猫咪' : '狗狗') }}</text>
			</view>
			<view class="character-section">
				<text class="char-label">性格：</text>
				<view class="char-tags">
					<text class="char-tag" v-for="tag in characterList" :key="tag">{{ tag }}</text>
				</view>
			</view>
		</view>

		<!-- “关于它”故事 -->
		<view class="story-section" v-if="petInfo && petInfo.story">
			<text class="story-title">♥ 关于它</text>
			<text class="story-text">{{ petInfo.story }}</text>
		</view>

		<!-- 表单区域 -->
		<view class="form-section">
			<view class="form-title">基本信息</view>
			<view class="form-item">
				<text class="form-label">真实姓名</text>
				<input class="form-input" v-model="form.name" placeholder="请输入真实姓名" />
			</view>
			<view class="form-item">
				<text class="form-label">联系电话</text>
				<input class="form-input" v-model="form.phone" placeholder="请输入手机号码" type="number" maxlength="11" />
			</view>
			<view class="form-item">
				<text class="form-label">居住城市</text>
				<input class="form-input" v-model="form.city" placeholder="请输入居住城市" />
			</view>
			<view class="form-item">
				<text class="form-label">居住情况</text>
				<view class="radio-group">
					<view 
						class="radio-item" 
						:class="{ active: form.housing === item.value }"
						v-for="item in housingOptions" 
						:key="item.value"
						@click="form.housing = item.value"
					>
						{{ item.label }}
					</view>
				</view>
			</view>
		</view>

		<view class="form-section">
			<view class="form-title">养宠经验</view>
			<view class="form-item">
				<text class="form-label">是否养过宠物</text>
				<view class="radio-group">
					<view 
						class="radio-item" 
						:class="{ active: form.hasExperience === 'yes' }"
						@click="form.hasExperience = 'yes'"
					>有</view>
					<view 
						class="radio-item" 
						:class="{ active: form.hasExperience === 'no' }"
						@click="form.hasExperience = 'no'"
					>没有</view>
				</view>
			</view>
			<view class="form-item" v-if="form.hasExperience === 'yes'">
				<text class="form-label">养宠经历</text>
				<textarea class="form-textarea" v-model="form.experience" placeholder="请描述您的养宠经历" />
			</view>
			<view class="form-item">
				<text class="form-label">领养原因</text>
				<textarea class="form-textarea" v-model="form.reason" placeholder="请说明您为什么想领养它" />
			</view>
		</view>

		<!-- 协议 -->
		<view class="agreement-section">
			<view class="check-box" :class="{ checked: form.agree }" @click="form.agree = !form.agree">
				<text v-if="form.agree">✓</text>
			</view>
			<text class="agreement-text">
				我已阅读并同意<text class="link">《领养协议》</text>和<text class="link">《宠物养护须知》</text>
			</text>
		</view>

		<!-- 提交按钮 -->
		<view class="submit-wrap">
			<view class="submit-btn" :class="{ disabled: !canSubmit }" @click="submitApply">
				提交申请
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// ===== 兜底数据（与 adopt.vue 完全一致） =====
const fallbackPetList = [
	{
		id: 1,
		name: '布丁',
		type: 'cat',
		breed: '奶牛猫',
		age: '2岁',
		character: '聪明 安静 黏人',
		location: '南京',
		avatar: 'https://picsum.photos/id/40/400/500',
		star: 35,
		comment: 146,
		isLiked: false,
		story: '布丁性格温柔胆小，曾经被遗弃，渴望稳定温暖的家。它喜欢安安静静待在窗边晒太阳，不吵闹，希望主人可以多多耐心陪伴它。'
	},
	{
		id: 2,
		name: '阿宝',
		type: 'cat',
		breed: '橘猫',
		age: '2岁半',
		character: '黏人 好动 亲人',
		location: '苏州',
		avatar: 'https://picsum.photos/id/41/400/500',
		star: 35,
		comment: 196,
		isLiked: true,
		story: '阿宝是个活泼小话痨，特别黏人，喜欢跟着主人到处跑。喜欢玩逗猫棒，渴望被抚摸，希望家里有人经常陪伴玩耍。'
	},
	{
		id: 3,
		name: '可乐',
		type: 'dog',
		breed: '金毛',
		age: '3岁',
		character: '聪明 调皮 活泼',
		location: '长沙',
		avatar: 'https://picsum.photos/id/237/400/500',
		star: 21,
		comment: 1146,
		isLiked: false,
		story: '可乐精力充沛，学习指令很快，喜欢外出遛弯。需要有时间遛狗的家庭，会给主人带来满满的欢乐。'
	},
	{
		id: 4,
		name: '柴柴',
		type: 'dog',
		breed: '柴犬',
		age: '1岁半',
		character: '内敛 安静 忠诚',
		location: '北京',
		avatar: 'https://picsum.photos/id/169/400/500',
		star: 90,
		comment: 45,
		isLiked: false,
		story: '柴柴性格腼腆慢热，不会主动闹腾。熟悉之后会很忠诚，适合生活节奏比较安静稳定的家庭。'
	}
]

const petInfo = ref(null)
const housingOptions = ref([
	{ label: '自有住房', value: 'own' },
	{ label: '租房', value: 'rent' },
	{ label: '与家人同住', value: 'family' }
])

const form = ref({
	name: '',
	phone: '',
	city: '',
	housing: '',
	hasExperience: '',
	experience: '',
	reason: '',
	agree: false
})

const characterList = computed(() => {
	if (!petInfo.value) return []
	const char = petInfo.value.character
	if (Array.isArray(char)) return char
	if (typeof char === 'string') return char.split(/\s+/).filter(Boolean)
	return []
})

const canSubmit = computed(() => {
	return form.value.name &&
		   form.value.phone &&
		   form.value.city &&
		   form.value.housing &&
		   form.value.hasExperience &&
		   form.value.reason &&
		   form.value.agree
})

//优先从 globalData 读取，否则 fallback
onLoad((options) => {
	const app = getApp()
	if (app.globalData && app.globalData.selectedPet) {
		petInfo.value = app.globalData.selectedPet
		app.globalData.selectedPet = null
		return
	}
	const pid = Number(options.petId)
	if (pid) {
		const found = fallbackPetList.find(item => item.id === pid)
		if (found) {
			petInfo.value = found
			return
		}
	}
	petInfo.value = fallbackPetList[0] || null
})

const goBack = () => uni.navigateBack()

const submitApply = () => {
	if (!canSubmit.value) {
		uni.showToast({ title: '请完善所有信息', icon: 'none' })
		return
	}
	if (!/^1\d{10}$/.test(form.value.phone)) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}
	
	uni.showLoading({ title: '提交中...' })
	
	setTimeout(() => {
		uni.hideLoading()
		
		const app = getApp()
		const globalData = app.globalData || {}
		
		// 生成新申请数据
		const newApplication = {
			id: Date.now(),
			petName: petInfo.value?.name || '未知宠物',
			petAvatar: petInfo.value?.avatar || 'https://picsum.photos/id/40/100/100',
			status: 'pending',
			desc: `申请领养${petInfo.value?.name || '宠物'}`,
			time: new Date().toLocaleString(),
			applicant: form.value.name,
			phone: form.value.phone,
			city: form.value.city,
			housing: form.value.housing,
			hasExperience: form.value.hasExperience,
			experience: form.value.experience,
			reason: form.value.reason
		}
		
		// 使用全局方法添加申请（自动持久化）
		if (globalData.addAdoptApplication) {
			globalData.addAdoptApplication(newApplication)
		} else {
			// 兼容旧逻辑
			if (globalData.adoptApplications) {
				if (typeof globalData.adoptApplications.value !== 'undefined') {
					globalData.adoptApplications.value = [
						newApplication,
						...globalData.adoptApplications.value
					]
				} else {
					globalData.adoptApplications.unshift(newApplication)
				}
			}
		}
		
		uni.showModal({
			title: '提交成功',
			content: `您对【${petInfo.value?.name}】的领养申请已提交，我们会在1‑3个工作日内与您联系，请保持电话畅通。`,
			showCancel: false,
			success: () => {
				uni.navigateBack()
			}
		})
	}, 1500)
}
</script>

<style lang="scss" scoped>
.apply-page {
	background: #F5F5F5;
	min-height: 100vh;
	padding-bottom: 200rpx;
}

/* ========== 顶部导航 ========== */
.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 60rpx 32rpx 24rpx;
	background: #fff;
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
	font-weight: bold;
	color: #333;
}

.placeholder {
	width: 72rpx;
}

/* ========== 宠物信息卡（与详情页完全一致） ========== */
.info-card {
	margin: 24rpx 32rpx 16rpx;
	background: #FFFBEA;
	border-radius: 32rpx;
	padding: 24rpx;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(139, 90, 43, 0.08);
}

.pet-avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 24rpx;
	border: 4rpx solid #fff;
	flex-shrink: 0;
}

.pet-base {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	min-width: 0;
}

.name-row {
	display: flex;
	align-items: baseline;
	gap: 16rpx;
}

.pet-name {
	font-size: 44rpx;
	font-weight: bold;
	color: #333;
}

.pet-age {
	font-size: 32rpx;
	color: #666;
}

.pet-breed {
	font-size: 26rpx;
	color: #666;
}

.character-section {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-top: 8rpx;
	flex-wrap: wrap;
}

.char-label {
	font-size: 28rpx;
	color: #D49A55;
	font-weight: 500;
	flex-shrink: 0;
}

.char-tags {
	display: flex;
	gap: 16rpx;
	flex-wrap: wrap;
}

.char-tag {
	padding: 8rpx 24rpx;
	background: #FFE082;
	color: #8B6914;
	font-size: 24rpx;
	border-radius: 20rpx;
	font-weight: 500;
}

/* ===== “关于它”故事（额外补充） ===== */
.story-section {
	margin: 0 32rpx 24rpx;
	padding: 28rpx 32rpx;
	background: #fff;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.story-title {
	display: block;
	font-size: 30rpx;
	font-weight: 600;
	color: #8B5A2B;
	margin-bottom: 16rpx;
}

.story-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.8;
}

/* ========== 表单样式（保持不变） ========== */
.form-section {
	margin: 24rpx 32rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 32rpx;
}

.form-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 32rpx;
}

.form-item {
	margin-bottom: 32rpx;
	&:last-child {
		margin-bottom: 0;
	}
}

.form-label {
	display: block;
	font-size: 28rpx;
	color: #333;
	margin-bottom: 16rpx;
	font-weight: 500;
}

.form-input {
	width: 100%;
	height: 88rpx;
	background: #F8F8F8;
	border-radius: 12rpx;
	padding: 0 24rpx;
	font-size: 28rpx;
	color: #333;
	box-sizing: border-box;
}

.form-textarea {
	width: 100%;
	height: 180rpx;
	background: #F8F8F8;
	border-radius: 12rpx;
	padding: 20rpx 24rpx;
	font-size: 28rpx;
	color: #333;
	box-sizing: border-box;
}

.radio-group {
	display: flex;
	gap: 20rpx;
	flex-wrap: wrap;
}

.radio-item {
	padding: 16rpx 40rpx;
	background: #F8F8F8;
	border: 2rpx solid transparent;
	border-radius: 44rpx;
	font-size: 28rpx;
	color: #666;
	transition: all 0.2s;
}

.radio-item.active {
	background: #FFF5E4;
	border-color: #D49A55;
	color: #D49A55;
}

.agreement-section {
	display: flex;
	align-items: flex-start;
	padding: 0 32rpx;
	margin-top: 40rpx;
}

.check-box {
	width: 36rpx;
	height: 36rpx;
	border: 2rpx solid #D0D0D0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16rpx;
	flex-shrink: 0;
	font-size: 20rpx;
	color: #fff;
	margin-top: 4rpx;
}

.check-box.checked {
	background: #D49A55;
	border-color: #D49A55;
}

.agreement-text {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
}

.link {
	color: #D49A55;
}

.submit-wrap {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: #fff;
}

.submit-btn {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(90deg, #D49A55, #B8860B);
	color: #fff;
	font-size: 34rpx;
	font-weight: bold;
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.submit-btn.disabled {
	opacity: 0.5;
}
</style>