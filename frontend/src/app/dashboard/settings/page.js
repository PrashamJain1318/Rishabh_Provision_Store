'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, ShieldCheck, Save, Monitor, Moon, Sun, Smartphone, Trash2, LogOut } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(res.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5001/api/settings', settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateNestedSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-gray-100 rounded-3xl" />
        <div className="h-64 bg-gray-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Account Settings</h1>
          <p className="text-gray-500">Manage your preferences and security</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Monitor size={20} /></div>
          <h3 className="font-bold text-gray-900 text-lg">App Preferences</h3>
        </div>
        <div className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Theme Selection</label>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'system', icon: Monitor, label: 'System Default' },
                { id: 'light', icon: Sun, label: 'Light Mode' },
                { id: 'dark', icon: Moon, label: 'Dark Mode' }
              ].map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateNestedSetting('preferences', 'theme', theme.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                    settings.preferences.theme === theme.id 
                      ? 'border-primary bg-primary/5 text-primary font-bold' 
                      : 'border-gray-100 text-gray-600 hover:border-gray-200'
                  }`}
                >
                  <theme.icon size={18} /> {theme.label}
                </button>
              ))}
            </div>
          </div>
          
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Bell size={20} /></div>
          <h3 className="font-bold text-gray-900 text-lg">Notification Preferences</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'email', label: 'Email Notifications', desc: 'Order updates & invoices' },
            { id: 'sms', label: 'SMS Alerts', desc: 'Delivery tracking via SMS' },
            { id: 'push', label: 'Push Notifications', desc: 'Real-time app alerts' },
            { id: 'promotional', label: 'Promotional Offers', desc: 'Coupons and sale alerts' },
          ].map(notif => (
            <div key={notif.id} className="flex items-start justify-between p-4 rounded-xl border border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">{notif.label}</h4>
                <p className="text-xs text-gray-500 mt-1">{notif.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.notifications[notif.id]}
                  onChange={(e) => updateNestedSetting('notifications', notif.id, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg"><ShieldCheck size={20} /></div>
          <h3 className="font-bold text-gray-900 text-lg">Security & Privacy</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h4 className="font-bold text-gray-900">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.security.twoFactorEnabled}
                onChange={(e) => updateNestedSetting('security', 'twoFactorEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <h4 className="font-bold text-gray-900">Login Alerts</h4>
              <p className="text-xs text-gray-500 mt-1">Get notified of new logins from unrecognized devices.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={settings.security.loginAlerts}
                onChange={(e) => updateNestedSetting('security', 'loginAlerts', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="p-6 border-t border-red-50 bg-red-50/30">
          <h4 className="font-bold text-red-600 mb-4 text-sm uppercase tracking-wider">Danger Zone</h4>
          <div className="flex flex-wrap gap-4">
            <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <LogOut size={16} /> Logout All Devices
            </button>
            <button className="px-5 py-2.5 bg-red-100 text-red-700 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-red-200 transition-colors">
              <Trash2 size={16} /> Delete Account
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}