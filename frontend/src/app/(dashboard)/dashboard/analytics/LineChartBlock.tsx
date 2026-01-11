"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export interface LineChartBlockProps {
  title: string;
  data: any[];
  dataKey: string;
  stroke: string;
}

export const LineChartBlock: React.FC<LineChartBlockProps> = ({
  title,
  data,
  dataKey,
  stroke,
}) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#888" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={stroke}
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
