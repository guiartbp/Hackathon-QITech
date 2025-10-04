interface InfoRowProps {
  label: string;
  value: string;
  icon?: string;
}

export function InfoRow({ label, value, icon }: InfoRowProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}
