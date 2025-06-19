// AzureADContext.js

import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

// project imports
import Loader from 'components/ui-component/Loader';
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

const AzureADContext = createContext(null);

// Initial state
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

// MSAL config
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID, // Azure Client ID
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}`, // Tenant ID o nombre
    redirectUri: 'http://localhost:3000'
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export const AzureADProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = msalInstance.getAllAccounts();

        if (accounts.length > 0) {
          const account = accounts[0];
          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user: {
                id: account.localAccountId,
                email: account.username,
                name: account.name
              }
            }
          });
        }

        dispatch({ type: 'INIT', payload: { isInitialized: true } });
      } catch (err) {
        console.error('MSAL init error:', err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);

  const getAccessToken = async () => {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) return null;

      const account = accounts[0];

      try {
        const result = await msalInstance.acquireTokenSilent({
          account,
          scopes: [`api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/access_as_user`]
        });

        localStorage.setItem('accessToken', result.accessToken);

        return result.accessToken;
      } catch (err) {
        console.error('Error al obtener accessToken:', err);
        return null;
      }
    };


  const login = async () => {
    try {
      await msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'email']
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    const account = msalInstance.getAllAccounts()[0];
    msalInstance.logoutRedirect({
      account
    });

    dispatch({ type: LOGOUT });
  };

  const resetPassword = async () => {}; // Implementable con flows de Azure B2C si lo necesitas

  const updateProfile = () => {}; // Opcional

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <AzureADContext.Provider value={{ ...state, login, logout, resetPassword, updateProfile, getAccessToken }}>
      {children}
    </AzureADContext.Provider>
  );
};

AzureADProvider.propTypes = {
  children: PropTypes.node
};

export default AzureADContext;
