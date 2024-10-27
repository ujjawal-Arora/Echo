"use client"
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch as useReduxDispatch, useSelector as useReduxSelector ,TypedUseSelectorHook} from 'react-redux';
import chatSlice from '../slices/chatslice';
import ThemeSlice from '../slices/ThemeSlice'
export const store=configureStore({
    reducer:{
        Chat:chatSlice,
        Theme:ThemeSlice
    }
})
export type RootState = {
    Theme: boolean; 
    Chat:any;
};
export {Provider};
export const useDispatch = () => useReduxDispatch();
export const useSelector:TypedUseSelectorHook<RootState> =useReduxSelector;
