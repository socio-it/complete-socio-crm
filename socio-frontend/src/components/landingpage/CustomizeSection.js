import Link from 'next/link';

// material-ui
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import { FormattedMessage } from 'react-intl';

// assets
import { IconCircleCheck } from '@tabler/icons-react';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';


const LayerLeft = '/bot_en_tablero.png';
//const LayerLeft = '/assets/images/landing/customization-left.png';
const LayerRight = '/assets/images/landing/customization-right.png';

// ==============================|| LANDING - CUSTOMIZE ||============================== //

const CustomizeSection = () => {
  const listSX = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    padding: '10px 0',
    fontSize: '1rem',
    color: 'grey.900',
    svg: { color: 'secondary.main' }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container justifyContent="space-between" alignItems="center" spacing={{ xs: 1.5, sm: 2.5, md: 3, lg: 5 }}>
        <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
          <Stack sx={{ width: '75%', mb: 5, mx: 'auto' }}>
            <CardMedia component="img" image={LayerLeft} alt="Layer" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 2 }}>
                <FormattedMessage id="simple-user-experience" />
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.primary"
                sx={{
                  fontSize: '1rem',
                  zIndex: '99',
                  width: { xs: '100%', sm: '100%', md: 'calc(100% - 20%)' }
                }}
              >
                <FormattedMessage id="solutions-customizable" />
              </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography sx={listSX}>
                  <IconCircleCheck color='#2196F3' size={20} />
                  <FormattedMessage id="clear-structure" />
                </Typography>
                <Typography sx={listSX}>
                  <IconCircleCheck size={20} color='#2196F3'/>
                  <FormattedMessage id="clean-modular" />
                </Typography>
                <Typography sx={listSX}>
                  <IconCircleCheck size={20} color='#2196F3'/>
                  <FormattedMessage id="quick-setup" />
                </Typography>
                <Typography sx={listSX}>
                  <IconCircleCheck size={20} color='#2196F3'/>
                  <FormattedMessage id="multiple-layout" />
                </Typography>
                <Typography sx={listSX}>
                  <IconCircleCheck size={20} color='#2196F3'/>
                  <FormattedMessage id="single-page-theme" />
                </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/*
        <Grid item xs={12}>
          <Grid container spacing={2.5} direction={{ xs: 'column-reverse', md: 'row' }}>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' }, mb: 2 }}>
                    Figma Design System
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.primary"
                    sx={{
                      fontSize: '1rem',
                      zIndex: '99',
                      width: { xs: '100%', md: 'calc(100% - 20%)' }
                    }}
                  >
                    Streamlining the development process and saving you time and effort in the initial design phase.
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={listSX}>
                    <IconCircleCheck size={20} />
                    Professional Kit for Designer
                  </Typography>
                  <Typography sx={listSX}>
                    <IconCircleCheck size={20} />
                    Properly Organised Pages
                  </Typography>
                  <Typography sx={listSX}>
                    <IconCircleCheck size={20} />
                    Dark/Light Design
                  </Typography>
                  <Typography sx={listSX}>
                    <IconCircleCheck size={20} />
                    *Figma file included only in Plus & Extended Licenses.
                  </Typography>
                  <Typography sx={listSX}>
                    <IconCircleCheck size={20} />A theme that can be easily configured on a single page.
                  </Typography>
                  <Stack direction="row">
                    <AnimateButton>
                      <Button
                        startIcon={<LayersTwoToneIcon />}
                        sx={{ boxShadow: 'none', my: 4 }}
                        variant="contained"
                        component={Link}
                        href="https://www.figma.com/file/2u2TmauA6lanVMYiywzS1o/berry-figma-v3.0?node-id=0%3A1"
                        target="_blank"
                      >
                        Explore Figma
                      </Button>
                    </AnimateButton>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} sx={{ img: { width: '100%' } }}>
              <Stack sx={{ width: '70%', mx: 'auto' }}>
                <CardMedia component="img" image={LayerRight} alt="Layer" />
              </Stack>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default CustomizeSection;
