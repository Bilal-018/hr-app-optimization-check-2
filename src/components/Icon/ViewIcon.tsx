import { useTheme } from '@mui/material/styles';

const ViewIcon = () => {
    const theme = useTheme();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21.1303 9.8531C22.2899 11.0732 22.2899 12.9268 21.1303 14.1469C19.1745 16.2047 15.8155 19 12 19C8.18448 19 4.82549 16.2047 2.86971 14.1469C1.7101 12.9268 1.7101 11.0732 2.86971 9.8531C4.82549 7.79533 8.18448 5 12 5C15.8155 5 19.1745 7.79533 21.1303 9.8531Z" stroke={theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C'} stroke-width="1.5" />
            <circle cx="12" cy="12" r="3" stroke={theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C'} stroke-width="1.5" />
        </svg>
    )
};

export default ViewIcon;