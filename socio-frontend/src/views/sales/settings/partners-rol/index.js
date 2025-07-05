// material-ui
import Grid from '@mui/material/Grid';

// project import
import FullFeaturedCrudGrid from './FullFeatured';
import { gridSpacing } from 'store/constant';

// ==============================|| INLINE EDITING DATA GRID ||============================== //

export default function InlineEditing() {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <FullFeaturedCrudGrid />
      </Grid>
    </Grid>
  );
}
