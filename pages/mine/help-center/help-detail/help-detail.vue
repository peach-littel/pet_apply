<template>
	<view class="help-detail-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">{{ helpInfo.title || '帮助详情' }}</text>
			<view class="nav-right"></view>
		</view>

		<!-- 内容 -->
		<view class="content-wrap" v-if="helpInfo">
			<!-- 标题区域 -->
			<view class="title-section">
				<text class="help-icon">{{ helpInfo.icon }}</text>
				<text class="help-title">{{ helpInfo.title }}</text>
			</view>

			<!-- 正文 -->
			<view class="content-section" v-html="helpInfo.content"></view>

			<!-- 底部提示 -->
			<view class="tip-section">
				<text class="tip-text">💡 如果以上内容未能解决您的问题</text>
				<view class="tip-btn" @click="contactService">联系在线客服</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-else class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const helpInfo = ref({
	id: '',
	icon: '',
	title: '',
	content: ''
})

//  帮助数据（与列表保持一致） 
const helpDataMap = {
	1: {
		id: 1,
		icon: '📋',
		title: '如何申请领养',
		content: `
			<h2>如何申请领养</h2>
			<p>1. 浏览宠物列表，选择您喜欢的宠物</p>
			<p>2. 点击「申请领养」按钮</p>
			<p>3. 填写个人信息和领养申请表单</p>
			<p>4. 提交申请，等待审核</p>
			<p>5. 审核通过后，工作人员会联系您</p>
			<p><strong>注意事项：</strong></p>
			<p>• 请确保填写的联系方式准确</p>
			<p>• 领养需要年满18周岁</p>
			<p>• 请确认您有足够的时间和精力照顾宠物</p>
		`
	},
	2: {
		id: 2,
		icon: '📝',
		title: '领养审核需要多久',
		content: `
			<h2>领养审核需要多久</h2>
			<p>一般情况下，领养审核时间为1-3个工作日。</p>
			<p><strong>审核流程包括：</strong></p>
			<p>1. 工作人员初步审核申请信息</p>
			<p>2. 电话或短信联系申请人核实信息</p>
			<p>3. 确认领养条件和居住环境</p>
			<p>4. 审核通过后通知领养人</p>
			<p><strong>温馨提示：</strong></p>
			<p>• 请保持电话畅通，以便工作人员联系</p>
			<p>• 如需加快审核，可联系在线客服</p>
		`
	},
	3: {
		id: 3,
		icon: '🐾',
		title: '领养需要什么条件',
		content: `
			<h2>领养需要什么条件</h2>
			<p><strong>基本条件：</strong></p>
			<p>• 年满18周岁，具有完全民事行为能力</p>
			<p>• 有固定的住所和稳定的收入</p>
			<p>• 家庭成员同意领养</p>
			<p>• 有足够的时间照顾宠物</p>
			<p><strong>优先条件：</strong></p>
			<p>• 有养宠经验者优先</p>
			<p>• 自有住房者优先</p>
			<p>• 有宠物陪伴经历者优先</p>
		`
	},
	4: {
		id: 4,
		icon: '💰',
		title: '支持哪些支付方式',
		content: `
			<h2>支持哪些支付方式</h2>
			<p>目前支持以下支付方式：</p>
			<p><strong>1. 微信支付</strong> - 推荐使用，安全便捷</p>
			<p><strong>2. 支付宝支付</strong> - 支持支付宝账户支付</p>
			<p><strong>3. 余额支付</strong> - 使用账户余额支付</p>
			<p><strong>温馨提示：</strong></p>
			<p>• 支付过程中请确保网络畅通</p>
			<p>• 如遇支付问题，请联系客服</p>
		`
	},
	5: {
		id: 5,
		icon: '💳',
		title: '支付失败怎么办',
		content: `
			<h2>支付失败怎么办</h2>
			<p><strong>常见原因：</strong></p>
			<p>1. 网络不稳定 - 请切换网络后重试</p>
			<p>2. 账户余额不足 - 请充值后重试</p>
			<p>3. 支付限额 - 可联系银行调整限额</p>
			<p>4. 系统繁忙 - 请稍后再试</p>
			<p><strong>解决方法：</strong></p>
			<p>• 重新发起支付</p>
			<p>• 更换支付方式</p>
			<p>• 联系在线客服处理</p>
		`
	},
	6: {
		id: 6,
		icon: '🚚',
		title: '发货时间要多久',
		content: `
			<h2>发货时间要多久</h2>
			<p>订单支付成功后，我们会在1-3个工作日内发货。</p>
			<p><strong>物流时效：</strong></p>
			<p>• 同城：1-2天送达</p>
			<p>• 省内：2-3天送达</p>
			<p>• 省外：3-5天送达</p>
			<p><strong>温馨提示：</strong></p>
			<p>• 节假日物流可能会有延迟</p>
			<p>• 可联系客服查询物流进度</p>
		`
	},
	7: {
		id: 7,
		icon: '📍',
		title: '如何查询物流信息',
		content: `
			<h2>如何查询物流信息</h2>
			<p><strong>查询方法：</strong></p>
			<p>1. 进入「我的」-「我的订单」</p>
			<p>2. 点击需要查询的订单</p>
			<p>3. 点击「查看物流」按钮</p>
			<p>4. 查看实时物流状态</p>
			<p><strong>温馨提示：</strong></p>
			<p>• 物流信息更新可能有延迟</p>
			<p>• 如长时间未更新，请联系客服</p>
		`
	},
	8: {
		id: 8,
		icon: '🔄',
		title: '退换货政策说明',
		content: `
			<h2>退换货政策说明</h2>
			<p><strong>退换货条件：</strong></p>
			<p>• 商品未拆封、不影响二次销售</p>
			<p>• 收到商品后7天内提出申请</p>
			<p>• 质量问题可在15天内申请</p>
			<p><strong>退换货流程：</strong></p>
			<p>1. 进入「我的」-「我的订单」</p>
			<p>2. 选择需要退换的订单</p>
			<p>3. 点击「申请退款」</p>
			<p>4. 填写退款原因和说明</p>
			<p>5. 提交申请，等待审核</p>
		`
	},
	9: {
		id: 9,
		icon: '❓',
		title: '如何申请退款',
		content: `
			<h2>如何申请退款</h2>
			<p><strong>申请步骤：</strong></p>
			<p>1. 进入「我的」-「我的订单」</p>
			<p>2. 选择需要退款的订单</p>
			<p>3. 点击「申请退款」按钮</p>
			<p>4. 选择退款原因，填写说明</p>
			<p>5. 提交申请，等待商家审核</p>
			<p><strong>退款到账时间：</strong></p>
			<p>• 微信/支付宝支付：1-3个工作日</p>
			<p>• 余额支付：即时到账</p>
		`
	},
	10: {
		id: 10,
		icon: '🐱',
		title: '猫咪日常护理指南',
		content: `
			<h2>猫咪日常护理指南</h2>
			<p><strong>饮食管理：</strong></p>
			<p>• 提供优质的猫粮和充足的清水</p>
			<p>• 定时定量喂食，避免过度肥胖</p>
			<p>• 定期更换猫粮品牌</p>
			<p><strong>健康管理：</strong></p>
			<p>• 定期接种疫苗</p>
			<p>• 定期体内外驱虫</p>
			<p>• 每年进行一次体检</p>
			<p><strong>日常护理：</strong></p>
			<p>• 每日梳毛，保持毛发健康</p>
			<p>• 定期清洁耳朵和眼睛</p>
			<p>• 保持猫砂盆清洁</p>
		`
	},
	11: {
		id: 11,
		icon: '🐶',
		title: '狗狗训练入门教程',
		content: `
			<h2>狗狗训练入门教程</h2>
			<p><strong>基础指令训练：</strong></p>
			<p>1. 坐下：用零食引导狗狗坐下</p>
			<p>2. 握手：轻抬狗狗前爪并给予奖励</p>
			<p>3. 趴下：从坐下姿势引导趴下</p>
			<p>4. 过来：用愉快的语气呼唤狗狗</p>
			<p><strong>训练技巧：</strong></p>
			<p>• 每次训练不超过15分钟</p>
			<p>• 使用零食作为奖励</p>
			<p>• 保持耐心和一致性</p>
			<p>• 正向强化，不惩罚</p>
		`
	},
	12: {
		id: 12,
		icon: '💉',
		title: '宠物疫苗接种指南',
		content: `
			<h2>宠物疫苗接种指南</h2>
			<p><strong>猫咪疫苗接种：</strong></p>
			<p>• 基础免疫：8周、12周、16周各接种一次</p>
			<p>• 加强免疫：每年接种一次</p>
			<p>• 狂犬疫苗：每年接种一次</p>
			<p><strong>狗狗疫苗接种：</strong></p>
			<p>• 基础免疫：6周、9周、12周各接种一次</p>
			<p>• 加强免疫：每年接种一次</p>
			<p>• 狂犬疫苗：每年接种一次</p>
			<p><strong>注意事项：</strong></p>
			<p>• 接种前确保宠物健康</p>
			<p>• 接种后观察30分钟</p>
			<p>• 一周内避免洗澡和剧烈运动</p>
		`
	},
	13: {
		id: 13,
		icon: '🦷',
		title: '宠物牙齿护理方法',
		content: `
			<h2>宠物牙齿护理方法</h2>
			<p><strong>日常护理：</strong></p>
			<p>• 每周给宠物刷牙2-3次</p>
			<p>• 使用宠物专用牙膏和牙刷</p>
			<p>• 提供洁齿骨或洁齿玩具</p>
			<p><strong>专业护理：</strong></p>
			<p>• 每年进行一次专业洁牙</p>
			<p>• 定期检查牙齿和牙龈健康</p>
			<p>• 发现牙结石及时处理</p>
			<p><strong>警示信号：</strong></p>
			<p>• 口臭、流口水增多</p>
			<p>• 进食困难、食欲下降</p>
			<p>• 牙龈红肿、出血</p>
		`
	}
}

