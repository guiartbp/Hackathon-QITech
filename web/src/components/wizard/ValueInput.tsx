import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface ValueInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function ValueInput({ value, onChange, min, max, step }: ValueInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const numValue = parseInt(rawValue) || 0;
    if (numValue <= max) {
      onChange(numValue);
    }
  };

  const increment = () => {
    if (value < max) {
      onChange(Math.min(value + step, max));
    }
  };

  const decrement = () => {
    if (value > min) {
      onChange(Math.max(value - step, min));
    }
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        onClick={decrement}
        disabled={value <= min}
        className="h-12 w-12"
      >
        <Minus className="h-5 w-5" />
      </Button>
      
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
          R$
        </span>
        <input
          type="text"
          value={value.toLocaleString('pt-BR')}
          onChange={handleInputChange}
          className="w-64 h-16 text-center text-3xl font-bold border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background pl-12"
          placeholder="50.000"
        />
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={increment}
        disabled={value >= max}
        className="h-12 w-12"
      >
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}