<script setup>
import { ref, computed } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

// ========== 存储常量 ==========
const STORAGE_KEYS = {
  ADOPT_APPLICATIONS: 'adoptApplications',
  ORDERS: 'orders',
  FAVORITES: 'favorites',
  USER_INFO: 'userInfo',
  CART_LIST: 'cartList'
}

/** 读取本地存储 */
const loadFromStorage = (key, defaultValue) => {
  try {
    const data = uni.getStorageSync(key)
    if (data) return JSON.parse(data)
  } catch (e) {
    console.error('读取存储失败:', key, e)
  }
  return defaultValue
}

/** 写入本地存储 */
const saveToStorage = (key, data) => {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch (e) {
    console.error('写入存储失败:', key, e)
  }
}

// ========== 用户信息 ==========
const userInfo = ref(loadFromStorage(STORAGE_KEYS.USER_INFO, {
  avatar: '/pages/static/image/user.png',
  nickname: '铲屎官小雅',
  gender: '女',
  phone: '138****8888',
  birthday: '1995-06-15',
  signature: '用心爱每一个小生命'
}))

const updateUserInfo = (data) => {
  userInfo.value = { ...userInfo.value, ...data }
  saveToStorage(STORAGE_KEYS.USER_INFO, userInfo.value)
}

// ========== 购物车 ==========
const cartList = ref(loadFromStorage(STORAGE_KEYS.CART_LIST, []))

const cartTotalCount = computed(() => {
  return cartList.value.reduce((sum, item) => sum + item.quantity, 0)
})

/** 添加到购物车 */
const addToCart = (item) => {
  const existIndex = cartList.value.findIndex(
    cartItem => cartItem.id === item.id && cartItem.spec === (item.spec || '')
  )
  if (existIndex !== -1) {
    cartList.value[existIndex].quantity += item.quantity || 1
  } else {
    cartList.value.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      spec: item.spec || '',
      quantity: item.quantity || 1,
      checked: true,
      isPackage: item.isPackage || false,
      items: item.items || []
    })
  }
  saveToStorage(STORAGE_KEYS.CART_LIST, cartList.value)
}

/** 删除购物车商品 */
const removeFromCart = (id, spec) => {
  const index = cartList.value.findIndex(item => item.id === id && item.spec === spec)
  if (index !== -1) {
    cartList.value.splice(index, 1)
    saveToStorage(STORAGE_KEYS.CART_LIST, cartList.value)
  }
}

const clearCart = () => {
  cartList.value = []
  saveToStorage(STORAGE_KEYS.CART_LIST, cartList.value)
}

const getCartList = () => cartList.value
const getCartTotalCount = () => cartTotalCount.value

// ========== 收藏 ==========
const favorites = ref(loadFromStorage(STORAGE_KEYS.FAVORITES, []))

const addFavorite = (item) => {
  const exists = favorites.value.some(f => f.id === item.id && f.type === item.type)
  if (!exists) {
    favorites.value.push(item)
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites.value)
    return true
  }
  return false
}

const removeFavorite = (id, type) => {
  const index = favorites.value.findIndex(f => f.id === id && f.type === type)
  if (index !== -1) {
    favorites.value.splice(index, 1)
    saveToStorage(STORAGE_KEYS.FAVORITES, favorites.value)
    return true
  }
  return false
}

const isFavorite = (id, type) => {
  return favorites.value.some(f => f.id === id && f.type === type)
}

// ========== 领养申请 ==========
const adoptApplications = ref(loadFromStorage(STORAGE_KEYS.ADOPT_APPLICATIONS, []))

const addAdoptApplication = (application) => {
  adoptApplications.value.unshift(application)
  saveToStorage(STORAGE_KEYS.ADOPT_APPLICATIONS, adoptApplications.value)
}

const updateAdoptApplication = (id, newStatus) => {
  const item = adoptApplications.value.find(x => x.id === id)
  if (!item) return false
  item.status = newStatus
  saveToStorage(STORAGE_KEYS.ADOPT_APPLICATIONS, adoptApplications.value)
  return true
}

// ========== 订单 ==========
const orders = ref(loadFromStorage(STORAGE_KEYS.ORDERS, []))

const addOrder = (order) => {
  orders.value.unshift(order)
  saveToStorage(STORAGE_KEYS.ORDERS, orders.value)
}

