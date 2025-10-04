import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartComponentProps {
  data: Array<{ [key: string]: string | number }>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  darkMode?: boolean;
}

export function LineChartComponent({ 
  data, 
  xKey, 
  yKey, 
  color = 'hsl(var(--primary))', 
  height = 200,
  darkMode = false 
}: LineChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke={darkMode ? 'hsl(var(--muted))' : 'hsl(var(--border))'} 
        />
        <XAxis 
          dataKey={xKey} 
          stroke={darkMode ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))'} 
          fontSize={12}
        />
        <YAxis 
          stroke={darkMode ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))'} 
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: darkMode ? 'hsl(var(--chart-bg))' : 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey={yKey} 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
