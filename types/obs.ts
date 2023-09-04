export type OBSScene = {
  name: string // e.g., "[customizable] content"
}

export type OBSItem = {
  name: string
  source_uuid: string
  visible: boolean
  pos: {
    x: number
    y: number
  }
  scale: {
    x: number
    y: number
  }
  [key: string]: unknown
}

export type OBSSource = {
  id: string
  name: string
  settings: Record<string, unknown>
  [key: string]: unknown
}

export type OBSSceneCollection = {
  scene_order: OBSScene[]
  sources: OBSSource[]
  [key: string]: unknown
}
