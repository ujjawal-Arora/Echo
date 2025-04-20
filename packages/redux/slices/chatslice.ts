"use client"
import {createSlice} from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadState = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const serializedState = localStorage.getItem('chatState');
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Error loading chat state from localStorage:", err);
    return null;
  }
};

const chatSlice=createSlice({
    name:'Chat',
    initialState: loadState(),
    reducers:{
        addtomainarea:(state,action)=>{
            // Save the new state to localStorage
            if (typeof window === 'undefined') {
                return action.payload;
            }
            try {
                const serializedState = JSON.stringify(action.payload);
                localStorage.setItem('chatState', serializedState);
            } catch (err) {
                console.error("Error saving chat state to localStorage:", err);
            }
            return action.payload;
        },
        clearChatState: (state) => {
            // Clear the state from localStorage
            if (typeof window !== 'undefined') {
                try {
                    localStorage.removeItem('chatState');
                } catch (err) {
                    console.error("Error clearing chat state from localStorage:", err);
                }
            }
            return null;
        }
    }
})
export const {addtomainarea, clearChatState} =chatSlice.actions;
export default chatSlice.reducer;