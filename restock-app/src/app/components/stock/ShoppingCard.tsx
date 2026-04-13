import { motion } from "motion/react";
import { Check } from "lucide-react";
import { GroceryItem } from "@/types/stock";
import { getStatusInfo } from "@/lib/stockUtils";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface ShoppingCardProps {
  item: GroceryItem;
  onRestock: (id: string) => void;
}

export function ShoppingCard({ item, onRestock }: ShoppingCardProps) {
  const statusInfo = getStatusInfo(item.status);
  const needed = Math.max(0, item.targetQuantity - item.quantity);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border border-border rounded-lg bg-card overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
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
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h3 className="text-foreground font-medium mb-0.5">{item.name}</h3>
            <p className="text-muted-foreground text-sm">{item.category}</p>
          </div>
          <span className={`${statusInfo.colorClass} mt-0.5`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </span>
        </div>
        <p className="text-muted-foreground text-sm mb-3">
          Need {needed} {item.unit}
        </p>
        <button
          onClick={() => onRestock(item.id)}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg hover:opacity-90 active:scale-95 transition-all font-medium text-sm"
        >
          <Check size={15} />
          Mark Restocked
        </button>
      </div>
    </motion.div>
  );
}
