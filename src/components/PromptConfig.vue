<template>
  <div class="prompt-config">
    <div class="config-header">
      <h2>配置面板</h2>
      <div class="config-actions">
        <el-button size="small" type="text" @click="toggleCollapse">
          <el-icon><component :is="isCollapsed ? 'ArrowDown' : 'ArrowUp'" /></el-icon>
          {{ isCollapsed ? '展开' : '收起' }}
        </el-button>
        <el-button size="small" type="text" @click="resetConfig">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
      </div>
    </div>
    
    <el-form :model="config" label-width="80px" label-position="top">
      <!-- 预设模板 - 置顶显示 -->
      <div class="template-section">
        <div class="template-header">
          <h3>🚀 快速开始</h3>
          <span class="template-desc">选择预设模板快速配置</span>
        </div>
        <div class="template-grid">
          <div 
            v-for="template in templates" 
            :key="template.id"
            class="template-card"
            :class="{ active: selectedTemplate === template.id }"
            @click="loadTemplate(template.id)"
          >
            <div class="template-icon">{{ getTemplateIcon(template.id) }}</div>
            <div class="template-info">
              <h4>{{ template.name }}</h4>
              <p>{{ template.description }}</p>
            </div>
            <div class="template-actions">
              <el-button size="small" type="primary" plain>使用</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 基础配置 - 始终显示 -->
      <div class="config-section">
        <div class="section-header" @click="toggleSection('basic')">
          <h3>基础配置</h3>
          <el-icon class="section-toggle">
            <component :is="expandedSections.basic ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>
        <div v-show="expandedSections.basic" class="section-content">
          <el-form-item label="角色分类">
            <el-select v-model="config.roleCategory" placeholder="选择角色分类" @change="onRoleCategoryChange">
              <el-option v-for="category in roleCategories" :key="category.value" :label="category.label" :value="category.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="具体角色">
            <el-select v-model="config.role" placeholder="选择或输入具体角色" filterable allow-create>
              <el-option v-for="role in filteredRoleOptions" :key="role" :label="role" :value="role" />
            </el-select>
          </el-form-item>

          <!-- 技术栈选择（仅当前端开发时显示） -->
          <el-form-item v-if="config.roleCategory === 'development'" label="技术栈">
            <el-select v-model="config.techStack" placeholder="选择技术栈" multiple>
              <el-option v-for="tech in frontendTechStack" :key="tech" :label="tech" :value="tech" />
            </el-select>
          </el-form-item>
        </div>
      </div>

      <!-- 任务配置 -->
      <div class="config-section">
        <div class="section-header" @click="toggleSection('task')">
          <h3>任务配置</h3>
          <el-icon class="section-toggle">
            <component :is="expandedSections.task ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>
        <div v-show="expandedSections.task" class="section-content">
          <el-form-item label="任务描述">
            <el-input
              v-model="config.task"
              type="textarea"
              :rows="3"
              placeholder="描述具体要完成的任务..."
            />
          </el-form-item>

          <el-form-item label="上下文背景">
            <el-input
              v-model="config.context"
              type="textarea"
              :rows="3"
              placeholder="提供相关背景信息..."
            />
          </el-form-item>

          <el-form-item label="输出风格">
            <el-select v-model="config.style" placeholder="选择输出风格">
              <el-option v-for="style in styleOptions" :key="style.value" :label="style.label" :value="style.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="输出格式">
            <el-select v-model="config.format" placeholder="选择输出格式">
              <el-option v-for="format in formatOptions" :key="format.value" :label="format.label" :value="format.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="示例">
            <el-input
              v-model="config.examples"
              type="textarea"
              :rows="3"
              placeholder="提供示例输入输出..."
            />
          </el-form-item>

          <el-form-item label="约束条件">
            <el-input
              v-model="config.constraints"
              type="textarea"
              :rows="2"
              placeholder="添加约束条件..."
            />
          </el-form-item>
        </div>
      </div>

      <!-- 需求信息 -->
      <div class="config-section">
        <div class="section-header" @click="toggleSection('requirements')">
          <h3>需求信息</h3>
          <el-icon class="section-toggle">
            <component :is="expandedSections.requirements ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>
        <div v-show="expandedSections.requirements" class="section-content">
          <el-form-item label="项目类型">
            <el-select v-model="config.projectType" placeholder="选择项目类型">
              <el-option v-for="type in projectTypes" :key="type.value" :label="type.label" :value="type.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="项目复杂度">
            <el-select v-model="config.complexity" placeholder="选择项目复杂度">
              <el-option v-for="complexity in complexityLevels" :key="complexity.value" :label="complexity.label" :value="complexity.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="详细需求">
            <el-input
              v-model="config.requirements"
              type="textarea"
              :rows="4"
              placeholder="描述具体的功能需求、业务逻辑、用户故事等..."
            />
          </el-form-item>
        </div>
      </div>

      <!-- 技术规格 -->
      <div class="config-section">
        <div class="section-header" @click="toggleSection('technical')">
          <h3>技术规格</h3>
          <el-icon class="section-toggle">
            <component :is="expandedSections.technical ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>
        <div v-show="expandedSections.technical" class="section-content">
          <el-form-item label="性能要求">
            <el-select v-model="config.performance" placeholder="选择性能要求">
              <el-option v-for="perf in performanceLevels" :key="perf.value" :label="perf.label" :value="perf.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="架构设计">
            <el-input
              v-model="config.architecture"
              type="textarea"
              :rows="3"
              placeholder="描述系统架构、模块设计、数据流等..."
            />
          </el-form-item>

          <el-form-item label="测试策略">
            <el-select v-model="config.testing" placeholder="选择测试策略">
              <el-option v-for="test in testingStrategies" :key="test.value" :label="test.label" :value="test.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="部署环境">
            <el-select v-model="config.deployment" placeholder="选择部署环境">
              <el-option v-for="env in deploymentEnvs" :key="env.value" :label="env.label" :value="env.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="安全要求">
            <el-input
              v-model="config.security"
              type="textarea"
              :rows="2"
              placeholder="描述安全要求、认证授权、数据保护等..."
            />
          </el-form-item>

          <el-form-item label="扩展性要求">
            <el-input
              v-model="config.scalability"
              type="textarea"
              :rows="2"
              placeholder="描述扩展性要求、并发处理、负载均衡等..."
            />
          </el-form-item>
        </div>
      </div>

      <!-- 自定义字段 -->
      <el-divider>自定义字段</el-divider>
      
      <div v-for="(field, index) in config.customFields" :key="field.id" class="custom-field">
        <el-form-item :label="field.label">
          <div style="display: flex; gap: 10px; align-items: center;">
            <el-input
              v-if="field.type === 'input'"
              v-model="field.value"
              :placeholder="`输入${field.label}...`"
              style="flex: 1;"
            />
            <el-input
              v-else-if="field.type === 'textarea'"
              v-model="field.value"
              type="textarea"
              :rows="2"
              :placeholder="`输入${field.label}...`"
              style="flex: 1;"
            />
            <el-select
              v-else-if="field.type === 'select'"
              v-model="field.value"
              :placeholder="`选择${field.label}...`"
              style="flex: 1;"
            >
              <el-option
                v-for="option in field.options"
                :key="option"
                :label="option"
                :value="option"
              />
            </el-select>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="removeCustomField(index)"
            />
          </div>
        </el-form-item>
      </div>

      <el-button
        type="primary"
        :icon="Plus"
        @click="showAddFieldDialog = true"
        style="width: 100%; margin-top: 10px;"
      >
        添加自定义字段
      </el-button>

    </el-form>

    <!-- 添加自定义字段对话框 -->
    <el-dialog v-model="showAddFieldDialog" title="添加自定义字段" width="400px">
      <el-form :model="newField" label-width="80px">
        <el-form-item label="字段名称">
          <el-input v-model="newField.label" placeholder="输入字段名称" />
        </el-form-item>
        <el-form-item label="字段类型">
          <el-select v-model="newField.type" placeholder="选择字段类型">
            <el-option label="单行输入" value="input" />
            <el-option label="多行输入" value="textarea" />
            <el-option label="下拉选择" value="select" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="newField.type === 'select'" label="选项">
          <el-input
            v-model="newFieldOptions"
            type="textarea"
            :rows="3"
            placeholder="每行一个选项"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddFieldDialog = false">取消</el-button>
        <el-button type="primary" @click="addCustomField">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { Plus, Delete, Refresh, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import type { PromptConfig, CustomField, PromptTemplate } from '../types/prompt'

const emit = defineEmits<{
  update: [config: PromptConfig]
}>()

const config = reactive<PromptConfig>({
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

const showAddFieldDialog = ref(false)
const selectedTemplate = ref('')
const isCollapsed = ref(false)

// 配置分组展开状态
const expandedSections = ref({
  basic: true,        // 基础配置默认展开
  task: false,        // 任务配置默认收起
  requirements: false, // 需求信息默认收起
  technical: false,   // 技术规格默认收起
  custom: false       // 自定义字段默认收起
})

const newField = reactive({
  label: '',
  type: 'input' as 'input' | 'textarea' | 'select'
})

const newFieldOptions = ref('')

// 角色分类选项
const roleCategories = [
  { label: '代码开发专家', value: 'development' },
  { label: '内容创作', value: 'content' },
  { label: '数据分析', value: 'data' },
  { label: '产品管理', value: 'product' },
  { label: '市场营销', value: 'marketing' },
  { label: '教育培训', value: 'education' },
  { label: '设计创意', value: 'design' }
]

// 各分类下的具体角色选项
const roleOptionsByCategory = {
  development: [
    '前端开发工程师',
    '后端开发工程师', 
    '全栈开发工程师',
    '移动端开发工程师',
    'DevOps工程师',
    '测试工程师',
    '架构师',
    '技术专家'
  ],
  content: [
    '专业写作助手',
    '内容策划师',
    '文案编辑',
    '技术文档专家'
  ],
  data: [
    '数据分析师',
    '数据科学家',
    '商业智能专家',
    '统计分析师'
  ],
  product: [
    '产品经理',
    '产品运营',
    '用户体验设计师',
    '产品策略师'
  ],
  marketing: [
    '市场营销专家',
    '品牌策划师',
    '数字营销专家',
    '社交媒体运营'
  ],
  education: [
    '教育导师',
    '培训师',
    '学习顾问',
    '知识管理专家'
  ],
  design: [
    'UI/UX设计师',
    '平面设计师',
    '创意总监',
    '视觉设计师'
  ]
}

// 前端技术栈选项
const frontendTechStack = [
  'Vue.js',
  'React',
  'Angular',
  'TypeScript',
  'JavaScript',
  'HTML5',
  'CSS3',
  'Sass/SCSS',
  'Less',
  'Tailwind CSS',
  'Bootstrap',
  'Element Plus',
  'Ant Design',
  'Vite',
  'Webpack',
  'Node.js',
  'Express',
  'Next.js',
  'Nuxt.js',
  'Vue Router',
  'Vuex/Pinia',
  'Redux',
  'MobX',
  'Jest',
  'Cypress',
  'ESLint',
  'Prettier'
]

// 计算当前分类下的角色选项
const filteredRoleOptions = computed(() => {
  if (!config.roleCategory) return []
  return roleOptionsByCategory[config.roleCategory as keyof typeof roleOptionsByCategory] || []
})

// 角色分类变化处理
const onRoleCategoryChange = () => {
  // 清空当前角色选择
  config.role = ''
  // 清空技术栈选择
  config.techStack = []
}

// 重置配置
const resetConfig = () => {
  Object.assign(config, {
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
}

// 切换整体折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  if (isCollapsed.value) {
    // 全部收起
    Object.keys(expandedSections.value).forEach(key => {
      expandedSections.value[key] = false
    })
  } else {
    // 展开基础配置
    expandedSections.value.basic = true
  }
}

// 切换分组展开状态
const toggleSection = (section: string) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

// 获取模板图标
const getTemplateIcon = (templateId: string) => {
  const iconMap: Record<string, string> = {
    'writing-assistant': '✍️',
    'vue3-questionnaire-system': '⚡',
    'react-admin-system': '⚛️',
    'code-reviewer': '🔍'
  }
  return iconMap[templateId] || '📝'
}

const styleOptions = [
  { label: '专业正式', value: 'professional' },
  { label: '友好亲切', value: 'friendly' },
  { label: '简洁明了', value: 'concise' },
  { label: '详细全面', value: 'detailed' },
  { label: '创意生动', value: 'creative' },
  { label: '技术性强', value: 'technical' }
]

const formatOptions = [
  { label: '纯文本', value: 'text' },
  { label: 'Markdown', value: 'markdown' },
  { label: '列表形式', value: 'list' },
  { label: '表格形式', value: 'table' },
  { label: 'JSON格式', value: 'json' },
  { label: '代码块', value: 'code' }
]

// 项目类型选项
const projectTypes = [
  { label: 'Web应用', value: 'web-app' },
  { label: '移动应用', value: 'mobile-app' },
  { label: '桌面应用', value: 'desktop-app' },
  { label: 'API服务', value: 'api-service' },
  { label: '微服务架构', value: 'microservice' },
  { label: '数据平台', value: 'data-platform' },
  { label: 'AI/ML项目', value: 'ai-ml' },
  { label: '区块链应用', value: 'blockchain' },
  { label: 'IoT项目', value: 'iot' },
  { label: '游戏开发', value: 'game' }
]

// 项目复杂度选项
const complexityLevels = [
  { label: '简单项目', value: 'simple' },
  { label: '中等复杂度', value: 'medium' },
  { label: '复杂项目', value: 'complex' },
  { label: '企业级项目', value: 'enterprise' },
  { label: '高并发系统', value: 'high-concurrency' },
  { label: '分布式系统', value: 'distributed' }
]

// 性能要求选项
const performanceLevels = [
  { label: '基础性能', value: 'basic' },
  { label: '中等性能', value: 'medium' },
  { label: '高性能', value: 'high' },
  { label: '极致性能', value: 'extreme' },
  { label: '实时响应', value: 'realtime' },
  { label: '大规模并发', value: 'massive-concurrency' }
]

// 测试策略选项
const testingStrategies = [
  { label: '单元测试', value: 'unit-test' },
  { label: '集成测试', value: 'integration-test' },
  { label: '端到端测试', value: 'e2e-test' },
  { label: '性能测试', value: 'performance-test' },
  { label: '安全测试', value: 'security-test' },
  { label: '自动化测试', value: 'automated-test' },
  { label: 'TDD开发', value: 'tdd' },
  { label: 'BDD开发', value: 'bdd' }
]

// 部署环境选项
const deploymentEnvs = [
  { label: '本地开发', value: 'local' },
  { label: '测试环境', value: 'testing' },
  { label: '预生产环境', value: 'staging' },
  { label: '生产环境', value: 'production' },
  { label: '云服务器', value: 'cloud' },
  { label: '容器化部署', value: 'container' },
  { label: 'Kubernetes', value: 'k8s' },
  { label: 'Serverless', value: 'serverless' }
]

// 预设模板
const templates: PromptTemplate[] = [
  {
    id: 'writing-assistant',
    name: '写作助手',
    description: '帮助用户进行文章写作',
    config: {
      role: '专业写作助手',
      roleCategory: 'content',
      techStack: [],
      task: '根据用户提供的主题和要求，撰写高质量的文章',
      context: '用户需要专业的写作帮助，包括结构规划、内容组织和语言润色',
      style: 'professional',
      format: 'markdown',
      examples: '用户：帮我写一篇关于人工智能的文章\n助手：我将为您撰写一篇结构清晰、内容丰富的人工智能主题文章...',
      constraints: '文章应该逻辑清晰、语言流畅、内容准确',
      customFields: []
    }
  },
  {
    id: 'vue3-questionnaire-system',
    name: 'Vue3问卷系统开发',
    description: '基于Vue3+TypeScript+Pinia构建完整问卷系统',
    config: {
      role: '前端开发工程师',
      roleCategory: 'development',
      techStack: ['Vue.js', 'TypeScript', 'Pinia', 'Element Plus', 'Vue Router', 'Vite'],
      task: '使用Vue3 + TypeScript + Pinia + Element Plus技术栈，开发一个完整的在线问卷系统，包括问卷创建、编辑、发布、填写、数据统计等功能模块',
      context: '项目需求：构建一个企业级问卷系统，支持多种题型（单选、多选、文本、评分等），具备问卷模板管理、用户权限控制、数据可视化分析等功能。技术栈：Vue3 Composition API + TypeScript + Pinia状态管理 + Element Plus UI组件库 + Vue Router路由管理 + Vite构建工具',
      style: 'technical',
      format: 'markdown',
      examples: `用户：帮我设计问卷系统的状态管理结构
助手：基于Pinia设计问卷系统的状态管理：

\`\`\`typescript
// stores/questionnaire.ts
import { defineStore } from 'pinia'

export interface Question {
  id: string
  type: 'single' | 'multiple' | 'text' | 'rating' | 'date'
  title: string
  options?: string[]
  required: boolean
  order: number
}

export interface Questionnaire {
  id: string
  title: string
  description: string
  questions: Question[]
  status: 'draft' | 'published' | 'closed'
  createdAt: string
  updatedAt: string
}

export const useQuestionnaireStore = defineStore('questionnaire', {
  state: () => ({
    questionnaires: [] as Questionnaire[],
    currentQuestionnaire: null as Questionnaire | null,
    responses: [] as any[]
  }),
  
  actions: {
    async createQuestionnaire(data: Partial<Questionnaire>) {
      // 创建问卷逻辑
    },
    
    async updateQuestion(questionId: string, questionData: Partial<Question>) {
      // 更新问题逻辑
    }
  }
})
\`\`\``,
      constraints: '代码必须遵循Vue3 Composition API最佳实践，使用TypeScript严格类型检查，组件设计要可复用，状态管理要清晰，性能要优化，代码要有详细注释',
      customFields: [],
      // 新增技术性字段
      projectType: 'web-app',
      complexity: 'complex',
      requirements: '支持多种题型（单选、多选、文本、评分、日期等），问卷模板管理，用户权限控制，数据可视化分析，实时预览，批量导入导出，移动端适配',
      performance: 'high',
      architecture: '采用组件化架构，状态管理使用Pinia，路由管理使用Vue Router，UI组件使用Element Plus，构建工具使用Vite，支持热重载和快速构建',
      testing: 'unit-test',
      deployment: 'container',
      security: '用户认证使用JWT，数据加密传输，权限控制基于角色的访问控制（RBAC），防止XSS和CSRF攻击',
      scalability: '支持水平扩展，使用CDN加速静态资源，数据库读写分离，缓存策略优化，支持高并发访问'
    }
  },
  {
    id: 'react-admin-system',
    name: 'React管理系统开发',
    description: '基于React+TypeScript+Ant Design构建企业级管理系统',
    config: {
      role: '前端开发工程师',
      roleCategory: 'development',
      techStack: ['React', 'TypeScript', 'Ant Design', 'Redux Toolkit', 'React Router', 'Axios'],
      task: '使用React + TypeScript + Ant Design + Redux Toolkit技术栈，开发一个企业级后台管理系统，包括用户管理、权限控制、数据展示、图表分析等功能',
      context: '项目需求：构建一个功能完整的企业后台管理系统，支持多角色权限管理、数据CRUD操作、图表数据可视化、文件上传下载、系统配置等功能。技术栈：React 18 + TypeScript + Ant Design UI组件库 + Redux Toolkit状态管理 + React Router路由管理 + Axios HTTP客户端',
      style: 'technical',
      format: 'markdown',
      examples: `用户：帮我设计用户权限管理的Redux状态结构
助手：基于Redux Toolkit设计用户权限管理：

\`\`\`typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'guest'
  permissions: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
}

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
  }
})
\`\`\``,
      constraints: '代码必须遵循React Hooks最佳实践，使用TypeScript严格类型检查，组件设计要可复用，状态管理要清晰，性能要优化，代码要有详细注释',
      customFields: []
    }
  },
  {
    id: 'code-reviewer',
    name: '代码审查专家',
    description: '专业的代码审查和优化建议',
    config: {
      role: '代码开发专家',
      roleCategory: 'development',
      techStack: [],
      task: '审查用户提供的代码，提供优化建议和最佳实践指导',
      context: '用户希望改进代码质量，提高性能和可维护性',
      style: 'technical',
      format: 'markdown',
      examples: '用户提供代码片段，我将分析其逻辑、性能、安全性等方面',
      constraints: '建议应该具体可行，包含代码示例',
      customFields: []
    }
  }
]

// 添加自定义字段
const addCustomField = () => {
  if (!newField.label) return
  
  const field: CustomField = {
    id: Date.now().toString(),
    label: newField.label,
    value: '',
    type: newField.type,
    options: newField.type === 'select' ? newFieldOptions.value.split('\n').filter(opt => opt.trim()) : undefined
  }
  
  config.customFields.push(field)
  
  // 重置表单
  newField.label = ''
  newField.type = 'input'
  newFieldOptions.value = ''
  showAddFieldDialog.value = false
}

// 移除自定义字段
const removeCustomField = (index: number) => {
  config.customFields.splice(index, 1)
}

// 加载模板
const loadTemplate = (templateId: string) => {
  const template = templates.find(t => t.id === templateId)
  if (template) {
    Object.assign(config, template.config)
  }
}

// 监听配置变化
watch(config, (newConfig) => {
  emit('update', { ...newConfig })
}, { deep: true })

// 初始化时发送默认配置
onMounted(() => {
  emit('update', { ...config })
})
</script>

<style scoped>
.prompt-config {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.config-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.config-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.el-form {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

/* 表单分组样式 */
.form-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 12px 0;
}

.custom-field {
  margin-bottom: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.el-form-item {
  margin-bottom: 16px;
}

.el-divider {
  margin: 20px 0;
}

/* 优化表单标签 */
.el-form-item__label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 6px;
}

/* 优化输入框样式 */
.el-input__inner,
.el-textarea__inner {
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
}

.el-input__inner:focus,
.el-textarea__inner:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.el-textarea__inner {
  line-height: 1.6;
  resize: vertical;
}

/* 优化选择器样式 */
.el-select {
  width: 100%;
}

.el-select .el-input__inner {
  font-size: 14px;
}

/* 优化按钮样式 */
.el-button {
  font-size: 14px;
  padding: 8px 16px;
  height: auto;
  line-height: 1.4;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.el-button--small {
  padding: 6px 12px;
  font-size: 13px;
}

.el-button--primary {
  background: #6366f1;
  border-color: #6366f1;
}

.el-button--primary:hover {
  background: #5b21b6;
  border-color: #5b21b6;
}

/* 优化标签样式 */
.el-tag {
  font-size: 12px;
  padding: 4px 8px;
  height: auto;
  line-height: 1.4;
  border-radius: 6px;
  font-weight: 500;
}

/* 优化分割线样式 */
.el-divider__text {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  padding: 0 16px;
  background: #fafafa;
}

/* 优化对话框样式 */
.el-dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.el-dialog__body {
  padding: 24px;
}

/* 优化自定义字段样式 */
.custom-field .el-form-item {
  margin-bottom: 12px;
}

.custom-field .el-form-item__label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

/* 优化预设模板选择器 */
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

/* 修复多选标签容器 */
.el-select__tags {
  max-height: 120px !important;
  overflow-y: auto !important;
  padding: 4px 0 !important;
  border: none !important;
}

.el-tag--small {
  font-size: 11px !important;
  padding: 2px 6px !important;
  height: auto !important;
  line-height: 1.3 !important;
  margin: 2px 4px 2px 0 !important;
  border: none !important;
  border-radius: 4px !important;
}


/* 优化技术栈选择器 */
.tech-stack-selector {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: #f8fafc;
}

/* 优化表单分组 */
.form-group {
  margin-bottom: 24px;
}

.form-group-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

/* 优化统计信息 */
.config-stats {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  border: 1px solid #e2e8f0;
}

.config-stats .el-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}

/* 预设模板样式 */
.template-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.template-header {
  margin-bottom: 16px;
}

.template-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: white;
}

.template-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
}

.template-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.template-card:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.template-card.active {
  border-color: #6366f1;
  background: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.template-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
  flex-shrink: 0;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.template-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.template-actions {
  flex-shrink: 0;
}

/* 配置分组样式 */
.config-section {
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  transition: all 0.2s ease;
}

.config-section:hover {
  border-color: #6366f1;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #e2e8f0;
}

.section-header:hover {
  background: #f1f5f9;
}

.section-header h3 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.section-toggle {
  font-size: 16px;
  color: #6b7280;
  transition: transform 0.2s ease;
}

.section-content {
  padding: 16px;
  background: #ffffff;
}

.section-content .el-form-item {
  margin-bottom: 16px;
}

.section-content .el-form-item:last-child {
  margin-bottom: 0;
}

/* 智能显示逻辑 */
.config-section.auto-hide {
  opacity: 0.6;
  pointer-events: none;
}

.config-section.auto-hide .section-header {
  background: #f1f5f9;
  color: #9ca3af;
}

/* 配置进度指示器 */
.config-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #bae6fd;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #0369a1;
}

.progress-step.completed {
  color: #059669;
}

.progress-step.current {
  color: #dc2626;
  font-weight: 600;
}

/* 优化响应式 */
@media (max-width: 768px) {
  .config-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .config-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .section-header {
    padding: 10px 12px;
  }
  
  .section-content {
    padding: 12px;
  }
}
</style>