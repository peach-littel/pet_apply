<template>
	<view class="medical-detail">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">驱虫计划安排</text>
			<view class="nav-right"></view>
		</view>

		<view class="banner" style="background:linear-gradient(135deg,#FFE8D0,#FDDCB5)">
			<text class="banner-icon">🐛</text>
			<!-- <text class="banner-title">驱虫计划安排</text> -->
			<text class="banner-desc">科学驱虫，预防寄生虫感染</text>
		</view>

		<!-- 驱虫时间表 -->
		<view class="section">
			<view class="section-title">📋 驱虫时间表</view>
			<view class="timeline">
				<view class="timeline-item" v-for="(item, idx) in dewormSchedule" :key="idx">
					<view class="timeline-dot" :style="{ background: item.color }"></view>
					<view class="timeline-content">
						<text class="timeline-age">{{ item.age }}</text>
						<text class="timeline-desc">{{ item.desc }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 驱虫类型 -->
		<view class="section">
			<view class="section-title">🪱 驱虫类型对比</view>
			<view class="comparison-grid">
				<view class="comparison-item" v-for="(item, idx) in dewormTypes" :key="idx">
					<text class="comp-icon">{{ item.icon }}</text>
					<text class="comp-name">{{ item.name }}</text>
					<text class="comp-desc">{{ item.desc }}</text>
					<text class="comp-frequency">{{ item.frequency }}</text>
				</view>
			</view>
		</view>

		<!-- 注意事项 -->
		<view class="section">
			<view class="section-title">⚠️ 注意事项</view>
			<view class="tips-list">
				<view class="tip-item" v-for="(tip, idx) in tipsList" :key="idx">
					<text class="tip-dot">●</text>
					<text class="tip-text">{{ tip }}</text>
				</view>
			</view>
		</view>

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

	const dewormSchedule = ref([{
			age: '2-8周',
			desc: '首次体内驱虫（每2-3周一次）',
			color: '#4ECDC4'
		},
		{
			age: '8周-6月',
			desc: '体内驱虫（每月一次）+ 体外驱虫（每月一次）',
			color: '#F5A623'
		},
		{
			age: '6月以上',
			desc: '体内驱虫（每3-6个月一次）',
			color: '#FF6B6B'
		},
		{
			age: '全年',
			desc: '体外驱虫（每月一次，全年无休）',
			color: '#D49A55'
		}
	])

	const dewormTypes = ref([{
			icon: '💊',
			name: '体内驱虫',
			desc: '驱除蛔虫、钩虫、绦虫等肠道寄生虫',
			frequency: '幼宠每月/成宠每季'
		},
		{
			icon: '🧴',
			name: '体外驱虫',
			desc: '驱除跳蚤、蜱虫、螨虫等体外寄生虫',
			frequency: '每月一次'
		}
	])

	const tipsList = ref([
		'驱虫药用量需按体重计算，不可过量',
		'体内驱虫前后2小时建议禁食',
		'体外驱虫后48小时内避免洗澡',
		'不同品牌驱虫药不可混用',
		'定期环境消毒，防止再感染'
	])

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
</script>

<style lang="scss" scoped>
	/* 与 vaccine-guide 共用样式，此处省略 */
	.medical-detail {
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

	.banner {
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

	.section {
		background: #FFFFFF;
		margin: 0 32rpx 16rpx;
		padding: 24rpx;
		border-radius: 24rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
	}

	.section-title {
		font-size: 30rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
		margin-bottom: 16rpx;
	}

	.timeline {
		position: relative;
		padding-left: 20rpx;
	}

	.timeline-item {
		display: flex;
		gap: 20rpx;
		padding-bottom: 20rpx;
		position: relative;

		&:not(:last-child)::after {
			content: '';
			position: absolute;
			left: 4rpx;
			top: 20rpx;
			width: 2rpx;
			height: calc(100% - 10rpx);
			background: #E0E0E0;
		}
	}

	.timeline-dot {
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		flex-shrink: 0;
		margin-top: 6rpx;
	}

	.timeline-content {
		flex: 1;
	}

	.timeline-age {
		font-size: 24rpx;
		font-weight: 600;
		color: #D49A55;
		display: block;
	}

	.timeline-desc {
		font-size: 24rpx;
		color: #555;
		display: block;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 12rpx;
	}

	.comparison-item {
		background: #F9F7F4;
		padding: 16rpx;
		border-radius: 16rpx;
		text-align: center;
	}

	.comp-icon {
		font-size: 32rpx;
		display: block;
	}

	.comp-name {
		font-size: 24rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: block;
		margin-top: 4rpx;
	}

	.comp-desc {
		font-size: 20rpx;
		color: #666;
		display: block;
		margin-top: 2rpx;
	}

	.comp-frequency {
		font-size: 20rpx;
		color: #D49A55;
		display: block;
		margin-top: 4rpx;
	}

	.tips-list {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.tip-item {
		display: flex;
		gap: 8rpx;
	}

	.tip-dot {
		color: #D49A55;
		font-size: 16rpx;
	}

	.tip-text {
		font-size: 24rpx;
		color: #555;
		flex: 1;
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