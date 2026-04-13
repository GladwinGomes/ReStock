import { GroceryItem, StockStatus } from "@/types/stock";

export function computeStatus(quantity: number, restockThreshold: number, targetQuantity: number): StockStatus {
  const ratio = targetQuantity === 0 ? 1 : quantity / targetQuantity;
  if (quantity === 0 || ratio < 0.25) return "low";
  if (quantity <= restockThreshold || ratio < 0.55) return "restock-soon";
  return "stocked";
}

export function getStatusInfo(status: StockStatus) {
  switch (status) {
    case "low":
      return { label: "Low Stock", colorClass: "text-destructive", bgClass: "bg-destructive/10" };
    case "restock-soon":
      return { label: "Restock Soon", colorClass: "text-chart-4", bgClass: "bg-chart-4/10" };
    case "stocked":
      return { label: "Well Stocked", colorClass: "text-chart-2", bgClass: "bg-chart-2/10" };
  }
}

export function getFillPercent(item: GroceryItem): number {
  return Math.min((item.quantity / item.targetQuantity) * 100, 100);
}

export function getBarColor(status: StockStatus): string {
  if (status === "low") return "bg-destructive";
  if (status === "restock-soon") return "bg-chart-4";
  return "bg-chart-2";
}

export function advanceDay(items: GroceryItem[]): GroceryItem[] {
  return items.map((item) => {
    if (!item.dailyConsumption) return item;
    const newQty = Math.max(0, item.quantity - item.dailyConsumption);
    return {
      ...item,
      quantity: Math.round(newQty * 100) / 100,
      status: computeStatus(newQty, item.restockThreshold, item.targetQuantity),
    };
  });
}

export function adjustItem(items: GroceryItem[], id: string, delta: number): GroceryItem[] {
  return items.map((item) => {
    if (item.id !== id) return item;
    const step = getStep(item.unit);
    const newQty = Math.max(0, Math.round((item.quantity + delta * step) * 100) / 100);
    return { ...item, quantity: newQty, status: computeStatus(newQty, item.restockThreshold, item.targetQuantity) };
  });
}

export function restockItem(items: GroceryItem[], id: string): GroceryItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, quantity: item.targetQuantity, status: "stocked" as StockStatus }
      : item
  );
}

export function getStep(unit: string): number {
  if (unit === "g" || unit === "ml") return 50;
  return 1;
}

export const UNIT_OPTIONS = ["gal", "lb", "g", "ml", "pcs", "dozen", "loaf", "bottle", "cup", "head", "count", "box"];
export const ICON_OPTIONS = ["🥛","🫙","🥚","🫘","🍞","🍌","🥕","🍗","🍅","🥬","🧀","🫐","🍎","🧅","🧄","🥩","🐟","🥦","🍋","🫚","🧈","🥜","🫛","🌽"];
export const CATEGORIES = ["Dairy", "Meat", "Produce", "Pantry", "Bakery", "Other"] as const;

export const UNSPLASH_IMAGES: Record<string, string> = {
  milk: "https://images.unsplash.com/photo-1635436338433-89747d0ca0ef?w=400&q=80",
  curd: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&q=80",
  eggs: "https://images.unsplash.com/photo-1759082495730-2a5090278e7e?w=400&q=80",
  rajma: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80",
  bread: "https://images.unsplash.com/photo-1586765501508-cffc1fe200c8?w=400&q=80",
  bananas: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
  carrots: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80",
  chicken: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80",
};
