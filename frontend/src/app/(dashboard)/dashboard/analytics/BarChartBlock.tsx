"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export interface BarChartBlockProps {
  title: string;
  data: any[];
  dataKey: string;
  barColor: string;
}

export const BarChartBlock: React.FC<BarChartBlockProps> = ({
  title,
  data,
  dataKey,
  barColor,
}) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
