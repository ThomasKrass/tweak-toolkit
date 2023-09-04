import { Switch as HeadlessUISwitch } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

import Tooltip from 'components/core/tooltip'

interface SwitchProps {
  enabled: boolean
  setEnabled: Dispatch<SetStateAction<boolean>> | ((newValue: boolean) => void)
  label: string
  tooltip?: string
}

export default function Switch({
  label,
  enabled,
  setEnabled,
  tooltip,
}: SwitchProps) {
  return (
    <div className="flex flex-row items-center gap-2">
      <HeadlessUISwitch
        checked={enabled}
        onChange={setEnabled}
        className={`${
          enabled ? 'bg-editing' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </HeadlessUISwitch>
      <Tooltip content={tooltip}>
        <span className="font-medium">{label}</span>
      </Tooltip>
    </div>
  )
}
