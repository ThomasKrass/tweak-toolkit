import { ChangeEventHandler } from 'react'

import Switch from 'components/core/switch'
import Tooltip from 'components/core/tooltip'
import useAppContext from 'hooks/useAppContext'

export default function SimulateChatControl() {
  const {
    shouldSimulateLiveChat,
    setShouldSimulateLiveChat,
    simulatedMessageIntervalMs,
    setSimulatedMessageIntervalMs,
  } = useAppContext()

  const handleIntervalInputChange: ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    if (setSimulatedMessageIntervalMs == null) return

    const newValue = Number(event.target.value)
    setSimulatedMessageIntervalMs(newValue)
  }

  if (shouldSimulateLiveChat == null) return null
  if (setShouldSimulateLiveChat == null) return null
  if (simulatedMessageIntervalMs == null) return null

  return (
    <div className="flex flex-col gap-2 p-5 rounded-md shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Simulate Chat</h2>
        <p>Simulates the live chat by sending fake messages from fake users</p>
      </div>
      <div className="flex flex-col gap-4">
        <Switch
          label="Simulate Chat"
          enabled={shouldSimulateLiveChat}
          setEnabled={setShouldSimulateLiveChat}
        />
        <div className="flex flex-row items-center gap-2">
          <Tooltip
            content={`New Message Every ${Math.round(
              simulatedMessageIntervalMs / 1000,
            )}s`}
            hideOnClick={false}
          >
            <input
              type="range"
              className="accent-editing hover:cursor-grab active:cursor-grabbing"
              min={1000}
              max={60000}
              value={simulatedMessageIntervalMs}
              onChange={handleIntervalInputChange}
              disabled={!shouldSimulateLiveChat}
            />
          </Tooltip>
          <span className="font-medium">Message Frequency</span>
        </div>
      </div>
    </div>
  )
}
