// ==UserScript==
// @name         M-Team 新版列表大图预览
// @namespace    m-team-preview-img
// @version      1.0.2
// @author       Seahor
// @description  为 M-Team 新版添加列表大图预览功能
// @license      https://github.com/SeahorZhang/m-team-preview-img
// @icon         https://next.m-team.cc/favicon.ico
// @match        *.m-team.*
// ==/UserScript==
// https://greasyfork.org/zh-CN/scripts/564785-m-team-%E6%96%B0%E7%89%88%E5%88%97%E8%A1%A8%E5%A4%A7%E5%9B%BE%E9%A2%84%E8%A7%88

(function () {
  // 检查是否启用了图片预览功能
  // const isImagePreviewEnabled = () => localStorage.getItem("image-preview-enabled") !== "false";

  // 预览图片DOM
  let previewElement = null;

  // 用来存储鼠标移入和移出事件监听器
  let currentMouseoverListener = null;
  let currentMouseoutListener = null;
  let maskElementDom = null;

  function init() {
    // if (!isImagePreviewEnabled()) return; // 如果未启用预览功能则退出
    createPreviewElement(); // 创建预览元素
    addEventListeners(); // 绑定事件监听器
  }

  // 创建预览图片元素
  function createPreviewElement() {
    previewElement = document.createElement("img");
    previewElement.style.cssText = `
    position: fixed;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    object-fit: contain;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease;
    display: none;
    background-color: #fff;
  `;
    document.body.appendChild(previewElement);
  }

  // 计算并显示图片预览
  function showPreview(img) {
    const rect = img.getBoundingClientRect();
    const spacing = 35; // 距离
    const previewLeft = rect.right + spacing;
    const previewTop = rect.top + rect.height / 2;

    const defaultWidth = img.naturalWidth || img.width;
    const defaultHeight = img.naturalHeight || img.height;

    const availableWidth = window.innerWidth - previewLeft - 20; // 可用宽度
    const availableHeight = window.innerHeight * 0.7; // 可用高度

    let displayWidth = defaultWidth;
    let displayHeight = defaultHeight;

    // 计算预览图片的实际尺寸，先根据高度，再根据宽度
    if (displayHeight > availableHeight) {
      displayHeight = availableHeight;
      displayWidth = (displayWidth * availableHeight) / defaultHeight;
    }

    if (displayWidth > availableWidth) {
      displayWidth = availableWidth;
      displayHeight = (displayHeight * availableWidth) / defaultWidth;
    }

    // 最终的位置和大小调整
    let finalTop = previewTop - displayHeight / 2;
    finalTop = Math.max(finalTop, 10); // 防止超出上边界
    if (finalTop + displayHeight > window.innerHeight - 30) {
      finalTop = window.innerHeight - displayHeight - 30; // 防止超出下边界
    }

    // 设置预览图片样式
    previewElement.style.left = `${previewLeft}px`;
    previewElement.style.top = `${finalTop}px`;
    previewElement.style.width = `${displayWidth}px`;
    previewElement.style.height = `${displayHeight}px`;
    previewElement.style.display = "block";
    previewElement.style.opacity = "1";

    // 绑定鼠标移出事件
    currentMouseoutListener = () => {
      previewElement.style.display = "none"; // 隐藏预览
      maskElementDom.removeEventListener("mouseout", currentMouseoutListener); // 移除事件监听器
    };
    maskElementDom.addEventListener("mouseout", currentMouseoutListener);
  }

  // 添加事件监听器
  function addEventListeners() {
    // 监听鼠标移入
    currentMouseoverListener = (e) => {
      const maskElement = e.target.closest(".ant-image-mask");
      if (!maskElement) return; // 如果不在目标区域，则不处理
      maskElementDom = maskElement;

      const imgDom = maskElement
        .closest(".ant-image")
        .querySelector("img.ant-image-img");
      if (imgDom) {
        previewElement.src = imgDom.src;
        showPreview(imgDom);
      }
    };

    document.addEventListener("mouseover", currentMouseoverListener);
  }

  // 在页面加载完成后执行
  document.addEventListener("DOMContentLoaded", init);

  // 在页面卸载时清理事件监听器
  window.addEventListener("beforeunload", () => {
    if (currentMouseoverListener) {
      document.removeEventListener("mouseover", currentMouseoverListener); // 移除mouseover监听器
    }
    if (currentMouseoutListener) {
      previewElement.removeEventListener("mouseout", currentMouseoutListener); // 移除mouseout监听器
    }
  });
})();
