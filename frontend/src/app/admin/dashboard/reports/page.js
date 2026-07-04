'use client';

import { FileText, Download, TrendingUp, Users, Truck } from 'lucide-react';

export default function ReportsDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Reports & Exports</h1>
        <p className="text-gray-400 text-sm">Tax, Logistics, and Customer Analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Tax & Financial Reports */}
        <ReportCategory 
          title="Financial & Tax (GST)" 
          icon={FileText} 
          color="text-blue-500"
          reports={[
            'GST R1 Monthly Filing',
            'GST R3B Monthly Filing',
            'Profit & Loss Statement',
            'Expense Breakdown'
          ]}
        />

        {/* Customer Reports */}
        <ReportCategory 
          title="Customer Analytics" 
          icon={Users} 
          color="text-purple-500"
          reports={[
            'Customer Acquisition Cost (CAC)',
            'Lifetime Value (LTV) Analysis',
            'Churn Risk Prediction',
            'Top Spenders List'
          ]}
        />

        {/* Logistics Reports */}
        <ReportCategory 
          title="Delivery & Logistics" 
          icon={Truck} 
          color="text-green-500"
          reports={[
            'Delivery SLA Breach Report',
            'Driver Performance Metrics',
            'Return & Refund Analytics',
            'Zone-wise Dispatch Data'
          ]}
        />

      </div>
    </div>
  );
}

function ReportCategory({ title, icon: Icon, color, reports }) {
  return (
    <div className="bg-[#111] rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex items-center gap-3 bg-black/20">
        <Icon className={color} size={24} />
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="p-4 space-y-2">
        {reports.map((report, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1a1a1a] transition cursor-pointer group">
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition">{report}</span>
            <Download size={16} className="text-gray-600 group-hover:text-primary transition" />
          </div>
        ))}
      </div>
    </div>
  );
}
