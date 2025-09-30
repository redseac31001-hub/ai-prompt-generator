export interface CustomField {
  id: string
  label: string
  value: string
  type: 'input' | 'textarea' | 'select'
  options?: string[]
}

export interface PromptConfig {
  role: string
  roleCategory?: string
  techStack?: string[]
  task: string
  context: string
  style: string
  format: string
  examples: string
  constraints: string
  customFields: CustomField[]
  // 新增技术性字段
  projectType?: string
  complexity?: string
  requirements?: string
  performance?: string
  architecture?: string
  testing?: string
  deployment?: string
  security?: string
  scalability?: string
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  config: PromptConfig
}