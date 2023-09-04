import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialDigitalCapturedContent(
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
    identifier: 'digital_captured_content',
    instanceId,
    title: 'Screen Capture',

    customizableProperties: [
      'isEnabled',
      'location',
      'layer',
      'volume',
      'isVolumeMuted',
      'opacity',
    ],
    attributes: [
      {
        identifier: 'video_source',
        instanceNumber: 0,
        resources: {
          videoStream: sourceLocation,
        },
      },
      {
        identifier: 'audio_source',
        instanceNumber: 0,
        resources: {
          audioStream: {
            channels: [0, 1],
          },
        },
      },
    ],
    config: {
      isEnabled,
      location: configLocation,
      layer,
      volume: 1,
      isVolumeMuted: false,
      opacity: 1,
    },
  }

  return initialElement
}
