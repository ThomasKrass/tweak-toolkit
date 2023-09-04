import { OBSSceneCollection, OBSItem } from 'types/obs'

export default function getOBSItemsInScene(
  obsSceneCollection: OBSSceneCollection,
  scene: string,
): OBSItem[] | null {
  const sceneData = obsSceneCollection.sources.find(
    (source) => source.id === 'scene' && source.name === scene,
  )

  if (sceneData == null) return null

  return sceneData.settings.items as OBSItem[]
}
