<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 顶部导航栏 -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="header-left">
            <div class="logo">
              <el-icon class="logo-icon"><Star /></el-icon>
              <span class="logo-text">AI Prompt Generator</span>
            </div>
          </div>
          <div class="header-right">
            <el-button type="text" class="header-btn" @click="showHelp = true">
              <el-icon><QuestionFilled /></el-icon>
              帮助
            </el-button>
            <el-button type="text" class="header-btn" @click="showSettings = true">
              <el-icon><Setting /></el-icon>
              设置
            </el-button>
          </div>
        </div>
      </el-header>
      
      <el-container class="main-container">
        <!-- 左侧配置面板 -->
        <el-aside class="config-panel">
          <PromptConfig @update="handleConfigUpdate" />
        </el-aside>
        
        <!-- 右侧预览面板 -->
        <el-main class="preview-panel">
          <PromptPreview :config="promptConfig" />
        </el-main>
      </el-container>
    </el-container>

    <!-- 帮助对话框 -->
    <el-dialog v-model="showHelp" title="使用指南" width="600px" :close-on-click-modal="false">
      <div class="help-content">
        <h3>🎯 快速开始</h3>
        <ol>
          <li><strong>选择角色分类</strong> - 从代码开发、内容创作等分类中选择</li>
          <li><strong>选择具体角色</strong> - 如前端开发工程师、写作助手等</li>
          <li><strong>选择技术栈</strong> - 当前端开发时，选择相关技术栈</li>
          <li><strong>填写任务描述</strong> - 详细描述你要完成的任务</li>
          <li><strong>配置其他选项</strong> - 输出风格、格式、约束条件等</li>
          <li><strong>查看预览</strong> - 右侧实时预览生成的提示词</li>
        </ol>

        <h3>🔧 高级功能</h3>
        <ul>
          <li><strong>需求信息</strong> - 项目类型、复杂度、详细需求描述</li>
          <li><strong>技术规格</strong> - 性能要求、架构设计、测试策略等</li>
          <li><strong>自定义字段</strong> - 添加项目特定的配置项</li>
          <li><strong>预设模板</strong> - 快速加载常用场景配置</li>
        </ul>

        <h3>💡 使用技巧</h3>
        <ul>
          <li>详细描述任务背景，AI能更好地理解需求</li>
          <li>选择合适的技术栈，生成更精准的提示词</li>
          <li>使用约束条件限制输出范围，提高准确性</li>
          <li>保存常用配置为自定义字段，提高效率</li>
        </ul>

        <h3>📋 预设模板</h3>
        <ul>
          <li><strong>Vue3问卷系统</strong> - 完整的前端项目开发模板</li>
          <li><strong>React管理系统</strong> - 企业级后台管理系统模板</li>
          <li><strong>写作助手</strong> - 内容创作和文章写作模板</li>
        </ul>
      </div>
      <template #footer>
        <el-button @click="showHelp = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 设置对话框 -->
    <el-dialog v-model="showSettings" title="个性化设置" width="500px" :close-on-click-modal="false">
      <div class="settings-content">
        <el-form :model="settings" label-width="120px">
          <el-form-item label="主题模式">
            <el-radio-group v-model="settings.theme">
              <el-radio label="light">浅色模式</el-radio>
              <el-radio label="dark">深色模式</el-radio>
              <el-radio label="auto">跟随系统</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="字体大小">
            <el-slider v-model="settings.fontSize" :min="12" :max="18" :step="1" show-input />
          </el-form-item>

          <el-form-item label="自动保存">
            <el-switch v-model="settings.autoSave" />
            <span class="setting-desc">自动保存配置到本地存储</span>
          </el-form-item>

          <el-form-item label="默认视图">
            <el-radio-group v-model="settings.defaultView">
              <el-radio label="markdown">Markdown视图</el-radio>
              <el-radio label="source">源码视图</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="显示统计">
            <el-switch v-model="settings.showStats" />
            <span class="setting-desc">在预览区域显示字符数和词数统计</span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Star, QuestionFilled, Setting } from '@element-plus/icons-vue'
import PromptConfig from './components/PromptConfig.vue'
import PromptPreview from './components/PromptPreview.vue'
import type { PromptConfig as PromptConfigType } from './types/prompt'

const promptConfig = ref<PromptConfigType>({
  role: '',
  roleCategory: '',
  techStack: [],
  task: '',
  context: '',
  style: '',
  format: '',
  examples: '',
  constraints: '',
  customFields: [],
  // 新增技术性字段
  projectType: '',
  complexity: '',
  requirements: '',
  performance: '',
  architecture: '',
  testing: '',
  deployment: '',
  security: '',
  scalability: ''
})

// 对话框状态
const showHelp = ref(false)
const showSettings = ref(false)

// 设置数据
const settings = ref({
  theme: 'light',
  fontSize: 14,
  autoSave: true,
  defaultView: 'markdown',
  showStats: true
})

const handleConfigUpdate = (config: PromptConfigType) => {
  promptConfig.value = config
}

// 保存设置
const saveSettings = () => {
  // 保存到本地存储
  localStorage.setItem('ai-prompt-settings', JSON.stringify(settings.value))
  
  // 应用设置
  applySettings()
  
  showSettings.value = false
}

