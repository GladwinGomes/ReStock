import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// DEFAULT DATA
// Each item has:
//   id       → unique key React uses internally
//   name     → display name
//   unit     → what we measure in (g, ml, pcs…)
//   qty      → how much is currently in stock
//   daily    → how much we consume per day (null = we don't track this)
//   restock  → the default amount added when you press "+ Restock"
// ─────────────────────────────────────────────
const DEFAULT_ITEMS = [
  { id: 'milk',    name: 'Milk',    unit: 'ml',   qty: 0, daily: 600,  restock: 1000 },
  { id: 'curd',    name: 'Curd',    unit: 'g',    qty: 0, daily: 200,  restock: 1000 },
  { id: 'rajma',   name: 'Rajma',   unit: 'g',    qty: 0, daily: 75,   restock: 1000 },
  { id: 'eggs',    name: 'Eggs',    unit: 'pcs',  qty: 0, daily: 3,    restock: 12   },
  { id: 'bread',   name: 'Bread',   unit: 'days', qty: 0, daily: 1,    restock: 2    },
  { id: 'bananas', name: 'Bananas', unit: 'days', qty: 0, daily: 1,    restock: 3    },
  { id: 'carrots', name: 'Carrots', unit: 'g',    qty: 0, daily: 100,  restock: 700  },
  { id: 'chicken', name: 'Chicken', unit: 'g',    qty: 0, daily: 180,  restock: 1000 },
];

const STORAGE_KEY = 'restock-items';


// ─────────────────────────────────────────────
// HELPER: how many days of stock do we have left?
// ─────────────────────────────────────────────
function getDays(item) {
  if (item.daily === null) return 0;
  if (item.qty <= 0) return 0;
  return Math.floor(item.qty / item.daily);
}


// ─────────────────────────────────────────────
// HELPER: what's the status of this item?
// ─────────────────────────────────────────────
function getStatus(item) {
  const daysLeft = getDays(item);
  if (daysLeft === 0) return 'empty';
  if (daysLeft === 1) return 'warn';
  if (daysLeft === 2) return 'warn';
  return 'ok';
}


// ─────────────────────────────────────────────
// HELPER: human-readable label for days left
// ─────────────────────────────────────────────
function getDayLabel(item) {
  const daysLeft = getDays(item);
  if (daysLeft === 0) return 'Out of stock';
  if (daysLeft === 1) return 'Lasts 1 day';
  return `Lasts ${daysLeft} days`;
}


