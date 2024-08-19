import { Outlet, useLocation } from 'react-router';
import React, { useEffect, useState } from 'react';
import Topbar from '../Navigation/Topbar/Topbar';
import Sidebar from '../Navigation/Sidebar/Sidebar';
import { Box, useTheme } from '@mui/material';
import { MENU_FULL_OPTIONS, MENU_NEW_USER } from '../../data';
import jwtInterceoptor from '../../services/interceptors';
import { LeaveManagementIcon, DashboardBackground } from '../../assets/images';

const Layout: React.FC<any> = () => {
  const location = useLocation();
  const theme = useTheme();

  const barrerToken = sessionStorage.getItem('token_key');
  const allowedRoutes = [
    // 'https://kind-rock-0f8a1f603.5.azurestaticapps.net/login',
    '/login',
    '/forget-password',
    '/authentication',
  ];

  if (!allowedRoutes.includes(location.pathname)) {
    if (!barrerToken) {
      window.location.href =
        // 'https://kind-rock-0f8a1f603.5.azurestaticapps.net/login';
        '/login'
    }
  }
  const bearerToken = sessionStorage.getItem('token_key');
  const empId = sessionStorage.getItem('empId_key');

  const [favs, setFavs] = useState<any>([]);
  const getFavsData = () => {
    jwtInterceoptor
      .get(
        'api/FavouriteLink/GetFavouriteLinksByEmployeedetaiLId?EmployeeDetailId=' +
          empId
      )
      .then((response: any) => {
        let allFavs = [];
        for (var x of response.data) {
          let item = {
            id: x.favouriteLinkId,
            name: x.title,
            URL: x.favouriteLinkurl,
            icon: LeaveManagementIcon,
          };
          allFavs.push(item);
        }
        setFavs(allFavs);
      });
  };

  useEffect(() => {
    if (bearerToken) {
      getFavsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetchFavs = () => {
    getFavsData();
  };

  const menuItems =
    location.pathname === '/' ? MENU_NEW_USER : MENU_FULL_OPTIONS;

  return allowedRoutes.includes(location.pathname) ? (
    <Outlet />
  ) : (
    <Box
      sx={(theme) => ({
        // backgroundColor: theme.palette.background.foreground,
        backgroundColor: theme.palette.background.paper,
        background: `url(${DashboardBackground})`,
        backgroundSize: 'cover',
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
      })}
    >
      <Sidebar menuItems={menuItems} favs={favs} refetchFavs={refetchFavs} />
      <Box
        sx={{
          width: location.pathname === '/' ? '100%' : '90%',
          // width: location.pathname === "/presentations" ? "94%" : "100%",
          flexDirection: 'column',
          // backgroundColor: (theme) => theme.palette.background.paper,
          backgroundColor: theme.palette.mode === 'light' ? 'white' : '#2b2d3e',
          ...(location.pathname === '/presentations' && {
            width: '94%',
            '@media (max-width: 1260px)': {
              pr: '20px',
            },
          }),
          flex: 1,
        }}
        display='flex'
      >
        <Topbar favs={favs} refetchFavs={refetchFavs} />
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.background.default,
            // height: "calc(98vh - 75px)",
            overflowY: 'auto',
           // borderRadius: '10px 10px 10px 10px',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            //margin: 1,
            flex: 1,
          })}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
