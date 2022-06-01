import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

import ribat_logo from 'images/ribat_logo.png'
// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx }) {
  return (
    <RouterLink to="/">
      <Box component="img" src={ribat_logo} sx={{ width: 100, height: "100%", ...sx }} />
    </RouterLink>
  );
}