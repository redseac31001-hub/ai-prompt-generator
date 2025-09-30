<template>
  <div class="prompt-preview">
    <div class="preview-header">
      <div class="header-left">
        <h2>提示词预览</h2>
        <div class="preview-stats">
          <el-tag type="info" size="small">字符数: {{ generatedPrompt.length }}</el-tag>
          <el-tag type="success" size="small">词数: {{ wordCount }}</el-tag>
        </div>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          :icon="DocumentCopy"
          @click="copyToClipboard"
          class="action-btn"
        >
          复制提示词
        </el-button>
        <el-button
          :type="isMarkdownView ? 'primary' : 'default'"
          :icon="View"
          @click="toggleView"
          class="action-btn"
        >
          {{ isMarkdownView ? '源码视图' : 'Markdown视图' }}
        </el-button>
      </div>
    </div>

    <el-divider style="margin: 15px 0;" />

    <!-- 预览模式 -->
    <!-- Markdown 渲染视图 -->
    <div v-if="isMarkdownView" class="markdown-preview" v-html="renderedMarkdown"></div>

    <!-- 源码视图 -->
    <div v-else class="source-preview">
      <pre><code>{{ generatedPrompt }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { DocumentCopy, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { PromptConfig } from '../types/prompt'

const props = defineProps<{
  config: PromptConfig
}>()

const isMarkdownView = ref(true)

// 生成提示词
const generatedPrompt = computed(() => {
  const sections: string[] = []

  // 角色设定
  if (props.config.role) {
    let roleDescription = `你是一个${props.config.role}。`
    
    // 如果有技术栈信息，添加到角色描述中
    if (props.config.techStack && props.config.techStack.length > 0) {
      roleDescription += ` 你精通以下技术栈：${props.config.techStack.join('、')}。`
    }
    
    sections.push(`## 角色设定\n${roleDescription}`)
  }

  // 任务描述
  if (props.config.task) {
    sections.push(`## 任务描述\n${props.config.task}`)
  }

  // 上下文背景
  if (props.config.context) {
    sections.push(`## 上下文背景\n${props.config.context}`)
  }

  // 输出要求
  const requirements: string[] = []
  if (props.config.style) {
    const styleMap: Record<string, string> = {
      'professional': '专业正式',
      'friendly': '友好亲切',
      'concise': '简洁明了',
      'detailed': '详细全面',
      'creative': '创意生动',
      'technical': '技术性强'
    }
    requirements.push(`- 输出风格：${styleMap[props.config.style] || props.config.style}`)
  }

  if (props.config.format) {
    const formatMap: Record<string, string> = {
      'text': '纯文本格式',
      'markdown': 'Markdown格式',
      'list': '列表形式',
      'table': '表格形式',
      'json': 'JSON格式',
      'code': '代码块格式'
    }
    requirements.push(`- 输出格式：${formatMap[props.config.format] || props.config.format}`)
  }

  if (requirements.length > 0) {
    sections.push(`## 输出要求\n${requirements.join('\n')}`)
  }

  // 约束条件
  if (props.config.constraints) {
    sections.push(`## 约束条件\n${props.config.constraints}`)
  }

  // 示例
  if (props.config.examples) {
    sections.push(`## 示例\n${props.config.examples}`)
  }

  // 需求信息
  if (props.config.projectType || props.config.complexity || props.config.requirements) {
    const requirementSections: string[] = []
    
    if (props.config.projectType) {
      const projectTypeMap: Record<string, string> = {
        'web-app': 'Web应用',
        'mobile-app': '移动应用',
        'desktop-app': '桌面应用',
        'api-service': 'API服务',
        'microservice': '微服务架构',
        'data-platform': '数据平台',
        'ai-ml': 'AI/ML项目',
        'blockchain': '区块链应用',
        'iot': 'IoT项目',
        'game': '游戏开发'
      }
      requirementSections.push(`- 项目类型：${projectTypeMap[props.config.projectType] || props.config.projectType}`)
    }
    
    if (props.config.complexity) {
      const complexityMap: Record<string, string> = {
        'simple': '简单项目',
        'medium': '中等复杂度',
        'complex': '复杂项目',
        'enterprise': '企业级项目',
        'high-concurrency': '高并发系统',
        'distributed': '分布式系统'
      }
      requirementSections.push(`- 项目复杂度：${complexityMap[props.config.complexity] || props.config.complexity}`)
    }
    
    if (props.config.requirements) {
      requirementSections.push(`- 详细需求：${props.config.requirements}`)
    }
    
    if (requirementSections.length > 0) {
      sections.push(`## 需求信息\n${requirementSections.join('\n')}`)
    }
  }

  // 技术规格
  if (props.config.performance || props.config.architecture || props.config.testing || 
      props.config.deployment || props.config.security || props.config.scalability) {
    const techSections: string[] = []
    
    if (props.config.performance) {
      const performanceMap: Record<string, string> = {
        'basic': '基础性能',
        'medium': '中等性能',
        'high': '高性能',
        'extreme': '极致性能',
        'realtime': '实时响应',
        'massive-concurrency': '大规模并发'
      }
      techSections.push(`- 性能要求：${performanceMap[props.config.performance] || props.config.performance}`)
    }
    
    if (props.config.architecture) {
      techSections.push(`- 架构设计：${props.config.architecture}`)
    }
    
    if (props.config.testing) {
      const testingMap: Record<string, string> = {
        'unit-test': '单元测试',
        'integration-test': '集成测试',
        'e2e-test': '端到端测试',
        'performance-test': '性能测试',
        'security-test': '安全测试',
        'automated-test': '自动化测试',
        'tdd': 'TDD开发',
        'bdd': 'BDD开发'
      }
      techSections.push(`- 测试策略：${testingMap[props.config.testing] || props.config.testing}`)
    }
    
    if (props.config.deployment) {
      const deploymentMap: Record<string, string> = {
        'local': '本地开发',
        'testing': '测试环境',
        'staging': '预生产环境',
        'production': '生产环境',
        'cloud': '云服务器',
        'container': '容器化部署',
        'k8s': 'Kubernetes',
        'serverless': 'Serverless'
      }
      techSections.push(`- 部署环境：${deploymentMap[props.config.deployment] || props.config.deployment}`)
    }
    
    if (props.config.security) {
      techSections.push(`- 安全要求：${props.config.security}`)
    }
    
    if (props.config.scalability) {
      techSections.push(`- 扩展性要求：${props.config.scalability}`)
    }
    
    if (techSections.length > 0) {
      sections.push(`## 技术规格\n${techSections.join('\n')}`)
    }
  }

  // 自定义字段
  if (props.config.customFields.length > 0) {
    const customSections = props.config.customFields
      .filter(field => field.value.trim())
      .map(field => `## ${field.label}\n${field.value}`)
    
    sections.push(...customSections)
  }

  return sections.join('\n\n')
})

// 渲染Markdown
const renderedMarkdown = computed(() => {
  if (!generatedPrompt.value) return '<p>请在左侧配置面板中填写提示词信息...</p>'
  
  try {
    return marked(generatedPrompt.value, {
      breaks: true,
      gfm: true
    })
  } catch (error) {
    console.error('Markdown渲染错误:', error)
    return `<p>Markdown渲染错误</p><pre>${generatedPrompt.value}</pre>`
  }
})

// 计算词数
const wordCount = computed(() => {
  return generatedPrompt.value.replace(/\s+/g, ' ').trim().split(' ').length
})

// 切换视图
const toggleView = () => {
  isMarkdownView.value = !isMarkdownView.value
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value)
    ElMessage.success('提示词已复制到剪贴板！')
  } catch (error) {
    console.error('复制失败:', error)
    // 降级处理
    const textArea = document.createElement('textarea')
    textArea.value = generatedPrompt.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    ElMessage.success('提示词已复制到剪贴板！')
  }
}



