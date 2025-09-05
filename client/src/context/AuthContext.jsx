// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from './authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
        isAuthenticated: true
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: 'AUTH_START' });
        const response = await authService.getCurrentUser();
        
        if (response?.success && response.data?.user) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user: response.data.user }
          });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.login(credentials);

      if (response?.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.data.user }
        });
        toast.success('Login successful! Welcome back.');
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await authService.signup(userData);

      if (response?.success && response.data?.user) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user: response.data.user }
        });
        toast.success('Account created successfully! Welcome aboard.');
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
      dispatch({
        type: 'AUTH_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if server request fails
      dispatch({ type: 'AUTH_LOGOUT' });
      toast.info('Logged out locally');
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};