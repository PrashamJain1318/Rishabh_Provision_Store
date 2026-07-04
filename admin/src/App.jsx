import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, Menu, Bell, TrendingUp, Package, IndianRupee, FolderTree, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ProductsManager from './components/ProductsManager';
import CategoriesManager from './components/CategoriesManager';
import InventoryManager from './components/InventoryManager';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-gray-900 text-white h-screen shrink-0 overflow-hidden sticky top-0"
          >
            <div className="p-6">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-primary p-1.5 rounded-lg text-white">
                  <ShoppingBag size={20} />
                </span>
                Rishabh <span className="text-primary">Admin</span>
              </h1>
            </div>

            <nav className="mt-6 px-4 space-y-2">
              {[
                { name: 'Dashboard', icon: LayoutDashboard },
                { name: 'Analytics', icon: TrendingUp },
                { name: 'Orders', icon: Package },
                { name: 'Inventory', icon: Package },
                { name: 'Categories', icon: FolderTree },
                { name: 'Products', icon: ShoppingBag },
                { name: 'Customers', icon: Users },
                { name: 'Settings', icon: Settings },
              ].map((item) => (
                <button 
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} /> {item.name}
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              RJ
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8 flex-1 overflow-auto">
          {activeTab === 'Dashboard' && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Revenue', value: '₹45,231', icon: IndianRupee, color: 'bg-green-100 text-green-600', trend: '+12.5%' },
              { title: 'Active Orders', value: '24', icon: Package, color: 'bg-blue-100 text-blue-600', trend: '+4.2%' },
              { title: 'Total Customers', value: '1,204', icon: Users, color: 'bg-orange-100 text-orange-600', trend: '+18.1%' },
              { title: 'Growth', value: '+24%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600', trend: 'Steady' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <p className="text-xs text-green-500 mt-1">{stat.trend} from last month</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Recent Orders</h3>
              <button className="text-sm text-primary font-medium hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { id: '#ORD-1001', name: 'Ankit Sharma', date: 'Just now', amount: '₹1,240', status: 'Packing', statusColor: 'bg-yellow-100 text-yellow-700' },
                    { id: '#ORD-1000', name: 'Neha Gupta', date: '2 hours ago', amount: '₹890', status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
                    { id: '#ORD-0999', name: 'Rahul Verma', date: 'Yesterday', amount: '₹4,500', status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
                  ].map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                      <td className="px-6 py-4">{order.name}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 font-medium">*{order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-primary transition-colors tooltip" title="Print Invoice">
                          <Printer size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'Products' && (
            <ProductsManager />
          )}

          {activeTab === 'Categories' && (
            <CategoriesManager />
          )}

          {activeTab === 'Inventory' && (
            <InventoryManager />
          )}

          {activeTab === 'Analytics' && (
            <AnalyticsDashboard />
          )}

        </div>
      </main>

    </div>
  );
}

export default App;
