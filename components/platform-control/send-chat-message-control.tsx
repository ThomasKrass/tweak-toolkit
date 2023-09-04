import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { string, object } from 'yup'

import Button from 'components/core/button'

export default function SendChatMessageControl() {
  const eventBridgeUrl = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL || null

  if (eventBridgeUrl == null)
    return <div>NEXT_PUBLIC_EVENT_BRIDGE_URL must be specified</div>

  return (
    <div className="flex flex-col gap-2 p-5 rounded-md shadow-lg">
      <div className="mb-4">
        <h2 className="text-lg font-bold">Send Chat Message</h2>
        <p>Send a chat message to the live chat</p>
      </div>
      <Formik
        initialValues={{
          username: '',
          message: '',
        }}
        validationSchema={object({
          username: string().required('Username is required'),
          message: string().required('Message is required'),
        })}
        onSubmit={async (values) => {
          axios
            .post(eventBridgeUrl + '/chat-message', values)
            .then(() => {
              // Success toast
              toast.success(`${values.username}: ${values.message}`, {
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
              // Send message error toast
              toast.error(`Cannot send chat message`, {
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
        }}
      >
        <Form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium">
              Username
            </label>
            <Field id="username" name="username" as="input" />
            <ErrorMessage name="username">
              {(error: string) => (
                <div className="font-medium text-error">{error}</div>
              )}
            </ErrorMessage>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="font-medium">
              Message
            </label>
            <Field id="message" name="message" as="textarea" />
            <ErrorMessage name="message">
              {(error: string) => (
                <div className="font-medium text-error">{error}</div>
              )}
            </ErrorMessage>
          </div>

          <Button type="submit" className="self-center">
            Send Message
          </Button>
        </Form>
      </Formik>
    </div>
  )
}