onLoad((options) => {
	const id = Number(options.id)
	if (id && helpDataMap[id]) {
		helpInfo.value = helpDataMap[id]
	} else {
		uni.showToast({ title: '内容不存在', icon: 'none' })
	}
})

const goBack = () => uni.navigateBack()

// 联系客服 - 跳转到消息页的在线客服 
const contactService = () => {
	uni.navigateTo({
		url: `/pages/message/customer-service/customer-service`
	})
}
</script>

<style lang="scss" scoped>
.help-detail-page {
	min-height: 100vh;
	background: #F5F5F5;
	padding-bottom: 40rpx;
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
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.nav-right {
	width: 72rpx;
	flex-shrink: 0;
}

.loading-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 50vh;
}

.loading-text {
	font-size: 28rpx;
	color: #B0A8A0;
}

.content-wrap {
	margin: 20rpx 32rpx;
	background: #FFFFFF;
	border-radius: 24rpx;
	padding: 32rpx;
}

.title-section {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding-bottom: 24rpx;
	border-bottom: 2rpx solid #F5F4F0;
}

.help-icon {
	font-size: 40rpx;
}

.help-title {
	font-size: 32rpx;
	font-weight: 700;
	color: #1A1A1A;
}

.content-section {
	padding: 24rpx 0;
	font-size: 28rpx;
	color: #333;
	line-height: 1.8;
}

.content-section :deep(h2) {
	font-size: 30rpx;
	font-weight: 700;
	color: #1A1A1A;
	margin: 24rpx 0 12rpx;
}

.content-section :deep(h2:first-child) {
	margin-top: 0;
}

.content-section :deep(p) {
	margin: 8rpx 0;
	color: #444;
}

.content-section :deep(strong) {
	color: #1A1A1A;
	font-weight: 600;
}

.tip-section {
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 2rpx solid #F5F4F0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.tip-text {
	font-size: 26rpx;
	color: #999;
}

.tip-btn {
	padding: 16rpx 48rpx;
	background: linear-gradient(135deg, #D49A55, #B8860B);
	color: #fff;
	font-size: 28rpx;
	font-weight: 500;
	border-radius: 30rpx;

	&:active {
		transform: scale(0.94);
	}
}
</style>