const updateOrderStatus = (orderId, newStatus) => {
  console.log('===== updateOrderStatus 被调用 =====')
  console.log('订单号:', orderId)
  console.log('新状态:', newStatus)
  console.log('当前订单列表:', orders.value)
  
  const item = orders.value.find(x => x.id === orderId)
  if (!item) {
    console.warn('⚠️ 未找到订单:', orderId)
    return false
  }
  
  // 更新状态
  item.status = newStatus
  
  // 如果是支付成功，记录支付时间
  if (newStatus === 'paid') {
    item.payTime = new Date().toLocaleString()
    console.log('💰 支付时间已记录:', item.payTime)
  }
  
  // 保存到存储
  saveToStorage(STORAGE_KEYS.ORDERS, orders.value)
  console.log('✅ 订单状态已更新为:', newStatus)
  console.log('更新后的订单:', item)
  
  return true
}


const deleteOrder = (orderId) => {
  const idx = orders.value.findIndex(x => x.id === orderId)
  if (idx === -1) return false
  orders.value.splice(idx, 1)
  saveToStorage(STORAGE_KEYS.ORDERS, orders.value)
  return true
}

// ========== 规格增强工具函数 ==========
const enhanceSpecs = (specs, basePrice, baseOriginPrice, baseStock) => {
  if (!specs || specs.length === 0) {
    return [{ name: '默认规格', price: basePrice, originPrice: baseOriginPrice || null, stock: baseStock || 999 }]
  }
  
  if (typeof specs[0] === 'object' && specs[0].price !== undefined) {
    return specs
  }
  
  return specs.map((name, index) => {
    let priceMultiplier = 1
    const nameLower = String(name).toLowerCase()
    
    if (nameLower.includes('豪华') || nameLower.includes('旗舰') || nameLower.includes('大') || 
        nameLower.includes('家庭') || nameLower.includes('3kg') || nameLower.includes('500') ||
        nameLower.includes('5kg') || nameLower.includes('10kg')) {
      priceMultiplier = 1.5 + (index * 0.1)
    } else if (nameLower.includes('标准') || nameLower.includes('中') || nameLower.includes('1.5') || 
               nameLower.includes('200') || nameLower.includes('300') || nameLower.includes('400')) {
      priceMultiplier = 1.2 + (index * 0.05)
    } else if (nameLower.includes('小') || nameLower.includes('尝鲜') || nameLower.includes('50') || 
               nameLower.includes('100') || nameLower.includes('试用')) {
      priceMultiplier = 0.8 + (index * 0.05)
    } else {
      priceMultiplier = 1 + (index * 0.08)
    }
    
    const price = Math.round(basePrice * priceMultiplier)
    return {
      name: String(name),
      price: price,
      originPrice: Math.round(price * 1.3),
      stock: Math.floor(Math.random() * 500) + 30
    }
  })
}