// 应用设置
const applySettings = () => {
  // 应用字体大小
  document.documentElement.style.fontSize = `${settings.value.fontSize}px`
  
  // 应用主题（这里只是示例，实际需要更复杂的主题切换逻辑）
  if (settings.value.theme === 'dark') {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
}

// 加载设置
const loadSettings = () => {
  const saved = localStorage.getItem('ai-prompt-settings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
    applySettings()
  }
}

// 初始化时加载设置
loadSettings()
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'SF Pro Display', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #1a1a1a;
  background: #fafafa;
}

body {
  margin: 0;
  padding: 0;
  font-size: 14px;
  background: #fafafa;
}

/* 应用容器 */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fafafa;
}

/* 顶部导航栏 */
.app-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 64px !important;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
  color: #1a1a1a;
}

.logo-icon {
  font-size: 20px;
  color: #6366f1;
}

.logo-text {
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-btn {
  color: #6b7280 !important;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: #f3f4f6 !important;
  color: #374151 !important;
}

/* 主容器 */
.main-container {
  flex: 1;
  overflow: hidden;
  background: #fafafa;
}

/* 配置面板 */
.config-panel {
  width: 420px !important;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  padding: 0;
  overflow-y: auto;
  box-shadow: 2px 0 8px 0 rgba(0, 0, 0, 0.08);
  position: relative;
}

.config-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
}

/* 预览面板 */
.preview-panel {
  background: #ffffff;
  padding: 24px;
  overflow-y: auto;
  margin: 0;
}

/* 全局组件样式优化 */
.el-form-item__label {
  font-size: 13px !important;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.el-input__inner,
.el-textarea__inner,
.el-select .el-input__inner {
  font-size: 14px !important;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.el-button {
  font-size: 14px !important;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--primary {
  background: #6366f1;
  border-color: #6366f1;
}

.el-button--primary:hover {
  background: #5b21b6;
  border-color: #5b21b6;
}

.el-tag {
  font-size: 12px !important;
  border-radius: 6px;
  font-weight: 500;
}

.el-divider__text {
  font-size: 13px !important;
  font-weight: 600;
  color: #6b7280;
}

/* 优化间距 */
.el-form-item {
  margin-bottom: 20px !important;
}

.el-divider {
  margin: 24px 0 !important;
}

/* 优化标题样式 */
h1, h2, h3 {
  font-weight: 600;
  color: #1a1a1a;
}

h1 {
  font-size: 24px !important;
}

h2 {
  font-size: 18px !important;
}

h3 {
  font-size: 16px !important;
}

/* 现代化滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 选择器下拉优化 */
.el-select-dropdown {
  border-radius: 12px !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  border: none !important;
  padding: 8px 0 !important;
  max-height: 300px !important;
  overflow-y: auto !important;
}

.el-select-dropdown__item {
  font-size: 14px !important;
  padding: 12px 16px !important;
  transition: all 0.2s ease !important;
  margin: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  line-height: 1.5 !important;
}

.el-select-dropdown__item:hover {
  background: #f8fafc !important;
  color: #1a1a1a !important;
}

.el-select-dropdown__item.selected {
  background: #6366f1 !important;
  color: white !important;
}

.el-select-dropdown__item.selected:hover {
  background: #5b21b6 !important;
  color: white !important;
}

/* 修复下拉框容器 */
.el-popper {
  border: none !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
  padding: 0 !important;
  margin: 0 !important;
}

.el-popper__arrow {
  display: none !important;
}

/* 修复所有下拉框的通用问题 */
.el-select-dropdown__wrap {
  max-height: 300px !important;
  overflow-y: auto !important;
  border: none !important;
  border-radius: 12px !important;
}

.el-select-dropdown__list {
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

/* 修复输入框边框问题 */
.el-input__inner {
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
}

.el-input__inner:focus {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

.el-textarea__inner {
  border: 1px solid #d1d5db !important;
  border-radius: 8px !important;
}

.el-textarea__inner:focus {
  border-color: #6366f1 !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1) !important;
}

/* 对话框优化 */
.el-dialog {
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.el-dialog__header {
  padding: 24px 24px 0;
}

.el-dialog__body {
  padding: 24px;
}

/* 卡片样式 */
.card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 帮助对话框样式 */
.help-content {
  line-height: 1.6;
}

.help-content h3 {
  color: #1a1a1a;
  margin: 20px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.help-content h3:first-child {
  margin-top: 0;
}

.help-content ol,
.help-content ul {
  margin: 8px 0;
  padding-left: 20px;
}

.help-content li {
  margin: 6px 0;
  color: #374151;
}

.help-content strong {
  color: #1a1a1a;
  font-weight: 600;
}

/* 设置对话框样式 */
.settings-content {
  padding: 8px 0;
}

.setting-desc {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
  color: #374151;
}

/* 深色主题支持 */
.dark-theme {
  background: #1a1a1a;
  color: #ffffff;
}

.dark-theme .app-header {
  background: #2d2d2d;
  border-bottom-color: #404040;
}

.dark-theme .config-panel,
.dark-theme .preview-panel {
  background: #2d2d2d;
  border-color: #404040;
}

.dark-theme .el-input__inner,
.dark-theme .el-textarea__inner {
  background: #3a3a3a;
  border-color: #555;
  color: #ffffff;
}

.dark-theme .el-button--text {
  color: #ffffff !important;
}

.dark-theme .el-button--text:hover {
  background: #404040 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-panel {
    width: 100% !important;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .main-container {
    flex-direction: column;
  }
  
  .header-content {
    padding: 0 16px;
  }
  
  .config-panel,
  .preview-panel {
    padding: 16px;
  }
  
  .help-content h3 {
    font-size: 15px;
  }
  
  .help-content li {
    font-size: 14px;
  }
}
</style>