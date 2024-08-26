import { ResponsivePie, MayHaveLabel } from '@nivo/pie';
import React from 'react';

interface Props {
  data: MayHaveLabel[];
}

const PieChart: React.FC<Props> = ({ data }) => (
  <ResponsivePie
    data={data}
    innerRadius={0.7}
    padAngle={0.7}
    cornerRadius={0}
    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
    activeOuterRadiusOffset={5}
    borderWidth={1}
    colors={(d: any) => d.data.color} // Use color from data
    borderColor={{
      from: 'color',
      modifiers: [['darker', 0]],
    }}
    enableArcLinkLabels={false}
    arcLinkLabelsSkipAngle={10}
    arcLinkLabelsTextColor='#333333'
    arcLinkLabelsThickness={2}
    arcLinkLabelsColor={{ from: 'color' }}
    enableArcLabels={false}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{
      from: 'color',
      modifiers: [['darker', 2]],
    }}
    legends={[]}
  />
);

export default PieChart;
