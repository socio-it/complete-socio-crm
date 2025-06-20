// material-ui
import { Masonry } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FormattedMessage } from 'react-intl';

// project imports
import { cards } from './CardData';
import PeopleCard from './PeopleCard';

// =============================|| LANDING - FEATURE PAGE ||============================= //

const PeopleSection = () => {
  let cardResult = <></>;
  if (cards && cards.length > 0) {
    cardResult = cards.map((card, index) => (
      <Grid key={index} item>
        <PeopleCard
          id={card.id}
          image={card.image ? card.image : ''}
          name={card.name}
          tag={card.tag}
          content={card.content}
          view={card.view}
        />
      </Grid>
    ));
  }

  return (
    <Container>
      <Grid container spacing={7.5} justifyContent="center">
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Stack spacing={1.25} alignItems="center">
            <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              <FormattedMessage id="testaments" />
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
              <FormattedMessage id="testaments-desc" />
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} alignItems="center">
            <Masonry columns={{ xs: 1, sm: 2, md: 3, xl: 4 }} spacing={2}>
              {cardResult}
            </Masonry>
            <Box>
              <Button variant="outlined" component={Link} href="https://links.codedthemes.com/hsqll" target="_blank">
                <FormattedMessage id="read-more" />
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PeopleSection;
