import PropTypes from 'prop-types';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'components/ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { DASHBOARD_PATH } from 'config';
import { useIntl, FormattedMessage } from 'react-intl';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ===============================|| JWT LOGIN ||=============================== //

const JWTLogin = ({ loginProp, ...others }) => {
  const theme = useTheme();
  const intl = useIntl();
  const router = useRouter();
  const { login } = useAuth();
  const scriptedRef = useScriptRef();

  const [checked, setChecked] = React.useState(true);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: 'info@codedthemes.com',
        password: '123456',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(intl.formatMessage({ id: 'login-valid-email' }))
          .max(255)
          .required(intl.formatMessage({ id: 'login-email-required' })),
        password: Yup.string()
          .max(255)
          .required(intl.formatMessage({ id: 'login-password-required' }))
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);
          if (scriptedRef.current) {
            setStatus({ success: true });
            router.push(DASHBOARD_PATH);
            setSubmitting(false);
          }
        } catch (err) {
          console.error(err);
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-login">
              <FormattedMessage id="login-email-label" />
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              inputProps={{}}
              label={intl.formatMessage({ id: 'login-email-label' })}
            />
            {touched.email && errors.email && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">
              <FormattedMessage id="login-password-label" />
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              inputProps={{}}
              label={intl.formatMessage({ id: 'login-password-label' })}
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
            </Grid>

            {/*
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />
                }
                label="Keep me logged in"
              />
            </Grid>
            */}
            <Grid item>
              <Typography
                variant="subtitle1"
                component={Link}
                href={loginProp ? `/pages/authentication/auth${loginProp}/forgot-password` : '/pages/authentication/auth3/forgot-password'}
                sx={{ textDecoration: 'none' }}
              >
                <FormattedMessage id="login-forgot-password" />
              </Typography>
            </Grid>
          </Grid>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}
          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="primary" disabled={isSubmitting} sx={{'&:hover': {cursor:'pointer',},}} fullWidth size="large" type="submit" variant="contained">
                <FormattedMessage id="login-submit" />
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTLogin.propTypes = {
  loginProp: PropTypes.number
};

export default JWTLogin;
