import React from 'react';
import { Select as MuiSelect } from '@mui/material';

export default function Select({ children, ...props }: any) {
  return (
    <MuiSelect
      {...props}
      displayEmpty={true}
      renderValue={(value: any) =>
        value?.length
          ? Array.isArray(value)
            ? value.join(', ')
            : value
          : props.placeholder ?? ''
      }
      sx={{
        ...props.sx,
        '.MuiSelect-select': {
          opacity: props.value?.length || Array.isArray(props.value) ? 1 : 0.5,
        },
      }}
    >
      {children}
    </MuiSelect>
  );
}
