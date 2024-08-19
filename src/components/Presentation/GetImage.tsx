import { Stack, Typography } from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import PDFViewer from '../Global/PdfViewer';

const FileTypeIcons = {
  pdf: {
    icon: <PictureAsPdfIcon color='info' />,
    title: 'PDF',
  },
  // doc: {
  //   icon: <ArticleIcon color='info' />,
  //   title: 'DOC',
  // },
  // docx: {
  //   icon: <ArticleIcon color='info' />,
  //   title: 'DOCX',
  // },
  ppt: {
    icon: <SlideshowIcon color='info' />,
    title: 'PPT',
  },
  pptx: {
    icon: <SlideshowIcon color='info' />,
    title: 'PPTX',
  },
  // pptm: {
  //   icon: <ArticleIcon color='info' />,
  //   title: 'PPTM',
  // },
  // exe: {
  //   icon: <ArticleIcon color='info' />,
  //   title: 'EXE',
  // },
  mp4: {
    icon: <PlayCircleFilledIcon color='info' />,
    title: 'MP4',
  },
  mp3: {
    icon: <AudiotrackIcon color='info' />,
    title: 'MP3',
  },
  wav: {
    icon: <AudiotrackIcon color='info' />,
    title: 'WAV',
  },
  ogg: {
    icon: <AudiotrackIcon color='info' />,
    title: 'OGG',
  },
};

function GetImage({ presentation, isModalOpen = false, styles = {} }: any) {
  const fileType = presentation.name.split('.')[1];

  // const content = FileTypeIcons[fileType.toLowerCase()] || {};
  const content =
    FileTypeIcons[fileType.toLowerCase() as keyof typeof FileTypeIcons];

  return (
    <>
      {!isModalOpen && content?.icon ? (
        <Stack
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={2}
          height={'100%'}
        >
          {content.icon}
          <Typography variant='h5'>{content.title}</Typography>
        </Stack>
      ) : fileType.toLowerCase() == "ppt" || fileType.toLowerCase() == "pptx" ? (
        <iframe
          src={`https://docs.google.com/gview?url=${presentation.url}&embedded=true`}
          width="100%"
          height="100%"
          frameBorder="0"
        >
        </iframe>
      ) : fileType.toLowerCase() == "pdf" ? (
        <PDFViewer file={presentation.url} fileName={presentation.name} />
      ) : fileType.toLowerCase() === "mp4" ? (
        <video width="100%" height="100%" controls>
          <source src={presentation.url} type="video/mp4" />
        </video>
      ) : fileType.toLowerCase() === "mp3" || fileType.toLowerCase() === "wav" || fileType.toLowerCase() === "ogg" ? (
        <audio controls>
          <source src={presentation.url} type={`audio/${fileType}`} />
        </audio>
      ) : (
        <img src={presentation.url} alt={presentation.name} style={styles} />
      )}
    </>
  );
}

export default GetImage;
