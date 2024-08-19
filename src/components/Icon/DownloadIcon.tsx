import { useTheme } from '@mui/material/styles';

const DownloadIcon = () => {
    const theme = useTheme();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M21.334 15V19C21.334 19.5304 21.1233 20.0391 20.7482 20.4142C20.3731 20.7893 19.8644 21 19.334 21H5.33398C4.80355 21 4.29484 20.7893 3.91977 20.4142C3.5447 20.0391 3.33398 19.5304 3.33398 19V15" stroke = { theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C' } stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.33398 10L12.334 15L17.334 10" stroke = { theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C' } stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.334 15V3" stroke = { theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C' } stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
};

export default DownloadIcon;