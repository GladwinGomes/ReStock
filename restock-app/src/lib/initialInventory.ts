import { GroceryItem } from "@/types/stock";
import { computeStatus, UNSPLASH_IMAGES } from "@/lib/stockUtils";

function make(
  id: string,
  name: string,
  category: GroceryItem["category"],
  icon: string,
  quantity: number,
  unit: string,
  restockThreshold: number,
  targetQuantity: number,
  dailyConsumption?: number
): GroceryItem {
  return {
    id,
    name,
    category,
    icon,
    quantity,
    unit,
    restockThreshold,
    targetQuantity,
    status: computeStatus(quantity, restockThreshold, targetQuantity),
    image: UNSPLASH_IMAGES[id] ?? "",
    dailyConsumption,
  };
}

export const INITIAL_INVENTORY: GroceryItem[] = [
  make("milk",    "Milk",    "Dairy",   "🥛", 600,  "ml",  1000, 3000, 600),
  make("curd",    "Curd",    "Dairy",   "🫙", 400,  "ml",  500,  2000, 200),
  make("eggs",    "Eggs",    "Dairy",   "🥚", 6,    "pcs", 6,    24),
  make("rajma",   "Rajma",   "Pantry",  "🫘", 200,  "g",   300,  1000, 75),
  make("bread",   "Bread",   "Bakery",  "🍞", 2,    "loaf",3,    5),
  make("bananas", "Bananas", "Produce", "🍌", 5,    "pcs", 4,    12),
  make("carrots", "Carrots", "Produce", "🥕", 800,  "g",   300,  1000, 100),
  make("chicken", "Chicken", "Meat",    "🍗", 540,  "g",   400,  1000, 180),
];
