import {
  StreamElement,
  StreamElementIdentifier,
  isStreamElementIdentifier,
} from 'types/element'
import { OBSItem } from 'types/obs'
import initialBackgroundMusic from 'utils/initialElementConfigs/initialBackgroundMusic'
import initialChatOverlay from 'utils/initialElementConfigs/initialChatOverlay'
import initialCurrentlyPlayingMusic from 'utils/initialElementConfigs/initialCurrentlyPlayingMusic'
import initialDigitalCapturedContent from 'utils/initialElementConfigs/initialDigitalCapturedContent'
import initialInformationAboutTheStreamedContent from 'utils/initialElementConfigs/initialInformationAboutTheStreamedContent'
import initialStreamerRepresentation from 'utils/initialElementConfigs/initialStreamerRepresentation'
import initialTheStreamersVoice from 'utils/initialElementConfigs/initialTheStreamersVoice'

export default function obsItemToInitialTweakElement(
  customizableOBSItem: OBSItem,
  defaultOBSItem: OBSItem,
  layer: number,
  canvasWidth: number,
  canvasHeight: number,
  sourceWidth: number,
  sourceHeight: number,
): StreamElement | null {
  const elementIdentifier: StreamElementIdentifier | null = (() => {
    try {
      const identifier = customizableOBSItem.name.split('-')[0]

      if (!isStreamElementIdentifier(identifier)) return null

      return identifier
    } catch {
      return null
    }
  })()

  if (elementIdentifier == null) return null

  const initialElement: StreamElement | null = (() => {
    switch (elementIdentifier) {
      case 'digital_captured_content': {
        return initialDigitalCapturedContent(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'streamer_representation': {
        return initialStreamerRepresentation(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'chat_overlay': {
        return initialChatOverlay(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'information_about_the_streamed_content': {
        return initialInformationAboutTheStreamedContent(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'currently_playing_music': {
        return initialCurrentlyPlayingMusic(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'background_music': {
        return initialBackgroundMusic(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      case 'the_streamers_voice': {
        return initialTheStreamersVoice(
          customizableOBSItem,
          defaultOBSItem,
          layer,
          canvasWidth,
          canvasHeight,
          sourceWidth,
          sourceHeight,
        )
      }
      default:
        return null
    }
  })()

  return initialElement
}
