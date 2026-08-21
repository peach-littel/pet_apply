<template>
	<view class="help-page">
		<view class="nav-bar">
			<view class="nav-left" @click="goBack"><text class="back-icon">‹</text></view>
			<text class="nav-title">帮助中心</text>
			<view class="nav-right"></view>
		</view>

		<!-- 搜索框 -->
		<view class="search-box">
			<view class="search-input-wrap">
				<image class="search-icon" src="/pages/static/tab/search.png"></image>
				<input 
					class="search-input" 
					v-model="searchKeyword" 
					placeholder="搜索问题关键字" 
					confirm-type="search"
					@confirm="onSearch"
				/>
				<text class="search-clear" v-if="searchKeyword" @click="clearSearch">✕</text>
			</view>
		</view>

		<!-- 分类Tab -->
		<scroll-view class="category-tabs" scroll-x show-scrollbar="false">
			<view 
				class="category-item" 
				:class="{ active: currentCategory === item.value }"
				v-for="item in categoryList" 
				:key="item.value"
				@click="currentCategory = item.value"
			>
				{{ item.label }}
			</view>
		</scroll-view>

		<!-- 帮助列表 -->
		<view class="help-list">
			<view class="help-item" v-for="item in filteredList" :key="item.id" @click="goDetail(item)">
				<text class="help-icon">{{ item.icon }}</text>
				<view class="help-content">
					<text class="help-title">{{ item.title }}</text>
					<text class="help-desc">{{ item.desc }}</text>
				</view>
				<text class="help-arrow">›</text>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-if="filteredList.length === 0" class="empty-state">
			<text class="empty-icon">🔍</text>
			<text class="empty-text">{{ searchKeyword ? '未找到相关问题' : '暂无帮助内容' }}</text>
			<view class="empty-btn" @click="clearSearch" v-if="searchKeyword">清除搜索</view>
		</view>

		<!-- 底部联系客服 -->
		<view class="bottom-bar">
			<view class="contact-btn" @click="contactService">
				<text class="contact-icon">💬</text>
				<text>联系在线客服</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'

	const searchKeyword = ref('')
	const currentCategory = ref('all')

	// const categoryList = ref([
	// 	{ label: '全部', value: 'all' },
	// 	{ label: '领养', value: 'adopt' },
	// 	{ label: '支付', value: 'pay' },
	// 	{ label: '物流', value: 'logistics' },
	// 	{ label: '售后', value: 'after-sale' },
	// 	{ label: '养宠', value: 'pet-care' }
	// ])

	//  帮助数据 
	const helpList = ref([
		// 领养相关
		{
			id: 1,
			icon: '📋',
			title: '如何申请领养',
			desc: '了解领养申请流程和注意事项',
			category: 'adopt',
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
		{
			id: 2,
			icon: '📝',
			title: '领养审核需要多久',
			desc: '领养申请审核时间说明',
			category: 'adopt',
			content: `
				<h2>领养审核需要多久</h2>
				<p>一般情况下，领养审核时间为1-3个工作日。</p>
				<p>审核流程包括：</p>
				<p>1. 工作人员初步审核申请信息</p>
				<p>2. 电话或短信联系申请人核实信息</p>
				<p>3. 确认领养条件和居住环境</p>
				<p>4. 审核通过后通知领养人</p>
				<p><strong>温馨提示：</strong></p>
				<p>• 请保持电话畅通，以便工作人员联系</p>
				<p>• 如需加快审核，可联系在线客服</p>
			`
		},
		{
			id: 3,
			icon: '🐾',
			title: '领养需要什么条件',
			desc: '领养宠物的基本条件要求',
			category: 'adopt',
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

		// 支付相关
		{
			id: 4,
			icon: '💰',
			title: '支持哪些支付方式',
			desc: '商城支付方式说明',
			category: 'pay',
			content: `
				<h2>支持哪些支付方式</h2>
				<p>目前支持以下支付方式：</p>
				<p>1. <strong>微信支付</strong> - 推荐使用，安全便捷</p>
				<p>2. <strong>支付宝支付</strong> - 支持支付宝账户支付</p>
				<p>3. <strong>余额支付</strong> - 使用账户余额支付</p>
				<p><strong>温馨提示：</strong></p>
				<p>• 支付过程中请确保网络畅通</p>
				<p>• 如遇支付问题，请联系客服</p>
			`
		},
		{
			id: 5,
			icon: '💳',
			title: '支付失败怎么办',
			desc: '支付失败的原因和解决方法',
			category: 'pay',
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

		// 物流相关
		{
			id: 6,
			icon: '🚚',
			title: '发货时间要多久',
			desc: '订单发货时间说明',
			category: 'logistics',
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
		{
			id: 7,
			icon: '📍',
			title: '如何查询物流信息',
			desc: '查看订单物流状态的方法',
			category: 'logistics',
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

		// 售后相关
		{
			id: 8,
			icon: '🔄',
			title: '退换货政策说明',
			desc: '退换货申请条件和流程',
			category: 'after-sale',
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
		{
			id: 9,
			icon: '❓',
			title: '如何申请退款',
			desc: '退款申请的详细步骤',
			category: 'after-sale',
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

		// 养宠相关
		{
			id: 10,
			icon: '🐱',
			title: '猫咪日常护理指南',
			desc: '猫咪日常护理注意事项',
			category: 'pet-care',
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
		{
			id: 11,
			icon: '🐶',
			title: '狗狗训练入门教程',
			desc: '狗狗基础训练方法',
			category: 'pet-care',
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
		{
			id: 12,
			icon: '💉',
			title: '宠物疫苗接种指南',
			desc: '宠物疫苗接种时间和注意事项',
			category: 'pet-care',
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
		{
			id: 13,
			icon: '🦷',
			title: '宠物牙齿护理方法',
			desc: '宠物牙齿健康护理技巧',
			category: 'pet-care',
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
	])

	//  搜索筛选 
	const filteredList = computed(() => {
		let list = helpList.value
		
		// 分类筛选
		if (currentCategory.value !== 'all') {
			list = list.filter(item => item.category === currentCategory.value)
		}
		
		// 关键词搜索
		if (searchKeyword.value.trim()) {
			const keyword = searchKeyword.value.trim().toLowerCase()
			list = list.filter(item => 
				item.title.includes(keyword) || 
				item.desc.includes(keyword) ||
				item.content.toLowerCase().includes(keyword)
			)
		}
		
		return list
	})

	//  方法 
	const goBack = () => uni.navigateBack()

	const goDetail = (item) => {
		uni.navigateTo({
			url: `/pages/mine/help-center/help-detail/help-detail?id=${item.id}`
		})
	}

	const onSearch = () => {}
	const clearSearch = () => {
		searchKeyword.value = ''
	}

	// 联系客服 - 跳转到消息页的在线客服 c
	const contactService = () => {
		// 跳转到消息页的客服入口
		uni.navigateTo({
			url: `/pages/message/customer-service/customer-service`
		})
	}
</script>

<style lang="scss" scoped>
	.help-page {
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

	.search-box {
		padding: 16rpx 32rpx;
		background: #FFFFFF;
		border-bottom: 1rpx solid #F0EDE8;
	}

	.search-input-wrap {
		display: flex;
		align-items: center;
		background: #F5F5F5;
		border-radius: 30rpx;
		padding: 12rpx 20rpx;
	}

	.search-icon {
		width: 20px;
		height: 20px;
		opacity: 0.3;
		color: #999;
		margin-right: 12rpx;
	}

	.search-input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
		height: 44rpx;
	}

	.search-clear {
		font-size: 28rpx;
		color: #999;
		padding: 4rpx 8rpx;
	}

	.category-tabs {
		display: flex;
		background: #FFFFFF;
		padding: 12rpx 32rpx;
		gap: 16rpx;
		border-bottom: 1rpx solid #F0EDE8;
		white-space: nowrap;
		overflow-x: auto;
	}

	.category-item {
		font-size: 24rpx;
		color: #666;
		padding: 6rpx 16rpx;
		border-radius: 30rpx;
		flex-shrink: 0;

		&.active {
			color: #D49A55;
			background: #FFF5E4;
			font-weight: 500;
		}
	}

	.help-list {
		margin: 20rpx 32rpx;
		background: #FFFFFF;
		border-radius: 24rpx;
		overflow: hidden;
	}

	.help-item {
		display: flex;
		align-items: center;
		padding: 24rpx;
		border-bottom: 1rpx solid #F5F4F0;

		&:last-child {
			border-bottom: none;
		}

		&:active {
			background: #F9F7F4;
		}
	}

	.help-icon {
		font-size: 32rpx;
		margin-right: 16rpx;
		flex-shrink: 0;
	}

	.help-content {
		flex: 1;
		min-width: 0;
	}

	.help-title {
		font-size: 28rpx;
		color: #333;
		display: block;
		font-weight: 500;
	}

	.help-desc {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-top: 4rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.help-arrow {
		font-size: 32rpx;
		color: #CCC;
		flex-shrink: 0;
	}

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

		&:active {
			transform: scale(0.94);
		}
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

	.contact-btn {
		width: 100%;
		height: 88rpx;
		background: linear-gradient(135deg, #D49A55, #B8860B);
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		font-size: 30rpx;
		font-weight: 600;
		gap: 12rpx;
		transition: transform 0.2s;

		&:active {
			transform: scale(0.96);
		}
	}

	.contact-icon {
		font-size: 36rpx;
	}
</style>