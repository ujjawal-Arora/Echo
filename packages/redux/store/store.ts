"use client"
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch as useReduxDispatch, useSelector as useReduxSelector } from 'react-redux';
import chatSlice from '../slices/chatslice';
export const store=configureStore({
    reducer:{
        Chat:chatSlice
    }
})
export {Provider};
export const useDispatch = () => useReduxDispatch();
export const useSelector = () => useReduxSelector((state:any)=>state.Chat);
