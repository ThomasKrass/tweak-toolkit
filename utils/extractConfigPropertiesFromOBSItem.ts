import { StreamElement, StreamElementConfig } from 'types/element'
import { OBSItem } from 'types/obs'

export type ExtractedProperties = {
  instanceId: StreamElement['instanceId']
  isEnabled: StreamElementConfig['isEnabled']
  location: StreamElementConfig['location']
}

function computeLocation(
  obsItem: OBSItem,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): StreamElementConfig['location'] {
  const x0 = (obsItem.pos.x ?? 0) / canvasWidth
  const y0 = (obsItem.pos.y ?? 0) / canvasHeight

  // Compute lower right coordinates based on the source's scale and position
  const x1 =
    ((obsItem.pos.x ?? 0) + (obsItem.scale.x ?? 1) * sourceWidth) / canvasWidth
  const y1 =
    ((obsItem.pos.y ?? 0) + (obsItem.scale.y ?? 1) * sourceHeight) /
    canvasHeight

  return { x0, y0, x1, y1 }
}

export default function extractConfigPropertiesFromOBSItem(
  obsItem: OBSItem,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): ExtractedProperties {
  const extractedProperties: ExtractedProperties = {
    instanceId: obsItem.source_uuid,
    isEnabled: obsItem.visible ?? true,
    location: computeLocation(
      obsItem,
      canvasWidth,
      canvasHeight,
      sourceWidth,
      sourceHeight,
    ),
  }

  return extractedProperties
}
