import { OBSItem, OBSSceneCollection } from 'types/obs'
import getOBSItemsInScene from 'utils/getOBSItemsInScene'

export default function getMatchingOBSItemInRespectiveDefaultScene(
  obsSceneCollection: OBSSceneCollection,
  sceneName: string,
  customizableOBSItem: OBSItem,
): OBSItem | null {
  const defaultSceneName = `[default] ${sceneName}`
  const itemsInDefaultScene = getOBSItemsInScene(
    obsSceneCollection,
    defaultSceneName,
  )

  if (itemsInDefaultScene == null) return null

  const matchingDefaultOBSItem = itemsInDefaultScene.find(
    (item) => item.name === customizableOBSItem.name,
  )

  if (matchingDefaultOBSItem == null) return null

  return matchingDefaultOBSItem
}