// ========== 商品数据（使用本地图片 - 路径为 pages/static/image/） ==========
const rawGoodsData = [
  {
    id: 1,
    name: '鸭肉冻干狗粮',
    category: '主粮',
    desc: '新鲜鸭肉制作，无任何添加剂，放心给毛孩子食用...',
    price: 32,
    originPrice: 58,
    sales: 2341,
    badge: '热销',
    image: '/pages/static/image/dog.png',
    specs: ['50g 尝鲜装', '150g 标准装', '300g 家庭装'],
    images: [
      '/pages/static/image/dog.png',
      '/pages/static/image/food2.png',
      '/pages/static/image/food3.png'
    ],
    detailImages: [
      '/pages/static/image/food4.png',
      '/pages/static/image/food5.png'
    ],
    rating: 4.8,
    reviewCount: 156,
    stock: 200,
    reviews: [
      { userName: '爱宠小咪', rating: 5, time: '2024-12-15', content: '猫咪超爱吃，冻干很酥脆，闻着就是纯肉香，没有添加剂的味道，已经回购三次了！', images: ['/pages/static/image/food6.png'] },
      { userName: '汪星人家长', rating: 4, time: '2024-12-12', content: '狗狗很喜欢吃，就是价格有点小贵，但品质确实不错，会继续回购。', images: [] },
      { userName: '铲屎官小刘', rating: 5, time: '2024-12-10', content: '我家两只猫都抢着吃，适口性真的绝了！而且配料表很干净，非常放心。', images: ['/pages/static/image/food7.png'] }
    ]
  },
  {
    id: 2,
    name: '罐装三文鱼猫粮',
    category: '主粮',
    desc: '新鲜三文鱼制作，无任何添加剂，放心给毛孩子食用...',
    price: 48,
    originPrice: 68,
    sales: 1856,
    badge: '',
    image: '/pages/static/image/catfood.png',
    specs: ['400g 装', '1.5kg 装', '3kg 装'],
    images: [
      '/pages/static/image/catfood.png',
      '/pages/static/image/catfood2.png',
      '/pages/static/image/catfood3.png'
    ],
    detailImages: [
      '/pages/static/image/catfood4.png'
    ],
    rating: 4.5,
    reviewCount: 89,
    stock: 150,
    reviews: [
      { userName: '橘猫家长', rating: 5, time: '2024-12-14', content: '我家猫咪特别爱吃这个，适口性很好，吃完毛发也亮了。', images: [] },
      { userName: '多多妈', rating: 4, time: '2024-12-11', content: '品质不错，就是价格稍高，但一分钱一分货。', images: [] }
    ]
  },
  {
    id: 3,
    name: '宠物洗发水',
    category: '清洁',
    desc: '天然植物提取，温和不刺激，呵护宠物皮毛',
    price: 25,
    originPrice: 35,
    sales: 723,
    badge: '新品',
    image: '/pages/static/image/bath1.png',
    specs: ['200ml', '500ml'],
    images: [
      '/pages/static/image/bath1.png',
      '/pages/static/image/bath2.png'
    ],
    detailImages: [
      '/pages/static/image/bath3.png'
    ],
    rating: 4.2,
    reviewCount: 45,
    stock: 300,
    reviews: [
      { userName: '雪球麻麻', rating: 4, time: '2024-12-13', content: '味道很好闻，洗完毛发很柔顺，狗狗也不抗拒。', images: [] }
    ]
  },
  {
    id: 4,
    name: '加长版猫窝',
    category: '窝具',
    desc: '新疆棉花手工制作，无任何有害物质，放心给毛孩子使用...',
    price: 89,
    originPrice: 129,
    sales: 456,
    badge: '',
    image: '/pages/static/image/catbed1.png',
    specs: ['S', 'M', 'L'],
    images: [
      '/pages/static/image/catbed1.png',
      '/pages/static/image/catbed2.png'
    ],
    detailImages: [
      '/pages/static/image/catbed3.png'
    ],
    rating: 4.6,
    reviewCount: 67,
    stock: 80,
    reviews: [
      { userName: '小咪妈妈', rating: 5, time: '2024-12-10', content: '猫咪很喜欢这个窝，材质柔软，冬天很保暖。', images: [] }
    ]
  },
  {
    id: 5,
    name: '鸡肉冻干零食',
    category: '零食',
    desc: '优质鸡胸肉冻干，营养丰富，适口性极佳',
    price: 28,
    originPrice: 42,
    sales: 3120,
    badge: '爆款',
    image: '/pages/static/image/chicken1.png',
    specs: ['100g', '200g', '500g'],
    images: [
      '/pages/static/image/chicken1.png',
      '/pages/static/image/chicken2.png'
    ],
    detailImages: [
      '/pages/static/image/chicken3.png',
      '/pages/static/image/chicken4.png'
    ],
    rating: 4.9,
    reviewCount: 234,
    stock: 500,
    reviews: [
      { userName: '二哈家长', rating: 5, time: '2024-12-09', content: '狗狗超级爱吃，训练时用的奖励，效果很好！', images: ['/pages/static/image/chicken5.png'] }
    ]
  },
  {
    id: 6,
    name: '海洋鱼猫粮',
    category: '主粮',
    desc: '多种深海鱼混合，补充Omega‑3，呵护皮毛',
    price: 56,
    originPrice: 78,
    sales: 932,
    badge: '',
    image: '/pages/static/image/fish1.png',
    specs: ['1kg', '3kg', '5kg'],
    images: [
      '/pages/static/image/fish1.png',
      '/pages/static/image/fish2.png'
    ],
    detailImages: [
      '/pages/static/image/fish3.png'
    ],
    rating: 4.3,
    reviewCount: 78,
    stock: 120,
    reviews: [
      { userName: '布偶妈妈', rating: 4, time: '2024-12-08', content: '三文鱼含量高，猫咪爱吃，毛发有明显改善。', images: ['/pages/static/image/fish4.png'] }
    ]
  },
  {
    id: 7,
    name: '宠物指甲剪套装',
    category: '护理',
    desc: '静音设计，安全防滑，新手也能轻松操作',
    price: 35,
    originPrice: 45,
    sales: 567,
    badge: '热销',
    image: '/pages/static/image/tool1.png',
    specs: ['标准款', '豪华款'],
    images: [
      '/pages/static/image/tool1.png',
      '/pages/static/image/tool2.png'
    ],
    detailImages: [
      '/pages/static/image/tool3.png'
    ],
    rating: 4.4,
    reviewCount: 56,
    stock: 200,
    reviews: [
      { userName: '新手铲屎官', rating: 4, time: '2024-12-07', content: '第一次用就成功了，设计很安全，不怕剪到血线。', images: [] }
    ]
  },
  {
    id: 8,
    name: '猫爬架豪华版',
    category: '窝具',
    desc: '多层设计，满足猫咪攀爬、磨爪、休息需求',
    price: 199,
    originPrice: 299,
    sales: 234,
    badge: '',
    image: '/pages/static/image/tree1.png',
    specs: ['基础款', '豪华款', '旗舰款'],
    images: [
      '/pages/static/image/tree1.png',
      '/pages/static/image/tree2.png'
    ],
    detailImages: [
      '/pages/static/image/tree3.png',
      '/pages/static/image/tree4.png'
    ],
    rating: 4.7,
    reviewCount: 34,
    stock: 50,
    reviews: [
      { userName: '多猫家庭', rating: 5, time: '2024-12-06', content: '质量很好，三只猫都爱爬，特别结实稳定。', images: ['/pages/static/image/tree5.png'] }
    ]
  },
  {
    id: 9,
    name: '狗狗磨牙棒',
    category: '零食',
    desc: '天然牛骨制作，清洁牙齿，缓解磨牙期不适',
    price: 18,
    originPrice: 25,
    sales: 4567,
    badge: '爆款',
    image: '/pages/static/image/bone1.png',
    specs: ['小号', '中号', '大号'],
    images: [
      '/pages/static/image/bone1.png',
      '/pages/static/image/bone2.png'
    ],
    detailImages: [
      '/pages/static/image/bone3.png',
      '/pages/static/image/bone4.png'
    ],
    rating: 4.5,
    reviewCount: 345,
    stock: 800,
    reviews: [
      { userName: '金毛多多', rating: 5, time: '2024-12-05', content: '磨牙效果很好，狗狗爱啃，一根能啃好久。', images: ['/pages/static/image/bone5.png'] }
    ]
  }
]

