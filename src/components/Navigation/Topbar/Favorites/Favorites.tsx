import React, { useEffect, useState, useRef } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { StarIcon } from '../../../../assets/images';
import { Box, IconButton, Stack, styled, useMediaQuery, useTheme } from '@mui/material';
import { useSnackbar } from '../../../Global/WithSnackbar';
import { Link } from 'react-router-dom';
import jwtInterceptor from '../../../../services/interceptors';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteModal from '../../../Global/DeleteModal';
import { useTranslation } from 'react-i18next';

interface FavItem {
  id: string | null;
  URL: string;
  icon: string;
  name: string;
}

interface BasicPopoverProps {
  isTablet: boolean;
  favs: FavItem[];
  getFavsData: () => void;
}

export default function BasicPopover({
  favs,
  getFavsData,
}: BasicPopoverProps): JSX.Element {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const initialized = useRef<boolean>(false);
  const { showMessage }: any = useSnackbar();
  const [deleteFav, setDeleteFav] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const { t } = useTranslation();

  const bearerToken: string | null = sessionStorage.getItem('token_key');
  const base_url = process.env.REACT_APP_BASE_URL;

  const onFavDelete = () => {
    let url =
      'api/FavouriteLink/RemoveFromFavourite?FavouriteLinkId=' + deleteFav.id;
    jwtInterceptor.post(url).then((response: { data: any }) => {
      showMessage(response.data, 'success');
      getFavsData();
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function onFavConfirmationDelete() {
    setDeleteFav({ open: false, id: null });
    onFavDelete();
  }

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

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const CustomStarIcon = styled(StarIcon)(() => ({
    // color: 'black',
  }));

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <div
      style={{
        marginTop: '7px',
        display: matches ? 'block' : 'none'
      }}
    >
      <span onClick={handleClick}>
        <CustomStarIcon />
      </span>
      {/* {isTablet ? (
        <Button onClick={handleClick}>{t('Favorites')}</Button>
      ) : (
        <StarIcon component='span'  color='secondary' />
        <span onClick={handleClick}>
          <CustomStarIcon />
        </span>
      )} */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            width: '264px',
            height: '299px',
          },
        }}
      >
        <Typography
          sx={{
            p: 2,
            borderBottom: `.5px solid #18a0fb64`,
            paddingBlock: '12px',
          }}
        >
          {t('Favorites')}
        </Typography>
        {favs.map((option) => (
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <Link key={option.id} to={option.URL}>
              <Box
                sx={{
                  padding: '10px',
                  width: '95%',
                  '&:hover': {
                    // backgroundColor: '#F5F5F5',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  },
                }}
                display='flex'
                alignItems='center'
                gap='10px'
              >
                <img src={option.icon} alt='icon' />
                <Typography variant='body2'>{t(option.name)}</Typography>
              </Box>
            </Link>
            <IconButton
              onClick={() => { setDeleteFav({ open: true, id: option.id }) }}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        ))}
        {favs.length === 0 && (
          <Box
            sx={{
              padding: '15px',
              width: '95%',
            }}
            display='flex'
            alignItems='center'
            gap='10px'
          >
            <Typography variant='body2'>{t('No favorites yet')}</Typography>
          </Box>
        )}
      </Popover>
      <DeleteModal
        message={'Are you sure you want to delete this favorite?'}
        title={'Delete Favorite'}
        onCancel={() => { setDeleteFav({ open: false, id: null }) }}
        onConfirm={() => { onFavConfirmationDelete() }}
        open={deleteFav.open}
      />
    </div>
  );
}
