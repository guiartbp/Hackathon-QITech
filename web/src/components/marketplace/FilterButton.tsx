import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface FilterButtonProps {
  label: string;
  active?: boolean;
  onToggle: () => void;
}

export function FilterButton({ label, active = false, onToggle }: FilterButtonProps) {
  return (
    <Button
      variant={active ? 'default' : 'outline'}
      size="sm"
      onClick={onToggle}
      className="gap-2"
    >
      {active && <Check className="w-4 h-4" />}
      {label}
    </Button>
  );
}