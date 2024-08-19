import React, { useEffect, useState, useRef, useContext } from 'react';
import { SupportIcon } from '../../../assets/images';
import {
  Box,
  ClickAwayListener,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material';
import MenuItem from './MenuItem';
import { Link, useLocation } from 'react-router-dom';
import jwtInterceptor from '../../../services/interceptors';
import { useSnackbar } from '../../Global/WithSnackbar';
import { themeContext } from '../../../theme';
import SidebarBackground from '../../../assets/images/sidebarBgImg.png'

// interface MenuItemOption {
//   id: string;
//   name: string;
//   role: string;
//   icon: string;
//   subOptions: SubOption[];
//   route: string;
//   disable: boolean;
// }

// interface SubOption {
//   id: number;
//   name: string;
//   route: string;
// }

interface FavItem {
  id: string;
  name: string;
}

// interface SidebarProps {
//   menuItems: MenuItemOption[];
//   favs?: FavItem[];
//   refetchFavs: () => void;
// }

function Sidebar({ menuItems, favs = [], refetchFavs }: any): JSX.Element {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [openSubMenu, setOpenSubMenu] = useState<number>(0);

  const theme = useTheme();
  console.log('theme: ', theme);

  const roles: string[] = (sessionStorage.getItem('roles') ?? '').split(',');
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down('lg'));
  const [openTooltip, setOpenTooltip] = useState<number>(0);
  const { myTheme }: any = useContext(themeContext);
  console.log('myTheme: ', myTheme);

  // get current path
  const { pathname } = useLocation();

  const initialized = useRef<boolean>(false);
  const { showMessage }: any = useSnackbar();
  const bearerToken: string | null = sessionStorage.getItem('token_key');
  const empId: string | null = sessionStorage.getItem('empId_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    setMenuOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (!initialized.current) {
      if (bearerToken) {
        initialized.current = true;
      } else {
        window.location.href = base_url + '/login';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFavCreate = (fav: FavItem) => {
    let url = 'api/FavouriteLink/AddToFavourite';
    jwtInterceptor.post(url, fav).then((response: { data: any }) => {
      console.log('response: ', response);

      showMessage(response.data, 'success');
      refetchFavs();
    });
  };

  const onFavDelete = (favId: string) => {
    let url = 'api/FavouriteLink/RemoveFromFavourite?FavouriteLinkId=' + favId;
    jwtInterceptor.post(url).then((response: { data: any }) => {
      showMessage(response.data, 'success');
      refetchFavs();
    });
  };

  const lineStyle: React.CSSProperties = {
    display: theme.palette.mode === 'light' ? '': 'none',
    border: '0.2px solid #EEEE',
    margin: '10px 0',
    width: '100%',
  };

  const handleOpenTooltip = (id: number) => () => {
    if (isMobile) {
      setOpenTooltip(id);
    }
  };

  const handleCloseTooltip = () => {
    setOpenTooltip(0);
  };

  const handleAddFav = (name: string, route: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    let item: any = {
      favouriteLinkurl: route,
      employeeDetailId: empId,
      title: name,
    };

    if (!favs?.some((fav: any) => fav.name === name)) {
      onFavCreate(item);
    } else {
      let item = favs.filter((fav: any) => fav.name === name);
      onFavDelete(item[0].id);
    }
  };

  const isFavorite = (name: string) => {
    return favs?.some((fav: any) => fav.name === name);
  };

  console.log('fav >>> ', favs);

  const ColoredBox: React.FC<{
    color: string;
    gradientColor: string;
    text: string;
    iconColor: string;
    iconGradientColor: string;
    icon: string;
  }> = ({ color, gradientColor, text, iconColor, iconGradientColor }) => (
    <Box
      style={{
        width: '100%',
        height: '50px',
        borderRight: `4px solid ${color}`,
        marginTop: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundImage: `linear-gradient(120deg, #2a2d3e11, ${gradientColor})`,
      }}
    >
      <Typography
        sx={{ pl: 1, color: theme.palette.grey[400], fontWeight: '500' }}
      >
        {text}
      </Typography>
      <div
        style={{
          width: '10px',
          backgroundImage: `linear-gradient(90deg, transparent, ${iconGradientColor})`,
          height: '50px',
          marginRight: 2,
          filter: iconColor === 'gray' ? 'grayscale(100%)' : '',
        }}
      />
    </Box>
  );

  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <ClickAwayListener onClickAway={handleCloseTooltip}>
      <Box
        sx={{
          background: myTheme?.sidebar.background,
          backgroundImage: myTheme?.name === 'default' ? `url(${SidebarBackground})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          padding: pathname !== '/' ? '20px' : '',
          '@media (max-width: 1199px)': {
            padding: pathname !== '/' ? '10px' : '',
          },
          position: 'relative'
        }}
      >
        {pathname !== '/' && (
          <Box mt={1}>
            <Link to={'/dashboard'}>
              {menuOpen ? (
                <img
                  src={myTheme.logo}
                  alt='logo'
                  style={{
                    width: '150px',
                    height: 'auto',
                  }}
                />
              ) : (
                <img
                  src={myTheme.logoIcon}
                  alt='logo'
                  style={{
                    height: matches ? '47px' : '39px',
                    width: matches ? '48px' : '40px',
                    margin: matches ? '0' : '0 5px',
                  }}
                />
              )}
            </Link>
            <hr style={lineStyle} />
          </Box>
        )}

        <Box
          sx={{
            mt: 3,
            height: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'start',
            overflow: 'auto',
            gap: '30px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
              gap: '10px',
            }}
          >
            {menuItems?.map((option: any) => {
              if (roles.includes(option.role)) {
                return (
                  <MenuItem
                    icon={option.icon}
                    name={option.name}
                    key={option.id}
                    menuOpen={menuOpen}
                    subOptions={option.subOptions}
                    setMenuOpen={setMenuOpen}
                    id={option.id}
                    openSubMenu={openSubMenu}
                    setOpenSubMenu={setOpenSubMenu}
                    route={option.route}
                    handleOpenTooltip={handleOpenTooltip}
                    handleCloseTooltip={handleCloseTooltip}
                    openTooltip={openTooltip}
                    isMobile={isMobile}
                    handleAddFavorite={handleAddFav}
                    isFavorite={isFavorite}
                    favs={favs}
                    myTheme={myTheme}

                    disable={option.disable}
                  />
                );
              } else {
                return null;
              }
            })}

            {menuItems?.length > 0 && roles.includes('Admin') && (
              <MenuItem
                icon={SupportIcon}
                name='Settings'
                menuOpen={menuOpen}
                id='-1'
                route={'/admin-settings'}
                handleOpenTooltip={handleOpenTooltip}
                handleCloseTooltip={handleCloseTooltip}
                openTooltip={openTooltip}
                isMobile={isMobile}
                handleAddFavorite={handleAddFav}
                isFavorite={isFavorite}
                favs={favs}
                myTheme={myTheme}
                disable={false}
              />
            )}
            <hr style={lineStyle} />
          </Box>
          {menuOpen && (
            <Box
              style={{
                marginTop: 0,
                marginBottom: '30px',
                width: '100%',
                display: pathname === '/' ? 'none' : 'block',
              }}
            >
              <ColoredBox
                color='#964CF5'
                gradientColor='#ffffffa0'
                text='Business Management'
                iconColor='normal'
                iconGradientColor='#954cf576'
                icon={''}
              />
              <ColoredBox
                color='#37D310'
                gradientColor='#ffffffa0'
                text='QHSE'
                iconColor='normal'
                iconGradientColor='#37D31076'
                icon={''}
              />
              <ColoredBox
                color='#E2B93B'
                gradientColor='#ffffffa0'
                text='CRM'
                iconColor='normal'
                iconGradientColor='#E2B93B76'
                icon={''}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
}

export default Sidebar;
