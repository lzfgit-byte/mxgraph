import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn'; // element中文
import App from '@/App.vue';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(ElementPlus, { locale }).mount('#app');
