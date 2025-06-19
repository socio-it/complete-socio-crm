// MSALProvider.jsx
import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

// imports propios del proyecto
import Loader from 'components/ui-component/Loader';
import axios from 'utils/axios';
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

const backendClientId = process.env.NEXT_PUBLIC_AZURE_BACKEND_CLIENT_ID;
// 1️⃣  Contexto y cliente MSAL (variable global para evitar múltiples instancias)
const MSALContext = createContext(null);
let msalClient; // <-- ¡sin tipos!

export const MSALProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, {
    isLoggedIn: false,
    isInitialized: false,
    user: null
  });

  useEffect(() => {
    const bootstrap = async () => {
      // 2️⃣  Instanciar solo una vez
      if (!msalClient) {
        msalClient = new PublicClientApplication({
          auth: {
            clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
            authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID}`,
            redirectUri: 'http://localhost:3000/dashboard/analytics'//typeof window !== 'undefined' ? window.location.origin : ''
          }
        });

        // 3️⃣  ¡IMPORTANTE! inicializar antes de usar cualquier API
        await msalClient.initialize(); // <- evita el error
      }

      // 4️⃣  Comprobar sesión
      const accounts = msalClient.getAllAccounts();
      localStorage.setItem('serviceToken', accounts[0].idToken)
      
      if (accounts.length > 0) {
        dispatch({
          type: LOGIN,
          payload: {
            isLoggedIn: true,
            user: { email: accounts[0].username }
          }
        });
      } else {
        dispatch({ type: LOGOUT });
      }

      // 5️⃣  Marcar provider como listo
      dispatch({ type: 'INITIALIZED' });
    };

    bootstrap().catch(() => dispatch({ type: LOGOUT }));
  }, []);

  // ---------- Acciones ----------
  const login = async () => {
    const { accessToken } = await msalClient.loginPopup({
      scopes: ['openid', 'profile', 'email',`api://${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID}/access_as_user`,]
    });

    const { data } = await axios.post(
      '/api/auth/msal-login/',
      {},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    localStorage.setItem('serviceToken', data.token);
    dispatch({
      type: LOGIN,
      payload: { isLoggedIn: true, user: data.user }
    });
  };

  const loginWithToken = (serviceToken, user) => {
    localStorage.setItem('serviceToken', serviceToken);
    dispatch({ type: LOGIN, payload: { isLoggedIn: true, user } });
  };

  const logout = () => {
    msalClient?.logoutPopup(); // cierra sesión en MSAL
    localStorage.removeItem('serviceToken');
    dispatch({ type: LOGOUT });
  };

  // ---------- Render ----------
  if (!state.isInitialized) return <Loader />;

  return (
    <MSALContext.Provider
      value={{ ...state, login, loginWithToken, logout }}
    >
      {children}
    </MSALContext.Provider>
  );
};

MSALProvider.propTypes = { children: PropTypes.node };
export default MSALContext;
