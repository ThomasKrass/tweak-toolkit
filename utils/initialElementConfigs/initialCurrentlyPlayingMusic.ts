import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialCurrentlyPlayingMusic(
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
    identifier: 'currently_playing_music',
    instanceId,
    title: 'Now Playing',
    customizableProperties: [
      'isEnabled',
      'location',
      'layer',
      'opacity',
      'fontSize',
      'manifestation',
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
          text: '<Artist> | <Title of Song>',
        },
      },
    ],
    manifestations: {
      onEvent: {
        durationRange: {
          from: 3,
          to: 30,
        },
      },
      onInterval: {
        intervalRange: {
          from: 30,
          to: 300,
        },
        durationRange: {
          from: 3,
          to: 30,
        },
      },
    },
    config: {
      isEnabled,
      location: configLocation,
      layer,
      opacity: 1,
      fontSize: 0.5,
      manifestation: 'continuous',
      interval: 0.5,
      duration: 0.5,
    },
  }

  return initialElement
}
