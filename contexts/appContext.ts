import { Dispatch, SetStateAction, createContext } from 'react'
import { Socket } from 'socket.io-client'

export type AppContextValue = {
  socket: Socket | null
  shouldSimulateLiveChat: boolean | null
  setShouldSimulateLiveChat: Dispatch<SetStateAction<boolean>> | null
  simulatedMessageIntervalMs: number | null
  setSimulatedMessageIntervalMs: Dispatch<SetStateAction<number>> | null
}

const defaultValue: AppContextValue = {
  socket: null,
  shouldSimulateLiveChat: null,
  setShouldSimulateLiveChat: null,
  simulatedMessageIntervalMs: null,
  setSimulatedMessageIntervalMs: null,
}

export const AppContext = createContext<AppContextValue>(defaultValue)
