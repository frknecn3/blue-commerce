'use client'

import { useRef } from "react"
import { store } from "../redux/store"
import { Provider } from 'react-redux'
import { AppStore } from "../redux/store"

export default function StoreProvider({
    children,
  }: {
    children: React.ReactNode
  }) {
    const storeRef = useRef<AppStore>()
    if (!storeRef.current) {
      // Create the store instance the first time this renders
      storeRef.current = store()
    }
  
    return <Provider store={storeRef.current}>{children}</Provider>
  }