import PropTypes from 'prop-types';

// material-ui
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import ClientDetails from './ClientDetails';

// ==============================|| CLIENT DETAILS - DRAWER ||============================== //

const ClientDrawer = ({ open, setOpen, rowValue }) => {
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        zIndex: 100,
        display: open ? 'block' : 'none',
        '& .MuiDrawer-paper': {
          position: 'relative',
          ...(!downSM && open && { borderTop: '1px solid', borderTopColor: 'divider' }),
          ...(downSM && {
            position: 'absolute'
          }),
          overflow: 'unset',
          width: '100%',
          borderLeft: 'none'
        }
      }}
      variant="persistent"
      anchor="right"
      open={open}
    >
      <ClientDetails rowValue={rowValue} handleDrawerClose={handleDrawerClose} />
    </Drawer>
  );
};

ClientDrawer.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  rowValue: PropTypes.array
};

export default ClientDrawer;