// ─────────────────────────────────────────────
// STYLES: Tailwind classes grouped by status
// ─────────────────────────────────────────────
const statusStyles = {
  ok:    { card: 'border-zinc-200',  badge: 'bg-green-50 text-green-700 border border-green-200', bar: 'bg-green-500', label: 'ok'    },
  warn:  { card: 'border-amber-300', badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-400', label: 'low'   },
  empty: { card: 'border-red-400',   badge: 'bg-red-50 text-red-700 border border-red-300',       bar: 'bg-red-500',   label: 'empty' },
};


// ─────────────────────────────────────────────
// COMPONENT: a single item card
// ─────────────────────────────────────────────
function StockCard({ item, onUpdateQty, onRestock, onRemove }) {
  const [restockAmt, setRestockAmt] = useState('');

  const status   = getStatus(item);
  const cfg      = statusStyles[status];
  const daysLeft = getDays(item);

  let barPercent = 0;
  if (item.daily) {
    barPercent = Math.min(100, Math.round((daysLeft / 7) * 100));
  } else {
    barPercent = 100;
  }

  function handleRestock() {
    const amountToAdd = restockAmt ? parseFloat(restockAmt) : item.restock;
    onRestock(item.id, amountToAdd);
    setRestockAmt('');
  }

  return (
    <div className={`bg-white rounded-xl border p-4 flex flex-col gap-2 ${cfg.card}`}>

      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-zinc-700 capitalize">{item.name}</span>
        {status !== 'none' && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span
          min="0"
          className="w-20 text-xl font-semibold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        >{item.qty}</span>
        <span className="text-sm text-zinc-400">{item.unit}</span>
      </div>

      <div className="mt-auto pt-4 border-t border-zinc-100">
        <p className="text-xs text-zinc-400 mb-1.5">{getDayLabel(item)}</p>
        {item.daily && (
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
              style={{ width: `${barPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 items-center pt-1">
        <input
          type="number"
          placeholder={item.restock}
          value={restockAmt}
          onChange={(e) => setRestockAmt(e.target.value)}
          className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
        <button
          onClick={handleRestock}
          className="w-full text-xs px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 active:scale-95 transition-all"
        >
          + Restock
        </button>
      </div>

    </div>
  );
}


// ─────────────────────────────────────────────
// COMPONENT: a coloured alert banner
// ─────────────────────────────────────────────
function Alert({ type, message }) {
  const styles = {
    warn:   'bg-amber-50 border border-amber-200 text-amber-800',
    danger: 'bg-red-50 border border-red-200 text-red-800',
  };
  const icons = { warn: '⚠️', danger: '🚨' };

  return (
    <div className={`flex items-start gap-2 px-4 py-3 rounded-lg text-sm ${styles[type]}`}>
      <span className="text-base leading-none mt-0.5">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}


// ─────────────────────────────────────────────
// MAIN COMPONENT: the whole page
// ─────────────────────────────────────────────
export default function ReStock() {
  // CHANGED: start as null so we can distinguish "not loaded yet" from "empty list"
  const [items, setItems] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '', unit: '', daily: '', qty: '', restock: '',
  });


  // CHANGED: load persisted data on first mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems(DEFAULT_ITEMS);
      }
    } else {
      setItems(DEFAULT_ITEMS);
    }
  }, []);


  // CHANGED: save to localStorage whenever items change
  useEffect(() => {
    if (items === null) return; // don't save before first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);


  function updateQty(id, rawValue) {
    const parsed = parseFloat(rawValue) || 0;
    const safe   = Math.max(0, parsed);
    setItems((prevItems) =>
      prevItems.map((item) => item.id === id ? { ...item, qty: safe } : item)
    );
  }

  function restockItem(id, amount) {
    setItems((prevItems) =>
      prevItems.map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item)
    );
  }

  function removeItem(id) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    const itemToAdd = {
      id:      'item_' + Date.now(),
      name:    newItem.name.trim(),
      unit:    newItem.unit.trim() || 'pcs',
      daily:   parseFloat(newItem.daily) || null,
      qty:     parseFloat(newItem.qty) || 0,
      restock: parseFloat(newItem.restock) || 1,
    };
    setItems((prevItems) => [...prevItems, itemToAdd]);
    setNewItem({ name: '', unit: '', daily: '', qty: '', restock: '' });
    setShowAddForm(false);
  }


  // CHANGED: show nothing until items are loaded from storage
  if (items === null) {
    return <div className="max-w-2xl mx-auto p-6 text-sm text-zinc-400">Loading...</div>;
  }


  const alerts = [];
  items.forEach((item) => {
    if (item.daily === null) return;
    const daysLeft = getDays(item);
    if (item.qty <= 0) {
      alerts.push({ type: 'danger', message: `${item.name} is out of stock.` });
    } else if (daysLeft === 1) {
      alerts.push({ type: 'warn', message: `${item.name} runs out tomorrow — restock today.` });
    } else if (daysLeft === 2) {
      alerts.push({ type: 'warn', message: `${item.name} will run out in 2 days.` });
    }
  });


  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">

      <div className="mb-6 pb-4 border-b border-zinc-200">
        <h1 className="text-lg font-semibold text-zinc-800">ReStock</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Track what you have. See if you're covered for tomorrow and the day after.
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowAddForm((current) => !current)}
          className="h-10 px-5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 font-medium hover:bg-zinc-50 active:scale-95 transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add item'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Item name</label>
              <input
                type="text"
                placeholder="e.g. oats"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Unit</label>
              <input
                type="text"
                placeholder="g, ml, pcs"
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Daily use</label>
              <input
                type="number"
                placeholder="e.g. 80"
                value={newItem.daily}
                onChange={(e) => setNewItem({ ...newItem, daily: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Current stock</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={newItem.qty}
                onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Restock amount</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={newItem.restock}
                onChange={(e) => setNewItem({ ...newItem, restock: e.target.value })}
                className="w-full h-9 px-3 text-sm rounded-lg border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>

          </div>
          <button
            onClick={addItem}
            className="h-9 px-5 rounded-lg border border-zinc-300 bg-white text-sm text-zinc-700 font-medium hover:bg-zinc-100 active:scale-95 transition-all"
          >
            Add item
          </button>
        </div>
      )}

      {alerts.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {alerts.map((alert, index) => (
            <Alert key={index} type={alert.type} message={alert.message} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <StockCard
            key={item.id}
            item={item}
            onUpdateQty={updateQty}
            onRestock={restockItem}
            onRemove={removeItem}
          />
        ))}
      </div>

    </div>
  );
}