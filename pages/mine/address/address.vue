<template>
	<view class="address-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">收货地址</text>
			<view class="nav-right" @click="addAddress">
				<text class="nav-add">+</text>
			</view>
		</view>

		<view class="address-list">
			<view class="address-card" v-for="(item, idx) in addressList" :key="idx">
				<view class="address-info" @click="setDefault(item)">
					<view class="address-name">
						<text class="name">{{ item.name }}</text>
						<text class="phone">{{ item.phone }}</text>
					</view>
					<text class="address-detail">{{ item.address }}</text>
					<view class="address-bottom">
						<view class="address-tag" v-if="item.isDefault">默认</view>
						<text class="address-label" v-else>设为默认</text>
					</view>
				</view>
				<view class="address-actions">
					<view class="action-btn" @click="editAddress(item)">编辑</view>
					<view class="action-btn delete" @click="deleteAddress(item, idx)">删除</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="addressList.length === 0" class="empty-state">
			<text class="empty-icon">📍</text>
			<text class="empty-text">暂无收货地址</text>
			<view class="empty-btn" @click="addAddress">添加地址</view>
		</view>

		<!-- 新增/编辑地址弹窗 -->
		<view class="modal-mask" v-if="showModal" @click="closeModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
					<text class="modal-close" @click="closeModal">✕</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">收货人</text>
						<input class="form-input" v-model="formData.name" placeholder="请输入收货人姓名" />
					</view>
					<view class="form-item">
						<text class="form-label">手机号</text>
						<input class="form-input" v-model="formData.phone" placeholder="请输入手机号码" type="number"
							maxlength="11" />
					</view>
					<view class="form-item">
						<text class="form-label">所在地区</text>
						<input class="form-input" v-model="formData.region" placeholder="请选择省/市/区"
							@focus="showRegionPicker" />
					</view>
					<view class="form-item">
						<text class="form-label">详细地址</text>
						<input class="form-input" v-model="formData.address" placeholder="请输入详细地址" />
					</view>
					<view class="form-item">
						<text class="form-label">设为默认</text>
						<view class="switch-wrap" @click="formData.isDefault = !formData.isDefault">
							<view class="switch-track" :class="{ active: formData.isDefault }">
								<view class="switch-thumb" :class="{ active: formData.isDefault }"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="modal-footer">
					<view class="modal-btn confirm" @click="saveAddress">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	// ---- 地址列表 ----
	const addressList = ref([{
			name: '张三',
			phone: '138****8888',
			region: '北京市朝阳区',
			address: '建国路88号SOHO现代城A座101室',
			isDefault: true
		},
		{
			name: '李四',
			phone: '139****6666',
			region: '上海市浦东新区',
			address: '陆家嘴环路1000号恒生银行大厦',
			isDefault: false
		}
	])

	// ---- 弹窗状态 ----
	const showModal = ref(false)
	const isEdit = ref(false)
	const editIndex = ref(-1)

	// ---- 表单数据 ----
	const formData = ref({
		name: '',
		phone: '',
		region: '',
		address: '',
		isDefault: false
	})

	// ---- 返回 ----
	const goBack = () => uni.navigateBack()

	// ---- 新增地址 ----
	const addAddress = () => {
		isEdit.value = false
		editIndex.value = -1
		formData.value = {
			name: '',
			phone: '',
			region: '',
			address: '',
			isDefault: false
		}
		showModal.value = true
	}

	// ---- 编辑地址 ----
	const editAddress = (item) => {
		isEdit.value = true
		editIndex.value = addressList.value.indexOf(item)
		formData.value = {
			...item
		}
		showModal.value = true
	}

	// ---- 设置默认地址 ----
	const setDefault = (item) => {
		addressList.value.forEach(addr => {
			addr.isDefault = false
		})
		item.isDefault = true
		uni.showToast({
			title: '已设为默认地址',
			icon: 'success'
		})
	}

	// ---- 删除地址 ----
	const deleteAddress = (item, idx) => {
		uni.showModal({
			title: '确认删除',
			content: '确定要删除这个地址吗？',
			success: (res) => {
				if (res.confirm) {
					addressList.value.splice(idx, 1)
					uni.showToast({
						title: '已删除',
						icon: 'success'
					})
				}
			}
		})
	}

	// ---- 选择地区 ----
	const showRegionPicker = () => {
		uni.showToast({
			title: '请选择地区',
			icon: 'none'
		})
	}

	// ---- 关闭弹窗 ----
	const closeModal = () => {
		showModal.value = false
	}

	// ---- 保存地址 ----
	const saveAddress = () => {
		// 验证
		if (!formData.value.name.trim()) {
			uni.showToast({
				title: '请输入收货人姓名',
				icon: 'none'
			})
			return
		}
		if (!formData.value.phone.trim() || !/^1\d{10}$/.test(formData.value.phone)) {
			uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			})
			return
		}
		if (!formData.value.region.trim()) {
			uni.showToast({
				title: '请选择所在地区',
				icon: 'none'
			})
			return
		}
		if (!formData.value.address.trim()) {
			uni.showToast({
				title: '请输入详细地址',
				icon: 'none'
			})
			return
		}

		const newAddress = {
			...formData.value
		}

		// 如果设为默认，取消其他默认
		if (newAddress.isDefault) {
			addressList.value.forEach(addr => {
				addr.isDefault = false
			})
		}

		if (isEdit.value && editIndex.value !== -1) {
			// 编辑
			addressList.value[editIndex.value] = newAddress
			uni.showToast({
				title: '修改成功',
				icon: 'success'
			})
		} else {
			// 新增
			addressList.value.push(newAddress)
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
		}

		closeModal()
	}
