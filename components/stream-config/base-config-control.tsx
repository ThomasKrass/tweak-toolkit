import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { string, object, boolean, Schema } from 'yup'

import Button from 'components/core/button'
import Switch from 'components/core/switch'
import { StreamConfig } from 'types/element'
import { OBSItem } from 'types/obs'
import generateQRCodes from 'utils/generateQRCodes'
import getAllVisibleElementInstancesFromOBSSceneCollection from 'utils/getAllVisibleElementInstancesFromOBSSceneCollection'
import obsSceneCollectionToInitialTweakConfigurations from 'utils/obsSceneCollectionToInitialTweakConfigurations'
import toTitleCase from 'utils/toTitleCase'

const CONFIG_SERVER_URL = process.env.NEXT_PUBLIC_CONFIG_SERVER_URL
const EVENT_BRIDGE_URL = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL

const RESOLUTION_REGEX = /^[1-9][0-9]*x[1-9][0-9]*$/

const fieldNameForResolutionInputOfOBSItem = (
  obsItemName: OBSItem['name'],
): string => {
  return obsItemName + 'Resolution'
}

const handlePostConfigToServer = (scene: string, config: StreamConfig) => {
  if (CONFIG_SERVER_URL == null) return

  const body = { scene, config }

  return axios
    .post(CONFIG_SERVER_URL, body)
    .then(() => {
      axios.post(EVENT_BRIDGE_URL + '/refetch-config').catch(() => {
        // Refetch config error toast
        toast.error(`Cannot refetch config for ${toTitleCase(scene)} Scene`, {
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
    })
    .catch(() => {
      // Config upload error toast
      toast.error(`Cannot update ${toTitleCase(scene)} Scene`, {
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

const overwriteExistingStreamConfigurationsWithInitialConfigurationsFromOBSSceneCollection =
  async (initialConfigurations: Record<string, StreamConfig>) => {
    for (const [scene, config] of Object.entries(initialConfigurations)) {
      await handlePostConfigToServer(scene, config)
    }

    location.reload()
  }

interface SourceResolutionInput {
  itemName: OBSItem['name']
}

export default function BaseConfigControl() {
  const [shouldBeCondensed, setShouldBeCondensed] = useState(true)

  const [sourceResolutionInputs, setSourceResolutionInputs] = useState<
    SourceResolutionInput[]
  >([])

  const fileInputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (CONFIG_SERVER_URL == null) return

    try {
      axios
        .get<Record<string, unknown>>(`${CONFIG_SERVER_URL}/configs`)
        .then((response) => {
          const data = response.data

          if (Object.keys(data).length < 1) {
            setShouldBeCondensed(false)
          } else {
            setShouldBeCondensed(true)
          }
        })
    } catch {
      setShouldBeCondensed(false)
    }
  }, [])

  // Spawn an input for each element to let the user enter its source resolution.
  const handleSceneCollectionFileChange = (
    setFieldError: (field: string, message: string | undefined) => void,
  ) => {
    const fileInput = fileInputRef.current
    if (fileInput == null) return

    const files = fileInput.files
    if (files == null) return
    if (files.length < 1) return

    const file = files[0]

    const reader = new FileReader()

    reader.onload = function (event) {
      if (event.target == null || typeof event.target.result !== 'string')
        return

      try {
        const obsSceneCollection = JSON.parse(event.target.result)

        const containedElementInstances =
          getAllVisibleElementInstancesFromOBSSceneCollection(
            obsSceneCollection,
          )

        setSourceResolutionInputs(
          containedElementInstances.map((elementInstance) => ({
            itemName: elementInstance,
          })),
        )
      } catch (error) {
        setFieldError(
          'obsSceneCollectionFile',
          'Could not parse the uploaded JSON file',
        )
      }
    }

    reader.readAsText(file)
  }

  const getValidationSchemasForSourceResolutionInputs = () => {
    return sourceResolutionInputs.reduce<Record<string, Schema>>(
      (acc, input) => {
        return {
          ...acc,
          [fieldNameForResolutionInputOfOBSItem(input.itemName)]: string()
            .required('The resolution of this element is required')
            .matches(
              RESOLUTION_REGEX,
              'Resolution must be in the format <width>x<height>',
            ),
        }
      },
      {},
    )
  }

  return (
    <div className="flex flex-col gap-2 p-5 rounded-md shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Base Configuration</h2>
        <p>
          Generate the base configuration from a scene collection exported from
          OBS
        </p>
      </div>
      {shouldBeCondensed && (
        <div className="flex flex-row flex-wrap items-center justify-between gap-4">
          <p className="text-gray-500 max-w-prose">
            If you wish to update your configuration using a new scene
            collection file from OBS, simply click the button. Note that
            uploading a new file will overwrite any existing scenes that are
            also present in the new scene collection file.
          </p>
          <Button
            onClick={() => setShouldBeCondensed(false)}
            className="self-center"
          >
            Upload a New OBS Scene Collection File
          </Button>
        </div>
      )}
      {!shouldBeCondensed && (
        <Formik
          initialValues={{
            obsSceneCollectionFile: '',
            obsCanvasResolution: '3840x2160',
            shouldDownloadQRCodes: true,
          }}
          validationSchema={object({
            obsSceneCollectionFile: string().required(
              'OBS scene collection file is required',
            ),
            obsCanvasResolution: string()
              .required('OBS canvas resolution is required')
              .matches(
                RESOLUTION_REGEX,
                'Resolution must be in the format <width>x<height>',
              ),
            shouldDownloadQRCodes: boolean().required(
              'You must specify if QR codes should be generated from the given scene collection or not',
            ),
            ...getValidationSchemasForSourceResolutionInputs(),
          })}
          onSubmit={async (values, actions) => {
            const fileInput = fileInputRef.current
            if (fileInput == null) return

            const files = fileInput.files
            if (files == null) return
            if (files.length < 1) return

            const file = files[0]

            const reader = new FileReader()

            reader.onload = function (event) {
              if (
                event.target == null ||
                typeof event.target.result !== 'string'
              )
                return

              try {
                const obsSceneCollection = JSON.parse(event.target.result)
                const [canvasWidth, canvasHeight] = values.obsCanvasResolution
                  .split('x')
                  .map(Number)

                const obsItemSourceResolutions = sourceResolutionInputs.reduce<
                  Record<
                    OBSItem['name'],
                    { sourceWidth: number; sourceHeight: number }
                  >
                >((acc, input) => {
                  const itemName = input.itemName

                  const fieldName =
                    fieldNameForResolutionInputOfOBSItem(itemName)

                  const fieldValue = (values as Record<string, unknown>)[
                    fieldName
                  ]

                  if (typeof fieldValue !== 'string') return acc

                  const [sourceWidth, sourceHeight] = fieldValue
                    .split('x')
                    .map(Number)

                  return { ...acc, [itemName]: { sourceWidth, sourceHeight } }
                }, {})

                const initialConfigurations =
                  obsSceneCollectionToInitialTweakConfigurations(
                    obsSceneCollection,
                    canvasWidth,
                    canvasHeight,
                    obsItemSourceResolutions,
                  )

                // Generate QR codes for all scenes included inside the scene collection
                //  if specified by the user.
                if (values.shouldDownloadQRCodes) {
                  generateQRCodes(Object.keys(initialConfigurations))
                }

                // Overwrite existing configurations on the config server with
                //  newly created ones (based on OBS scene collection).
                overwriteExistingStreamConfigurationsWithInitialConfigurationsFromOBSSceneCollection(
                  initialConfigurations,
                )
              } catch (error) {
                actions.setFieldError(
                  'obsSceneCollectionFile',
                  'Could not parse the uploaded JSON file',
                )
              }
            }

            reader.readAsText(file)
          }}
        >
          {({ setFieldValue, values, setFieldError, handleChange }) => (
            <Form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="obsSceneCollectionFile" className="font-medium">
                  OBS Scene Collection File
                </label>
                <Field
                  id="obsSceneCollectionFile"
                  name="obsSceneCollectionFile"
                  as="input"
                  type="file"
                  accept=".json"
                  innerRef={fileInputRef}
                  onChange={(event: ChangeEvent) => {
                    handleSceneCollectionFileChange(setFieldError)
                    handleChange(event)
                  }}
                />
                <ErrorMessage name="obsSceneCollectionFile">
                  {(error: string) => (
                    <div className="font-medium text-error">{error}</div>
                  )}
                </ErrorMessage>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="obsCanvasResolution" className="font-medium">
                  OBS Canvas Resolution
                </label>
                <Field
                  id="obsCanvasResolution"
                  name="obsCanvasResolution"
                  as="input"
                  type="text"
                />
                <ErrorMessage name="obsCanvasResolution">
                  {(error: string) => (
                    <div className="font-medium text-error">{error}</div>
                  )}
                </ErrorMessage>
              </div>
              <div className="flex flex-col gap-4">
                {sourceResolutionInputs.map((input) => {
                  const fieldName = fieldNameForResolutionInputOfOBSItem(
                    input.itemName,
                  )

                  return (
                    <div className="flex flex-col gap-1" key={input.itemName}>
                      <label htmlFor={fieldName} className="font-medium">
                        Resolution of {input.itemName}
                      </label>
                      <Field
                        id={fieldName}
                        name={fieldName}
                        as="input"
                        type="text"
                      />
                      <ErrorMessage name={fieldName}>
                        {(error: string) => (
                          <div className="font-medium text-error">{error}</div>
                        )}
                      </ErrorMessage>
                    </div>
                  )
                })}
              </div>
              <div className="flex flex-col gap-1">
                <Switch
                  label="Generate QR Code(s)"
                  enabled={values.shouldDownloadQRCodes}
                  setEnabled={(newValue: boolean) =>
                    setFieldValue('shouldDownloadQRCodes', newValue)
                  }
                  tooltip="If this option is active, QR codes for each scene will be generated. These codes can be placed in the respective scene inside of OBS."
                />
              </div>
              <div className="flex flex-row justify-center gap-1">
                <Button type="submit" className="self-center">
                  Create Tweak Configuration From OBS
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}
