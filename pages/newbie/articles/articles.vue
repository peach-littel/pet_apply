<template>
	<view class="articles-page">
		<!-- 顶部导航 -->
		<view class="nav-bar">
			<view class="nav-left" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<text class="nav-title">{{ pageTitle }}</text>
			<view class="nav-right"></view>
		</view>

		<!-- 文章列表 -->
		<view class="articles-list">
			<view class="article-card" v-for="(item, idx) in filteredArticles" :key="idx" @click="viewArticle(item)">
				<view class="article-content">
					<view class="article-tag">{{ item.category }}</view>
					<text class="article-title">{{ item.title }}</text>
					<text class="article-desc">{{ item.desc }}</text>
					<view class="article-meta">
						<text class="meta-item">📅 {{ item.time }}</text>
						<text class="meta-item">👁️ {{ item.views }}</text>
					</view>
				</view>
				<image class="article-image" :src="item.image" mode="aspectFill" />
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredArticles.length === 0" class="empty">
			<text class="empty-icon">📖</text>
			<text class="empty-text">暂无相关文章</text>
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

	const keyword = ref('')
	const pageTitle = ref('相关文章')

	// ---- 文章数据 ----
	const articleList = ref([{
			id: 1,
			title: '新手养猫全攻略：从零开始养猫',
			desc: '从选猫到日常护理，一篇搞定所有养猫知识点',
			category: '猫咪养护',
			time: '2024-12-15',
			views: 2341,
			image: 'https://picsum.photos/id/40/200/200',
			tags: ['猫咪', '新手', '养护']
		},
		{
			id: 2,
			title: '猫咪常见疾病预防指南',
			desc: '了解猫咪常见疾病症状，做到早发现早治疗',
			category: '疾病预防',
			time: '2024-12-12',
			views: 1856,
			image: 'https://picsum.photos/id/41/200/200',
			tags: ['疾病', '预防', '健康']
		},
		{
			id: 3,
			title: '科学喂养：猫咪饮食全解析',
			desc: '不同年龄段猫咪的营养需求和饮食建议',
			category: '科学喂养',
			time: '2024-12-10',
			views: 1567,
			image: 'https://picsum.photos/id/42/200/200',
			tags: ['喂养', '营养', '饮食']
		},
		{
			id: 4,
			title: '猫咪行为学：读懂你的猫',
			desc: '了解猫咪行为背后的含义，建立更好的亲子关系',
			category: '行为训练',
			time: '2024-12-08',
			views: 1234,
			image: 'https://picsum.photos/id/43/200/200',
			tags: ['行为', '训练', '沟通']
		},
		{
			id: 5,
			title: '狗狗呕吐原因及处理方法',
			desc: '狗狗呕吐的常见原因和正确的应对措施',
			category: '狗狗健康',
			time: '2024-12-06',
			views: 987,
			image: 'https://picsum.photos/id/237/200/200',
			tags: ['狗狗', '呕吐', '健康']
		},
		{
			id: 6,
			title: '宠物疫苗全面解析',
			desc: '宠物疫苗种类、接种时间和注意事项详解',
			category: '疫苗知识',
			time: '2024-12-04',
			views: 876,
			image: 'https://picsum.photos/id/44/200/200',
			tags: ['疫苗', '免疫', '健康']
		}
	])

	// ---- 筛选文章 ----
	const filteredArticles = computed(() => {
		if (!keyword.value) return articleList.value
		const kw = keyword.value.toLowerCase()
		return articleList.value.filter(item => {
			return item.title.includes(kw) ||
				item.desc.includes(kw) ||
				item.category.includes(kw) ||
				item.tags.some(tag => tag.includes(kw))
		})
	})

	onLoad((options) => {
		const kw = options.keyword || ''
		if (kw) {
			keyword.value = decodeURIComponent(kw)
			pageTitle.value = `"${keyword.value}" 相关文章`
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

	const viewArticle = (item) => {
		uni.showToast({
			title: `查看：${item.title}`,
			icon: 'none'
		})
	}
</script>

<style lang="scss" scoped>
	.articles-page {
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

	.articles-list {
		padding: 20rpx 32rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.article-card {
		display: flex;
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 20rpx;
		gap: 16rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		transition: transform 0.2s;

		&:active {
			transform: scale(0.97);
		}
	}

	.article-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6rpx;
	}

	.article-tag {
		align-self: flex-start;
		padding: 4rpx 16rpx;
		background: #FFF5E4;
		color: #D49A55;
		font-size: 20rpx;
		border-radius: 20rpx;
	}

	.article-title {
		font-size: 28rpx;
		font-weight: 600;
		color: #1A1A1A;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.article-desc {
		font-size: 22rpx;
		color: #999;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.article-meta {
		display: flex;
		gap: 20rpx;
		margin-top: 4rpx;
	}

	.meta-item {
		font-size: 20rpx;
		color: #B0A8A0;
	}

	.article-image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 16rpx;
		object-fit: cover;
		flex-shrink: 0;
		background: #F0EDE8;
	}

	.empty {
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
	}
</style>