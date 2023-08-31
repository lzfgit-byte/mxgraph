import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import locale from 'element-plus/dist/locale/zh-cn'; // element中文
import App from '@/App.vue';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(ElementPlus).mount('#app');
