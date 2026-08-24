<template>
	<view class="index-page page-container">
		<!-- 顶部用户栏 -->
		<view class="header">
			<view class="greeting">
				<text class="greeting-title">早安，小主</text>
				<text class="greeting-sub">今天也值得被温柔陪伴哦</text>
			</view>
			<image class="avatar" src="/static/image/user.png" mode="aspectFill" />
		</view>
		<!-- 搜索框 -->
		<view class="search-box">
			<view class="search-inner">
				<image class="search-icon" src="/static/tab/search.png"></image>
				<input class="search-input" placeholder="搜索猫咪、狗狗、零食、玩具" placeholder-class="search-placeholder" />
			</view>
		</view>
		<!-- 轮播Banner -->
		<swiper 
			class="banner-swiper" 
			indicator-dots 
			indicator-color="#E5E5E5" 
			indicator-active-color="#F6C667"
			indicator-bottom="-36rpx"
			circular 
			autoplay
		>
			<swiper-item>
				<view class="banner-card">
					<image class="banner-img" src="/static/image/pet.png" mode="aspectFill" />
					<view class="banner-content">
						<!-- 顶部文字局部遮罩层，只保护标题文字，不影响图片主体 -->
						<view class="banner-top-mask"></view>
						<view class="banner-text">
							<text class="banner-title">给它一个家</text>
							<text class="banner-sub">让领养成为新生活的开始</text>
						</view>
						<view class="banner-btns">
							<view class="banner-btn btn-yellow" @click="goAdopt">
								<text class="btn-icon">🤝</text>
								<text>宠物领养</text>
							</view>
							<view class="banner-btn btn-blue" @click="goMall">
								<text class="btn-icon">🛍️</text>
								<text>用品商城</text>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
			<swiper-item>
				<view class="banner-card">
					<image class="banner-img" src="/static/image/petall.png" mode="aspectFill" />
					<view class="banner-content">
						<view class="banner-top-mask"></view>
						<view class="banner-text">
							<text class="banner-title">科学养宠指南</text>
							<text class="banner-sub">新手铲屎官必看攻略</text>
						</view>
						<view class="banner-btns">
							<view class="banner-btn btn-yellow" @click="goAdopt">
								<text>立即查看</text>
							</view>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<!-- 推荐宠物 -->
		<view class="pet-grid">
			<view class="pet-card" v-for="item in petList" :key="item.id" @click="goDetail(item)">
				<image class="pet-avatar" :src="item.avatar" mode="aspectFill" />
				<view class="pet-info">
					<text class="pet-name">{{ item.name }}</text>
					<view class="pet-breed">
						<text class="breed-label">品种：</text>
						<text class="breed-name">{{ item.breed }}</text>
					</view>
					<view class="pet-tags">
						<text class="tag" v-for="tag in item.tags" :key="tag">{{ tag }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
import { ref } from 'vue'
// ===== 首页宠物列表（补全 story 字段，确保与详情页/申请页数据一致） =====
const petList = ref([
	{
		id: 1,
		name: '豆豆',
		breed: '橘猫',
		age: '2岁',
		avatar: '/static/image/pet5.png',
		tags: ['活泼', '黏人'],
		character: ['活泼', '黏人'],
		tips: [
			'豆豆肠胃比较敏感，尽量喂食固定猫粮，不要随意换粮；',
			'喜欢高处，家里可以准备猫爬架，满足跳跃需求；',
			'性格亲人，很适合有孩子的家庭。'
		],
		health: { worm: true, vaccine: true, checkup: false },
		story: '豆豆是个贪吃的小胖橘，喜欢晒太阳和蹭蹭，希望能遇到一个温暖的家。'
	},
	{
		id: 2,
		name: '珂珂',
		breed: '柯基',
		age: '2岁半',
		avatar: '/static/image/pet7.png',
		tags: ['温顺', '聪明'],
		character: ['温顺', '聪明'],
		tips: [
			'柯基腿短，避免频繁上下楼梯，保护腰椎；',
			'食量容易超标，需要控制饮食防止肥胖；',
			'需要每日外出遛弯，运动量需求较高。'
		],
		health: { worm: true, vaccine: true, checkup: true },
		story: '财财是个小短腿，虽然腿短但精力旺盛，喜欢跟人玩耍，是个开心果。'
	},
	{
		id: 3,
		name: '布丁',
		breed: '奶牛猫',
		age: '2岁',
		avatar: '/static/image/pet1.png',
		tags: ['安静', '亲人'],
		character: ['安静', '亲人'],
		tips: [
			'布丁胆子偏小，刚到家请给它留出安静适应空间；',
			'不爱剧烈打闹，适合上班族安静居家环境；',
			'毛发好打理，每周简单梳毛即可。'
		],
		health: { worm: true, vaccine: false, checkup: true },
		story: '布丁性格温柔胆小，曾经被遗弃，渴望稳定温暖的家。它喜欢安安静静待在窗边晒太阳。'
	},
	{
		id: 4,
		name: '可乐',
		breed: '金毛',
		age: '3岁',
		avatar: '/static/image/pet3.png',
		tags: ['活泼', '爱笑'],
		character: ['活泼', '爱笑'],
		tips: [
			'精力旺盛，每天需要较长时间户外遛放；',
			'掉毛量大，需要日常勤梳毛打扫；',
			'对所有人都友善，看家能力弱。'
		],
		health: { worm: false, vaccine: true, checkup: true },
		story: '可乐精力充沛，学习指令很快，喜欢外出遛弯。需要有时间遛狗的家庭，会给主人带来满满欢乐。'
	},
	{
		id: 5,
		name: '奶茶',
		breed: '布偶猫',
		age: '1岁',
		avatar:  '/static/image/pet6.png',
		tags: ['温柔', '黏人'],
		character: ['温柔', '黏人'],
		tips: [
			'长毛猫，每日必须梳毛，防止打结；',
			'性格软萌，不能承受粗暴对待；',
			'需要定期观察眼部清洁。'
		],
		health: { worm: true, vaccine: true, checkup: false },
		story: '奶茶是个小仙女，性格软萌黏人，最喜欢被抱抱和抚摸，是理想的陪伴型猫咪。'
	},
	{
		id: 6,
		name: '豆包',
		breed: '萨摩耶',
		age: '1岁半',
		avatar: '/static/image/pet8.png',
		tags: ['开朗', '友善'],
		character: ['开朗', '友善'],
		tips: [
			'运动量很大，每天必须保证遛狗时间；',
			'换毛季掉毛非常严重；',
			'爱叫，居住公寓需要留意噪音问题。'
		],
		health: { worm: true, vaccine: false, checkup: false },
		story: '豆包是个微笑天使，永远咧着嘴笑，性格开朗友善，能给家庭带来无限欢乐。'
	}
])
const goAdopt = () => {
	uni.switchTab({ url: '/pages/adopt/adopt' })
}
const goMall = () => {
	uni.switchTab({ url: '/pages/mall/mall' })
}
//点击宠物时传递完整对象，存入 globalData
const goDetail = (item) => {
	const app = getApp()
	app.globalData.selectedPet = item
	uni.navigateTo({ url: `/pages/adopt-detail/adopt-detail` })
}
</script>
<style lang="scss" scoped>
.index-page {
	padding-bottom: 140rpx;
}
/* ========== 顶部问候区 ========== */
.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 60rpx;
	padding-bottom: 32rpx;
}
.greeting {
	display: flex;
	flex-direction: column;
}
.greeting-title {
	font-size: 30rpx;
	color: #9C6632;
	line-height: 1.2;
	font-family: Arial, Helvetica, sans-serif;
}
.greeting-sub {
	font-size: 28rpx;
	color: #000000;
	margin-top: 12rpx;
	font-weight: bold;
}
.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	border: 4rpx solid #fff;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.08);
}
/* ========== 搜索框 ========== */
.search-box {
	margin-bottom: 40rpx;
	padding: 3rpx;
	border-radius: 50rpx;
	background: linear-gradient(90deg, #C7DCFB 0%, #FFE7A8 100%);
}
.search-inner {
	display: flex;
	align-items: center;
	background: #fff;
	border-radius: 50rpx;
	padding: 20rpx 32rpx;
}
.search-icon {
	width: 20px;
	height: 20px;
	margin-right: 16rpx;
	opacity: 0.6;
}
.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}
.search-placeholder {
	color: #999;
}
/* ========== 轮播Banner ========== */
.banner-swiper {
	height: 480rpx;
	margin-bottom: 60rpx;
}
.banner-card {
	width: 100%;
	height: 100%;
	border-radius: 32rpx;
	overflow: hidden;
	position: relative;
}
.banner-img {
	width: 100%;
	height: 100%;
}
.banner-content {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 48rpx 40rpx;
	box-sizing: border-box;
	background: transparent;
}
/* 局部顶部遮罩，只作用于标题文字区域，向下渐变透明，不污染图片下半部分 */
.banner-top-mask {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 300rpx;
	background: linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%);
	z-index: 1;
}
.banner-text {
	position: relative;
	z-index: 2;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.banner-title {
	font-size: 68rpx;
	font-weight: bold;
	color: #ffffff;
	line-height: 1.2;
	//双重文字阴影，抗图片干扰
	text-shadow: 0 2rpx 10rpx rgba(0,0,0,0.6), 0 1rpx 4rpx rgba(0,0,0,0.35);
}
.banner-sub {
	font-size: 28rpx;
	color: rgba(255,255,255,0.96);
	margin-top: 12rpx;
	text-shadow: 0 2rpx 8rpx rgba(0,0,0,0.55);
}
.banner-btns {
	position: relative;
	z-index: 2;
	display: flex;
	justify-content: center;
	gap: 24rpx;
}
.banner-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	padding: 22rpx 56rpx;
	border-radius: 28rpx;
	font-size: 30rpx;
	font-weight: 500;
}
.btn-yellow {
	background: #FFF1D9;
	color: #8B5A2B;
}
.btn-blue {
	background: #B4D2F0;
	color: #fff;
}
/* ========== 宠物双列卡片 ========== */
.pet-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24rpx;
}
.pet-card {
	display: flex;
	align-items: center;
	background: #fff;
	padding: 20rpx;
	border-radius: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.pet-avatar {
	width: 110rpx;
	height: 110rpx;
	border-radius: 20rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}
.pet-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	min-width: 0;
}
.pet-name {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}
.pet-breed {
	font-size: 24rpx;
}
.breed-label {
	color: #999;
}
.breed-name {
	color: #D49A55;
	font-weight: 500;
}
.pet-tags {
	display: flex;
	gap: 10rpx;
	margin-top: 4rpx;
	flex-wrap: nowrap;
	overflow: hidden;
	width: 100%;
}
.tag {
	flex-shrink: 0;
	padding: 4rpx 12rpx;
	background: #FFF5E4;
	color: #D49A55;
	font-size: 20rpx;
	border-radius: 16rpx;
	white-space: nowrap;
}
</style>
