"use client"
import { Provider, store, useDispatch, useSelector } from './store/store';
import { addtomainarea, clearChatState } from './slices/chatslice';
import { addDark, removedark } from './slices/ThemeSlice';

export {
  Provider,
  store,
  useDispatch,
  useSelector,
  addtomainarea,
  clearChatState,
  addDark,
  removedark
}; 