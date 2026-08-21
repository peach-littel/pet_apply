<template>
	<view class="profile-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">个人资料</text>
			<view class="nav-right" @click="saveProfile">
				<text class="save-btn">保存</text>
			</view>
		</view>

		<view class="profile-list">
			<!-- 头像 -->
			<view class="profile-item avatar-item" @click="changeAvatar">
				<text class="item-label">头像</text>
				<view class="avatar-wrap">
					<image class="avatar-img" :src="userInfo.avatar" mode="aspectFill" />
					<view class="avatar-edit">
						<text>📷</text>
					</view>
				</view>
			</view>

			<!-- 昵称 -->
			<view class="profile-item">
				<text class="item-label">昵称</text>
				<input 
					class="item-input" 
					v-model="userInfo.nickname" 
					placeholder="请输入昵称"
					maxlength="20"
				/>
			</view>

			<!-- 性别 -->
			<view class="profile-item">
				<text class="item-label">性别</text>
				<view class="gender-options">
					<view 
						class="gender-option" 
						:class="{ active: userInfo.gender === '男' }"
						@click="userInfo.gender = '男'"
					>男</view>
					<view 
						class="gender-option" 
						:class="{ active: userInfo.gender === '女' }"
						@click="userInfo.gender = '女'"
					>女</view>
					<view 
						class="gender-option" 
						:class="{ active: userInfo.gender === '保密' }"
						@click="userInfo.gender = '保密'"
					>保密</view>
				</view>
			</view>

			<!-- 手机号 -->
			<view class="profile-item" @click="changePhone">
				<text class="item-label">手机号</text>
				<text class="item-value">{{ userInfo.phone }}</text>
				<text class="item-arrow">›</text>
			</view>

			<!-- 生日 -->
			<picker 
				mode="date" 
				:value="userInfo.birthday" 
				:start="startDate" 
				:end="endDate"
				@change="onDateChange"
			>
				<view class="profile-item">
					<text class="item-label">生日</text>
					<text class="item-value" :class="{ placeholder: !userInfo.birthday }">
						{{ userInfo.birthday || '请选择' }}
					</text>
					<text class="item-arrow">›</text>
				</view>
			</picker>

			<!-- 个性签名 -->
			<view class="profile-item signature-item">
				<text class="item-label">个性签名</text>
				<input 
					class="item-input" 
					v-model="userInfo.signature" 
					placeholder="留下你的个性签名"
					maxlength="30"
				/>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

// ---- 获取全局数据 ----
const app = getApp()
const globalData = app.globalData || {}

// ---- 用户信息（从全局读取） ----
const userInfo = ref({ 
  avatar: globalData.userInfo?.value?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  nickname: globalData.userInfo?.value?.nickname || '铲屎官小雅',
  gender: globalData.userInfo?.value?.gender || '女',
  phone: globalData.userInfo?.value?.phone || '138****8888',
  birthday: globalData.userInfo?.value?.birthday || '1995-06-15',
  signature: globalData.userInfo?.value?.signature || '用心爱每一个小生命'
})

// ---- 日期范围 ----
const startDate = ref('1950-01-01')
const endDate = ref(new Date().toISOString().split('T')[0])

// ---- 返回 ----
const goBack = () => {
  uni.navigateBack()
}

// ---- 修改头像 ----
const changeAvatar = () => {
  uni.showActionSheet({
    itemList: ['拍照', '从相册选择'],
    success: (res) => {
      if (res.tapIndex === 0) {
        uni.chooseImage({
          count: 1,
          sourceType: ['camera'],
          success: (chooseRes) => {
            uploadAvatar(chooseRes.tempFilePaths[0])
          }
        })
      } else if (res.tapIndex === 1) {
        uni.chooseImage({
          count: 1,
          sourceType: ['album'],
          success: (chooseRes) => {
            uploadAvatar(chooseRes.tempFilePaths[0])
          }
        })
      }
    }
  })
}

// ---- 上传头像 ----
const uploadAvatar = (filePath) => {
  uni.showLoading({ title: '上传中...' })
  setTimeout(() => {
    uni.hideLoading()
    userInfo.value.avatar = filePath
    uni.showToast({ title: '头像已更新', icon: 'success' })
  }, 1500)
}

// ---- 修改手机号 ----
const changePhone = () => {
  uni.showModal({
    title: '修改手机号',
    content: '当前手机号：' + userInfo.value.phone,
    editable: true,
    placeholderText: '请输入新手机号',
    success: (res) => {
      if (res.confirm && res.content) {
        const phone = res.content.trim()
        if (/^1\d{10}$/.test(phone)) {
          userInfo.value.phone = phone
          uni.showToast({ title: '手机号已更新', icon: 'success' })
        } else {
          uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
        }
      }
    }
  })
}

// ---- 生日选择变化 ----
const onDateChange = (e) => {
  const date = e.detail.value
  if (date) {
    userInfo.value.birthday = date
  }
}

// ---- 保存个人资料（更新全局用户信息） ----
const saveProfile = () => {
  if (!userInfo.value.nickname.trim()) {
    uni.showToast({ title: '请输入昵称', icon: 'none' })
    return
  }
  
  uni.showLoading({ title: '保存中...' })
  setTimeout(() => {
    uni.hideLoading()
    
    // ✅ 更新全局用户信息
    if (globalData.updateUserInfo) {
      globalData.updateUserInfo({
        avatar: userInfo.value.avatar,
        nickname: userInfo.value.nickname,
        gender: userInfo.value.gender,
        phone: userInfo.value.phone,
        birthday: userInfo.value.birthday,
        signature: userInfo.value.signature
      })
    }
    
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 1000)
}
</script>

<style lang="scss" scoped>
.profile-page {
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
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.save-btn {
	font-size: 28rpx;
	color: #D49A55;
	font-weight: 600;
}

/* ========== 资料列表 ========== */
.profile-list {
	margin: 20rpx 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	overflow: hidden;
}
.profile-item {
	display: flex;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 1rpx solid #F5F4F0;
	&:last-child {
		border-bottom: none;
	}
}
.item-label {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
	width: 140rpx;
	flex-shrink: 0;
}
.item-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
	height: 44rpx;
}
.item-value {
	flex: 1;
	font-size: 28rpx;
	color: #333;
	text-align: right;
}
.item-value.placeholder {
	color: #B0A8A0;
}
.item-arrow {
	font-size: 32rpx;
	color: #CCC;
	margin-left: 8rpx;
}

/* ===== 头像 ===== */
.avatar-item {
	padding: 16rpx 24rpx;
}
.avatar-wrap {
	position: relative;
	width: 80rpx;
	height: 80rpx;
	flex-shrink: 0;
}
.avatar-img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}
.avatar-edit {
	position: absolute;
	bottom: -4rpx;
	right: -4rpx;
	font-size: 20rpx;
	background: #D49A55;
	color: #fff;
	border-radius: 50%;
	width: 32rpx;
	height: 32rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.15);
}

/* ===== 性别 ===== */
.gender-options {
	display: flex;
	gap: 12rpx;
	flex: 1;
	justify-content: flex-end;
}
.gender-option {
	padding: 6rpx 24rpx;
	background: #F5F4F0;
	border-radius: 30rpx;
	font-size: 26rpx;
	color: #666;
	border: 2rpx solid transparent;
	transition: all 0.2s;
	&.active {
		background: #FFF5E4;
		border-color: #D49A55;
		color: #D49A55;
	}
}

/* ===== 个性签名 ===== */
.signature-item .item-input {
	text-align: right;
	font-size: 26rpx;
	color: #666;
}
</style>