'use client';

import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// third-party
import { IntlProvider } from 'react-intl';

// project import
import useConfig from 'hooks/useConfig';

// load locales files
const loadLocaleData = (i18n) => {
  switch (i18n) {
    case 'es':
      return import('../../utils/locales/es.json');
    case 'fr':
      return import('../../utils/locales/fr.json');
    case 'ro':
      return import('../../utils/locales/ro.json');
    case 'zh':
      return import('../../utils/locales/zh.json');
    default:
      return import('../../utils/locales/en.json');
  }
};

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  const { i18n } = useConfig();
  const [messages, setMessages] = useState();

  useEffect(() => {
    loadLocaleData(i18n).then((d) => {
      setMessages(d.default);
    });
  }, [i18n]);

  return (
    <>
      {messages && (
        <IntlProvider locale={i18n} defaultLocale="en" messages={messages}>
          {children}
        </IntlProvider>
      )}
    </>
  );
};

Locales.propTypes = {
  children: PropTypes.node
};

export default Locales;
