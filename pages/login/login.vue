<template>
	<view class="login-page">
		<!-- Logo区域 -->
		<view class="logo-section">
			<view class="logo-icon">🐾</view>
			<text class="logo-title">宠物领养</text>
			<text class="logo-sub">给它一个温暖的家</text>
		</view>

		<!-- 测试账号提示 -->
		<view class="test-tip">
			<text class="tip-icon">💡</text>
			<text class="tip-text">测试账号：13800138000  验证码：666666</text>
		</view>

		<!-- 表单区域 -->
		<view class="form-section">
			<view class="input-item">
				<text class="input-icon">📱</text>
				<input class="input-field" v-model="phone" placeholder="请输入手机号" type="number" maxlength="11" />
			</view>
			<view class="input-item">
				<text class="input-icon">🔑</text>
				<input class="input-field" v-model="code" placeholder="请输入验证码" type="number" maxlength="6" />
				<view class="code-btn" :class="{ disabled: countdown > 0 }" @click="sendCode">
					{{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
				</view>
			</view>
		</view>

		<!-- 快捷填充 -->
		<view class="quick-fill">
			<text class="fill-btn" @click="fillTestAccount(1)">一键填充测试账号1</text>
			<text class="fill-btn" @click="fillTestAccount(2)">一键填充测试账号2</text>
		</view>

		<!-- 登录按钮 -->
		<view class="login-btn" :class="{ disabled: !canLogin }" @click="handleLogin">
			登录
		</view>

		<!-- 协议 -->
		<view class="agreement">
			<view class="check-box" :class="{ checked: agree }" @click="agree = !agree">
				<text v-if="agree">✓</text>
			</view>
			<text class="agreement-text">
				登录即代表同意<text class="link">《用户协议》</text>和<text class="link">《隐私政策》</text>
			</text>
		</view>

		<!-- 第三方登录 -->
		<view class="third-login">
			<view class="divider">
				<text class="line"></text>
				<text class="divider-text">其他登录方式</text>
				<text class="line"></text>
			</view>
			<view class="third-icons">
				<view class="third-icon" @click="wxLogin">
					<text>💬</text>
				</view>
				<view class="third-icon" @click="qqLogin">
					<text>🐧</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { userStore } from '@/store/index.js'

const phone = ref('')
const code = ref('')
const agree = ref(false)
const countdown = ref(0)

// ========== 测试账号数据 ==========
const testAccounts = [
	{
		phone: '13800138000',
		code: '666666',
		userInfo: {
			id: 10001,
			nickname: '铲屎官小雅',
			avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
			userId: '88520666',
			points: 1280,
			city: '北京'
		}
	},
	{
		phone: '13900139000',
		code: '888888',
		userInfo: {
			id: 10002,
			nickname: '爱猫人士阿凯',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
			userId: '88520777',
			points: 3560,
			city: '上海'
		}
	}
]

// 快捷填充测试账号
const fillTestAccount = (index) => {
	const account = testAccounts[index - 1]
	phone.value = account.phone
	code.value = account.code
	agree.value = true
}

const canLogin = computed(() => phone.value && code.value && agree.value)

const sendCode = () => {
	if (countdown.value > 0) return
	if (!/^1\d{10}$/.test(phone.value)) {
		uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
		return
	}
	countdown.value = 60
	uni.showToast({ title: '验证码已发送', icon: 'success' })
	const timer = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) clearInterval(timer)
	}, 1000)
}

