
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CarbonActivity, getCategoryCarbonTotals, getDailyCarbonTotals } from '@/lib/carbon-utils';

interface CarbonChartProps {
  activities: CarbonActivity[];
  chartType: 'daily' | 'category';
  title?: string;
}

const CATEGORY_COLORS = {
  Transportation: '#3AABF9',
  Food: '#8ED41C',
  Home: '#CDAF47',
  Shopping: '#9B59B6'
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const CarbonChart: React.FC<CarbonChartProps> = ({ 
  activities, 
  chartType, 
  title = 'Carbon Footprint' 
}) => {
  const dailyData = getDailyCarbonTotals(activities);
  const categoryData = getCategoryCarbonTotals(activities);

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {chartType === 'daily' && (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `${value} kg`}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} kg CO₂`, 'Carbon']}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
              />
              <Bar 
                dataKey="total" 
                name="Carbon" 
                fill="#72AA16" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartType === 'category' && (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} kg CO₂`, 'Carbon']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CarbonChart;
