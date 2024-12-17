import { Card, CardContent } from "@mui/material";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import "../../../styles/tailwind.css";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { StockData } from "../../../config/types";
import { formattedDate } from "../../../services/getDataFromApi";

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

const AreaCharts = ({ data }: { data: StockData[] }) => {
  if (!data || data.length === 0) {
    return;
  }
  return (
    <div>
      <Card>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] w-full "
            style={{ height: 300, width: "100%" }}
          >
            <AreaChart accessibilityLayer data={data}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  const date = new Date(value); // Convert timestamp to Date object
                  return formattedDate(date); // Format time as hh:mm:ss
                }}
              />

              <YAxis tickLine={false} tickMargin={10} axisLine={false} />
              <Area dataKey="close" fill="var(--color-close)" radius={4} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AreaCharts;
