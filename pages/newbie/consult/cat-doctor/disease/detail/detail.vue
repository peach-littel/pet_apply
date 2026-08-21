<template>
	<view class="disease-detail">
		<!-- 顶部导航 - 透明磨砂 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<!-- <text class="nav-title">{{ diseaseInfo.name }}</text> -->
			<view class="nav-right"></view>
		</view>

		<!-- 头部大图区域 -->
		<view class="hero-section">
			<view class="hero-bg" :style="{ background: currentGradient }">
				<view class="hero-content">
					<text class="hero-icon">{{ diseaseInfo.icon }}</text>
					<text class="hero-name">{{ diseaseInfo.name }}</text>
					<text class="hero-desc">{{ diseaseInfo.desc }}</text>
					<view class="hero-badge">
						<text class="badge-text">🐾 猫咪健康指南</text>
					</view>
				</view>
			</view>
			<view class="hero-wave">
				<svg viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						fill="#F9F7F4" />
				</svg>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-wrap">
			<!-- 快速概览 -->
			<view class="quick-stats">
				<view class="stat-item">
					<text class="stat-number">{{ diseaseInfo.symptoms.length }}</text>
					<text class="stat-label">常见症状</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-number">{{ diseaseInfo.severity || '中' }}</text>
					<text class="stat-label">严重程度</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<text class="stat-number">{{ diseaseInfo.recovery || '3-7' }}</text>
					<text class="stat-label">恢复天数</text>
				</view>
			</view>

			<!-- 症状卡片 -->
			<view class="info-card symptoms-card">
				<view class="card-header">
					<text class="card-icon">📋</text>
					<text class="card-title">常见症状</text>
					<view class="card-badge">{{ diseaseInfo.symptoms.length }}项</view>
				</view>
				<view class="symptoms-grid">
					<view class="symptom-chip" v-for="(symptom, idx) in diseaseInfo.symptoms" :key="idx">
						<text class="chip-dot">●</text>
						<text class="chip-text">{{ symptom }}</text>
					</view>
				</view>
			</view>

			<!-- 原因卡片 -->
			<view class="info-card cause-card">
				<view class="card-header">
					<text class="card-icon">🔍</text>
					<text class="card-title">可能原因</text>
				</view>
				<view class="cause-list">
					<view class="cause-item" v-for="(cause, idx) in diseaseInfo.causesList" :key="idx">
						<text class="cause-num">{{ idx + 1 }}</text>
						<text class="cause-text">{{ cause }}</text>
					</view>
				</view>
			</view>

			<!-- 处理建议卡片 -->
			<view class="info-card treatment-card">
				<view class="card-header">
					<text class="card-icon">💊</text>
					<text class="card-title">处理建议</text>
				</view>
				<view class="treatment-list">
					<view class="treatment-item" v-for="(step, idx) in diseaseInfo.treatmentList" :key="idx">
						<view class="step-number">{{ idx + 1 }}</view>
						<view class="step-content">
							<text class="step-title">{{ step.title }}</text>
							<text class="step-desc">{{ step.desc }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 就医建议卡片 -->
			<view class="info-card advice-card">
				<view class="card-header">
					<text class="card-icon">🏥</text>
					<text class="card-title">就医建议</text>
				</view>
				<view class="advice-content">
					<text class="advice-icon">⚠️</text>
					<text class="advice-text">{{ diseaseInfo.advice }}</text>
				</view>
				<view class="advice-tips">
					<text class="tip">• 如症状加重请立即就医</text>
					<text class="tip">• 提前联系医院确认接诊</text>
					<text class="tip">• 带上猫咪的健康档案</text>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom-bar">
			<view class="btn btn-primary" @click="consultDoctor">
				<text>💬 咨询医生</text>
			</view>
			<view class="btn btn-secondary" @click="viewRelated">
				<text>📖 了解更多</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const diseaseInfo = ref({
		name: '感冒',
		icon: '🤧',
		desc: '打喷嚏、流鼻涕、咳嗽',
		severity: '中',
		recovery: '3-7',
		symptoms: ['打喷嚏', '流鼻涕', '咳嗽', '精神萎靡', '食欲下降'],
		causesList: ['病毒感染', '天气变化', '免疫力下降', '接触患病猫咪'],
		treatmentList: [{
				title: '保暖休息',
				desc: '提供温暖的休息环境，避免受凉'
			},
			{
				title: '补充水分',
				desc: '确保充足饮水，可适当补充电解质'
			},
			{
				title: '营养支持',
				desc: '提供易消化的食物，增强体力'
			},
			{
				title: '观察记录',
				desc: '记录体温和症状变化，及时应对'
			}
		],
		advice: '如果症状持续超过2天，或出现呼吸困难、拒绝进食、体温超过39.5°C，请立即就医。'
	})

	// 渐变背景映射
	const gradientMap = {
		'感冒': 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		'呕吐': 'linear-gradient(135deg, #D5F0E8, #B8E0D2)',
		'腹泻': 'linear-gradient(135deg, #D4E7F7, #A4C7E8)',
		'眼部问题': 'linear-gradient(135deg, #F8D7DF, #F0B8C8)',
		'耳部问题': 'linear-gradient(135deg, #FFE8D0, #FDDCB5)',
		'口腔问题': 'linear-gradient(135deg, #D5F0E8, #B8E0D2)'
	}

	const currentGradient = computed(() => {
		return gradientMap[diseaseInfo.value.name] || 'linear-gradient(135deg, #D5F0E8, #B8E0D2)'
	})

	// 疾病数据映射
	const diseaseData = {
		'感冒': {
			name: '感冒',
			icon: '🤧',
			desc: '打喷嚏、流鼻涕、咳嗽',
			severity: '中',
			recovery: '3-7',
			symptoms: ['打喷嚏', '流鼻涕', '咳嗽', '精神萎靡', '食欲下降'],
			causesList: ['病毒感染', '天气变化', '免疫力下降', '接触患病猫咪'],
			treatmentList: [{
					title: '保暖休息',
					desc: '提供温暖的休息环境，避免受凉'
				},
				{
					title: '补充水分',
					desc: '确保充足饮水，可适当补充电解质'
				},
				{
					title: '营养支持',
					desc: '提供易消化的食物，增强体力'
				},
				{
					title: '观察记录',
					desc: '记录体温和症状变化，及时应对'
				}
			],
			advice: '如果症状持续超过2天，或出现呼吸困难、拒绝进食、体温超过39.5°C，请立即就医。'
		},
		'呕吐': {
			name: '呕吐',
			icon: '🤮',
			desc: '频繁呕吐、食欲不振',
			severity: '高',
			recovery: '1-3',
			symptoms: ['频繁呕吐', '食欲不振', '精神萎靡', '体重下降', '脱水'],
			causesList: ['毛球症', '饮食不当', '肠胃炎', '寄生虫', '应激反应'],
			treatmentList: [{
					title: '禁食休息',
					desc: '禁食4-6小时，让肠胃得到休息'
				},
				{
					title: '少量喂水',
					desc: '少量多次喂水，防止脱水'
				},
				{
					title: '逐步恢复',
					desc: '逐步恢复喂食，选择易消化食物'
				},
				{
					title: '观察记录',
					desc: '观察呕吐物颜色、频率和状态'
				}
			],
			advice: '如果24小时内呕吐超过3次，或出现血便、腹部疼痛、持续精神萎靡，请立即就医。'
		},
		'腹泻': {
			name: '腹泻',
			icon: '💩',
			desc: '软便、拉稀、便血',
			severity: '高',
			recovery: '2-5',
			symptoms: ['软便', '拉稀', '便血', '食欲不振', '脱水', '精神萎靡'],
			causesList: ['饮食变化', '食物不耐受', '细菌感染', '寄生虫', '应激反应'],
			treatmentList: [{
					title: '禁食休息',
					desc: '禁食4-6小时，让肠道休息'
				},
				{
					title: '补充电解质',
					desc: '补充电解质水，防止脱水'
				},
				{
					title: '易消化饮食',
					desc: '逐步恢复易消化食物'
				},
				{
					title: '益生菌调理',
					desc: '使用宠物专用益生菌'
				}
			],
			advice: '如果腹泻超过24小时，或出现血便、频繁呕吐、精神萎靡、体温异常，请立即就医。'
		},
		'眼部问题': {
			name: '眼部问题',
			icon: '😿',
			desc: '流泪、红肿、分泌物',
			severity: '中',
			recovery: '3-7',
			symptoms: ['流泪增多', '眼白红肿', '分泌物增多', '畏光', '揉眼睛'],
			causesList: ['结膜炎', '角膜损伤', '过敏', '异物刺激', '眼部感染'],
			treatmentList: [{
					title: '清洁眼部',
					desc: '用温水轻轻清洁眼部周围'
				},
				{
					title: '专用眼药水',
					desc: '使用宠物专用眼药水（遵医嘱）'
				},
				{
					title: '防止抓挠',
					desc: '防止猫咪抓挠眼睛，可戴伊丽莎白圈'
				},
				{
					title: '观察变化',
					desc: '观察分泌物颜色和量的变化'
				}
			],
			advice: '如果出现脓性分泌物、角膜混浊、瞳孔异常、持续疼痛，请立即就医。'
		},
		'耳部问题': {
			name: '耳部问题',
			icon: '👂',
			desc: '瘙痒、异味、分泌物',
			severity: '中',
			recovery: '5-14',
			symptoms: ['频繁摇头', '抓耳朵', '耳道异味', '分泌物增多', '耳朵红肿'],
			causesList: ['耳螨感染', '细菌感染', '真菌感染', '过敏', '异物进入'],
			treatmentList: [{
					title: '清洁耳道',
					desc: '使用宠物专用洗耳液清洁'
				},
				{
					title: '定期检查',
					desc: '定期检查耳道状态'
				},
				{
					title: '驱虫药物',
					desc: '使用驱耳螨药物（遵医嘱）'
				},
				{
					title: '保持干燥',
					desc: '保持耳道干燥，防止感染'
				}
			],
			advice: '如果出现耳道出血、严重疼痛、听力下降、持续摇头，请立即就医。'
		},
		'口腔问题': {
			name: '口腔问题',
			icon: '🦷',
			desc: '口臭、牙龈红肿、流口水',
			severity: '中',
			recovery: '7-14',
			symptoms: ['口臭明显', '牙龈红肿', '流口水增多', '进食困难', '牙结石'],
			causesList: ['牙周病', '口腔溃疡', '牙龈炎', '牙齿损伤', '口腔肿瘤'],
			treatmentList: [{
					title: '定期刷牙',
					desc: '使用宠物专用牙膏刷牙'
				},
				{
					title: '口腔清洁',
					desc: '使用口腔清洁液'
				},
				{
					title: '洁齿玩具',
					desc: '提供清洁牙齿的玩具'
				},
				{
					title: '定期检查',
					desc: '定期进行口腔检查'
				}
			],
			advice: '如果出现严重口臭、牙龈出血、牙齿松动、拒绝进食、面部肿胀，请立即就医。'
		}
	}

	onLoad((options) => {
		const name = decodeURIComponent(options.name || '感冒')
		const disease = diseaseData[name]
		if (disease) {
			diseaseInfo.value = disease
		} else {
			diseaseInfo.value = diseaseData['感冒']
		}
	})

	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
	}

	const consultDoctor = () => {
		uni.navigateTo({
			url: `/pages/newbie/consult/chat/chat?disease=${encodeURIComponent(diseaseInfo.value.name)}&type=disease`
		})
	}
	
	const viewRelated = () => {
		uni.navigateTo({
			url: `/pages/newbie/articles/articles?keyword=${encodeURIComponent(diseaseInfo.value.name)}`
		})
	}
