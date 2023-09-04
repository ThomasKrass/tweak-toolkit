import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialStreamerRepresentation(
  customizableOBSItem: OBSItem,
  defaultOBSItem: OBSItem,
  layer: number,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): StreamElement {
  const { location: sourceLocation } = extractConfigPropertiesFromOBSItem(
    customizableOBSItem,
    canvasWidth,
    canvasHeight,
    sourceWidth,
    sourceHeight,
  )

  const {
    instanceId,
    isEnabled,
    location: configLocation,
  } = extractConfigPropertiesFromOBSItem(
    defaultOBSItem,
    canvasWidth,
    canvasHeight,
    sourceWidth,
    sourceHeight,
  )

  const initialElement: StreamElement = {
    identifier: 'streamer_representation',
    instanceId,
    title: 'Webcam',
    customizableProperties: ['isEnabled', 'location', 'layer', 'opacity'],
    attributes: [
      {
        identifier: 'video_source',
        instanceNumber: 0,
        resources: {
          videoStream: sourceLocation,
        },
      },
    ],
    config: {
      isEnabled,
      location: configLocation,
      layer,
      opacity: 1,
    },
  }

  return initialElement
}
