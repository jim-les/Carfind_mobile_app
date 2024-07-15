import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base_url } from './config';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'SET_AUTH':
      return {
        ...state,
        isAuthenticated: action.payload,
      };
    default:
      return state;
  }
};

const validateSession = async () => {
  try {
    const response = await fetch(`${base_url}/validate-session`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': await AsyncStorage.getItem('sessionCookie'),
      },
      credentials: 'include',
    });

    const data = await response.json();
    if (data.status === 'success') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const isValidSession = await validateSession();
      dispatch({ type: 'SET_AUTH', payload: isValidSession });
    } catch (error) {
      console.error('Error checking authentication status:', error);
      dispatch({ type: 'SET_AUTH', payload: false });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
