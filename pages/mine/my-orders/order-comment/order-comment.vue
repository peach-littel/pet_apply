<template>
	<view class="comment-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">评价订单</text>
			<view class="nav-right"></view>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="goods-item" v-for="(item, idx) in orderInfo.items" :key="idx">
				<image class="goods-img" :src="item.image || defaultImage" mode="aspectFill" />
				<view class="goods-info">
					<text class="goods-name">{{ item.name }}</text>
					<text class="goods-spec">{{ item.spec || '默认规格' }}</text>
					<text class="goods-price">¥{{ item.price }}</text>
				</view>
			</view>
		</view>

		<!-- 评价区域 -->
		<view class="comment-section">
			<view class="section-title">总体评价</view>
			<view class="star-rating">
				<text 
					class="star" 
					v-for="i in 5" 
					:key="i"
					@click="rating = i"
				>
					{{ i <= rating ? '★' : '☆' }}
				</text>
			</view>
			<text class="rating-label">{{ ratingLabels[rating] }}</text>
		</view>

		<!-- 评价内容 -->
		<view class="comment-section">
			<view class="section-title">评价内容</view>
			<textarea 
				class="comment-textarea" 
				v-model="commentContent" 
				placeholder="分享您的使用体验，帮助更多铲屎官~"
				maxlength="200"
			/>
			<text class="char-count">{{ commentContent.length }}/200</text>
		</view>

		<!-- 上传图片 -->
		<view class="comment-section">
			<view class="section-title">上传图片（选填）</view>
			<view class="image-upload">
				<view class="image-list">
					<view class="image-item" v-for="(img, idx) in uploadImages" :key="idx">
						<image class="upload-img" :src="img" mode="aspectFill" />
						<view class="delete-btn" @click="removeImage(idx)">✕</view>
					</view>
					<view class="upload-btn" @click="chooseImage" v-if="uploadImages.length < 6">
						<text class="upload-icon">+</text>
						<text class="upload-text">添加图片</text>
					</view>
				</view>
				<text class="upload-tip">最多上传6张图片</text>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="bottom-bar">
			<view class="submit-btn" @click="submitComment">
				<text>提交评价</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref} from 'vue'
import { onLoad} from '@dcloudio/uni-app'

const defaultImage = 'https://via.placeholder.com/200/FFE5B4/8B5A2B?text=Pet'

const orderInfo = ref({
	id: '',
	items: []
})

const rating = ref(5)
const commentContent = ref('')
const uploadImages = ref([])

const ratingLabels = {
	1: '很差',
	2: '较差',
	3: '一般',
	4: '满意',
	5: '非常满意'
}

onLoad((options) => {
	if (options.order) {
		try {
			orderInfo.value = JSON.parse(decodeURIComponent(options.order))
		} catch (e) {
			uni.showToast({ title: '订单信息错误', icon: 'none' })
		}
	}
})

const chooseImage = () => {
	uni.chooseImage({
		count: 6 - uploadImages.value.length,
		sizeType: ['compressed'],
		success: (res) => {
			uploadImages.value = [...uploadImages.value, ...res.tempFilePaths]
		}
	})
}

const removeImage = (index) => {
	uploadImages.value.splice(index, 1)
}

const submitComment = () => {
	if (!commentContent.value.trim()) {
		uni.showToast({ title: '请填写评价内容', icon: 'none' })
		return
	}

	uni.showLoading({ title: '提交中...' })
	setTimeout(() => {
		uni.hideLoading()
		
		// 更新订单状态为已完成
		const app = getApp()
		const globalData = app.globalData || {}
		if (globalData.updateOrderStatus) {
			globalData.updateOrderStatus(orderInfo.value.id, 'completed')
		}
		
		uni.showModal({
			title: '评价成功',
			content: '感谢您的评价！',
			showCancel: false,
			success: () => {
				uni.navigateBack()
			}
		})
	}, 1500)
}

const goBack = () => {
	uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.comment-page {
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

.goods-list {
	background: #FFFFFF;
	margin: 20rpx 32rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.goods-item {
	display: flex;
	gap: 16rpx;
	padding: 12rpx 0;
	border-bottom: 1rpx solid #F5F4F0;

	&:last-child {
		border-bottom: none;
	}
}

.goods-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 8rpx;
	object-fit: cover;
	flex-shrink: 0;
	background: #F0EDE8;
}

.goods-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 4rpx;
}

.goods-name {
	font-size: 26rpx;
	color: #333;
	font-weight: 500;
}

.goods-spec {
	font-size: 22rpx;
	color: #999;
}

.goods-price {
	font-size: 24rpx;
	color: #D44C4C;
}

.comment-section {
	background: #FFFFFF;
	margin: 0 32rpx 16rpx;
	padding: 24rpx;
	border-radius: 16rpx;
}

.section-title {
	font-size: 28rpx;
	font-weight: 600;
	color: #1A1A1A;
	display: block;
	margin-bottom: 16rpx;
}

.star-rating {
	display: flex;
	gap: 16rpx;
	margin-bottom: 12rpx;
}

.star {
	font-size: 48rpx;
	color: #ddd;
	transition: color 0.2s;

	&:active {
		transform: scale(0.9);
	}
}

.star-rating .star {
	color: #F5A623;
}

.rating-label {
	font-size: 28rpx;
	color: #F5A623;
	display: block;
	text-align: center;
}

.comment-textarea {
	width: 100%;
	height: 160rpx;
	background: #F8F8F8;
	border-radius: 12rpx;
	padding: 16rpx 20rpx;
	font-size: 28rpx;
	color: #333;
	box-sizing: border-box;
}

.char-count {
	display: block;
	text-align: right;
	font-size: 22rpx;
	color: #999;
	margin-top: 8rpx;
}

.image-upload {
	margin-top: 8rpx;
}

.image-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.image-item {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	overflow: hidden;
}

.upload-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.delete-btn {
	position: absolute;
	top: 4rpx;
	right: 4rpx;
	width: 40rpx;
	height: 40rpx;
	background: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 24rpx;
}

.upload-btn {
	width: 160rpx;
	height: 160rpx;
	border: 2rpx dashed #D0D0D0;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #F8F8F8;
}

.upload-icon {
	font-size: 48rpx;
	color: #999;
}

.upload-text {
	font-size: 22rpx;
	color: #999;
	margin-top: 4rpx;
}

.upload-tip {
	font-size: 22rpx;
	color: #999;
	display: block;
	margin-top: 12rpx;
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

.submit-btn {
	width: 100%;
	height: 96rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	border-radius: 48rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 32rpx;
	font-weight: 600;
	box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.3);
	transition: transform 0.2s;

	&:active {
		transform: scale(0.96);
	}
}
</style>