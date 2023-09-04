import Editor from '@monaco-editor/react'
import axios from 'axios'
import * as monaco from 'monaco-editor'
import { useEffect, useRef, useState, MutableRefObject } from 'react'
import { toast } from 'react-toastify'

import Button from 'components/core/button'
import Dialog from 'components/core/dialog'
import Listbox from 'components/core/listbox'
import toTitleCase from 'utils/toTitleCase'

const CONFIG_SERVER_URL = process.env.NEXT_PUBLIC_CONFIG_SERVER_URL
const EVENT_BRIDGE_URL = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL

export default function SceneConfigControl() {
  const [configsForAllScenes, setConfigsForAllScenes] = useState<Record<
    string,
    unknown
  > | null>(null)

  const [selectedScene, setSelectedScene] = useState(() => {
    if (configsForAllScenes == null) return null
    if (Object.keys(configsForAllScenes).length < 1) return null

    return Object.keys(configsForAllScenes)[0]
  })

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>(null)

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
  ) => {
    type MutableEditorRef =
      MutableRefObject<monaco.editor.IStandaloneCodeEditor>
    ;(editorRef as MutableEditorRef).current = editor
  }

  useEffect(() => {
    if (CONFIG_SERVER_URL == null) return

    try {
      axios
        .get<Record<string, unknown>>(`${CONFIG_SERVER_URL}/configs`)
        .then((response) => {
          const data = response.data
          setConfigsForAllScenes(data)
        })
    } catch {
      /* empty */
    }
  }, [])

  useEffect(() => {
    if (selectedScene != null) return

    if (configsForAllScenes == null) return

    if (Object.keys(configsForAllScenes).length < 1) return

    setSelectedScene(Object.keys(configsForAllScenes)[0])
  }, [configsForAllScenes, selectedScene])

  if (configsForAllScenes == null) return null
  if (selectedScene == null) return null

  const handleSaveConfig = () => {
    if (editorRef.current == null) return
    if (CONFIG_SERVER_URL == null) return

    let updatedSceneConfig = null
    try {
      updatedSceneConfig = JSON.parse(editorRef.current.getValue())
    } catch {
      return toast.error(
        `Could not parse the configuration for ${toTitleCase(
          selectedScene,
        )} Scene`,
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        },
      )
    }

    const body = { scene: selectedScene, config: updatedSceneConfig }

    axios
      .post(CONFIG_SERVER_URL, body)
      .then(() => {
        axios
          .post(EVENT_BRIDGE_URL + '/refetch-config')
          .then(() => {
            // Success toast
            toast.success(`Updated ${toTitleCase(selectedScene)} Scene`, {
              position: 'top-right',
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            })
          })
          .catch(() => {
            // Refetch config error toast
            toast.error(
              `Cannot refetch config for ${toTitleCase(selectedScene)} Scene`,
              {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
              },
            )
          })
      })
      .catch(() => {
        // Config upload error toast
        toast.error(`Cannot update ${toTitleCase(selectedScene)} Scene`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
      })
  }

  const handleDeleteCurrentScene = () => {
    if (CONFIG_SERVER_URL == null) return

    const body = { scene: selectedScene }

    axios
      .delete(CONFIG_SERVER_URL, { data: body })
      .then(() => {
        location.reload()
      })
      .catch(() => {
        // Config deletion error toast
        toast.error(`Cannot delete ${toTitleCase(selectedScene)} Scene`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        })
      })
  }

  return (
    <div className="flex flex-col gap-2 p-5 rounded-md shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Scene Configuration</h2>
        <p>Configure the selected scene in detail</p>
      </div>
      <div className="relative z-10 mb-4">
        <Listbox
          values={Object.keys(configsForAllScenes)}
          selectedValue={selectedScene}
          setSelectedValue={setSelectedScene}
          valueToString={(scene) => toTitleCase(scene) + ' Scene'}
        />
      </div>
      <Editor
        defaultLanguage="json"
        value={JSON.stringify(configsForAllScenes[selectedScene], null, 4)}
        height="min(90vh, 600px)"
        onMount={handleEditorDidMount}
      />
      <div className="flex flex-row justify-center gap-2">
        <Button className="self-center" onClick={handleSaveConfig}>
          Save Changes
        </Button>
        <Dialog
          triggerButton={
            <Button variant="warn" className="self-center">
              Delete Scene
            </Button>
          }
          action={handleDeleteCurrentScene}
          actionButtonTitle="Delete"
          content={`Do you really want to delete the ${toTitleCase(
            selectedScene,
          )} Scene?`}
          headline="Delete Scene"
        />
      </div>
    </div>
  )
}
