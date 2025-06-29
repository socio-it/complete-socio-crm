// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconBrush, IconTools } from '@tabler/icons-react';

// constant
const icons = {
  IconBrush,
  IconTools
};

// ==============================|| UI ELEMENTS MENU ITEMS ||============================== //

const agents = {
  id: 'agents',
  title: <FormattedMessage id="agents" />,
  icon: icons.IconBrush,
  type: 'group',
  children: [
    {
        id: 'outlook-tasks-agent',
        title: <FormattedMessage id="outlook-tasks-agent" />,
        type: 'item',
        url: '/dashboard/outlook-tasks',
        breadcrumbs: false
    },
  ]
};

export default agents;
