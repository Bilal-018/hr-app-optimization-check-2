import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

function Link({ children, ...props }: any) {
  return (
    <RouterLink
      style={{
        textDecoration: 'none',
      }}
      {...props}
    >
      {children}
    </RouterLink>
  );
}

export default Link;
