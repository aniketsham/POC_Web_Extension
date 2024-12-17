import { Card, CardContent } from "@mui/material";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import "../../../styles/tailwind.css";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { StockData } from "../../../config/types";

import { formattedDate } from "../../../services/getDataFromApi";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];

const chartConfig = {
  // desktop: {
  //   label: "Desktop",
  //   color: "#2563eb",
  // },
  // mobile: {
  //   label: "Mobile",
  //   color: "#60a5fa",
  // },
  close: {
    label: "close",
    color: "#a569bd",
  },
} satisfies ChartConfig;

const Charts = ({ data }: { data: StockData[] }) => {
  if (!data || data.length === 0) {
    return;
  }
  return (
    <div>
      <Card>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full"
            style={{ height: 300, width: "100%" }}
          >
            <LineChart accessibilityLayer data={data}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              <XAxis
                dataKey="timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return formattedDate(date);
                }}
              />
              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <Line dataKey="close" fill="var(--color-close)" radius={4} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
