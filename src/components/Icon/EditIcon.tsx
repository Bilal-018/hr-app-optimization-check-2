import { useTheme } from '@mui/material/styles';

const EditIcon = () => {
    const theme = useTheme();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M3.66602 21H21.666M14.4504 5.31171C14.4504 5.31171 14.4504 6.94634 16.0851 8.58096C17.7197 10.2156 19.3543 10.2156 19.3543 10.2156M7.98564 17.9881L11.4184 17.4977C11.9135 17.4269 12.3724 17.1975 12.7261 16.8438L20.9889 8.58096C21.8917 7.67818 21.8917 6.21449 20.9889 5.31171L19.3543 3.67708C18.4515 2.77431 16.9878 2.77431 16.0851 3.67708L7.82218 11.94C7.46849 12.2936 7.23907 12.7525 7.16833 13.2477L6.67794 16.6804C6.56897 17.4432 7.22282 18.097 7.98564 17.9881Z" stroke={theme.palette.mode === 'dark' ? '#ffffff' : '#092C4C'} stroke-width="1.5" stroke-linecap="round" />
        </svg>
    )
};

export default EditIcon;