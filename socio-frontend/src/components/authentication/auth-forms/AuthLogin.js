import PropTypes from 'prop-types';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AnimateButton from 'components/ui-component/extended/AnimateButton';

// ===============================|| ADFS LOGIN BUTTON ||============================== //

const ADFSLogin = ({ redirectUri }) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const redirect = redirectUri || `${backend}/`;
  const handleLogin = () => {
    window.location.href = `${backend}/api/oauth2/login?redirect_uri=${encodeURIComponent(redirect)}`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <AnimateButton>
        <Button color="primary" fullWidth size="large" variant="contained" onClick={handleLogin}>
          Login with Microsoft
        </Button>
      </AnimateButton>
    </Box>
  );
};

ADFSLogin.propTypes = {
  redirectUri: PropTypes.string
};

export default ADFSLogin;
