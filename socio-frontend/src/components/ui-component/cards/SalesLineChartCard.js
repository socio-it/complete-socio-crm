import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third party
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ============================|| SALES LINE CARD ||============================ //

const SalesLineChartCard = ({ bgColor, chartData, footerData, icon, title, percentage }) => {
  const theme = useTheme();

  let footerHtml;
  if (footerData) {
    footerHtml = footerData.map((item, index) => (
      <Grid item key={index}>
        <Box sx={{ my: 3, p: 1 }}>
          <Stack spacing={0.75} alignItems="center">
            <Typography variant="h3">{item.value}</Typography>
            <Typography variant="body1">{item.label}</Typography>
          </Stack>
        </Box>
      </Grid>
    ));
  }

  return (
    <Card>
      <Box sx={{ color: '#fff', bgcolor: bgColor || theme.palette.primary.dark, p: 3 }}>
        <Grid container direction="column" spacing={1}>
          <Grid item container justifyContent="space-between" alignItems="center">
            {title && (
              <Grid item>
                <Typography variant="subtitle1" color="inherit">
                  {title}
                </Typography>
              </Grid>
            )}
            <Grid item>
              <Stack direction="row" alignItems="center" spacing={2}>
                {icon && (
                  <Box
                    component="span"
                    sx={{
                      mr: 2
                    }}
                  >
                    {icon}
                  </Box>
                )}
                {percentage && (
                  <Typography variant="subtitle1" color="inherit">
                    {percentage}
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>
          {chartData && (
            <Grid item>
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type={chartData.options?.chart?.type}
                height={chartData.options?.chart?.height}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      {footerData && (
        <Grid container alignItems="center" justifyContent="space-around">
          {footerHtml}
        </Grid>
      )}
    </Card>
  );
};

SalesLineChartCard.propTypes = {
  title: PropTypes.string,
  chartData: PropTypes.object,
  footerData: PropTypes.array,
  bgColor: PropTypes.string,
  icon: PropTypes.element,
  percentage: PropTypes.string
};

export default SalesLineChartCard;
