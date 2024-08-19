export const preparePieChartData = (data: any) => {
  return data.map((item: any) => {
    return {
      id: item.key,
      label: item.key,
      value: item.value,
      color: item.color,
    };
  });
};
