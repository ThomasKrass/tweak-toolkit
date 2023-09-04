import 'styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { faker } from '@faker-js/faker'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Socket, io } from 'socket.io-client'

import { AppContext } from 'contexts/appContext'
import DefaultLayout from 'layouts/default'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<Socket | null>(null)

  const [shouldSimulateLiveChat, setShouldSimulateLiveChat] = useState(false)
  const [simulatedMessageIntervalMs, setSimulatedMessageIntervalMs] =
    useState(1000)

  const eventBridgeUrl = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL || null

  useEffect(() => {
    const eventBridgeUrl = process.env.NEXT_PUBLIC_EVENT_BRIDGE_URL || null
    if (eventBridgeUrl == null) return

    const socketIo = io(eventBridgeUrl)
    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!shouldSimulateLiveChat) return

    const simulateChat = setInterval(() => {
      const username = faker.internet.userName()
      const message = faker.word.words(faker.number.int({ min: 2, max: 7 }))

      axios.post(eventBridgeUrl + '/chat-message', {
        username,
        message,
      })
    }, simulatedMessageIntervalMs)

    return () => {
      clearInterval(simulateChat)
    }
  }, [eventBridgeUrl, shouldSimulateLiveChat, simulatedMessageIntervalMs])

  const queryClient = new QueryClient()

  return (
    <AppContext.Provider
      value={{
        socket,
        shouldSimulateLiveChat,
        setShouldSimulateLiveChat,
        simulatedMessageIntervalMs,
        setSimulatedMessageIntervalMs,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <DefaultLayout>
          <ToastContainer />
          <Component {...pageProps} />
        </DefaultLayout>
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
