import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {cartDisplayReducer, generalReducer} from './reducers'
const rootReducer = combineReducers({
    generalReducer,
    cartDisplayReducer
})
export const store = () => {
    return configureStore({
        reducer:rootReducer
    })
}
// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']