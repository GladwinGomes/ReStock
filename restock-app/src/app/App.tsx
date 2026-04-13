import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { GroceryItem } from "@/types/stock";
import { INITIAL_INVENTORY } from "@/lib/initialInventory";
import { adjustItem, restockItem, advanceDay } from "@/lib/stockUtils";
import { StatCards } from "@/app/components/stock/StatCards";
import { ShoppingCard } from "@/app/components/stock/ShoppingCard";
import { InventoryCard } from "@/app/components/stock/InventoryCard";
import { AddItemModal } from "@/app/components/stock/AddItemModal";

export default function App() {
  const [inventory, setInventory] = useState<GroceryItem[]>(INITIAL_INVENTORY);
  const [showAddModal, setShowAddModal] = useState(false);
  const [day, setDay] = useState(1);

  const lowItems     = inventory.filter((i) => i.status === "low");
  const soonItems    = inventory.filter((i) => i.status === "restock-soon");
  const stockedItems = inventory.filter((i) => i.status === "stocked");
  const shoppingList = [...lowItems, ...soonItems];

  const handleAdjust  = (id: string, delta: number) => setInventory((p) => adjustItem(p, id, delta));
  const handleRestock = (id: string)                 => setInventory((p) => restockItem(p, id));
  const handleAdd     = (item: GroceryItem)          => setInventory((p) => [...p, item]);
  const handleNextDay = ()                            => { setInventory((p) => advanceDay(p)); setDay((d) => d + 1); };
  const handleReset   = ()                            => { setInventory(INITIAL_INVENTORY); setDay(1); };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="tracking-tight text-foreground">ReStock</h1>
              <span className="text-xs text-muted-foreground border border-border rounded-md px-2 py-0.5 font-normal">
                Day {day}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextDay}
                className="flex items-center gap-1.5 border border-border text-muted-foreground px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                Next day <ChevronRight size={14} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <Plus size={16} />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* KPI cards */}
        <StatCards
          total={inventory.length}
          lowStock={lowItems.length}
          needRestocking={shoppingList.length}
        />

        {/* Shopping list */}
        <AnimatePresence>
          {shoppingList.length > 0 && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="mb-4 text-foreground">Shopping List</h2>
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence>
                  {shoppingList.map((item) => (
                    <ShoppingCard key={item.id} item={item} onRestock={handleRestock} />
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Inventory status */}
        <section>
          <h2 className="mb-6 text-foreground">Inventory Status</h2>
          <div className="space-y-8">

            {lowItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-destructive">
                  <AlertCircle size={17} />
                  <h3 className="text-destructive">Low Stock</h3>
                  <span className="text-muted-foreground text-sm">· {lowItems.length} {lowItems.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {lowItems.map((item) => <InventoryCard key={item.id} item={item} onAdjust={handleAdjust} />)}
                </div>
              </div>
            )}

            {soonItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-chart-4">
                  <Clock size={17} />
                  <h3 className="text-chart-4">Restock Soon</h3>
                  <span className="text-muted-foreground text-sm">· {soonItems.length} {soonItems.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {soonItems.map((item) => <InventoryCard key={item.id} item={item} onAdjust={handleAdjust} />)}
                </div>
              </div>
            )}

            {stockedItems.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 text-chart-2">
                  <CheckCircle2 size={17} />
                  <h3 className="text-chart-2">Well Stocked</h3>
                  <span className="text-muted-foreground text-sm">· {stockedItems.length} {stockedItems.length === 1 ? "item" : "items"}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stockedItems.map((item) => <InventoryCard key={item.id} item={item} onAdjust={handleAdjust} />)}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex justify-end">
            <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Reset all
            </button>
          </div>
        </section>
      </div>

      <AddItemModal open={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAdd} />
    </div>
  );
}
