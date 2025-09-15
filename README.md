# 增强版HID鼠标参数配置工具

基于Vue3 + TypeScript的专业级HID鼠标设备配置工具，支持WebHID API的鼠标设备。

## 🚀 技术栈

- **前端框架**: Vue 3 + Composition API
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI框架**: Element Plus + TailwindCSS
- **路由**: Vue Router 4
- **工具链**: ESLint + Prettier

## 📦 项目结构

```
hidmouse/
├── src/
│   ├── assets/                  # 静态资源
│   │   └── styles/              # 样式文件
│   ├── components/             # 组件
│   │   ├── DeviceConnection.vue # 设备连接组件
│   │   ├── ConfigurationPanel.vue # 配置面板组件
│   │   ├── BasicSettings.vue    # 基本设置组件
│   │   ├── AdvancedSettings.vue # 高级设置组件
│   │   └── MacroSettings.vue    # 宏设置组件
│   ├── composables/             # 组合式函数
│   │   ├── useHIDDevice.ts      # HID设备管理
│   │   └── useMacroRecorder.ts   # 宏录制功能
│   ├── stores/                  # 状态管理
│   │   └── app.ts              # 主应用状态
│   ├── types/                   # 类型定义
│   │   └── index.ts            # 类型声明
│   ├── utils/                   # 工具函数
│   │   └── hid.ts              # HID相关工具
│   ├── views/                   # 页面组件
│   │   ├── HomeView.vue        # 主页面
│   │   └── AboutView.vue       # 关于页面
│   ├── App.vue                  # 根组件
│   ├── main.ts                  # 入口文件
│   └── router/                  # 路由配置
│       └── index.ts
├── public/                      # 公共资源
├── index.html                   # HTML模板
├── package.json                 # 项目配置
├── vite.config.ts              # Vite配置
├── tsconfig.json               # TypeScript配置
├── tailwind.config.js          # Tailwind配置
└── .gitignore                  # Git忽略文件
```

## 🛠️ 安装和运行

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安装依赖
```bash
npm install
# 或
yarn install
```

### 开发模式
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

### 代码检查
```bash
npm run lint
# 或
yarn lint
```

### 类型检查
```bash
npm run type-check
# 或
yarn type-check
```

## 🔧 核心功能

### 1. 设备连接管理
- 自动检测WebHID API支持
- 设备连接和断开
- 实时状态监控
- 设备信息显示

### 2. 参数配置
- CPI设置（400-16000）
- 按键映射配置
- 双击速度调节
- 滚轮速度设置
- 回报率配置（125/250/500/1000Hz）
- 传感器设置
- 灯光控制

### 3. 宏录制功能
- 实时宏录制
- 鼠标和键盘事件记录
- 宏编辑和管理
- 宏绑定到按键
- 本地存储支持

### 4. 设备诊断
- 设备信息检测
- 报告ID测试
- 兼容性分析

## 📱 浏览器兼容性

- ✅ Chrome 89+
- ✅ Edge 89+
- ✅ Opera 75+
- ❌ Safari
- ❌ Firefox
- ❌ Internet Explorer

## 🔐 安全考虑

- 仅在安全上下文（HTTPS或localhost）中运行
- 需要用户明确授权设备访问
- 不存储敏感信息
- 遵循WebHID API安全最佳实践

## 🎨 设计特色

- 响应式设计，支持移动设备
- 现代化UI界面
- 深色/浅色主题支持
- 流畅的动画效果
- 专业的视觉层次

## 📊 性能优化

- 组件懒加载
- 路由代码分割
- 资源压缩优化
- 缓存策略
- Tree-shaking支持

## 🔧 开发指南

### 添加新功能
1. 在 `src/types/index.ts` 中定义类型
2. 在 `src/stores/app.ts` 中添加状态管理
3. 在 `src/components/` 中创建组件
4. 在 `src/composables/` 中创建组合式函数
5. 在 `src/utils/` 中添加工具函数

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用组合式API（Composition API）
- 组件使用PascalCase命名
- 文件使用kebab-case命名

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式化
- refactor: 代码重构
- test: 测试相关
- chore: 构建工具或依赖管理

## 🤝 贡献指南

1. Fork本仓库
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建Pull Request

## 📄 许可证

MIT License

## 🆘 技术支持

如有问题，请提交Issue或联系开发团队。

---

**注意**: 本工具需要支持WebHID API的鼠标设备。不同厂商的鼠标可能使用不同的通信协议，请根据具体设备规格进行适配。