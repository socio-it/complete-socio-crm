// third party
import { Roboto } from 'next/font/google';

export const BASE_PATH = '';

export const DASHBOARD_PATH = '/dashboard/default';
export const HORIZONTAL_MAX_ITEM = 7;

export const MenuOrientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

export const ThemeMode = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const ThemeDirection = {
  LTR: 'ltr',
  RTL: 'rtl'
};

const roboto = Roboto({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

const config = {
  menuOrientation: MenuOrientation.HORIZONTAL,
  miniDrawer: false,
  fontFamily: roboto.style.fontFamily,
  borderRadius: 8,
  outlinedFilled: true,
  mode: ThemeMode.DARK,
  presetColor: 'default',
  i18n: 'en',
  themeDirection: ThemeDirection.LTR,
  container: false
};

export default config;

// 👇 Esta línea está bien si sigues usando el Auth0Context (aunque sea con Azure)
export const APP_AUTH = 'AUTH0';
