"use client"
import {createSlice} from '@reduxjs/toolkit';
const chatSlice=createSlice({
    name:'Chat',
    initialState:null,
    reducers:{
        addtomainarea:(state,action)=>{
            return action.payload
        }
    }
})
export const {addtomainarea} =chatSlice.actions;
export default chatSlice.reducer;