const handleLogin = () => {
	if (!canLogin.value) {
		uni.showToast({ title: '请完善信息并同意协议', icon: 'none' })
		return
	}
	
	uni.showLoading({ title: '登录中...' })
	
	setTimeout(() => {
		uni.hideLoading()
		
		// 校验测试账号
		const matchAccount = testAccounts.find(
			item => item.phone === phone.value && item.code === code.value
		)
		
		if (matchAccount) {
			// 测试账号匹配成功，写入全局状态
			userStore.login(matchAccount.userInfo)
			uni.showToast({ title: '登录成功', icon: 'success' })
			setTimeout(() => {
				uni.switchTab({ url: '/pages/index/index' })
			}, 1000)
		} else {
			// 测试模式：任意手机号+任意6位验证码也可登录（通用测试）
			if (/^1\d{10}$/.test(phone.value) && /^\d{6}$/.test(code.value)) {
				const guestUser = {
					id: Date.now(),
					nickname: `用户${phone.value.slice(-4)}`,
					avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
					userId: phone.value.slice(-8),
					points: 0,
					city: '未设置'
				}
				userStore.login(guestUser)
				uni.showToast({ title: '登录成功', icon: 'success' })
				setTimeout(() => {
					uni.switchTab({ url: '/pages/index/index' })
				}, 1000)
			} else {
				uni.showToast({ title: '手机号或验证码错误', icon: 'none' })
			}
		}
	}, 1200)
}

const wxLogin = () => {
	uni.showToast({ title: '微信登录开发中', icon: 'none' })
}
const qqLogin = () => {
	uni.showToast({ title: 'QQ登录开发中', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.login-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #FFF5E4 0%, #FFF9EF 50%, #fff 100%);
	padding: 0 64rpx;
	box-sizing: border-box;
}

.logo-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 120rpx;
	margin-bottom: 40rpx;
}

.logo-icon {
	font-size: 120rpx;
	margin-bottom: 32rpx;
}

.logo-title {
	font-size: 52rpx;
	font-weight: bold;
	color: #8B5A2B;
	margin-bottom: 16rpx;
}

.logo-sub {
	font-size: 28rpx;
	color: #999;
}

.test-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	background: #FFF3CD;
	padding: 16rpx 24rpx;
	border-radius: 16rpx;
	margin-bottom: 32rpx;
}

.tip-icon {
	font-size: 28rpx;
	margin-right: 12rpx;
}

.tip-text {
	font-size: 24rpx;
	color: #856404;
}

.form-section {
	margin-bottom: 24rpx;
}

.input-item {
	display: flex;
	align-items: center;
	height: 100rpx;
	background: #fff;
	border-radius: 50rpx;
	padding: 0 32rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04);
}

.input-icon {
	font-size: 36rpx;
	margin-right: 20rpx;
}

.input-field {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.code-btn {
	font-size: 26rpx;
	color: #D49A55;
	padding-left: 20rpx;
	border-left: 1rpx solid #E0E0E0;
}

.code-btn.disabled {
	color: #999;
}

.quick-fill {
	display: flex;
	justify-content: flex-end;
	gap: 32rpx;
	margin-bottom: 40rpx;
}

.fill-btn {
	font-size: 24rpx;
	color: #D49A55;
}

.login-btn {
	width: 100%;
	height: 100rpx;
	background: linear-gradient(90deg, #D49A55, #B8860B);
	color: #fff;
	font-size: 36rpx;
	font-weight: bold;
	border-radius: 50rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 40rpx;
	box-shadow: 0 8rpx 20rpx rgba(212, 154, 85, 0.3);
}

.login-btn.disabled {
	opacity: 0.5;
}

.agreement {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	margin-bottom: 80rpx;
}

.check-box {
	width: 32rpx;
	height: 32rpx;
	border: 2rpx solid #D0D0D0;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12rpx;
	flex-shrink: 0;
	font-size: 18rpx;
	color: #fff;
	margin-top: 2rpx;
}

.check-box.checked {
	background: #D49A55;
	border-color: #D49A55;
}

.agreement-text {
	font-size: 24rpx;
	color: #999;
}

.link {
	color: #D49A55;
}

.third-login {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.divider {
	display: flex;
	align-items: center;
	gap: 24rpx;
	margin-bottom: 48rpx;
}

.line {
	width: 80rpx;
	height: 1rpx;
	background: #E0E0E0;
}

.divider-text {
	font-size: 24rpx;
	color: #999;
}

.third-icons {
	display: flex;
	gap: 60rpx;
}

.third-icon {
	width: 88rpx;
	height: 88rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 44rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
}
</style>