import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialChatOverlay(
  customizableOBSItem: OBSItem,
  defaultOBSItem: OBSItem,
  layer: number,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): StreamElement {
  const {
    instanceId,
    location: configLocation,
    isEnabled,
  } = extractConfigPropertiesFromOBSItem(
    defaultOBSItem,
    canvasWidth,
    canvasHeight,
    sourceWidth,
    sourceHeight,
  )

  const initialElement: StreamElement = {
    identifier: 'chat_overlay',
    instanceId,
    title: 'Chat Overlay',
    customizableProperties: [
      'isEnabled',
      'location',
      'layer',
      'opacity',
      'fontSize',
    ],
    attributes: [
      {
        identifier: 'text_source',
        instanceNumber: 0,
        resources: {
          fontSizeRange: {
            from: 10,
            to: 80,
          },
        },
      },
    ],
    config: {
      isEnabled,
      location: configLocation,
      layer,
      opacity: 1,
      fontSize: 0.5,
    },
  }

  return initialElement
}
