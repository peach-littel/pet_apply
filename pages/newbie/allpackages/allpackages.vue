<template>
	<view class="packages-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">全部套餐</text>
			<view class="nav-right"></view>
		</view>

		<!-- 套餐筛选 -->
		<view class="filter-tabs">
			<view class="filter-item" :class="{ active: currentFilter === 'all' }" @click="currentFilter = 'all'">
				全部
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'cat' }" @click="currentFilter = 'cat'">
				🐱 猫咪
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'dog' }" @click="currentFilter = 'dog'">
				🐶 狗狗
			</view>
			<view class="filter-item" :class="{ active: currentFilter === 'combo' }" @click="currentFilter = 'combo'">
				🎯 组合
			</view>
		</view>

		<!-- 套餐列表 -->
		<view class="packages-list">
			<view class="package-card" v-for="(pkg, index) in filteredPackages" :key="index">
				<view class="package-header">
					<view class="package-info">
						<text class="package-name">{{ pkg.name }}</text>
						<text class="package-desc">{{ pkg.desc }}</text>
					</view>
					<view class="package-tag" v-if="pkg.tag" :style="{ background: pkg.tagColor }">
						{{ pkg.tag }}
					</view>
				</view>

				<view class="package-price-row">
					<view class="package-price">
						<text class="price-symbol">¥</text>
						<text class="price-num">{{ pkg.price }}</text>
						<text class="price-origin" v-if="pkg.originPrice">¥{{ pkg.originPrice }}</text>
					</view>
					<view class="package-sales">已售 {{ pkg.sales || 0 }} 件</view>
				</view>

				<view class="package-items">
					<text class="item" v-for="(item, idx) in pkg.items" :key="idx">✓ {{ item }}</text>
				</view>

				<view class="package-action">
					<view class="package-btn" @click="selectPackage(pkg)">
						立即选购
					</view>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredPackages.length === 0" class="empty-state">
			<text class="empty-icon">📦</text>
			<text class="empty-text">暂无相关套餐</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed
	} from 'vue'

	// ---- 获取全局购物车 ----
	const app = getApp()
	const globalData = app.globalData || {}

	const currentFilter = ref('all')

	// ---- 全部套餐数据（添加 id） ----
	const allPackages = ref([
		// 猫咪套餐
		{
			id: 201,
			name: '猫咪基础入门包',
			tag: '热门',
			tagColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
			desc: '适合初次养猫，包含基础必需品',
			category: 'cat',
			price: 299,
			originPrice: 399,
			sales: 2341,
			items: ['优质猫粮 5kg', '封闭式猫砂盆', '豆腐猫砂 4袋', '陶瓷食盆水盆', '柔软猫窝', '猫抓板']
		},
		{
			id: 202,
			name: '猫咪豪华护理包',
			tag: '推荐',
			tagColor: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
			desc: '高品质猫咪护理体验',
			category: 'cat',
			price: 599,
			originPrice: 899,
			sales: 856,
			items: ['进口高端猫粮 5kg', '智能饮水机', '猫爬架 1.8m', '电动玩具', '护理套装', '宠物推车']
		},
		{
			id: 203,
			name: '猫咪健康保障包',
			tag: '超值',
			tagColor: 'linear-gradient(135deg, #F5A623, #F7C948)',
			desc: '健康医疗用品一站式配齐',
			category: 'cat',
			price: 399,
			originPrice: 599,
			sales: 1234,
			items: ['年度驱虫套餐', '免疫登记本', '宠物医药箱', '营养补充剂', '口腔护理套装', '宠物保险卡']
		},
		// 狗狗套餐
		{
			id: 204,
			name: '狗狗基础入门包',
			tag: '热门',
			tagColor: 'linear-gradient(135deg, #FF6B6B, #EE4444)',
			desc: '适合初次养狗，包含基础必需品',
			category: 'dog',
			price: 349,
			originPrice: 459,
			sales: 1876,
			items: ['优质狗粮 5kg', '不锈钢食盆水盆', '舒适狗窝', '牵引绳套装', '胸背带', '发声玩具']
		},
		{
			id: 205,
			name: '狗狗训练成长包',
			tag: '推荐',
			tagColor: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
			desc: '训练用品全套，助你轻松训犬',
			category: 'dog',
			price: 499,
			originPrice: 699,
			sales: 723,
			items: ['训练零食大礼包', '狗厕所/尿垫', '训练响片', '牵引训练绳', '益智玩具', '行为训练手册']
		},
		{
			id: 206,
			name: '狗狗户外运动包',
			tag: '超值',
			tagColor: 'linear-gradient(135deg, #F5A623, #F7C948)',
			desc: '户外运动装备一次配齐',
			category: 'dog',
			price: 459,
			originPrice: 659,
			sales: 567,
			items: ['户外牵引绳 5m', '宠物背包', '便携饮水器', '飞盘玩具', '宠物雨衣', '夜光项圈']
		},
		// 组合套餐
		{
			id: 207,
			name: '新手养宠全家桶',
			tag: '超值',
			tagColor: 'linear-gradient(135deg, #F5A623, #F7C948)',
			desc: '猫狗通用，一站式配齐所有必需品',
			category: 'combo',
			price: 899,
			originPrice: 1299,
			sales: 2345,
			items: ['豪华主粮 10kg', '智能喂食器', '猫爬架/狗围栏', '宠物推车', '年度驱虫套餐', '宠物保险']
		},
		{
			id: 208,
			name: '宠物医疗健康包',
			tag: '推荐',
			tagColor: 'linear-gradient(135deg, #4ECDC4, #44B39D)',
			desc: '猫狗通用，健康医疗一应俱全',
			category: 'combo',
			price: 599,
			originPrice: 899,
			sales: 456,
			items: ['宠物急救箱', '年度疫苗套餐', '体外驱虫药 6支', '体内驱虫药 6粒', '宠物体检卡 1次', '宠物保险卡']
		}
	])

	// ---- 筛选逻辑 ----
	const filteredPackages = computed(() => {
		if (currentFilter.value === 'all') return allPackages.value
		return allPackages.value.filter(pkg => pkg.category === currentFilter.value)
	})

	// ---- 方法 ----
	const goBack = () => {
		try {
			const pages = getCurrentPages()
			if (pages.length > 1) {
				uni.navigateBack()
			} else {
				uni.switchTab({
					url: '/pages/newbie/newbie'
				})
			}
		} catch (e) {
			uni.switchTab({
				url: '/pages/newbie/newbie'
			})
		}
	}

	// ---- ⭐ 立即选购套餐（加入购物车） ----
	const selectPackage = (pkg) => {
		const cartItem = {
			id: pkg.id,
			name: pkg.name,
			price: pkg.price,
			image: 'https://picsum.photos/id/1062/200/200',
			spec: '套餐包',
			quantity: 1,
			isPackage: true,
			items: pkg.items,
			originPrice: pkg.originPrice,
			category: pkg.category
		}

		if (globalData && typeof globalData.addToCart === 'function') {
			globalData.addToCart(cartItem)
			uni.showToast({
				title: `已加入购物车：${pkg.name}`,
				icon: 'success',
				duration: 1500
			})
		} else {
			uni.showToast({
				title: '购物车服务未初始化',
				icon: 'none'
			})
		}
	}
