import Chart from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';

interface LeavesData {
  month: string;
  year: string;
  value: string;
}

interface Props {
  leaves: {
    sickLeaves: LeavesData[];
    annualLeaves: LeavesData[];
  };
  isMonthlyLeaves: boolean;
  width: number;
}

const BarChart: React.FC<Props> = ({ leaves, isMonthlyLeaves }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);

  useEffect(() => {
    const months = leaves?.sickLeaves?.map((item) => {
      if (isMonthlyLeaves === true) {
        return item?.month + ' ' + item?.year;
      } else {
        return item?.year;
      }
    });

    const sickLeaves = leaves?.sickLeaves?.map((item) => {
      return Number(item?.value);
    });

    const annualLeaves = leaves?.annualLeaves?.map((item) => {
      return Number(item?.value);
    });

    const ctx = chartRef.current?.getContext('2d');

    if (!ctx) return;

    if (chartInstance) {
      chartInstance?.destroy();
    }

    const newChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Annual Leaves',
            backgroundColor: 'rgba(150, 76, 245, 1)',
            data: annualLeaves,
          },
          {
            label: 'Sickness',
            backgroundColor: 'rgba(150, 76, 245, 0.1)',
            data: sickLeaves,
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
          },
        },
      },
    });

    setChartInstance(newChartInstance);

    return () => {
      newChartInstance.destroy();
    };
  }, [leaves, isMonthlyLeaves]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
