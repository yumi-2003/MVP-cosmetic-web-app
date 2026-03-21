import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/**
 * Custom Redux Hooks for TypeScript
 * 
 * Instead of using the default useDispatch and useSelector everywhere, 
 * use these typed versions to get full autocompletion and type safety 
 * for your store's state and actions.
 */

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;

// Use throughout your app instead of plain `useSelector`
export const useAppSelector: <T>(selector: (state: RootState) => T) => T = useSelector;
