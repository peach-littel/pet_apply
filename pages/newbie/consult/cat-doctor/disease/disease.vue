<template>
	<view class="consult-chat">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">😿 疾病咨询</text>
			<view class="nav-right"></view>
		</view>

		<!-- 咨询说明 -->
		<view class="chat-banner">
			<text class="banner-icon">😿</text>
			<text class="banner-title">猫咪疾病咨询</text>
			<text class="banner-desc">专业兽医在线解答，快速诊断猫咪健康问题</text>
		</view>

		<!-- 常见疾病 -->
		<view class="disease-section">
			<view class="section-title">常见疾病</view>
			<view class="disease-grid">
				<view class="disease-item" v-for="(item, idx) in diseaseList" :key="idx" @click="selectDisease(item)">
					<view class="disease-icon">{{ item.icon }}</view>
					<text class="disease-name">{{ item.name }}</text>
					<text class="disease-desc">{{ item.desc }}</text>
				</view>
			</view>
		</view>

		<!-- 症状描述 -->
		<view class="symptom-section">
			<view class="section-title">请描述您猫咪的症状</view>
			<view class="symptom-tags">
				<view class="symptom-tag" :class="{ active: selectedSymptoms.includes(tag) }"
					v-for="(tag, idx) in symptomList" :key="idx" @click="toggleSymptom(tag)">
					{{ tag }}
				</view>
			</view>
			<view class="symptom-input-wrap">
				<textarea class="symptom-input" v-model="symptomDesc" placeholder="详细描述猫咪的症状..." />
			</view>
			<view class="chat-btn" @click="startConsult">
				<text>开始咨询</text>
			</view>
		</view>

		<!-- 在线医生 -->
		<view class="doctor-section">
			<view class="section-title">👨‍⚕️ 在线医生</view>
			<view class="doctor-list">
				<view class="doctor-item" v-for="(doctor, idx) in doctorList" :key="idx" @click="consultDoctor(doctor)">
					<view class="doctor-avatar">{{ doctor.avatar }}</view>
					<view class="doctor-info">
						<text class="doctor-name">{{ doctor.name }}</text>
						<text class="doctor-title">{{ doctor.title }}</text>
						<view class="doctor-status online">● 在线</view>
					</view>
					<view class="doctor-btn">咨询</view>
				</view>
			</view>
		</view>

		<!-- 客服时间 -->
		<view class="service-time">
			<text class="time-title">💬 在线客服</text>
			<text class="time-text">工作日 9:00 - 21:00</text>
			<text class="time-tip">非工作时间请留言，24小时内回复</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'

	const symptomDesc = ref('')
	const selectedSymptoms = ref([])

	const diseaseList = ref([{
			icon: '🤧',
			name: '感冒',
			desc: '打喷嚏、流鼻涕、咳嗽'
		},
		{
			icon: '🤮',
			name: '呕吐',
			desc: '频繁呕吐、食欲不振'
		},
		{
			icon: '💩',
			name: '腹泻',
			desc: '软便、拉稀、便血'
		},
		{
			icon: '😿',
			name: '眼部问题',
			desc: '流泪、红肿、分泌物'
		},
		{
			icon: '👂',
			name: '耳部问题',
			desc: '瘙痒、异味、分泌物'
		},
		{
			icon: '🦷',
			name: '口腔问题',
			desc: '口臭、牙龈红肿、流口水'
		}
	])

	const symptomList = ref([
		'发热', '呕吐', '腹泻', '咳嗽', '打喷嚏',
		'食欲不振', '精神萎靡', '体重下降', '脱水', '便血'
	])

	const doctorList = ref([{
			avatar: '🐱',
			name: '李医生',
			title: '资深宠物医师 · 8年经验'
		},
		{
			avatar: '🐱',
			name: '王医生',
			title: '宠物内科专家 · 6年经验'
		},
		{
			avatar: '🐱',
			name: '张医生',
			title: '宠物急诊医师 · 5年经验'
		}
	])

	const toggleSymptom = (tag) => {
		const index = selectedSymptoms.value.indexOf(tag)
		if (index > -1) {
			selectedSymptoms.value.splice(index, 1)
		} else {
			selectedSymptoms.value.push(tag)
		}
	}

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

	// 跳转到疾病详情
	const selectDisease = (item) => {
		uni.navigateTo({
			url: `/pages/newbie/consult/cat-doctor/disease/detail/detail?name=${encodeURIComponent(item.name)}&icon=${encodeURIComponent(item.icon)}&desc=${encodeURIComponent(item.desc)}`
		})
	}

	const startConsult = () => {
		if (selectedSymptoms.value.length === 0 && !symptomDesc.value.trim()) {
			uni.showToast({
				title: '请选择症状或描述病情',
				icon: 'none'
			})
			return
		}
		// 跳转到咨询聊天页，传递症状信息
		uni.navigateTo({
			url: `/pages/newbie/consult/chat/chat?type=disease&symptoms=${encodeURIComponent(selectedSymptoms.value.join(','))}&desc=${encodeURIComponent(symptomDesc.value)}`
		})
	}

	const consultDoctor = (doctor) => {
		uni.navigateTo({
			url: `/pages/newbie/consult/chat/chat?doctor=${encodeURIComponent(doctor.name)}&type=doctor`
		})
	}
