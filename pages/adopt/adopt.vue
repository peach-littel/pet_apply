<template>
	<view class="adopt-page page-container">
		<!-- 顶部栏 -->
		<view class="header">
			<view class="city-select" @click="selectCity">
				<text class="city-text">{{ currentCity }}</text>
				<text class="arrow">▼</text>
			</view>
			<view class="search-btn" @click="handleSearch">
				<image class="search-icon" src="/static/tab/search.png"></image>
			</view>
		</view>

		<!-- 搜索输入框 -->
		<view class="search-wrap" v-if="showSearch">
			<input class="search-input" v-model="searchKey" placeholder="搜索宠物名称、性格、地点" confirm-type="search" @confirm="onSearchConfirm"/>
			<view class="search-cancel" @click="closeSearch">取消</view>
		</view>

		<!-- 标题 -->
		<view class="title-section" v-if="!showSearch">
			<text class="main-title">等待回家的小伙伴</text>
			<text class="sub-title">每一次了解，都是靠近彼此的一步</text>
		</view>

		<!-- 分类Tab -->
		<view class="tab-list">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === item.value }"
				v-for="item in tabList" 
				:key="item.value"
				@click="changeTab(item.value)"
			>
				{{ item.label }}
			</view>
		</view>

		<!-- 宠物列表 -->
		<view class="pet-grid">
			<view class="pet-card" v-for="item in filteredList" :key="item.id" @click="goDetail(item)">
				<view class="card-img-wrap">
					<image class="pet-img" :src="item.avatar" mode="aspectFill" />
					<view class="more-btn" @click.stop="handleMore(item)">
						<text>⋮</text>
					</view>
				</view>
				<view class="card-content">
					<view class="pet-header">
						<text class="pet-name">{{ item.name }}</text>
						<text class="heart-icon" :class="{ liked: item.isLiked }" @click.stop="toggleLike(item)">♥</text>
					</view>
					<text class="pet-desc">{{ item.age }} | {{ Array.isArray(item.character) ? item.character.join(' ') : item.character }} | 现处{{ item.location }}</text>
					<view class="card-footer">
						<view class="stats">
							<text class="stat-item">
								<text class="stat-icon">👍</text>
								{{ item.star }}
							</text>
							<text class="stat-item">
								<text class="stat-icon">💬</text>
								{{ item.comment }}
							</text>
						</view>
						<view class="apply-btn" @click.stop="applyAdopt(item)">申请领养</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

const currentCity = ref('全部城市')
const cityOptions = ['全部城市','北京','南京','苏州','长沙','上海','杭州']
const showSearch = ref(false)
const searchKey = ref('')
const currentTab = ref('all')
const tabList = ref([
	{ label: '全部', value: 'all' },
	{ label: '猫咪', value: 'cat' },
	{ label: '狗狗', value: 'dog' },
	{ label: '小型宠', value: 'small' },
	{ label: '已到家', value: 'adopted' }
])

// ===== 领养页宠物列表 =====
const petList = ref([
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
		avatar: '/static/image/pet2.png',
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
		avatar: '/static/image/pet3.png',
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
		avatar: '/static/image/pet4.png',
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
])

// ---- 初始化时检查收藏状态 ----
const initFavoriteStatus = () => {
	const favorites = globalData.favorites?.value || []
	petList.value.forEach(pet => {
		const isFav = favorites.some(f => f.id === pet.id && f.type === 'pet')
		pet.isLiked = isFav
	})
}

// ---- 页面显示时更新收藏状态 ----
onShow(() => {
	initFavoriteStatus()
})

// 筛选逻辑
const filteredList = computed(() => {
	let list = [...petList.value]
	if (currentTab.value !== 'all') {
		list = list.filter(item => item.type === currentTab.value)
	}
	if (currentCity.value !== '全部城市') {
		list = list.filter(item => item.location === currentCity.value)
	}
	const kw = searchKey.value.trim().toLowerCase()
	if (kw) {
		list = list.filter(item => {
			const charStr = Array.isArray(item.character) ? item.character.join(' ') : item.character
			return item.name.toLowerCase().includes(kw)
				|| charStr.toLowerCase().includes(kw)
				|| item.location.toLowerCase().includes(kw)
		})
	}
	return list
})

// 交互方法
const selectCity = () => {
	uni.showActionSheet({
		itemList: cityOptions,
		success: res => { currentCity.value = cityOptions[res.tapIndex] }
	})
}
const handleSearch = () => { showSearch.value = true }
const closeSearch = () => {
	showSearch.value = false
	searchKey.value = ''
}
const onSearchConfirm = () => { console.log('执行搜索', searchKey.value) }
const changeTab = (val) => { currentTab.value = val }

