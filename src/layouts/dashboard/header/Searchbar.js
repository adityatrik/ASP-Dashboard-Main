import { useState } from 'react';
// @mui
import { styled, makeStyles } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener, Typography, Box, Container, Grid } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
import profileImage from '../logo/LEICA-LOGO.png';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledSearchbar = styled('div')(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: HEADER_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));


// ----------------------------------------------------------------------

export default function Searchbar() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <Grid container spacing={2} alignItems="center" justifyContent="center" textAlign="center" sx={{mr:5}}      >
        <Grid item>
          <img src={profileImage} alt="gambar" width="60px" />
        </Grid>
        <Grid item>
          <Typography variant='h3' sx={{ color: "black", textAlign: 'center' }}>
            LEICA INDONESIA
          </Typography>
        </Grid>
      </Grid>
  );
}