</script>

<style lang="scss" scoped>
	.consult-chat {
		min-height: 100vh;
		background: #F9F7F4;
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
	}

	.nav-right {
		width: 72rpx;
		flex-shrink: 0;
	}

	.chat-banner {
		background: linear-gradient(135deg, #D5F0E8, #B8E0D2);
		margin: 20rpx 32rpx;
		padding: 32rpx;
		border-radius: 24rpx;
		text-align: center;
	}

	.banner-icon {
		font-size: 56rpx;
		display: block;
	}

	.banner-title {
		font-size: 32rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-top: 12rpx;
	}

	.banner-desc {
		font-size: 24rpx;
		color: #555;
		display: block;
		margin-top: 6rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 16rpx;
	}

	.disease-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.disease-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12rpx;
	}

	.disease-item {
		background: #F9F7F4;
		padding: 16rpx;
		border-radius: 16rpx;
		text-align: center;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.95);
		}
	}

	.disease-icon {
		font-size: 32rpx;
		display: block;
	}

	.disease-name {
		font-size: 24rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-top: 4rpx;
	}

	.disease-desc {
		font-size: 20rpx;
		color: #999;
		display: block;
		margin-top: 2rpx;
	}

	.symptom-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.symptom-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-bottom: 16rpx;
	}

	.symptom-tag {
		padding: 8rpx 20rpx;
		background: #F5F4F0;
		border-radius: 30rpx;
		font-size: 24rpx;
		color: #666;
		border: 2rpx solid transparent;
		transition: all 0.2s;

		&.active {
			background: #FFF5E4;
			border-color: #D49A55;
			color: #D49A55;
		}
	}

	.symptom-input-wrap {
		margin-bottom: 16rpx;
	}

	.symptom-input {
		width: 100%;
		height: 120rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		padding: 16rpx 20rpx;
		font-size: 26rpx;
		color: #333;
		box-sizing: border-box;
	}

	.chat-btn {
		width: 100%;
		height: 80rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		border-radius: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.3);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}

	/* ========== 在线医生 ========== */
	.doctor-section {
		background: #FFFFFF;
		margin: 0 32rpx 20rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.doctor-list {
		display: flex;
		flex-direction: column;
		gap: 14rpx;
	}

	.doctor-item {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 16rpx;
		background: #F9F7F4;
		border-radius: 16rpx;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.97);
		}
	}

	.doctor-avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #D5F0E8, #B8E0D2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		flex-shrink: 0;
	}

	.doctor-info {
		flex: 1;
	}

	.doctor-name {
		font-size: 26rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
	}

	.doctor-title {
		font-size: 20rpx;
		color: #999;
		display: block;
	}

	.doctor-status {
		font-size: 18rpx;
		color: #4ECDC4;
	}

	.doctor-status.online {
		color: #4ECDC4;
	}

	.doctor-btn {
		padding: 8rpx 24rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		color: #fff;
		font-size: 22rpx;
		border-radius: 30rpx;
		font-weight: 500;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.92);
		}
	}

	.service-time {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 24rpx 28rpx;
		margin: 0 32rpx;
		text-align: center;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.time-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-bottom: 8rpx;
	}

	.time-text {
		font-size: 26rpx;
		color: #333;
		display: block;
	}

	.time-tip {
		font-size: 22rpx;
		color: #B0A8A0;
		display: block;
		margin-top: 6rpx;
	}
</style>