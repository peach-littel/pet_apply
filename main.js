import { createSSRApp } from 'vue'
import App from './App.vue'
import { userStore } from './store/index.js'

export function createApp() {
	const app = createSSRApp(App)
	// 初始化用户登录状态
	userStore.init()
	return { app }
}