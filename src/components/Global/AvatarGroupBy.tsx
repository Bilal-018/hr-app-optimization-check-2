import { Avatar, AvatarGroup } from '@mui/material';
import React, { useState, useEffect } from 'react';

const noop = () => { /* do nothing */ };

function AvatarGroupBy({ images, onClick = noop }: any) {
  const [base64Images, setBase64Images] = useState<any>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const blobs = await Promise.all(
          images.map(async  (image: any) => {
            // If image is a URL, fetch the file and convert it to a Blob
            if (typeof image === 'string') {
              const response = await fetch(image);
              return response.blob();
            }
            // If image is already a File or Blob, return it as is
            return image;
          })
        );
        const base64Images = await Promise.all(
          blobs.map((blob: Blob) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(blob);
            });
          })
        );
        setBase64Images(base64Images);
      } catch (error) {
        console.error(error);
      }
    };
    void loadImages();
  }, [images]);

  return (
    <AvatarGroup
      max={5}
      sx={{
        justifyContent: 'flex-end',
        alignItems: 'center',

        '.MuiAvatar-colorDefault': {
          fontSize: '14px',
          borderRadius: '19px',
          height: 'fit-content',
          width: 'fit-content',
          padding: '5px 10px',
          backgroundColor: '#18A0FB',
          color: '#fff',
        },
      }}
    >
      {base64Images.map((base64Image: any, i: any) => (
        <Avatar
          alt='Remy Sharp'
          src={base64Image}
          key={i}
          onClick={() => onClick(i)}
          sx={{
            minHeight: '30px',
            minWidth: '20px',
            borderRadius: '100px',
          }}
        />
      ))}
    </AvatarGroup>
  );
}

export default AvatarGroupBy;
