'use client';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project imports
import Loader from 'components/ui-component/Loader';
import MainCard from 'components/ui-component/cards/MainCard';
import Breadcrumbs from 'components/ui-component/extended/Breadcrumbs';

import { DASHBOARD_PATH, ThemeMode } from 'config';
import { dispatch } from 'store';
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import { getUserStory, getUserStoryOrder, getProfiles, getComments, getItems, getColumns, getColumnsOrder } from 'store/slices/kanban';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ==============================|| APPLICATION - KANBAN ||============================== //

export default function KanbanPage({ children }) {
  const theme = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { menuMaster } = useGetMenuMaster();

  let tab = 'board';
  let breadcrumbTitle = '';
  let breadcrumbHeading = '';

  switch (pathname) {
    case '/apps/kanban/backlogs':
      tab = 'backlogs';
      breadcrumbTitle = 'Backlogs';
      breadcrumbHeading = 'Backlogs';
      break;
    case '/apps/kanban/board':
    default:
      tab = 'board';
      breadcrumbTitle = 'Board';
      breadcrumbHeading = 'Taskboard';
  }

  const [value, setValue] = useState(tab);
  const [loading, setLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.replace(`/apps/kanban/${newValue}`);
  };

  useEffect(() => {
    setValue(tab);
  }, [tab]);

  let breadcrumbLinks = [{ title: 'Home', to: DASHBOARD_PATH }, { title: 'Kanban', to: '/apps/kanban/board' }, { title: breadcrumbTitle }];
  if (tab === 'board') {
    breadcrumbLinks = [{ title: 'Home', to: DASHBOARD_PATH }, { title: 'Kanban' }];
  }

  useEffect(() => {
    if (menuMaster.openedItem !== 'kanban') handlerActiveItem('kanban');
    // eslint-disable-next-line
  }, [pathname]);

  useEffect(() => {
    const items = dispatch(getItems());
    const columns = dispatch(getColumns());
    const columnOrder = dispatch(getColumnsOrder());
    const profile = dispatch(getProfiles());
    const comments = dispatch(getComments());
    const story = dispatch(getUserStory());
    const storyOrder = dispatch(getUserStoryOrder());

    Promise.all([items, columns, columnOrder, profile, comments, story, storyOrder]).then(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Breadcrumbs custom heading={breadcrumbHeading} links={breadcrumbLinks} />
      <Box sx={{ display: 'flex' }}>
        <Grid container>
          <Grid item xs={12}>
            <MainCard contentSX={{ p: 2 }}>
              <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                sx={{
                  px: 1,
                  pb: 2,
                  '& a': {
                    minWidth: 10,
                    px: 1,
                    py: 1.5,
                    mr: 2.25,
                    color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  },
                  '& a.Mui-selected': {
                    color: 'primary.main'
                  },
                  '& a > svg': {
                    marginBottom: '0px !important',
                    mr: 1.25
                  }
                }}
              >
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  value="board"
                  href="/apps/kanban/board"
                  label={value === 'board' ? 'Board' : 'View as Board'}
                  {...a11yProps(0)}
                />
                <Tab
                  sx={{ textTransform: 'none' }}
                  component={Link}
                  value="backlogs"
                  href="/apps/kanban/backlogs"
                  label={value === 'backlogs' ? 'Backlogs' : 'View as Backlog'}
                  {...a11yProps(1)}
                />
              </Tabs>
              {children}
            </MainCard>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

KanbanPage.propTypes = {
  children: PropTypes.node
};
