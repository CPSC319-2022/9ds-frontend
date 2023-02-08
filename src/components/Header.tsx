import { AppBar, Box, Button,Grid, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
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

  const textTheme = {textTransform: 'capitalize', fontFamily:'roboto', fontSize: 16, px:1};

  return <Box sx={{py:16, px:16, color:'black'}}>
            <AppBar position="static" color='transparent' sx={{color: 'black', borderRadius:2, border:2, py:1}}>
              <Toolbar>
                  <Grid container   direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                  <Box
                      component="img"
                      sx={{ ml:24, borderRadius:3 }}
                      alt="Logo"
                      src={require('../assets/logo.png')}
                    />                  
                      <Grid item  >
                        <Box sx={{ gap:96, flexGrow: 1, display:{ xs: 'none', md: 'flex'} }}>
                          <Button
                            onClick={() => navigate('/')}
                            sx={{ color: 'black.main'}}
                          >
                            <Typography sx={textTheme}>
                              Home
                            </Typography>
                          </Button>
                          <IconButton
                            sx={{ color:'black.main'}}
                            onClick={handleClick}
                          >
                            <Typography sx={textTheme}>
                              Blog
                            </Typography>
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
                            sx={{color: 'black.main', display: 'block' }}
                          >
                            <Typography sx={textTheme}>
                              About Us
                            </Typography>
                          </Button>
                        </Box>
                      </Grid>

                      <Grid item>
                        <Box sx={{ gap: 16, flexGrow: 1, display:  'flex'}}>
                          <Button
                            onClick={() => navigate('/login')}
                            sx={{ border: 1,color: 'black.main', display: 'block' }}
                          >
                            <Typography sx={{ fontSize:14}}>
                              Login
                            </Typography>
                            </Button>
                          <Button
                            onClick={() => navigate('/signup')}
                            sx={{ backgroundColor: 'black.main', border: 1,color: 'white.main', display: 'block', mr:24}}
                          >
                            <Typography sx={{ fontSize:14}}>
                              Sign Up
                            </Typography>
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
              </Toolbar>
            </AppBar>
          </Box>
  }

