import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import { Grid, Button, Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover, Backdrop, Modal, Fade, TextField } from '@mui/material';
// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  // overflowY: "scroll",
  maxHeight: "90%",
  borderRadius: 3,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  // overflow: 'hidden',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AccountPopover() {
  const [openProfile, setopenProfile] = useState(null);

  const handleOpenProfile = (event) => {
    setopenProfile(event.currentTarget);
  };

  const [open, setOpen] = useState(false);
  const [addNama, setAddNama] = useState("");

  const handleCloseProfile = () => {
    setopenProfile(null);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  const handleSubmit = (event) => {
    setOpen(false);
  };

  const handleNameChange = (event) => {
    setAddNama(event.target.value)
  }

  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      <IconButton
        onClick={handleOpenProfile}
        sx={{
          p: 0,
          ...(openProfile && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={account.photoURL} alt="photoURL" />
      </IconButton>

      <div>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Profile
              </Typography>
              <form onSubmit={handleSubmit}>
                <div>
                  <TextField sx={{ mt: 2, width: '630px' }} label="Nama Perusahaan" value={addNama} onChange={handleNameChange} />
                </div>
              </form>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button sx={{ mt: 2 }} type="submit" onClick={handleSubmit}>SIMPAN</Button>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Button sx={{ mt: 2 }} type="cancel" onClick={handleClose}>BATAL</Button>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Modal>
      </div>

      <Popover
        open={Boolean(openProfile)}
        anchorEl={openProfile}
        onClose={handleCloseProfile}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            ADMIN
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            Super User
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem onClick={handleOpen}>Profile</MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
