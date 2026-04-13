import { motion } from "motion/react";
import { GroceryItem } from "@/types/stock";
import { getStatusInfo, getFillPercent, getBarColor } from "@/lib/stockUtils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface InventoryCardProps {
  item: GroceryItem;
  onAdjust: (id: string, delta: number) => void;
}

export function InventoryCard({ item, onAdjust }: InventoryCardProps) {
  const statusInfo = getStatusInfo(item.status);
  const fillPct = getFillPercent(item);
  const barColor = getBarColor(item.status);

  const displayQty = item.quantity % 1 === 0
    ? item.quantity.toString()
    : item.quantity.toFixed(1);

  return (
    <motion.div
      layout
      className="border border-border rounded-lg bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted relative">
        {item.image ? (
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {item.icon}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Name · Category */}
        <div className="flex items-baseline gap-2 mb-2">
          <h4 className="text-foreground font-medium">{item.name}</h4>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground text-sm">{item.category}</span>
        </div>

        {/* Qty + badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-foreground text-sm font-medium">
            {displayQty} {item.unit}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${statusInfo.bgClass} ${statusInfo.colorClass}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-muted rounded-full overflow-hidden mb-3">
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Target + stepper */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Target: {item.targetQuantity} {item.unit}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAdjust(item.id, -1)}
              disabled={item.quantity === 0}
              className="w-8 h-8 rounded-lg border border-border hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-foreground font-medium"
            >
              −
            </button>
            <button
              onClick={() => onAdjust(item.id, 1)}
              className="w-8 h-8 rounded-lg border border-border hover:bg-muted transition-colors flex items-center justify-center text-foreground font-medium"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