// ---- 收藏切换（对接全局数据） ----
const toggleLike = (item) => {
	const favoriteItem = {
		id: item.id,
		name: item.name,
		price: 0,
		image: item.avatar,
		type: 'pet'
	}
	
	if (item.isLiked) {
		// 取消收藏
		if (globalData.removeFavorite) {
			const result = globalData.removeFavorite(item.id, 'pet')
			if (result) {
				item.isLiked = false
				uni.showToast({ title: '已取消收藏', icon: 'none' })
			}
		}
	} else {
		// 添加收藏
		if (globalData.addFavorite) {
			const result = globalData.addFavorite(favoriteItem)
			if (result) {
				item.isLiked = true
				uni.showToast({ title: '收藏成功', icon: 'success' })
			} else {
				uni.showToast({ title: '已收藏过了', icon: 'none' })
			}
		}
	}
}

//跳转详情：传递完整对象
const goDetail = (item) => {
	const app = getApp()
	app.globalData.selectedPet = item
	uni.navigateTo({ url: `/pages/adopt-detail/adopt-detail` })
}

//跳转申请：传递完整对象
const applyAdopt = (item) => {
	const app = getApp()
	app.globalData.selectedPet = item
	uni.navigateTo({ url: `/pages/adopt-apply/adopt-apply` })
}

const handleMore = (item) => {
	uni.showActionSheet({
		itemList: ['分享', '举报', '不感兴趣'],
		success: (res) => {
			uni.showToast({ title: `点击了${res.tapIndex + 1}`, icon: 'none' })
		}
	})
}
</script>

<style lang="scss" scoped>
.adopt-page {
	padding-bottom: 140rpx;
	padding-top: 60rpx;
}

/* ========== 顶部栏 ========== */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 32rpx;
}

.city-select {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 14rpx 28rpx;
	border-radius: 40rpx;
}

.city-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.arrow {
	font-size: 18rpx;
	color: #666;
	margin-left: 10rpx;
}

.search-btn {
	width: 84rpx;
	height: 84rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
}

.search-icon {
	width: 20px;
	height: 20px;
	opacity: 0.8;
	align-items: center;
	line-height: 20px;
}

.search-wrap {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-bottom: 32rpx;
}
.search-input {
	flex: 1;
	background: #fff;
	border-radius: 40rpx;
	padding: 16rpx 24rpx;
	font-size: 28rpx;
}
.search-cancel {
	font-size: 28rpx;
	color: #8B5A2B;
}

.title-section {
	margin-bottom: 36rpx;
}

.main-title {
	display: block;
	font-size: 58rpx;
	font-weight: bold;
	color: #8B5A2B;
	line-height: 1.2;
	margin-bottom: 16rpx;
}

.sub-title {
	font-size: 28rpx;
	color: #666;
}

.tab-list {
	display: flex;
	justify-content: space-between;
	margin-bottom: 40rpx;
}

.tab-item {
	flex: 1;
	text-align: center;
	padding: 18rpx 0;
	margin: 0 10rpx;
	background: #fff;
	color: #8B5A2B;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 40rpx;
	transition: all 0.3s;
}
.tab-item:first-child { margin-left: 0; }
.tab-item:last-child { margin-right: 0; }
.tab-item.active {
	background: #D49A55;
	color: #fff;
	box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.25);
}

.pet-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}

.pet-card {
	background: #fff;
	border-radius: 32rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.card-img-wrap {
	position: relative;
	width: 100%;
	height: 380rpx;
}

.pet-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.more-btn {
	position: absolute;
	top: 20rpx;
	right: 20rpx;
	width: 48rpx;
	height: 48rpx;
	background: rgba(255, 255, 255, 0.85);
	backdrop-filter: blur(8rpx);
	-webkit-backdrop-filter: blur(8rpx);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #555;
	font-size: 28rpx;
	line-height: 1;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	z-index: 2;
}

.card-content {
	padding: 20rpx 20rpx 24rpx;
	box-sizing: border-box;
}

.pet-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10rpx;
}

.pet-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #222;
}

.heart-icon {
	font-size: 36rpx;
	color: #ccc;
	transition: all 0.2s;
}
.heart-icon.liked {
	color: #C48B56;
}

.pet-desc {
	font-size: 24rpx;
	color: #999;
	line-height: 1.4;
	display: block;
	margin-bottom: 16rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: 100%;
	box-sizing: border-box;
}

.card-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	box-sizing: border-box;
	flex-wrap: nowrap;
}

.stats {
	display: flex;
	gap: 10rpx;
	flex-shrink: 0;
	min-width: 0;
}

.stat-item {
	font-size: 24rpx;
	color: #999;
	display: flex;
	align-items: center;
	gap: 4rpx;
	white-space: nowrap;
	flex-shrink: 0;
}

.stat-icon {
	font-size: 22rpx;
	opacity: 0.9;
}

.apply-btn {
	flex-shrink: 0;
	min-width: 128rpx;
	height: 48rpx;
	line-height: 48rpx;
	padding: 0 20rpx;
	background: #FFE5B4;
	color: #8B5A2B;
	font-size: 24rpx;
	font-weight: 500;
	border-radius: 24rpx;
	white-space: nowrap;
	text-align: center;
	box-sizing: border-box;
	margin-left: 12rpx;
}
</style>