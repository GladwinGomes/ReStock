interface StatCardsProps {
  total: number;
  lowStock: number;
  needRestocking: number;
}

export function StatCards({ total, lowStock, needRestocking }: StatCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-12">
      <div className="border border-border rounded-lg p-5 bg-card">
        <div className="text-muted-foreground text-sm mb-1">Total Items</div>
        <div className="text-[2.5rem] leading-none tracking-tight text-foreground">{total}</div>
      </div>
      <div className="border border-border rounded-lg p-5 bg-card">
        <div className="text-muted-foreground text-sm mb-1">Low Stock</div>
        <div className="text-[2.5rem] leading-none tracking-tight text-destructive">{lowStock}</div>
      </div>
      <div className="border border-border rounded-lg p-5 bg-card">
        <div className="text-muted-foreground text-sm mb-1">Need Restocking</div>
        <div className="text-[2.5rem] leading-none tracking-tight text-chart-4">{needRestocking}</div>
      </div>
    </div>
  );
}
