import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: { name: string; sales: number; orders: number }[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">إحصائيات المبيعات</h3>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء المتجر</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(12, 100%, 62%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(12, 100%, 62%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 100%, 62%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(200, 100%, 62%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 18%)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(0, 0%, 60%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(0, 0%, 60%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(0, 0%, 8%)', 
                border: '1px solid hsl(0, 0%, 18%)',
                borderRadius: '12px',
                color: 'hsl(0, 0%, 98%)'
              }}
              labelStyle={{ color: 'hsl(0, 0%, 60%)' }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="hsl(12, 100%, 62%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorSales)" 
              name="المبيعات ($)"
            />
            <Area 
              type="monotone" 
              dataKey="orders" 
              stroke="hsl(200, 100%, 62%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOrders)" 
              name="الطلبات"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">المبيعات</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-muted-foreground">الطلبات</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
