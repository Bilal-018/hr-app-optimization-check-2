import React, { useState } from 'react';
import { Box, IconButton, Typography, alpha } from '@mui/material';
import { ExpandLessIcon, ExpandMoreIcon } from '../../../assets/images';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MenuTooltip from '../../Global/MenuTooltip';
import { useTheme } from '@mui/material';

const backColor = '#18A0FB';

interface SubOption {
  id: number;
  name: string;
  route: string;
}

// interface MenuItemProps {
//   icon: string;
//   name: string;
//   menuOpen: boolean;
//   subOptions: SubOption[];
//   setMenuOpen: (menuOpen: boolean) => void;
//   openSubMenu: string;
//   setOpenSubMenu: (openSubMenu: string) => void;
//   id: string;
//   route: string | null;
//   handleOpenTooltip: (id: string) => (event: React.MouseEvent) => void;
//   handleCloseTooltip: () => void;
//   openTooltip: string;
//   isMobile: boolean;
//   isFavorite: (name: string) => boolean;
//   handleAddFavorite: (
//     name: string,
//     route: string,
//     event: React.MouseEvent
//   ) => void;
//   myTheme: any; // Adjust type based on your theme structure
//   disable: boolean;
// }

function MenuItem(props: any): JSX.Element {
  const {
    icon,
    name,
    menuOpen,
    subOptions,
    setMenuOpen,
    openSubMenu,
    setOpenSubMenu,
    id,
    route,
    handleOpenTooltip,
    handleCloseTooltip,
    openTooltip,
    isMobile,
    handleAddFavorite,
    myTheme,
    disable,
    favs,
  } = props;


  const { t } = useTranslation();
  const { pathname } = useLocation();
  const open =
    openSubMenu === id ||
    subOptions?.some((subOption: any) => subOption.route === pathname);
  const theme = useTheme();

  const handleOpen = () => {
    if (isMobile) setMenuOpen(false);
    setOpenSubMenu(id);
  };

  const handleClose = () =>
    setOpenSubMenu(openSubMenu === id ? '' : openSubMenu);

  // const handleCloseMenu = () => {
  //   handleClose();
  //   setMenuOpen((pre: boolean) => !pre);
  // };

  const toolTipBack =
    myTheme.sidebar.background === 'transparent'
      ? backColor
      : myTheme.sidebar.background;

  const MenuItemLink: React.FC<{ subOption: SubOption }> = ({ subOption }) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = useState(false);

    return (
      <Link
        to={subOption.route}
        style={{ pointerEvents: disable ? 'none' : 'auto' }}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '9px 9px 9px 9px',
            my: '4px',
            borderRadius: '10px',
            cursor: 'pointer',
            height: '45px',
            minWidth: '210px',
            backgroundColor: pathname === subOption.route ? myTheme.sidebar.background2 : '',
            color:
              theme.palette.mode === 'light'
                ? 'black'
                : pathname === subOption.route
                  ? 'white'
                  : 'white',
            '&:hover': {
              backgroundColor: myTheme.sidebar.background2,
              color:
                toolTipBack !== backColor
                  ? menuOpen
                    ? theme.palette.background.default
                    : theme.palette.background.default
                  : theme.palette.background.default,
            },
          })}
          onMouseEnter={() => { setIsHovered(true) }}
          onMouseLeave={() => { setIsHovered(false) }}
        >
          <Typography variant='body1'
            className='child-text'
            color={isHovered ? myTheme.sidebar.colorDark : pathname === subOption.route ? myTheme.sidebar.colorDark : myTheme.sidebar.color}
          >
            {t(subOption.name)}
          </Typography>
          <IconButton
            onClick={(e) =>
              handleAddFavorite(subOption.name, subOption.route, e)
            }
            sx={{
              padding: '5px !important',
            }}
          >
            <StarRoundedIcon
              // className={
              //   isFavorite(subOption.name) ? ' !important' : 'red'
              // }
              sx={() => ({
                color: favs?.some((fav: any) => fav?.name === subOption?.name)
                  ? '#FFD66B !important'
                  : isHovered
                    ? myTheme.sidebar.colorDark
                    : pathname === subOption.route
                      ? myTheme.sidebar.colorDark
                      : '',
                width: '20px',
              })}
            />
          </IconButton>
        </Box>
      </Link>
    );
  };

  const MenuItems: React.FC = () => (
    <>
      {subOptions.map((subOption: any) => (
        <MenuItemLink subOption={subOption} key={subOption.id} />
      ))}
    </>
  );

  const [isHovered, setIsHovered] = useState(false);


  return (
    <Box
      style={{
        borderBottom: (route === '/hr-dashboard' && theme.palette.mode === 'light') ? '1px solid #EEEE' : '',
        borderTop: (route === '/hr-dashboard' && theme.palette.mode === 'light') ? '1px solid #EEEE' : '',
        marginTop: route === '/hr-dashboard' ? '20px' : '',
        pointerEvents: disable ? 'none' : 'auto',
      }}
      onClick={() => {
        if (subOptions?.length > 0) {
          if (open) handleClose();
          else handleOpen();
        }
      }}
    >
      <Box
        sx={{
          ...(menuOpen && {
            minWidth: {
              lg: '257px',
            },
          }),
          py: '12px',
          px: '5px',
          borderRadius: '10px',
          color: disable
            ? theme.palette.grey[400]
            : pathname === route ? myTheme.sidebar.colorDark : myTheme.sidebar.color,
          backgroundColor: pathname === route ? myTheme.sidebar.background2 : ''
          ,
          '&:hover': {
            backgroundColor: myTheme.sidebar.background2,

            img: {
              ...(theme.palette.mode === 'light'
                ? {
                  filter: myTheme.name === 'default' && 'brightness(0%) invert(100%)',
                }
                : {
                  filter: 'brightness(0%) invert(100%)',
                }),
            },
          },

          img: {
            ...(theme.palette.mode !== 'light'
              ? {
                filter: disable
                  ? 'brightness(100%) invert(100%) grayscale(100%)'
                  : 'brightness(0%) invert(100%)',
              }
              : {
                filter: disable
                  ? 'brightness(100%) invert(100%) grayscale(100%)'
                  : (myTheme.name !== 'default' && !isHovered) ?
                    pathname != route &&
                    'brightness(0%) invert(100%)' : pathname === route && 'brightness(0%) invert(100%)',
              }),
          },

          ...(open
            ? menuOpen && { '&:hover': { backgroundColor: 'transparent' } }
            : {}),
        }}

        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <MenuTooltip
          menu={
            subOptions?.length > 0 ? (
              <MenuItems />
            ) : (
              <MenuItemLink
                subOption={{ name: t(name), route: route || '', id: 0 }}
              />
            )
          }
          inTooltip={isMobile ? true : !menuOpen && !open}
          isMobile={isMobile}
          open={openTooltip === id}
          handleOpenTooltip={handleOpenTooltip(id)}
          handleCloseTooltip={handleCloseTooltip}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '0px 10px',
              gap: '15px',
              cursor: 'pointer',
              img: {
                width: menuOpen ? '20px' : '20px',
                '@media (max-width: 600px)': {
                  width: menuOpen ? '15px' : '20px',
                },
              },
            }}
          >
            <img src={icon} alt='logo' />
            <Box
              sx={{
                flex: 1,
                display: menuOpen ? 'flex' : 'none',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >

              {/*  color numbber is not correct */}
              <Link

                to={route || '#'}
                style={{ pointerEvents: route !== null ? 'auto' : 'none' }}
              >
                <Typography
                  variant='body2'
                  sx={{
                    ['@media (pointer: coarse)']: {
                      color: pathname === route ? myTheme.sidebar.colorDark : myTheme.sidebar.color,
                    },
                  }}
                  color={(isHovered === true && !open) ? myTheme.sidebar.colorDark : pathname === route ? myTheme.sidebar.colorDark : myTheme.sidebar.color}
                >
                  {t(name)}
                </Typography>
              </Link>
              {subOptions?.length > 0 &&
                (open ? (
                  <ExpandLessIcon
                    sx={{
                      // color: theme.palette.mode === 'light' ? 'black' : 'white',
                      color: myTheme.sidebar.color,
                    }}
                  />
                ) : (
                  <ExpandMoreIcon
                    sx={{
                      // color: theme.palette.mode === 'light' ? 'black' : 'white',
                      color: myTheme.sidebar.color,
                    }}
                  />
                ))}
            </Box>
          </Box>
        </MenuTooltip>
        {menuOpen && open && (
          <Box
            sx={(theme) => ({
              borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              paddingLeft: '10px',
              marginLeft: '18px',
            })}
            className='menu-items'
          >
            <MenuItems />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MenuItem;
