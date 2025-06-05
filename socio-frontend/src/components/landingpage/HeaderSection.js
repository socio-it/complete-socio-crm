import { useMemo } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
import { motion } from 'framer-motion';
import { FormattedMessage } from 'react-intl';

// project imports
import AnimateButton from 'components/ui-component/extended/AnimateButton';

import { DASHBOARD_PATH, ThemeDirection, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// assets
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const TechLight = '/assets/images/landing/tech-light.svg';
const TechDark = '/assets/images/landing/tech-dark.svg';
const dashboard = '/assets/images/landing/hero-dashboard.png';
const widget1 = '/assets/images/landing/hero-widget-1.png';
const widget2 = '/assets/images/landing/hero-widget-2.png';
const BgDark = '/assets/images/landing/bg-hero-block-dark.png';
const BgLight = '/assets/images/landing/bg-hero-block-light.png';

// styles
const HeaderImage = styled('img')(({ theme }) => ({
  maxWidth: '100%',
  borderRadius: 20,
  transform: 'scale(1.7)',
  transformOrigin: theme.direction === 'rtl' ? '100% 50%' : '0 50%',
  [theme.breakpoints.down('xl')]: {
    transform: 'scale(1.5)'
  },
  [theme.breakpoints.down('lg')]: {
    transform: 'scale(1.2)'
  }
}));

const HeaderAnimationImage = styled('img')({
  maxWidth: '100%',
  filter: 'drop-shadow(0px 0px 50px rgb(33 150 243 / 30%))'
});

// ==============================|| LANDING - HEADER PAGE ||============================== //

const HeaderSection = () => {
  const { mode, themeDirection } = useConfig();

  const headerSX = { fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem', lg: '3.5rem' } };

  const HeaderAnimationImagememo = useMemo(
    () => (
      <HeaderAnimationImage
        src={mode === ThemeMode.DARK ? BgDark : BgLight}
        alt="Berry"
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'absolute',
          filter: 'none',
          bottom: { md: 0 },
          right: 0,
          width: '50%',
          transformOrigin: '50% 50%',
          transform: themeDirection === ThemeDirection.RTL ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      />
    ),
    [themeDirection, mode]
  );

  return (
    <Container sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container  justifyContent="space-between" alignItems="center" sx={{ mt: { xs: 10, sm: 6, md: 18.75 }, mb: { xs: 2.5, md: 10 } }}>
        <Grid item xs={12} md={5}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30 }}
              >
                <Stack spacing={1}>
                  <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1" sx={headerSX}>
                    <FormattedMessage id="discover-ai-power" />
                  </Typography>
                  <Typography textAlign={{ xs: 'center', md: 'left' }} variant="h1"  color="primary" sx={{headerSX,fontSize:30}}>
                    <FormattedMessage id="automate-tasks-slogan" />
                  </Typography>
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} sx={{ mt: -2.5, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                {/* 
                                <Typography
                  textAlign={{ xs: 'center', md: 'left' }}
                  color="text.primary"
                  variant="body1"
                  sx={{ fontSize: { xs: '1rem', md: '1.125rem' } }}
                >
                  Automatiza tareas, acelera decisiones y libera a tu equipo para innovar.
                </Typography>*/}
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <Grid container spacing={2} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Grid item>
                    <AnimateButton>
                      <Button
                        component={Link}
                        href={DASHBOARD_PATH}
                        target="_blank"
                        size="large"
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                      >
                        <FormattedMessage id="our-products" />
                      </Button>
                    </AnimateButton>
                  </Grid>
                  <Grid item>
                    <Button component={Link} href="https://links.codedthemes.com/hsqll" target="_blank" size="large">
                      <FormattedMessage id="get-them-now" />
                    </Button>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' } }}>
          {/*
          <Box
      component="video"
      src="/videos/video_entrada_2.mp4"
      autoPlay
      muted
      loop
      sx={{
        width: '120%',
        marginLeft: 4,
        height: 'auto',
        display: 'block',
        opacity: 0.2,
        backgroundColor: '#111936',

        filter: 'brightness(2) contrast(100%) saturate(100%) hue-rotate(-30deg)', 
      }}
    />
           */}

  <video
    src="/videos/video_entrada_3.mp4"
    autoPlay
    muted
    loop
    style={{ width: '110%', height: 'auto', marginLeft:60, borderRadius: '25px' }}
  />      

          
          {HeaderAnimationImagememo}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HeaderSection;


/*

            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.6 }}
              >
                <Stack direction="row" spacing={2} alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <CardMedia
                    component="img"
                    image={mode === ThemeMode.BgLight ? TechDark : TechLight}
                    alt="Berry Tech"
                    sx={{ width: { xs: '75%', sm: '50%', md: '75%' } }}
                  />
                </Stack>
              </motion.div>
            </Grid>
        <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Box sx={{ position: 'relative', mt: 8.75, zIndex: 9 }}>
            <HeaderImage src={dashboard} alt="Berry" />
            <Box
              sx={{
                position: 'absolute',
                top: { md: -35, lg: -110 },
                right: themeDirection === ThemeDirection.RTL ? 170 : { md: -50, lg: -140, xl: -220 },
                width: { md: 220, lg: 290 },
                animation: '10s slideY linear infinite'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.2 }}
              >
                <HeaderAnimationImage src={widget1} alt="Berry" />
              </motion.div>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                bottom: { md: -20, lg: -90 },
                left: { md: 100, lg: 300 },
                width: { md: 220, lg: 280 },
                animation: '10s slideY linear infinite',
                animationDelay: '2s'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 30, delay: 0.4 }}
              >
                <HeaderAnimationImage src={widget2} alt="Berry" />
              </motion.div>
            </Box>
          </Box>
          {HeaderAnimationImagememo}
        </Grid>
*/