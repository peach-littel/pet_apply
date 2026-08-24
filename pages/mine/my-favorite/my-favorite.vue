<template>
	<view class="my-favorite-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">我的收藏</text>
			<view class="nav-right"></view>
		</view>
		<!-- Tab切换 -->
		<view class="filter-tabs">
			<view class="filter-item" :class="{ active: currentTab === 'all' }" @click="currentTab = 'all'">全部</view>
			<view class="filter-item" :class="{ active: currentTab === 'goods' }" @click="currentTab = 'goods'">商品</view>
			<view class="filter-item" :class="{ active: currentTab === 'pet' }" @click="currentTab = 'pet'">宠物</view>
		</view>
		<!-- 收藏网格：只循环filteredList，根据type渲染不同卡片 -->
		<view v-if="filteredList.length > 0" class="favorite-grid">
			<view
				class="favorite-card"
				v-for="item in filteredList"
				:key="'fav-' + item.id"
				@click="goDetail(item)"
			>
				<view class="card-img-wrap">
					<image class="card-img" :src="item.image || item.avatar" mode="aspectFill" />
					<view v-if="item.type === 'pet'" class="card-tag pet-tag">🐾 宠物</view>
					<view v-if="item.type === 'goods'" class="card-tag goods-tag">🛍️ 商品</view>
					<view class="card-badge" v-if="item.type === 'goods' && item.badge">{{ item.badge }}</view>
					<!-- 取消收藏按钮 阻止冒泡 -->
					<view class="unfav-btn" @click.stop="handleUnFavorite(item)">
						<text>❤️</text>
					</view>
				</view>
				<view class="card-content">
					<!-- 宠物卡片内容 -->
					<template v-if="item.type === 'pet'">
						<view class="card-header">
							<text class="card-name">{{ item.name }}</text>
							<text class="card-age">{{ item.age || '' }}</text>
						</view>
						<view class="card-breed">
							<text class="breed-value">{{ item.breed || '未知品种' }}</text>
						</view>
						<view class="card-tags" v-if="item.character && item.character.length">
							<text class="tag" v-for="tag in item.character" :key="tag">{{ tag }}</text>
						</view>
						<text class="card-desc" v-if="item.comment">{{ item.comment }}</text>
					</template>
					<!-- 商品卡片内容 -->
					<template v-if="item.type === 'goods'">
						<text class="card-name">{{ item.name }}</text>
						<view class="card-price-row">
							<text class="card-price">{{ item.price }}</text>
							<text class="card-origin-price" v-if="item.originPrice">¥{{ item.originPrice }}</text>
						</view>
						<view class="card-stats">
							<text class="stat-item">已售 {{ item.sales || 0 }}件</text>
							<text class="stat-item">收藏 {{ item.favCount || 0 }}</text>
						</view>
						<text class="card-desc">{{ item.desc }}</text>
					</template>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredList.length === 0" class="empty-state">
			<text class="empty-icon">❤️</text>
			<text class="empty-text">暂无收藏</text>
			<view class="empty-btn" @click="goShopping">去逛逛</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

const app = getApp()
const globalData = app.globalData || {}

