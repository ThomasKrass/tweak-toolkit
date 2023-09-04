import { StreamConfig, StreamElement } from 'types/element'
import { OBSItem, OBSSceneCollection } from 'types/obs'
import getMatchingOBSItemInRespectiveDefaultScene from 'utils/getMatchingOBSItemInRespectiveDefaultScene'
import getOBSItemsInScene from 'utils/getOBSItemsInScene'
import obsItemToInitialTweakElement from 'utils/obsItemToInitialTweakElement'

/**
 * Extracts all usable data from the OBS scene collection and returns it as a
 *  StreamConfig for Tweak (for each scene inside the scene collection).
 *
 * @param obsSceneCollection
 * @param canvasWidth
 * @param canvasHeight
 * @returns
 */
export default function obsSceneCollectionToInitialTweakConfigurations(
  obsSceneCollection: OBSSceneCollection,
  canvasWidth: number,
  canvasHeight: number,
  obsItemResolutions: Record<
    OBSItem['name'],
    { sourceWidth: number; sourceHeight: number }
  >,
): Record<string, StreamConfig> {
  // Get all customizable scenes from the OBS scene collection.
  const includedCustomizableScenes = obsSceneCollection.scene_order
    .filter((scene) => scene.name.startsWith('[customizable]'))
    .map((scene) => scene.name)

  const partialConfig = includedCustomizableScenes.reduce<
    Record<string, StreamConfig>
  >((acc, customizableScene) => {
    const sceneName = customizableScene.replace('[customizable] ', '')

    const obsItemsInScene = getOBSItemsInScene(
      obsSceneCollection,
      customizableScene,
    )
    if (obsItemsInScene == null) return acc

    const sceneConfig: StreamConfig = {
      elements: obsItemsInScene.reduce<StreamElement[]>(
        (acc, customizableOBSItem, layer) => {
          const matchingDefaultOBSItem =
            getMatchingOBSItemInRespectiveDefaultScene(
              obsSceneCollection,
              sceneName,
              customizableOBSItem,
            )

          // No matching item found in default config -> Cannot infer its "real" position
          //  inside the stream.
          if (matchingDefaultOBSItem == null) return acc

          const sourceWidth = (() => {
            try {
              return obsItemResolutions[customizableOBSItem.name].sourceWidth
            } catch {
              return 0
            }
          })()
          const sourceHeight = (() => {
            try {
              return obsItemResolutions[customizableOBSItem.name].sourceHeight
            } catch {
              return 0
            }
          })()

          const element = obsItemToInitialTweakElement(
            customizableOBSItem,
            matchingDefaultOBSItem,
            layer,
            canvasWidth,
            canvasHeight,
            sourceWidth,
            sourceHeight,
          )

          if (element == null) return acc

          return [...acc, element]
        },
        [],
      ),
    }

    return { ...acc, [sceneName]: sceneConfig }
  }, {})

  return partialConfig
}
