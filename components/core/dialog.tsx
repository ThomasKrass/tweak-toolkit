import { Dialog as HeadlessUIDialog, Transition } from '@headlessui/react'
import { Fragment, ReactElement, cloneElement, useState } from 'react'

export interface DialogProps {
  triggerButton: ReactElement
  headline: string
  content: string
  action: () => void
  actionButtonTitle: string
}

export default function Dialog({
  triggerButton,
  headline,
  content,
  action,
  actionButtonTitle,
}: DialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleActionButtonClick = () => {
    action()
    closeModal()
  }

  return (
    <>
      {cloneElement(triggerButton, { onClick: openModal })}

      <Transition appear show={isOpen} as={Fragment}>
        <HeadlessUIDialog
          as="div"
          className="relative z-10"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <HeadlessUIDialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <HeadlessUIDialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-black"
                  >
                    {headline}
                  </HeadlessUIDialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{content}</p>
                  </div>

                  <div className="flex flex-row gap-2 mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md bg-error/90 hover:bg-error"
                      onClick={handleActionButtonClick}
                    >
                      {actionButtonTitle}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium border border-transparent rounded-md bg-black/5 hover:bg-black/10"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </HeadlessUIDialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </HeadlessUIDialog>
      </Transition>
    </>
  )
}