// 和adopt‑detail完全一致的宠物完整数据源，用于根据id补全完整宠物信息
const fallbackPets = [
	{
		id: 1,
		name: '布丁',
		type: 'cat',
		breed: '奶牛猫',
		age: '2岁',
		character: ['聪明', '安静', '黏人'],
		location: '南京',
		avatar: '/static/image/pet1.png',
		star: 35,
		comment: '布丁性格温柔胆小，曾经被遗弃，渴望稳定温暖的家。',
		isLiked: false,
		tips: [
			'布丁胆子偏小，刚到家请给它留出安静适应空间；',
			'不爱剧烈打闹，适合上班族安静居家环境；',
			'毛发好打理，每周简单梳毛即可。'
		]
	},
	{
		id: 2,
		name: '阿宝',
		type: 'cat',
		breed: '橘猫',
		age: '2岁半',
		character: ['黏人', '好动', '亲人'],
		location: '苏州',
		avatar: '/static/image/pet2.png',
		star: 35,
		comment: '阿宝是个活泼小话痨，特别黏人，喜欢跟着主人到处跑。',
		isLiked: true,
		tips: [
			'阿宝非常黏人，需要主人每天花时间陪伴玩耍；',
			'喜欢高处，建议准备猫爬架满足跳跃需求；',
			'食量较大，注意控制饮食避免肥胖。'
		]
	},
	{
		id: 3,
		name: '可乐',
		type: 'dog',
		breed: '金毛',
		age: '3岁',
		character: ['聪明', '调皮', '活泼'],
		location: '长沙',
		avatar: '/static/image/pet3.png',
		star: 21,
		comment: '可乐精力充沛，学习指令很快，喜欢外出遛弯。',
		isLiked: false,
		tips: [
			'精力旺盛，每天需要较长时间户外遛放；',
			'掉毛量大，需要日常勤梳毛打扫；',
			'对所有人都友善，看家能力弱。'
		]
	},
	{
		id: 4,
		name: '柴柴',
		type: 'dog',
		breed: '柴犬',
		age: '1岁半',
		character: ['内敛', '安静', '忠诚'],
		location: '北京',
		avatar: '/static/image/pet4.png',
		star: 90,
		comment: '柴柴性格腼腆慢热，熟悉之后会很忠诚。',
		isLiked: false,
		tips: [
			'性格腼腆慢热，需要耐心建立信任；',
			'不爱叫，很适合公寓环境居住；',
			'每天需要适量户外运动，保持精力。'
		]
	}
]

const currentTab = ref('all')
const favoriteList = ref([])

// 根据id获取完整宠物对象
const getFullPetById = (petId) => {
	return fallbackPets.find(p => p.id === petId)
}

const updateFavoriteList = () => {
	const favorites = globalData.favorites?.value || []
	// 宠物收藏：使用fallbackPets补全全部字段；商品直接使用收藏数据
	favoriteList.value = favorites.map(item => {
		if (item.type === 'pet') {
			const fullPet = getFullPetById(item.id)
			if (fullPet) {
				return { ...fullPet, type: 'pet' }
			}
		}
		return { ...item }
	})
}

// 筛选后的总列表
const filteredList = computed(() => {
	if (currentTab.value === 'all') return favoriteList.value
	return favoriteList.value.filter(item => item.type === currentTab.value)
})

onShow(() => {
	updateFavoriteList()
})

const goBack = () => uni.navigateBack()
const goShopping = () => uni.switchTab({ url: '/pages/mall/mall' })

// 取消收藏
const handleUnFavorite = (item) => {
	uni.showModal({
		title: '取消收藏',
		content: '确定要取消收藏该内容吗？',
		success: (res) => {
			if (res.confirm) {
				if (globalData.removeFavorite) {
					globalData.removeFavorite(item.id, item.type)
				}
				uni.showToast({ title: '已取消收藏', icon: 'none' })
				updateFavoriteList()
			}
		}
	})
}

