import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppData, Accomplishment, DEFAULT_APP_DATA } from '../../shared/types';

type Action =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'ADD_ACCOMPLISHMENT'; payload: Accomplishment }
  | { type: 'UPDATE_ACCOMPLISHMENT'; payload: Accomplishment }
  | { type: 'DELETE_ACCOMPLISHMENT'; payload: string };

interface AppState {
  data: AppData;
  loading: boolean;
}

interface AppContextValue {
  state: AppState;
  addAccomplishment: (accomplishment: Accomplishment) => Promise<void>;
  updateAccomplishment: (accomplishment: Accomplishment) => Promise<void>;
  deleteAccomplishment: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload, loading: false };
    case 'ADD_ACCOMPLISHMENT':
      return {
        ...state,
        data: {
          ...state.data,
          accomplishments: [...state.data.accomplishments, action.payload],
        },
      };
    case 'UPDATE_ACCOMPLISHMENT':
      return {
        ...state,
        data: {
          ...state.data,
          accomplishments: state.data.accomplishments.map((a) =>
            a.id === action.payload.id ? action.payload : a
          ),
        },
      };
    case 'DELETE_ACCOMPLISHMENT':
      return {
        ...state,
        data: {
          ...state.data,
          accomplishments: state.data.accomplishments.filter((a) => a.id !== action.payload),
        },
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, {
    data: DEFAULT_APP_DATA,
    loading: true,
  });

  useEffect(() => {
    window.api.loadData().then((data) => {
      dispatch({ type: 'SET_DATA', payload: data });
    });
  }, []);

  async function addAccomplishment(accomplishment: Accomplishment): Promise<void> {
    const updatedData = await window.api.addAccomplishment(accomplishment);
    dispatch({ type: 'SET_DATA', payload: updatedData });
  }

  async function updateAccomplishment(accomplishment: Accomplishment): Promise<void> {
    const updatedData = await window.api.updateAccomplishment(accomplishment);
    dispatch({ type: 'SET_DATA', payload: updatedData });
  }

  async function deleteAccomplishment(id: string): Promise<void> {
    const updatedData = await window.api.deleteAccomplishment(id);
    dispatch({ type: 'SET_DATA', payload: updatedData });
  }

  return (
    <AppContext.Provider
      value={{ state, addAccomplishment, updateAccomplishment, deleteAccomplishment }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
