import React from "react";
import { Stack } from "@mui/material";
import StatBox from "../Global/StatBox";

interface KPI {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

interface KPISProps {
  kpis: KPI[];
}

function KPIS({ kpis }: KPISProps): JSX.Element {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {kpis.map((kpi, i) => (
        <StatBox
          key={i}
          title={kpi.title}
          value={kpi.value}
          icon={kpi.icon}
          color={kpi.color}
          hideProgress // Assuming this property is always true, adjust as needed
        />
      ))}
    </Stack>
  );
}

export default KPIS;
