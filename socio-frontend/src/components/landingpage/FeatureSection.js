import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import CardMedia from '@mui/material/CardMedia';
import { FormattedMessage } from 'react-intl';

// project imports
import FadeInWhenVisible from './Animation';
import SubCard from 'components/ui-component/cards/SubCard';
import Avatar from 'components/ui-component/extended/Avatar';
import { ThemeMode } from 'config';

// assets
const Offer1 = '/assets/images/landing/offer/offer-1.png';
const Offer2 = '/assets/images/landing/offer/offer-2.png';
const Offer3 = '/assets/images/landing/offer/offer-3.png';
const Offer4 = '/assets/images/landing/offer/offer-4.png';
const Offer5 = '/assets/images/landing/offer/offer-5.png';
const Offer6 = '/assets/images/landing/offer/offer-6.png';

// =============================|| LANDING - FEATURE PAGE ||============================= //

const OfferCard = ({ title, caption, image }) => {
  const theme = useTheme();
  const AvaterSx = { background: 'transparent', color: 'secondary.main', width: 56, height: 56 };

  return (
    <FadeInWhenVisible>
      <SubCard
        sx={{
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'grey.100',
          borderColor: 'divider',
          '&:hover': { boxShadow: 'none' },
          height: '100%'
        }}
      >
        <Stack spacing={4}>
          <Avatar variant="rounded" sx={AvaterSx}>
            <CardMedia component="img" src={image} alt="Beautiful User Interface" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h3" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              {caption}
            </Typography>
          </Stack>
        </Stack>
      </SubCard>
    </FadeInWhenVisible>
  );
};

OfferCard.propTypes = {
  title: PropTypes.node,
  caption: PropTypes.node,
  image: PropTypes.string
};

const FeatureSection = () => (
  <Container>
    <Grid container spacing={7.5} justifyContent="center">
      <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
        <Grid container spacing={1.5}>
          <Grid item xs={12}>
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              <FormattedMessage id="what-we-offer" />
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ fontSize: '1rem' }}>
              <FormattedMessage id="automation-slogan" />
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={5} sx={{ '&> .MuiGrid-root > div': { height: '100%' } }}>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="email-migration-title" />}
              caption={<FormattedMessage id="email-migration-caption" />}
              image={Offer1}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="meeting-bot-title" />}
              caption={<FormattedMessage id="meeting-bot-caption" />}
              image={Offer2}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="crm-services-title" />}
              caption={<FormattedMessage id="crm-services-caption" />}
              image={Offer3}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="power-automate-title" />}
              caption={<FormattedMessage id="power-automate-caption" />}
              image={Offer4}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="power-apps-title" />}
              caption={<FormattedMessage id="power-apps-caption" />}
              image={Offer5}
            />
          </Grid>
          <Grid item md={4} sm={6}>
            <OfferCard
              title={<FormattedMessage id="ai-agents-title" />}
              caption={<FormattedMessage id="ai-agents-caption" />}
              image={Offer6}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Container>
);

export default FeatureSection;
