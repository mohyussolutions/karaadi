"use client";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

export interface PieChartBlockProps {
  title: string;
  data: PieChartData[];
  colors: string[];
}

export type PieChartData = {
  name: string;
  value: number;
  [key: string]: string | number | undefined;
};

export const PieChartBlock: React.FC<PieChartBlockProps> = ({
  title,
  data,
  colors,
}) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
