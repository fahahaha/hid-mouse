# 本地部署指南

## 📋 环境要求

### 必需软件
- **Node.js**: 版本 >= 18.0.0
- **npm**: 版本 >= 9.0.0 (随Node.js安装)
- **Git**: 用于版本控制

### 推荐开发工具
- **VS Code**: 推荐的代码编辑器
- **Chrome/Edge**: 支持WebHID API的浏览器
- **Git Bash**: Windows命令行工具

## 🚀 快速开始

### 1. 检查环境

```bash
# 检查Node.js版本
node --version
# 需要显示版本号 >= 18.0.0

# 检查npm版本
npm --version
# 需要显示版本号 >= 9.0.0

# 检查Git版本
git --version
```

### 2. 项目安装

```bash
# 进入项目目录
cd hidmouse

# 安装依赖
npm install
```

### 3. 启动开发服务器

```bash
# 启动开发服务器
npm run dev
```

服务器将在 `http://localhost:3000` 启动

## 🔧 开发命令

### 开发环境
```bash
npm run dev          # 启动开发服务器
npm run preview      # 预览构建结果
```

### 代码检查
```bash
npm run lint         # 运行ESLint检查
npm run type-check   # 运行TypeScript类型检查
```

### 构建和部署
```bash
npm run build        # 构建生产版本
npm run preview      # 预览生产版本
```

## 📱 浏览器支持

### ✅ 支持的浏览器
- **Chrome 89+** - 完全支持WebHID API
- **Microsoft Edge 89+** - 完全支持WebHID API
- **Opera 75+** - 完全支持WebHID API

### ❌ 不支持的浏览器
- **Safari** - 不支持WebHID API
- **Firefox** - 不支持WebHID API
- **Internet Explorer** - 不支持现代Web API

## 🖱️ 设备要求

### 支持的设备
- 支持WebHID API的HID鼠标设备
- 可配置参数的游戏鼠标
- 支持自定义回报率的鼠标

### 设备测试
1. 连接鼠标设备
2. 打开支持的浏览器
3. 访问 `http://localhost:3000`
4. 点击"连接鼠标设备"
5. 授权设备访问权限

## ⚠️ 常见问题

### 1. Node.js版本问题
**问题**: `Node.js version too low`

**解决**:
```bash
# 下载并安装最新版Node.js
# 访问 https://nodejs.org/

# 或使用nvm管理Node.js版本
nvm install 18
nvm use 18
```

### 2. 依赖安装失败
**问题**: `npm install` 失败

**解决**:
```bash
# 清理npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 3. 端口占用
**问题**: `Port 3000 is already in use`

**解决**:
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（Windows）
taskkill /PID <进程ID> /F

# 或使用其他端口
npm run dev -- --port 3001
```

### 4. TypeScript错误
**问题**: 类型检查失败

**解决**:
```bash
# 安装缺少的类型
npm install --save-dev @types/node

# 重新生成类型声明
npm run type-check
```

### 5. WebHID API不可用
**问题**: 浏览器不支持WebHID API

**解决**:
- 使用Chrome或Edge浏览器
- 确保浏览器版本最新
- 在 `chrome://flags` 中启用实验性Web平台功能

### 6. 设备连接失败
**问题**: 无法连接鼠标设备

**解决**:
- 确保鼠标正确连接
- 检查设备是否支持WebHID API
- 尝试不同的USB端口
- 重启浏览器

## 🛠️ 开发环境配置

### VS Code推荐扩展
```json
{
  "recommendations": [
    "vue.volar",
    "vue.vscode-typescript-vue-plugin",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

### VS Code设置
```json
{
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 📊 性能优化

### 开发体验优化
```bash
# 启用热重载
# 默认已配置在vite.config.ts中

# 开发环境构建优化
# Vite自动处理模块热替换
```

### 生产环境优化
```bash
# 构建优化
npm run build

# 分析构建结果
npm install --save-dev rollup-plugin-visualizer
```

## 🔒 安全注意事项

### 开发环境
- 仅在 `localhost` 或 `https` 环境下运行
- WebHID API需要安全上下文
- 设备访问需要用户明确授权

### 生产环境
- 必须使用HTTPS
- 配置适当的安全头
- 实施设备访问控制

## 📝 开发工作流

### 1. 功能开发
```bash
# 创建新功能分支
git checkout -b feature/new-feature

# 开发代码
# 运行开发服务器
npm run dev

# 提交变更
git add .
git commit -m "feat: add new feature"
```

### 2. 代码检查
```bash
# 运行代码检查
npm run lint
npm run type-check

# 修复问题
npm run lint -- --fix
```

### 3. 测试
```bash
# 开发测试
npm run dev

# 生产构建测试
npm run build
npm run preview
```

## 🆘 故障排除

### 日志查看
```bash
# 查看开发服务器日志
npm run dev

# 查看构建日志
npm run build

# 查看类型错误
npm run type-check
```

### 调试工具
- **浏览器开发者工具**: F12
- **Vue DevTools**: 浏览器扩展
- **网络面板**: 检查API请求
- **控制台**: 查看错误信息

### 性能分析
```bash
# 安装分析工具
npm install --save-dev rollup-plugin-visualizer

# 构建分析
npm run build
```

## 📞 技术支持

### 获取帮助
1. 查看浏览器控制台错误信息
2. 检查网络连接
3. 确认设备兼容性
4. 查看项目Issue

### 反馈问题
- 提供错误信息复现步骤
- 包含浏览器和操作系统信息
- 提供设备型号和规格

---

**注意**: 本工具需要支持WebHID API的鼠标设备和兼容的浏览器才能正常运行。