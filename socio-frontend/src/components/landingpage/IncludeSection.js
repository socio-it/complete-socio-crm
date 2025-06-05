// material-ui
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { FormattedMessage } from 'react-intl';

// third-party
import Marquee from 'react-fast-marquee';

// project import
import { ThemeMode } from 'config';

// =============================|| LANDING - INCLUDE SECTION ||============================= //

const IncludeSection = () => {
  const theme = useTheme();
  const marqueeSX = {
    display: 'flex',
    width: '100%',
    gap: 6,
    justifyContent: 'space-around',
    '.MuiTypography-root': {
      fontWeight: 600,
      color: theme.palette.mode === ThemeMode.DARK ? 'text.primary' : 'text.secondary',
      '&:hover': {
        color: theme.palette.mode === ThemeMode.DARK ? 'text.secondary' : 'grey.900',
        cursor: 'pointer'
      }
    }
  };

  const margueeFirst = [
    'live-customizer',
    'conceptual-apps-count',
    'highly-flexible',
    'always-updated',
    'beautiful-design',
    'typescript-support',
    'figma-design',
    'dark-light-layouts',
    'rtl',
    'prettier-standard',
    'multi-language-support',
    'auth-methods'
  ];
  const margueeSecond = [
    'auth-methods',
    'multi-language-support',
    'prettier-standard',
    'rtl',
    'dark-light-layouts',
    'figma-design',
    'typescript-support',
    'beautiful-design',
    'highly-flexible',
    'conceptual-apps-count',
    'live-customizer',
    'always-updated'
  ];

  return (
    <Box sx={{ '.overlay': { display: 'none' } }}>
      <Container>
        <Stack spacing={1.25} alignItems="center">
          <Typography variant="h2" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            <FormattedMessage id="well-liked-features" />
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 400 }} align="center">
            <FormattedMessage id="multiple-categories" />
          </Typography>
        </Stack>
      </Container>
      <Stack spacing={4} sx={{ mt: 9, direction: 'initial' }}>
        <Marquee className="marquee-section">
          <Box sx={marqueeSX}>
            {margueeFirst.map((item, index) => (
              <Typography key={index} variant="h2" {...(index === 0 && { sx: { ml: 1 } })}>
                <FormattedMessage id={item} />
              </Typography>
            ))}
          </Box>
        </Marquee>
        <Marquee className="marquee-section" direction="right">
          <Box sx={marqueeSX}>
            {margueeSecond.map((item, index) => (
              <Typography key={index} variant="h2" {...(index === 0 && { sx: { ml: 5 } })}>
                <FormattedMessage id={item} />
              </Typography>
            ))}
          </Box>
        </Marquee>
      </Stack>
    </Box>
  );
};

export default IncludeSection;
