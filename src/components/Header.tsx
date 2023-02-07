import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useState } from "react";

export const Header = () => {

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    return <Typography> 
              <AppBar position="static" color='transparent'>
                <Toolbar  sx={{  flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <img src="9ds_logo.png" alt="logo" />
                    <Box sx={{ gap: 2, color: 'black', flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                          onClick={() => navigate('/')}
                          sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                          Home
                        </Button>
                    
                    <IconButton
                      sx={{ color:'black'}}
                      onClick={handleClick}
                    >
                      Blog
                      <ArrowDropDownIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose}>Menu Item 1</MenuItem>
                      <MenuItem onClick={handleClose}>Menu Item 2</MenuItem>
                      <MenuItem onClick={handleClose}>Menu Item 3</MenuItem>
                    </Menu>
                    
                        <Button
                          onClick={() => navigate('/about')}
                          sx={{ my: 2, color: 'black', display: 'block' }}
                        >
                          About Us
                        </Button>
                    </Box>
                    <Box sx={{ gap: 2, flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                          onClick={() => navigate('/login')}
                          sx={{ border: 1, my: 2, color: 'black', display: 'block' }}
                        >
                          Login
                        </Button>
                        <Button
                          onClick={() => navigate('/signup')}
                          sx={{ backgroundColor: 'black', border: 1, my: 2, color: 'white', display: 'block' }}
                        >
                          Sign Up
                        </Button>
                    </Box>
                </Toolbar>
              </AppBar>
            </Typography>
  }

