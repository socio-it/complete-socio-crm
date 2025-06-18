import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

// project imports
import Loader from 'components/ui-component/Loader';
import axios from 'utils/axios';
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

let msalClient;

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const MSALContext = createContext(null);

export const MSALProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    if (!msalClient) {
      msalClient = new PublicClientApplication({
        auth: {
          clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
          authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
          redirectUri: typeof window !== 'undefined' ? window.location.origin : ''
        }
      });
    }

    const init = async () => {
      try {
        const accounts = msalClient.getAllAccounts();
        if (accounts.length > 0) {
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                email: accounts[0].username
              }
            }
          });
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const login = async () => {
    const result = await msalClient.loginPopup({ scopes: ['openid', 'profile', 'email'] });
    const token = result.accessToken;
    const response = await axios.post(
      '/api/auth/msal-login/',
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { token: serviceToken, user } = response.data;
    localStorage.setItem('serviceToken', serviceToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const loginWithToken = (serviceToken, user) => {
    localStorage.setItem('serviceToken', serviceToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const logout = () => {
    if (msalClient) {
      msalClient.logoutPopup();
    }
    localStorage.removeItem('serviceToken');
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {};
  const updateProfile = () => {};

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <MSALContext.Provider value={{ ...state, login, loginWithToken, logout, resetPassword, updateProfile }}>
      {children}
    </MSALContext.Provider>
  );
};

MSALProvider.propTypes = {
  children: PropTypes.node
};

export default MSALContext;
