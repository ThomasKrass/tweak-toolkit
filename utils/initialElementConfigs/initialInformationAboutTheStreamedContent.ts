import { StreamElement } from 'types/element'
import { OBSItem } from 'types/obs'
import extractConfigPropertiesFromOBSItem from 'utils/extractConfigPropertiesFromOBSItem'

export default function initialInformationAboutTheStreamedContent(
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
    identifier: 'information_about_the_streamed_content',
    instanceId,
    title: 'Content Info',
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
          text: 'Lorem Ipsum',
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