const goDetail = (item) => {
	if (item.type === 'goods') {
		uni.navigateTo({ url: `/pages/goods-detail/goods-detail?id=${item.id}` })
	} else {
		// 拿到完整宠物对象传给详情，修复详情页空白
		const fullPet = getFullPetById(item.id)
		if (fullPet) {
			app.globalData.selectedPet = fullPet
			uni.navigateTo({ url: `/pages/adopt-detail/adopt-detail` })
		} else {
			uni.showToast({ title: '宠物数据不存在', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.my-favorite-page {
	min-height: 100vh;
	background: #F5F5F5;
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
/* ========== Tab切换 ========== */
.filter-tabs {
	display: flex;
	background: #FFFFFF;
	padding: 16rpx 32rpx;
	gap: 24rpx;
	border-bottom: 1rpx solid #F0EDE8;
}
.filter-item {
	font-size: 26rpx;
	color: #666;
	padding: 8rpx 4rpx;
	position: relative;
	&.active {
		color: #D49A55;
		font-weight: 600;
		&::after {
			content: '';
			position: absolute;
			bottom: -4rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 20rpx;
			height: 4rpx;
			background: #D49A55;
			border-radius: 4rpx;
		}
	}
}
/* ========== 收藏网格（两列） ========== */
.favorite-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx;
	padding: 20rpx 32rpx;
}
/* ========== 收藏卡片 ========== */
.favorite-card {
	background: #FFFFFF;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
	transition: transform 0.2s;
	&:active {
		transform: scale(0.97);
	}
}
/* ===== 图片区域 ===== */
.card-img-wrap {
	position: relative;
	width: 100%;
	height: 200rpx;
	overflow: hidden;
	background: #F0EDE8;
}
.card-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
.card-tag {
	position: absolute;
	top: 12rpx;
	left: 12rpx;
	padding: 4rpx 14rpx;
	border-radius: 16rpx;
	font-size: 18rpx;
	font-weight: 500;
	color: #fff;
}
.pet-tag {
	background: rgba(78, 205, 196, 0.85);
}
.goods-tag {
	background: rgba(212, 154, 85, 0.85);
}
.card-badge {
	position: absolute;
	top: 12rpx;
	right: 72rpx;
	padding: 4rpx 14rpx;
	background: linear-gradient(135deg, #FF6B6B, #EE4444);
	color: #fff;
	font-size: 18rpx;
	font-weight: 600;
	border-radius: 16rpx;
}
.unfav-btn {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	width: 48rpx;
	height: 48rpx;
	background: rgba(255,255,255,0.85);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28rpx;
	z-index: 5;
}
/* ===== 内容区域 ===== */
.card-content {
	padding: 14rpx 16rpx 18rpx;
}
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 4rpx;
}
.card-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	flex: 1;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.card-age {
	font-size: 22rpx;
	color: #999;
	flex-shrink: 0;
	margin-left: 8rpx;
}
.card-breed {
	font-size: 22rpx;
	color: #999;
	margin-bottom: 8rpx;
}
.breed-value {
	color: #D49A55;
	font-weight: 500;
}
.card-tags {
	display: flex;
	gap: 6rpx;
	flex-wrap: wrap;
	margin-bottom:8rpx;
}
.card-tags .tag {
	padding: 2rpx 12rpx;
	background: #FFF5E4;
	color: #D49A55;
	font-size: 18rpx;
	border-radius: 12rpx;
}
.card-desc {
	font-size: 22rpx;
	color:#777;
	overflow:hidden;
	text-overflow:ellipsis;
	display:-webkit-box;
	-webkit-line-clamp:2;
	-webkit-box-orient:vertical;
	line-height:1.4;
}
.card-price-row {
	display: flex;
	align-items: baseline;
	gap: 8rpx;
	margin-top: 4rpx;
}
.card-price {
	font-size: 28rpx;
	font-weight: 700;
	color: #D44C4C;
}
.card-price::before {
	content: '¥';
	font-size: 20rpx;
	font-weight: 600;
	margin-right: 2rpx;
}
.card-origin-price {
	font-size: 20rpx;
	color: #B0A8A0;
	text-decoration: line-through;
}
.card-stats {
	display:flex;
	gap:12rpx;
	margin-top: 4rpx;
	margin-bottom:8rpx;
}
.card-stats .stat-item {
	font-size: 20rpx;
	color: #999;
}
/* ========== 空状态 ========== */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 0;
}
.empty-icon {
	font-size: 80rpx;
	margin-bottom: 20rpx;
	opacity: 0.5;
}
.empty-text {
	font-size: 28rpx;
	color: #B0A8A0;
	margin-bottom: 32rpx;
}
.empty-btn {
	padding: 16rpx 60rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	color: #fff;
	font-size: 28rpx;
	border-radius: 30rpx;
	&:active {
		transform: scale(0.94);
	}
}
</style>