</script>

<style lang="scss" scoped>
	.packages-page {
		min-height: 100vh;
		background: #F9F7F4;
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
		flex-shrink: 0;
	}

	/* ========== 筛选标签 ========== */
	.filter-tabs {
		display: flex;
		background: #FFFFFF;
		padding: 16rpx 32rpx 20rpx;
		gap: 24rpx;
		border-bottom: 1rpx solid #F0EDE8;
	}

	.filter-item {
		font-size: 28rpx;
		color: #666;
		padding: 8rpx 4rpx;
		position: relative;
		transition: all 0.3s;

		&.active {
			color: #D49A55;
			font-weight: 600;

			&::after {
				content: '';
				position: absolute;
				bottom: -20rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 24rpx;
				height: 4rpx;
				background: #D49A55;
				border-radius: 4rpx;
			}
		}
	}

	/* ========== 套餐列表 ========== */
	.packages-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.package-card {
		background: #FFFFFF;
		border-radius: 28rpx;
		padding: 28rpx;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.98);
		}
	}

	.package-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 12rpx;
	}

	.package-info {
		flex: 1;
	}

	.package-name {
		font-size: 34rpx;
		font-weight: 700;
		color: #1A1A1A;
		display: block;
	}

	.package-desc {
		font-size: 24rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
	}

	.package-tag {
		padding: 4rpx 18rpx;
		color: #fff;
		font-size: 20rpx;
		font-weight: 600;
		border-radius: 30rpx;
		flex-shrink: 0;
		margin-left: 16rpx;
	}

	.package-price-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16rpx;
	}

	.package-price {
		display: flex;
		align-items: baseline;
		gap: 10rpx;
	}

	.price-symbol {
		font-size: 24rpx;
		color: #D44C4C;
		font-weight: 600;
	}

	.price-num {
		font-size: 40rpx;
		font-weight: 800;
		color: #D44C4C;
	}

	.price-origin {
		font-size: 22rpx;
		color: #B0A8A0;
		text-decoration: line-through;
	}

	.package-sales {
		font-size: 22rpx;
		color: #B0A8A0;
	}

	.package-items {
		display: flex;
		flex-wrap: wrap;
		gap: 6rpx 16rpx;
		margin-bottom: 20rpx;
		padding: 16rpx 0;
		border-top: 1rpx solid #F5F4F0;
		border-bottom: 1rpx solid #F5F4F0;
	}

	.package-items .item {
		font-size: 24rpx;
		color: #666;
		display: flex;
		align-items: center;
		gap: 4rpx;
	}

	.package-action {
		display: flex;
		justify-content: flex-end;
	}

	.package-btn {
		padding: 16rpx 48rpx;
		background: linear-gradient(135deg, #E8B880, #D49A55);
		border-radius: 33rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 28rpx;
		font-weight: 600;
		box-shadow: 0 4rpx 12rpx rgba(212, 154, 85, 0.2);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}

	/* ========== 空状态 ========== */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
	}
</style>