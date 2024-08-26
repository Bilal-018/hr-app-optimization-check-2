import Chart, { ChartConfiguration } from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';

interface SummaryItem {
  year: string;
  value: string;
}

interface Props {
  summary: SummaryItem[];
}

const ProgressiveChart: React.FC<Props> = ({ summary }) => {
  const [chartData, setChartData] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (Array.isArray(summary) && summary.length > 0) {
      const newData = summary.map((item: SummaryItem) => ({
        x: parseInt(item.year),
        y: parseFloat(item.value.replace('%', '')),
      }));
      setChartData(newData);
    }
  }, [summary]);

  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
          datasets: [
            {
              borderColor: '#18a0fb',
              borderWidth: 1,
              radius: 0,
              data: chartData,
            },
          ],
        },
        options: {
          animation: {
            duration: 2000,
            easing: 'linear',
          },
          interaction: {
            intersect: false,
          },
          plugins: {
            legend: {
              display: false, // Adjust this as needed
            },
          },
          scales: {
            x: {
              type: 'linear',
              grid: {
                display: false,
              },
              display: false,
            },
            y: {
              grid: {
                display: false,
              },
              display: false,
            },
          },
        },
      };

      const chart = new Chart(ctx, chartConfig);

      return () => {
        chart.destroy();
      };
    }
  }, [chartData]);

  return <canvas ref={chartRef} />;
};

export default ProgressiveChart;
