import { useState } from 'react'

const DEFAULT_ITEMS = [
  { id: 'milk', name: 'Milk', unit: 'ml', qty: 0, daily: 600, restock: 1000 },
  { id: 'curd', name: 'Curd', unit: 'ml', qty: 0, daily: 200, restock: 1000 },
  { id: 'rajma', name: 'Rajma', unit: 'g', qty: 0, daily: 75, restock: 1000 },
  { id: 'eggs', name: 'Eggs', unit: 'pcs', qty: 0, daily: null, restock: 12 },
  { id: 'bread', name: 'Bread', unit: 'slices', qty: 0, daily: null, restock: 10 },
  { id: 'bananas', name: 'Bananas', unit: 'pcs', qty: 0, daily: null, restock: 3 },
  { id: 'carrots', name: 'Carrots', unit: 'g', qty: 0, daily: 100, restock: 1000 },
  { id: 'chicken', name: 'Chicken', unit: 'g', qty: 0, daily: 180, restock: 1000 },
];

function getDays(item) {
  if (!item.daily || item.qty <= 0) return 0;
  return Math.floor(item.qty / item.daily);
}

function getStatus(item) {
  if (!item.daily) return 'none';
  const d = getDays(item);
  if (d === 0) return 'empty';
  if (d <= 2) return 'warn';
  return 'ok';
}

function getDayLabel(item) {
  if (!item.daily) return 'No daily tracking';
  const d = getDays(item);
  if (d === 0) return 'Out of stock';
  if (d === 1) return 'Lasts 1 day';
  return `Lasts ${d} days`;
}

const statusStyles = {
  ok: { card: 'border-zinc-200', badge: 'bg-green-50 text-green-700 border border-green-200', bar: 'bg-green-500', label: 'ok' },
  warn: { card: 'border-amber-300', badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-400', label: 'low' },
  empty: { card: 'border-red-400', badge: 'bg-red-50 text-red-700 border border-red-300', bar: 'bg-red-500', label: 'empty' },
  none: { card: 'border-zinc-200', badge: '', bar: 'bg-zinc-200', label: '' },
};

function StockCard({ item, onUpdateQty, onRestock, onRemove }) {
  const [restockAmt, setRestockAmt] = useState('');
  const status = getStatus(item);
  const cfg = statusStyles[status];
  const days = getDays(item);
  const barPct = item.daily ? Math.min(100, Math.round((days / 7) * 100)) : 100;

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

      {/* Editable quantity */}
      <div className="flex items-baseline gap-1">
        <input
          type="number"
          min="0"
          value={item.qty}
          onChange={(e) => onUpdateQty(item.id, e.target.value)}
          className="w-20 text-xl font-semibold text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
        <span className="text-sm text-zinc-400">{item.unit}</span>
      </div>

      {/* Days remaining */}
      <div className="mt-auto pt-2 border-t border-zinc-100">
        <p className="text-xs text-zinc-400 mb-1.5">{getDayLabel(item)}</p>
        {item.daily && (
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
              style={{ width: `${barPct}%` }}
            />
          </div>
        )}
      </div>

      {/* Restock row */}
      <div className="flex gap-1.5 items-center pt-1">
        <input
          type="number"
          placeholder={item.restock}
          value={restockAmt}
          onChange={(e) => setRestockAmt(e.target.value)}
          className="w-16 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
        <button
          onClick={() => { onRestock(item.id, restockAmt ? parseFloat(restockAmt) : item.restock); setRestockAmt(''); }}
          className="text-xs px-2 py-1 rounded-lg border border-zinc-200 hover:bg-zinc-50 active:scale-95 transition-all"
        >
          + Restock
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 active:scale-95 transition-all ml-auto"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function Alert({ type, message }) {
  const styles = {
    warn: 'bg-amber-50 border border-amber-200 text-amber-800',
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

export default function ReStock() {
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', unit: '', daily: '', qty: '', restock: '' });

  function updateQty(id, val) {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: Math.max(0, parseFloat(val) || 0) } : item)
    );
  }

  function restockItem(id, amount) {
    setItems((prev) =>
      prev.map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item)
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    if (!newItem.name.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: 'item_' + Date.now(),
        name: newItem.name.trim(),
        unit: newItem.unit.trim() || 'pcs',
        daily: parseFloat(newItem.daily) || null,
        qty: parseFloat(newItem.qty) || 0,
        restock: parseFloat(newItem.restock) || 1,
      },
    ]);
    setNewItem({ name: '', unit: '', daily: '', qty: '', restock: '' });
    setShowAddForm(false);
  }

  const alerts = [];
  items.forEach((item) => {
    if (!item.daily) return;
    const d = getDays(item);
    if (item.qty <= 0) alerts.push({ type: 'danger', message: `${item.name} is out of stock.` });
    else if (d === 1) alerts.push({ type: 'warn', message: `${item.name} runs out tomorrow — restock today.` });
    else if (d === 2) alerts.push({ type: 'warn', message: `${item.name} will run out in 2 days.` });
  });

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-zinc-200">
        <h1 className="text-lg font-semibold text-zinc-800">ReStock</h1>
        <p className="text-sm text-zinc-400 mt-0.5">
          Track what you have. See if you're covered for tomorrow and the day after.
        </p>
      </div>

      {/* Add item button */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="h-10 px-5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 font-medium hover:bg-zinc-50 active:scale-95 transition-all"
        >
          {showAddForm ? 'Cancel' : '+ Add item'}
        </button>
      </div>

      {/* Add item form */}
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

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          {alerts.map((a, i) => (
            <Alert key={i} type={a.type} message={a.message} />
          ))}
        </div>
      )}

      {/* Stock grid */}
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