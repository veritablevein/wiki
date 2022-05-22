export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				// 配置scss变量注入方便<style>使用
				additionalData: '@import "@/styles/variables.scss";'
			}
		}
	}
})