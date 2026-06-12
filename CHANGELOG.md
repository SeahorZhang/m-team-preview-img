# CHANGELOG

## [Unreleased]

### Fixed
- 修复 Vite 8 兼容性问题：单独安装 `esbuild` 依赖，避免 `transformWithEsbuild` 缺失导致构建失败。

### Changed
- 优化 `src/main.js` 启动流程，确保页面进入后自动初始化图片预览功能：
  - 添加 `runWhenReady()`，在 DOM 已就绪时自动执行初始化。
  - 调用 `initDirectImagePreview()` 之前先同步 `localStorage` 中的 `image-preview-enabled` 开关状态。
  - 使用 `createPreviewElement()` 延迟创建预览元素，避免无用 DOM 变更。
  - 增加 `bindEvents()` 和 `unbindEvents()` 的防重复绑定与清理逻辑，保障脚本多次刷新或重载时行为稳定。
  - 仅在预览开关启用时绑定 `mouseover` / `mouseout` / `resize` / `scroll` 事件，并在离开时正确隐藏预览图。
  - 强化 `renderPreview()`：按页面视窗、目标图片位置和最大比例动态计算预览尺寸，保证大图预览不会超出屏幕范围。
  - 保留 `reinitDirectImagePreview()`，支持外部重新加载时重新同步开关并重新初始化预览逻辑。
