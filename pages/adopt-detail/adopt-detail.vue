<template>
	<view class="detail-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
		</view>

		<!-- 宠物大图 -->
		<view class="pet-hero" v-if="petInfo">
			<image class="hero-img" :src="petInfo.avatar" mode="aspectFill" />
			<view class="status-tag">可领养</view>
		</view>

		<!-- 宠物信息卡 -->
		<view class="info-card" v-if="petInfo">
			<image class="pet-avatar" :src="petInfo.avatar" mode="aspectFill" />
			<view class="pet-base">
				<view class="name-row">
					<text class="pet-name">{{ petInfo.name }}</text>
					<text class="pet-age">{{ petInfo.age }}</text>
				</view>
				<text class="pet-breed">{{ petInfo.breed }}</text>
			</view>
			<view class="character-section">
				<text class="char-label">性格：</text>
				<view class="char-tags">
					<text class="char-tag" v-for="tag in (Array.isArray(petInfo.character) ? petInfo.character : [])" :key="tag">{{ tag }}</text>
				</view>
			</view>
		</view>

		<!-- 领养小提示 -->
		<view class="tips-card" v-if="petInfo">
			<text class="tips-title">领养小提示</text>
			<view class="tips-list">
				<text class="tip-item" v-for="(tip, index) in petInfo.tips" :key="index">
					{{ index + 1 }}.{{ tip }}
				</text>
			</view>
			<view class="status-list">
				<view class="status-item status-yellow">
					<text class="status-icon">📋</text>
					<text>已驱虫</text>
				</view>
				<view class="status-item status-blue">
					<text class="status-icon">💉</text>
					<text>已免疫</text>
				</view>
				<view class="status-item status-green">
					<text class="status-icon">🏥</text>
					<text>已体检</text>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar" v-if="petInfo">
			<view class="btn-primary" @click="applyAdopt">申请领养</view>
			<view class="btn-secondary" @click="shareToFriend">分享给朋友</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const petInfo = ref(null)

// ===== 兜底数据（与 adopt.vue 完全一致，防止直接访问详情页时无数据） =====
const fallbackPets = [
	{
		id: 1,
		name: '布丁',
		type: 'cat',
		breed: '奶牛猫',
		age: '2岁',
		character: ['聪明', '安静', '黏人'],
		location: '南京',
		avatar: 'https://picsum.photos/id/40/400/500',
		star: 35,
		comment: 146,
		isLiked: false,
		tips: [
			'布丁胆子偏小，刚到家请给它留出安静适应空间；',
			'不爱剧烈打闹，适合上班族安静居家环境；',
			'毛发好打理，每周简单梳毛即可。'
		],
		health: { worm: true, vaccine: false, checkup: true },
		story: '布丁性格温柔胆小，曾经被遗弃，渴望稳定温暖的家。它喜欢安安静静待在窗边晒太阳，不吵闹，希望主人可以多多耐心陪伴它。'
	},
	{
		id: 2,
		name: '阿宝',
		type: 'cat',
		breed: '橘猫',
		age: '2岁半',
		character: ['黏人', '好动', '亲人'],
		location: '苏州',
		avatar: 'https://picsum.photos/id/41/400/500',
		star: 35,
		comment: 196,
		isLiked: true,
		tips: [
			'阿宝非常黏人，需要主人每天花时间陪伴玩耍；',
			'喜欢高处，建议准备猫爬架满足跳跃需求；',
			'食量较大，注意控制饮食避免肥胖。'
		],
		health: { worm: true, vaccine: true, checkup: true },
		story: '阿宝是个活泼小话痨，特别黏人，喜欢跟着主人到处跑。喜欢玩逗猫棒，渴望被抚摸，希望家里有人经常陪伴玩耍。'
	},
	{
		id: 3,
		name: '可乐',
		type: 'dog',
		breed: '金毛',
		age: '3岁',
		character: ['聪明', '调皮', '活泼'],
		location: '长沙',
		avatar: 'https://picsum.photos/id/237/400/500',
		star: 21,
		comment: 1146,
		isLiked: false,
		tips: [
			'精力旺盛，每天需要较长时间户外遛放；',
			'掉毛量大，需要日常勤梳毛打扫；',
			'对所有人都友善，看家能力弱。'
		],
		health: { worm: false, vaccine: true, checkup: true },
		story: '可乐精力充沛，学习指令很快，喜欢外出遛弯。需要有时间遛狗的家庭，会给主人带来满满的欢乐。'
	},
	{
		id: 4,
		name: '柴柴',
		type: 'dog',
		breed: '柴犬',
		age: '1岁半',
		character: ['内敛', '安静', '忠诚'],
		location: '北京',
		avatar: 'https://picsum.photos/id/169/400/500',
		star: 90,
		comment: 45,
		isLiked: false,
		tips: [
			'性格腼腆慢热，需要耐心建立信任；',
			'不爱叫，很适合公寓环境居住；',
			'每天需要适量户外运动，保持精力。'
		],
		health: { worm: true, vaccine: true, checkup: false },
		story: '柴柴性格腼腆慢热，不会主动闹腾。熟悉之后会很忠诚，适合生活节奏比较安静稳定的家庭。'
	}
]

