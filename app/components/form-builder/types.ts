import type { Component } from 'vue'
import type { ZodSchema } from 'zod'

// ─── Field types (same as your React version) ──────────────────
export type FieldType =
  | 'text' | 'email' | 'password' | 'number'
  | 'formatted_number' | 'textarea'
  | 'select' | 'multiselect'
  | 'checkbox' | 'radio' | 'switch'
  | 'date' | 'time' | 'datetime'
  | 'slider' | 'rating' | 'file'
  | 'autocomplete' | 'custom'

export interface FieldOption {
  label: string
  value: any
  default?: boolean | null
  disabled?: boolean
  depth?: number
  isLeaf?: boolean
  parentId?: number | null
}

// ─── Grid sizing (Tailwind col-span equivalent) ────────────────
export interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 6 | 12  // col-span on mobile
  sm?: 1 | 2 | 3 | 4 | 6 | 12
  md?: 1 | 2 | 3 | 4 | 6 | 12
  lg?: 1 | 2 | 3 | 4 | 6 | 12
}

// ─── Base field (same props as your BaseFieldConfig) ──────────
export interface BaseFieldConfig {
  name: string
  label?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  disabled?: boolean
  hide?: boolean
  gridProps?: GridProps
}

// ─── Predefined field config ───────────────────────────────────
export interface PredefinedFieldConfig extends BaseFieldConfig {
  type: Exclude<FieldType, 'custom'>
  options?: FieldOption[]
  multiple?: boolean
  accept?: string
  rows?: number
  min?: number | string
  max?: number | string
  step?: number
  row?: boolean
  marks?: boolean | Array<{ value: number; label?: string }>
  showValue?: boolean
  precision?: number
  showPreview?: boolean
  maxFiles?: number
  handleChange?: (value: any) => void
}

// ─── Custom field config ───────────────────────────────────────
export interface CustomFieldConfig extends BaseFieldConfig {
  type: 'custom'
  component: Component
  componentProps?: Record<string, any>
}

export type FieldConfig = PredefinedFieldConfig | CustomFieldConfig

// ─── Section ───────────────────────────────────────────────────
export interface FormSection {
  title?: string
  description?: string
  fields: FieldConfig[]
  columns?: number
  collapsible?: boolean
  defaultExpanded?: boolean
}

// ─── Main config (same shape as your FormBuilderConfig) ────────
export interface FormBuilderConfig {
  sections?: FormSection[]
  fields?: FieldConfig[]
  columns?: number        // default grid columns
  schema?: ZodSchema       // Zod schema (replaces yup + RegisterOptions)
}