// 对原始数据进行规格增强
const goodsData = ref(rawGoodsData.map(goods => ({
  ...goods,
  specs: enhanceSpecs(goods.specs, goods.price, goods.originPrice, goods.stock || 999)
})))

const getGoodsList = () => goodsData.value
const getGoodsById = (id) => {
  const numId = Number(id)
  return goodsData.value.find(item => item.id === numId) || null
}
const getGoodsSpecs = (id) => {
  const goods = getGoodsById(id)
  return goods ? goods.specs : []
}

// ========== 生命周期 ==========
onLaunch(() => {
  console.log('🚀 App Launch 开始...')
  
  const app = getApp()
  if (app) {
    app.globalData = {
      userInfo,
      updateUserInfo,
      cartList,
      cartTotalCount,
      addToCart,
      removeFromCart,
      clearCart,
      getCartList,
      getCartTotalCount,
      goodsData,
      getGoodsList,
      getGoodsById,
      getGoodsSpecs,
      adoptApplications,
      addAdoptApplication,
      updateAdoptApplication,
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
    }
    
    console.log('✅ globalData 已挂载')
    console.log('📦 商品数量:', goodsData.value.length)
    console.log('🛒 购物车商品数:', cartList.value.length)
  }
  
  // #ifdef H5
  setTimeout(() => {
    bindMidButtonEvent()
  }, 600)
  // #endif
})

onShow(() => {
  console.log('App Show')
  // #ifdef H5
  bindMidButtonEvent()
  // #endif
})

onHide(() => {
  console.log('App Hide')
})

// ========== H5 tabbar中间按钮劫持 ==========
function bindMidButtonEvent() {
  let midBtn = document.querySelector('.uni-tabbar__item--mid')
  if (!midBtn) {
    const items = document.querySelectorAll('.uni-tabbar__item')
    for (const item of items) {
      if (item.getAttribute('data-pagepath') === '/pages/mall/mall') {
        midBtn = item
        break
      }
    }
  }
  if (!midBtn) return
  midBtn.removeEventListener('click', handleMidButtonClick)
  midBtn.addEventListener('click', handleMidButtonClick)
}

function handleMidButtonClick(e) {
  e.stopPropagation()
  e.preventDefault()
  uni.switchTab({
    url: '/pages/mall/mall',
    success() {
      console.log('✅ 跳转商城成功')
    },
    fail(err) {
      console.error('❌ switchTab 失败', err)
    }
  })
}
</script>

<style lang="scss">
page {
  background-color: #FFF9EF;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.page-container {
  padding: 0 32rpx;
  padding-top: var(--status-bar-height);
  box-sizing: border-box;
  min-height: 100vh;
}
view, text, image {
  box-sizing: border-box;
}
</style>