import { AppBar, Box, Button,Grid, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
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

    return <Box sx={{py:2, px:2}}>
              <AppBar position="static" color='transparent' sx={{ borderRadius:2, border:2, py:1}}>
                <Toolbar>
                    <Grid container   direction="row"
                          justifyContent="space-between"
                          alignItems="center">
                    <Box
                        component="img"
                        sx={{ ml:1 }}
                        alt="Logo"
                        src={require('../assets/logo.png')}
                      />                  
                        
                        <Grid item  >
                          <Box sx={{ gap:8, color: 'black', flexGrow: 1, display:{ xs: 'none', md: 'flex'} }}>
                            <Button
                              onClick={() => navigate('/')}
                              sx={{ color: 'black', display: 'block' }}
                            >
                              <Typography sx={textTheme}>
                                Home
                              </Typography>
                            </Button>
                            <IconButton
                              sx={{ color:'black'}}
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
                              sx={{color: 'black', display: 'block' }}
                            >
                              <Typography sx={textTheme}>
                                About Us
                              </Typography>
                            </Button>
                          </Box>
                        </Grid>

                        <Grid item>
                          <Box sx={{ gap: 2, flexGrow: 1, display:  'flex' }}>
                            <Button
                              onClick={() => navigate('/login')}
                              sx={{ border: 1,color: 'black', display: 'block' }}
                            >
                              <Typography sx={textTheme}>
                                Login
                              </Typography>
                              </Button>
                            <Button
                              onClick={() => navigate('/signup')}
                              sx={{ backgroundColor: 'black', border: 1,color: 'white', display: 'block', mr:1}}
                            >
                              <Typography sx={textTheme}>
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

