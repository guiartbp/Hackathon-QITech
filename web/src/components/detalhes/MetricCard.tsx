interface MetricCardProps {
  label: string;
  value: string;
  variant: 'neutral' | 'purple' | 'orange';
}

export function MetricCard({ label, value, variant }: MetricCardProps) {
  const bgColors = {
    neutral: 'bg-muted',
    purple: 'bg-purple/10',
    orange: 'bg-primary/10'
  };
  
  const textColors = {
    neutral: 'text-foreground',
    purple: 'text-purple',
    orange: 'text-primary'
  };
  
  return (
    <div className={`${bgColors[variant]} rounded-lg p-4`}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColors[variant]}`}>
        {value}
      </p>
    </div>
  );
}
