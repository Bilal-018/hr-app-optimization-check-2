import React from 'react';
import { Progress } from 'rsuite';
import 'rsuite/Progress/styles/index.css';

const Progressbar = ({ percent, color }: any) => {
  return <Progress.Line percent={percent} strokeColor={color} />;
};

export default Progressbar;
