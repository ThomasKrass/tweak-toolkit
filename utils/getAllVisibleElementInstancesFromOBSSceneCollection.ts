import { INVISIBLE_ELEMENTS, isStreamElementIdentifier } from 'types/element'
import { OBSItem, OBSSceneCollection } from 'types/obs'
import getOBSItemsInScene from 'utils/getOBSItemsInScene'

export default function getAllVisibleElementInstancesFromOBSSceneCollection(
  obsSceneCollection: OBSSceneCollection,
): OBSItem['name'][] {
  // Get all customizable scenes from the OBS scene collection.
  const includedCustomizableScenes = obsSceneCollection.scene_order
    .filter((scene) => scene.name.startsWith('[customizable]'))
    .map((scene) => scene.name)

  let result: OBSItem['name'][] = []

  for (const customizableScene of includedCustomizableScenes) {
    const includedItems = getOBSItemsInScene(
      obsSceneCollection,
      customizableScene,
    )

    if (includedItems == null) continue

    result = [...result, ...includedItems.map((item) => item.name)]
  }

  result = Array.from(new Set(result))
  result = result.filter((item) =>
    isStreamElementIdentifier(item.split('-')[0]),
  )

  // Only include visible elements
  result = result.filter((item) => {
    const elementIdentifier = item.split('-')[0]
    return !([...INVISIBLE_ELEMENTS] as string[]).includes(elementIdentifier)
  })

  return result
}