// 监听配置变化，自动滚动到顶部
watch(() => props.config, () => {
  // 可以在这里添加一些动画效果
}, { deep: true })
</script>

<style scoped>
.prompt-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.preview-stats {
  display: flex;
  gap: 8px;
  align-items: center;
}

.preview-stats .el-tag {
  font-size: 12px;
  padding: 4px 8px;
  height: auto;
  border-radius: 6px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-btn {
  font-size: 14px;
  padding: 8px 16px;
  height: auto;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn.el-button--primary {
  background: #6366f1;
  border-color: #6366f1;
}

.action-btn.el-button--primary:hover {
  background: #5b21b6;
  border-color: #5b21b6;
}

.markdown-preview {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  line-height: 1.7;
  font-size: 14px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  position: relative;
}

.markdown-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 12px 12px 0 0;
}

.source-preview {
  flex: 1;
  overflow-y: auto;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
  position: relative;
}

.source-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 12px 12px 0 0;
}



.source-preview pre {
  margin: 0;
  padding: 20px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: #374151;
}

/* Markdown样式优化 */
.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  color: #303133;
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 600;
}

.markdown-preview :deep(h1) {
  font-size: 18px;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 6px;
}

.markdown-preview :deep(h2) {
  font-size: 16px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 4px;
}

.markdown-preview :deep(h3) {
  font-size: 14px;
}

.markdown-preview :deep(p) {
  margin: 8px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
  margin: 8px 0;
  padding-left: 16px;
}

.markdown-preview :deep(li) {
  margin: 4px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.markdown-preview :deep(code) {
  background-color: #f0f2f5;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #e6a23c;
}

.markdown-preview :deep(pre) {
  background-color: #f0f2f5;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid #e4e7ed;
}

.markdown-preview :deep(pre code) {
  background: none;
  padding: 0;
  color: #303133;
  font-size: 12px;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #409EFF;
  padding-left: 12px;
  margin: 12px 0;
  color: #909399;
  font-style: italic;
}

.markdown-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.markdown-preview :deep(table th),
.markdown-preview :deep(table td) {
  border: 1px solid #e4e7ed;
  padding: 8px 12px;
  text-align: left;
}

.markdown-preview :deep(table th) {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
}

.markdown-preview :deep(table td) {
  color: #606266;
}

/* 优化链接样式 */
.markdown-preview :deep(a) {
  color: #409EFF;
  text-decoration: none;
}

.markdown-preview :deep(a:hover) {
  text-decoration: underline;
}

/* 优化强调样式 */
.markdown-preview :deep(strong) {
  font-weight: 600;
  color: #303133;
}

.markdown-preview :deep(em) {
  font-style: italic;
  color: #606266;
}
</style>
