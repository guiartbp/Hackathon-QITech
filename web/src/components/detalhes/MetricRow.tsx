import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface MetricRowProps {
  label: string;
  value: string | number;
  icon?: string;
  tooltip?: string;
  status?: 'success' | 'warning';
}

export function MetricRow({ label, value, icon, tooltip, status }: MetricRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm">{label}</span>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{value}</span>
        {status && (
          <Badge variant={status === 'success' ? 'default' : 'secondary'} className="text-xs">
            {status === 'success' ? '✓' : '⚠'}
          </Badge>
        )}
      </div>
    </div>
  );
}