</script>

<style lang="scss" scoped>
	.address-page {
		min-height: 100vh;
		background: #F5F5F5;
		padding-bottom: 140rpx;
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

	.nav-add {
		font-size: 44rpx;
		color: #D49A55;
		font-weight: 300;
	}

	/* ========== 地址列表 ========== */
	.address-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.address-card {
		background: #FFFFFF;
		border-radius: 16rpx;
		padding: 24rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}
	}

	.address-info {
		cursor: pointer;
	}

	.address-name {
		display: flex;
		gap: 20rpx;
	}

	.address-name .name {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
	}

	.address-name .phone {
		font-size: 26rpx;
		color: #666;
	}

	.address-detail {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-top: 8rpx;
	}

	.address-bottom {
		margin-top: 12rpx;
	}

	.address-tag {
		display: inline-block;
		padding: 4rpx 16rpx;
		background: #D49A55;
		color: #fff;
		font-size: 20rpx;
		border-radius: 20rpx;
	}

	.address-label {
		font-size: 20rpx;
		color: #B0A8A0;
	}

	.address-actions {
		display: flex;
		justify-content: flex-end;
		gap: 20rpx;
		margin-top: 16rpx;
		padding-top: 16rpx;
		border-top: 1rpx solid #F5F4F0;
	}

	.action-btn {
		font-size: 24rpx;
		color: #D49A55;
		padding: 4rpx 12rpx;

		&.delete {
			color: #FF6B6B;
		}
	}

	/* ========== 空状态 ========== */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 0;
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
	}

	/* ========== 弹窗 ========== */
	.modal-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		animation: fadeIn 0.25s;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.modal-content {
		background: #FFFFFF;
		width: 100%;
		border-radius: 32rpx 32rpx 0 0;
		padding: 32rpx 32rpx 48rpx;
		max-height: 70vh;
		animation: slideUp 0.3s;
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0);
		}
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.modal-title {
		font-size: 34rpx;
		font-weight: 700;
		color: #333;
	}

	.modal-close {
		font-size: 40rpx;
		color: #999;
		padding: 8rpx;
	}

	.modal-body {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
	}

	.form-label {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		width: 140rpx;
		flex-shrink: 0;
	}

	.form-input {
		flex: 1;
		height: 72rpx;
		background: #F9F7F4;
		border-radius: 12rpx;
		padding: 0 16rpx;
		font-size: 28rpx;
		color: #333;
	}

	.switch-wrap {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}

	.switch-track {
		width: 88rpx;
		height: 48rpx;
		background: #E0E0E0;
		border-radius: 24rpx;
		position: relative;
		transition: background 0.3s;

		&.active {
			background: #D49A55;
		}
	}

	.switch-thumb {
		width: 40rpx;
		height: 40rpx;
		background: #FFFFFF;
		border-radius: 50%;
		position: absolute;
		top: 4rpx;
		left: 4rpx;
		transition: left 0.3s;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

		&.active {
			left: 44rpx;
		}
	}

	.modal-footer {
		margin-top: 32rpx;
	}

	.modal-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 16rpx rgba(212, 154, 85, 0.25);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}
</style>