</script>

<style lang="scss" scoped>
	.disease-detail {
		min-height: 100vh;
		background: #F9F7F4;
		padding-bottom: 160rpx;
	}

	/* ========== 顶部导航 ========== */
	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 60rpx 32rpx 20rpx;
		background: transparent;
	}

	.nav-left {
		width: 72rpx;
		height: 72rpx;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(12rpx);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.back-icon {
		font-size: 70rpx;
		font-weight: 300;
		color: #ffb700;
		line-height: 1;
		margin-bottom: 10px;
	}

	.nav-title {
		font-size: 36rpx;
		font-weight: 700;
		color: #000000;
		flex: 1;
		text-align: center;
		text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
	}

	.nav-right {
		width: 72rpx;
		flex-shrink: 0;
	}

	/* ========== 头部大图区域 ========== */
	.hero-section {
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.hero-bg {
		padding: 100rpx 32rpx 60rpx;
		min-height: 420rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-content {
		text-align: center;
	}

	.hero-icon {
		font-size: 100rpx;
		display: block;
		margin-bottom: 16rpx;
	}

	.hero-name {
		font-size: 48rpx;
		font-weight: 800;
		color: #1A1A1A;
		display: block;
		margin-bottom: 8rpx;
	}

	.hero-desc {
		font-size: 28rpx;
		color: #555;
		display: block;
		margin-bottom: 20rpx;
	}

	.hero-badge {
		display: inline-block;
		padding: 8rpx 24rpx;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(8rpx);
		border-radius: 30rpx;
	}

	.badge-text {
		font-size: 22rpx;
		color: #555;
	}

	.hero-wave {
		position: absolute;
		bottom: -1rpx;
		left: 0;
		right: 0;
		width: 100%;
		height: 60rpx;
	}

	/* ========== 快速概览 ========== */
	.quick-stats {
		display: flex;
		align-items: center;
		background: #FFFFFF;
		margin: -20rpx 32rpx 20rpx;
		padding: 24rpx 16rpx;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		position: relative;
		z-index: 2;
	}

	.stat-item {
		flex: 1;
		text-align: center;
	}

	.stat-number {
		font-size: 36rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
	}

	.stat-label {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
	}

	.stat-divider {
		width: 1rpx;
		height: 40rpx;
		background: #E8E8E8;
	}

	/* ========== 内容卡片 ========== */
	.content-wrap {
		padding: 0 32rpx;
	}

	.info-card {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 18rpx;
	}

	.card-icon {
		font-size: 28rpx;
	}

	.card-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		flex: 1;
	}

	.card-badge {
		padding: 4rpx 16rpx;
		background: #F5F4F0;
		border-radius: 20rpx;
		font-size: 20rpx;
		color: #999;
	}

	/* 症状卡片 */
	.symptoms-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}

	.symptom-chip {
		display: flex;
		align-items: center;
		gap: 6rpx;
		padding: 8rpx 18rpx;
		background: #F9F7F4;
		border-radius: 30rpx;
	}

	.chip-dot {
		font-size: 14rpx;
		color: #D49A55;
	}

	.chip-text {
		font-size: 24rpx;
		color: #555;
	}

	/* 原因卡片 */
	.cause-list {
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	.cause-item {
		display: flex;
		align-items: center;
		gap: 14rpx;
		padding: 12rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
	}

	.cause-num {
		width: 36rpx;
		height: 36rpx;
		background: #D49A55;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18rpx;
		font-weight: 600;
		flex-shrink: 0;
	}

	.cause-text {
		font-size: 24rpx;
		color: #555;
	}

	/* 处理建议卡片 */
	.treatment-list {
		display: flex;
		flex-direction: column;
		gap: 16rpx;
	}

	.treatment-item {
		display: flex;
		gap: 16rpx;
		padding: 14rpx 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
	}

	.step-number {
		width: 44rpx;
		height: 44rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 20rpx;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-content {
		flex: 1;
	}

	.step-title {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
	}

	.step-desc {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	/* 就医建议卡片 */
	.advice-card {
		background: linear-gradient(135deg, #FFF5E4, #FFECD2);
		border: 1rpx solid rgba(212, 154, 85, 0.15);
	}

	.advice-content {
		display: flex;
		gap: 12rpx;
		padding: 16rpx;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 16rpx;
		margin-bottom: 16rpx;
	}

	.advice-icon {
		font-size: 28rpx;
		flex-shrink: 0;
	}

	.advice-text {
		font-size: 26rpx;
		color: #555;
		line-height: 1.6;
		flex: 1;
	}

	.advice-tips {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.advice-tips .tip {
		font-size: 22rpx;
		color: #8D6E63;
	}

	/* ========== 底部操作栏 ========== */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 32rpx 40rpx;
		background: #FFFFFF;
		display: flex;
		gap: 16rpx;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.04);
	}

	.btn {
		flex: 1;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: 600;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}

	.btn-primary {
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.3);
	}

	.btn-secondary {
		background: #F5F4F0;
		color: #666;
	}
</style>