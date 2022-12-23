export const OptionsFields = [
  'date',
  'number',
  'string',
  'bigint',
  'boolean',
  'function',
  'symbol',
  'undefined',
  'object'
] as const

type FieldType = typeof OptionsFields[number]

export interface Field {
  name: string
  type: FieldType
}

export interface Schema {
  fields: Field[]
}

export interface Resource {
  format: string
  name: string
  description?: string
  title?: string
  schema?: Schema
  sample?: any[]
  profile?: string
  key?: string
  path?: string
  size?: number
}

export interface License {
  name: string
  path?: string
  title?: string
}

export interface DataPackage {
  name: string
  title?: string
  terms?: string[]
  description?: string
  profile: string
  licenses: License[]
  resources: Resource[]
  path?: string
  key?: string
  size?: number
  views?: any
  derivedFrom?: {
    datasets: string[]
  }
}

export interface Term {
  name: string
  title?: string
  description?: string
  collections: string[]
}

export interface Collection {
  name: string
  title?: string
  description?: string
  terms: string[]
}
