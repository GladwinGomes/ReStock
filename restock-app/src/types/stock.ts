export type StockStatus = "low" | "restock-soon" | "stocked";

export type Category = "Dairy" | "Meat" | "Produce" | "Pantry" | "Bakery" | "Other";

export interface GroceryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  restockThreshold: number;
  targetQuantity: number;
  status: StockStatus;
  image: string;
  icon: string;
  dailyConsumption?: number;
}