onLoad(() => {
	const app = getApp()
	//优先使用 globalData 传递的数据
	if (app.globalData && app.globalData.selectedPet) {
		petInfo.value = app.globalData.selectedPet
		app.globalData.selectedPet = null // 清空，防止下次误用
		return
	}
	// ⚠️ 若没有 globalData（如直接访问），使用兜底数据（默认显示第一只）
	petInfo.value = fallbackPets[0] || null
})

const goBack = () => {
	uni.navigateBack()
}

//申请领养：传递当前宠物数据
const applyAdopt = () => {
	if (!petInfo.value) return
	const app = getApp()
	app.globalData.selectedPet = petInfo.value
	uni.navigateTo({
		url: `/pages/adopt-apply/adopt-apply`
	})
}

const shareToFriend = () => {
	uni.showToast({ title: '分享功能', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.detail-page {
	background: #F2F1EE;
	min-height: 100vh;
	padding-bottom: 180rpx;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 99;
	display: flex;
	justify-content: space-between;
	padding: 60rpx 32rpx 20rpx;
	background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%);
}

.back-btn {
	width: 80rpx;
	height: 80rpx;
	background: rgba(255,255,255,0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #333;
}

.back-icon {
	font-size: 70rpx;
	font-weight: 300;
	color: #333;
	line-height: 1;
	margin-bottom: 10px;
}

.pet-hero {
	position: relative;
	width: 100%;
	height: 700rpx;
}

.hero-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 0 0 40rpx 40rpx;
}

.status-tag {
	position: absolute;
	top: 80rpx;
	right: 32rpx;
	padding: 12rpx 32rpx;
	background: rgba(255,255,255,0.8);
	color: #8B5A2B;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 30rpx;
}

/* ========== 宠物信息卡（详情页样式） ========== */
.info-card {
	margin: -60rpx 32rpx 24rpx;
	background: #FFFBEA;
	border-radius: 32rpx;
	padding: 24rpx;
	position: relative;
	z-index: 2;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 20rpx;
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

/* ========== 领养提示 ========== */
.tips-card {
	margin: 0 32rpx;
	background: #fff;
	border-radius: 32rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.tips-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
	display: block;
	margin-bottom: 24rpx;
}

.tips-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	margin-bottom: 40rpx;
}

.tip-item {
	font-size: 28rpx;
	color: #666;
	line-height: 1.6;
}

.status-list {
	display: flex;
	justify-content: space-between;
	gap: 20rpx;
}

.status-item {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 24rpx 16rpx;
	border-radius: 20rpx;
	font-size: 28rpx;
	font-weight: 500;
}

.status-yellow {
	background: #FFF3CD;
	color: #856404;
}
.status-blue {
	background: #D1ECF1;
	color: #0C5460;
}
.status-green {
	background: #D4EDDA;
	color: #155724;
}

/* ========== 底部按钮 ========== */
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background: #fff;
	display: flex;
	box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
	z-index: 99;
}

.btn-primary {
	flex: 1;
	height: 100rpx;
	background: #C49060;
	color: #fff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 30rpx 0 0 30rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.btn-secondary {
	flex: 1;
	height: 100rpx;
	background: #FFD54F;
	color: #333;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 0 30rpx 30rpx 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>