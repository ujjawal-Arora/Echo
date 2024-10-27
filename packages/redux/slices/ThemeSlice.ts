"use client"
import {createSlice} from '@reduxjs/toolkit';
const ThemeSlice=createSlice({
    name:'Theme',
    initialState:false,
    reducers:{
        addDark:()=>{
            return true;
        },
        removedark:()=>{
            return false
        }
    }
})
export const {addDark,removedark} = ThemeSlice.actions;
export default ThemeSlice.reducer;