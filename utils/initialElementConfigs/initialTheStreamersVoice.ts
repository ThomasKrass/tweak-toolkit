import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialTheStreamersVoice(
  customizableOBSItem: OBSItem,
  defaultOBSItem: OBSItem,
  layer: number,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): StreamElement {
  const { instanceId } = extractConfigPropertiesFromOBSItem(
    defaultOBSItem,
    canvasWidth,
    canvasHeight,
    sourceWidth,
    sourceHeight,
  )

  const initialElement: StreamElement = {
    identifier: 'the_streamers_voice',
    instanceId,
    title: 'Voice',
    customizableProperties: ['volume', 'isVolumeMuted'],
    attributes: [
      {
        identifier: 'audio_source',
        instanceNumber: 0,
        resources: {
          audioStream: {
            channels: [0],
          },
        },
      },
    ],
    config: {
      volume: 1,
      isVolumeMuted: false,
    },
  }

  return initialElement
}
