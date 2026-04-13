import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { GroceryItem, Category } from "@/types/stock";
import { computeStatus, UNIT_OPTIONS, ICON_OPTIONS, CATEGORIES, UNSPLASH_IMAGES } from "@/lib/stockUtils";

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (item: GroceryItem) => void;
}

const DEFAULT_FORM = {
  name: "",
  category: "Other" as Category,
  icon: "🥛",
  quantity: 0,
  unit: "pcs",
  restockThreshold: 3,
  targetQuantity: 10,
  dailyConsumption: "",
};

export function AddItemModal({ open, onClose, onAdd }: AddItemModalProps) {
  const [form, setForm] = useState(DEFAULT_FORM);

  function set<K extends keyof typeof DEFAULT_FORM>(key: K, value: (typeof DEFAULT_FORM)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAdd() {
    if (!form.name.trim()) return;
    const id = form.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    onAdd({
      id,
      name: form.name.trim(),
      category: form.category,
      icon: form.icon,
      quantity: Number(form.quantity),
      unit: form.unit,
      restockThreshold: Number(form.restockThreshold),
      targetQuantity: Number(form.targetQuantity),
      status: computeStatus(Number(form.quantity), Number(form.restockThreshold), Number(form.targetQuantity)),
      image: UNSPLASH_IMAGES[id] ?? "",
      dailyConsumption: form.dailyConsumption ? Number(form.dailyConsumption) : undefined,
    });
    setForm(DEFAULT_FORM);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className="relative z-10 bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Add Item</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Icon picker */}
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Icon</label>
              <div className="flex flex-wrap gap-1.5">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => set("icon", icon)}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                      form.icon === icon
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted hover:bg-accent"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
              <input
                type="text"
                placeholder="e.g. Greek Yogurt"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Category + Unit */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as Category)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Unit</label>
                <select
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {UNIT_OPTIONS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Current + Target */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Current</label>
                <input
                  type="number" min={0}
                  value={form.quantity}
                  onChange={(e) => set("quantity", Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Target</label>
                <input
                  type="number" min={1}
                  value={form.targetQuantity}
                  onChange={(e) => set("targetQuantity", Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Daily consumption */}
            <div className="mb-5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">
                Daily use <span className="normal-case font-normal">(optional, in {form.unit}/day)</span>
              </label>
              <input
                type="number" min={0} placeholder="e.g. 1"
                value={form.dailyConsumption}
                onChange={(e) => set("dailyConsumption", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-input-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleAdd}
              disabled={!form.name.trim()}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
