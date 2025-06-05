// third party
import { Roboto } from 'next/font/google';

// basename: only at build time to set, and Don't add '/' at end off BASENAME for breadcrumbs, also Don't put only '/' use blank('') instead,
// like '/berry-material-react/react/default'
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
