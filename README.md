<p align="center">
  <img src="https://img.shields.io/npm/v/wedux-ui?color=a1b858&label=npm" alt="npm version" />
  <img src="https://img.shields.io/npm/l/wedux-ui?color=50a36f" alt="license" />
  <img src="https://img.shields.io/badge/platform-wechat--miniprogram-07c160" alt="platform" />
</p>

<h1 align="center">wedux-ui</h1>

<p align="center">轻量、可定制的微信小程序原生组件库</p>

<p align="center">
  零依赖 · CSS 变量主题 · 深色模式 · 50+ 组件
</p>

---

## 特性

- **零依赖** — 纯原生小程序，无 npm 运行时依赖
- **主题定制** — 基于 CSS 变量的 Design Token 体系，支持组件级覆盖
- **深色模式** — 内置 light / dark 预设，跟随系统或手动切换
- **按需引用** — 只注册用到的组件，不增加包体积
- **表单驱动** — 完整的 Form / FormItem 校验体系，统一表单组件行为

## 安装

```bash
npm install wedux-ui
```

安装后在**微信开发者工具**中点击 **工具 → 构建 npm**，等待构建完成即可使用。

## 快速上手

在页面或组件的 `.json` 中注册：

```json
{
  "usingComponents": {
    "w-button": "wedux-ui/components/button/button",
    "w-input": "wedux-ui/components/input/input"
  }
}
```

在 `.wxml` 中使用：

```html
<w-button type="primary" bind:tap="onTap">提交</w-button>
<w-input placeholder="请输入" bind:change="onChange" />
```

## 组件一览

### 通用

| 组件        | 说明             |
| ----------- | ---------------- |
| Button      | 按钮             |
| ButtonGroup | 按钮组           |
| FloatButton | 浮动按钮         |
| Icon        | 图标（iconfont） |

### 布局

| 组件    | 说明                                          |
| ------- | --------------------------------------------- |
| Flex    | 弹性布局                                      |
| Layout  | 页面布局（Header / Content / Footer / Sider） |
| Divider | 分割线                                        |

### 数据展示

| 组件                 | 说明          |
| -------------------- | ------------- |
| Avatar / AvatarGroup | 头像 / 头像组 |
| Badge                | 徽标          |
| Card                 | 卡片          |
| Ellipsis             | 文本省略      |
| GradientText         | 渐变文字      |
| H                    | 标题          |
| Highlight            | 文本高亮      |
| List / ListItem      | 列表          |
| NumberAnimation      | 数字动画      |
| QrCode               | 二维码        |
| Tag                  | 标签          |
| Watermark            | 水印          |
| Tree                 | 树形控件      |

### 数据录入

| 组件                     | 说明          |
| ------------------------ | ------------- |
| Form / FormItem          | 表单 / 表单项 |
| Input                    | 输入框        |
| Textarea                 | 多行输入      |
| InputOtp                 | 验证码输入    |
| Select                   | 选择器        |
| Switch                   | 开关          |
| Radio / RadioGroup       | 单选          |
| Checkbox / CheckboxGroup | 多选          |
| Rate                     | 评分          |
| Stepper                  | 步进器        |
| DatePicker               | 日期选择      |
| TimePicker               | 时间选择      |
| Calendar                 | 日历          |
| ColorPicker              | 颜色选择      |
| TreeSelect               | 树选择        |
| Upload                   | 上传          |

### 导航

| 组件          | 说明         |
| ------------- | ------------ |
| NavigationBar | 自定义导航栏 |
| TabBar        | 标签栏       |
| BackTop       | 回到顶部     |

### 反馈

| 组件           | 说明     |
| -------------- | -------- |
| Drawer         | 抽屉     |
| Popover        | 弹出气泡 |
| Tooltip        | 文字提示 |
| InfiniteScroll | 无限滚动 |

### 主题

| 组件          | 说明           |
| ------------- | -------------- |
| ThemeProvider | 主题配置提供者 |

## 主题定制

通过 `ThemeProvider` 组件覆盖设计变量：

```html
<w-theme-provider theme="{{theme}}">
  <w-button type="primary">自定义主题</w-button>
</w-theme-provider>
```

```js
const { lightTheme } = require('wedux-ui/components/theme-provider/presets');

Page({
  data: {
    theme: {
      ...lightTheme,
      '--w-primary-color': '#8b5cf6',
    },
  },
});
```

也可以通过组件级 CSS 变量精确控制单个组件：

```css
page {
  --w-btn-height: 44px;
  --w-btn-radius: 12px;
  --w-input-radius: 8px;
}
```

## 开发

```bash
# 安装依赖
pnpm install

# 格式化代码
pnpm format

# 构建 npm 产物
pnpm build
```

使用**微信开发者工具**打开项目根目录即可预览 Demo。

## 协议

[MIT](./LICENSE)
