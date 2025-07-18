'use client';

import Link from 'next/link';

// material-ui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import AuthFooter from 'components/ui-component/cards/AuthFooter';
import useAuth from 'hooks/useAuth';
import AuthWrapper1 from 'components/authentication/AuthWrapper1';
import AuthCardWrapper from 'components/authentication/AuthCardWrapper';
import Logo from 'components/ui-component/Logo';
import AuthLogin from 'components/authentication/auth-forms/AuthLogin';
import LocalizationSection from 'layout/MainLayout/Header/LocalizationSection';
import { FormattedMessage } from 'react-intl';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const { isLoggedIn } = useAuth();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Box display="flex" justifyContent="flex-end" sx={{ p: 2 }}>
        <LocalizationSection />
      </Box>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Link href="#" aria-label="logo">
                      <Logo />
                    </Link>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography gutterBottom variant={downMD ? 'h3' : 'h2'}>
                            <FormattedMessage id="login-welcome" />
                          </Typography>
                          <Typography variant="caption" color="primary" fontSize="16px" textAlign={{ xs: 'center', md: 'inherit' }}>
                            <FormattedMessage id="login-instructions" />
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography
                        component={Link}
                        href={isLoggedIn ? '/pages/authentication/auth3/register' : '/register'}
                        variant="subtitle1"
                        sx={{ textDecoration: 'none' }}
                      >
                        <FormattedMessage id="login-register-prompt" />
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
