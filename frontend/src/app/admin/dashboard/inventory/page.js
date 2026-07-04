'use client';

import { Package, AlertTriangle, RefreshCcw, ArrowRightLeft, FileText, QrCode } from 'lucide-react';

const INVENTORY = [
  { id: 'PRD-001', name: 'Aashirvaad Atta 5kg', stock: 120, zone: 'A1', batch: 'B-2401', expiry: '2025-12-10' },
  { id: 'PRD-002', name: 'Amul Taaza Milk 1L', stock: 12, zone: 'B4 (Cold)', batch: 'B-2405', expiry: '2024-05-15', alert: 'Expiry Near' },
  { id: 'PRD-003', name: 'Fortune Sunflower Oil 1L', stock: 4, zone: 'A3', batch: 'B-2399', expiry: '2026-01-20', alert: 'Low Stock' },
  { id: 'PRD-004', name: 'Basmati Rice 10kg', stock: 45, zone: 'C2', batch: 'B-2410', expiry: '2025-08-30' },
];

export default function InventoryDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Warehouse Management</h1>
          <p className="text-gray-400 text-sm">Control inventory, batches, barcodes, and automated restocking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg hover:bg-primary/90 transition flex items-center gap-2">
            <RefreshCcw size={16}/> Auto-Generate Purchase Orders
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ActionCard title="Stock Transfer" desc="Move inventory between zones" icon={ArrowRightLeft} color="text-blue-500" />
        <ActionCard title="Barcode Generator" desc="Print labels for new batches" icon={QrCode} color="text-purple-500" />
        <ActionCard title="Supplier POs" desc="Manage active purchase orders" icon={FileText} color="text-green-500" />
        <ActionCard title="Expiry Alerts" desc="Perishables nearing shelf life" icon={AlertTriangle} color="text-red-500" />
      </div>

      <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/20">
          <h3 className="font-bold text-white flex items-center gap-2"><Package size={18} className="text-primary"/> Master Inventory</h3>
          <input type="text" placeholder="Search product, SKU, batch..." className="bg-[#0a0a0a] border border-gray-700 text-white px-4 py-2 rounded-lg text-sm focus:border-primary outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-[#0a0a0a]">
              <tr>
                <th className="px-6 py-4 font-bold">SKU</th>
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Zone</th>
                <th className="px-6 py-4 font-bold">Batch Number</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Expiry Date</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY.map((item, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                  <td className="px-6 py-4 font-mono text-gray-500">{item.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 font-bold text-blue-400">{item.zone}</td>
                  <td className="px-6 py-4 font-mono text-xs">{item.batch}</td>
                  <td className="px-6 py-4 font-black text-white">{item.stock}</td>
                  <td className="px-6 py-4">{item.expiry}</td>
                  <td className="px-6 py-4">
                    {item.alert ? (
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.alert === 'Low Stock' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                        {item.alert}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400">Optimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, color }) {
  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition cursor-pointer group">
      <div className={`p-3 rounded-xl bg-gray-900 inline-block mb-4 border border-gray-800 group-hover:scale-110 transition-transform`}>
        <Icon className={color} size={24} />
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  );
}