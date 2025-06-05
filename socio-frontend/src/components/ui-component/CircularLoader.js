// material-ui
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

// ==============================|| LOADER - CIRCULAR ||============================== //

const CircularLoader = () => (
  <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
    <CircularProgress />
  </Stack>
);

export default CircularLoader;
