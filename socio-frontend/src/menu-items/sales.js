// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  IconShoppingBagDiscount,
  IconRobot,
  IconSettings
} from '@tabler/icons-react';

// constant
const icons = {
  IconShoppingBagDiscount,
  IconRobot,
  IconSettings
};

// ==============================|| SALES MENU ITEMS ||============================== //

const sales = {
  id: 'sales',
  title: <FormattedMessage id="sales" />,
  icon: icons.IconShoppingBagDiscount,
  type: 'group',
  children: [
    {
      id: 'agents',
      title: <FormattedMessage id="agents" />,
      type: 'collapse',
      icon: icons.IconRobot,
      children: [
        {
          id: 'email-agent-base',
          title: <FormattedMessage id="email-agent-base" />,
          type: 'item',
          url: '/sales/agents/email-agent-base',
          breadcrumbs: false
        },
      ]
    },
    {
      id: 'settings',
      title: <FormattedMessage id="settings" />,
      type: 'collapse',
      icon: icons.IconSettings,
      children: [
        {
          id: 'partners-rol',
          title: <FormattedMessage id="partners-rol" />,
          type: 'item',
          url: '/sales/settings/partners-rol',
          breadcrumbs: false
        },
      ]
    },
  ]
};

export default sales;