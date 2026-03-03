import React, { useState } from 'react';
import { UserRole } from './types';
import { 
  Users, 
  Calendar, 
  Wallet, 
  LayoutDashboard, 
  LogOut, 
  UserCircle,
  Stethoscope,
  ChevronLeft,
  FileBarChart,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { useNotifications } from './NotificationProvider';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, activeTab, setActiveTab, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'patients', label: 'المرضى', icon: Users },
    { id: 'schedule', label: 'المواعيد', icon: Calendar },
    { id: 'accounts', label: 'الحسابات', icon: Wallet },
    
  ];

  if (role === UserRole.DOCTOR) {
    menuItems.push({ id: 'reports', label: 'التقارير', icon: FileBarChart });
     menuItems.push({ id: 'pricing', label: 'تسعير الخدمات', icon: Wallet },);
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    closeSidebar();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-cairo" dir="rtl">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-100 shadow-2xl flex flex-col z-40
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between lg:justify-start gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-xl shadow-lg shadow-teal-100">
              <Stethoscope className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-teal-900 leading-none">دينتا كلاود</h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">إدارة العيادات</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scroll">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group ${
                activeTab === item.id 
                  ? 'bg-teal-600 text-white font-bold shadow-lg shadow-teal-100' 
                  : 'text-gray-400 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span className="text-sm tracking-wide">{item.label}</span>
              </div>
              {activeTab === item.id && <ChevronLeft size={14} />}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 shrink-0">
              <UserCircle className="text-teal-600" size={22} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-800 block truncate">
                {role === UserRole.DOCTOR ? 'د. عبدالرحمن ماهر' : 'موظف الاستقبال'}
              </span>
              <span className="text-[8px] text-teal-600 font-bold uppercase mt-0.5 bg-teal-50 px-2 py-0.5 rounded-full inline-block">
                {role === UserRole.DOCTOR ? 'مدير العيادة' : 'الاستقبال'}
              </span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all text-xs"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar} 
              className="lg:hidden p-2 text-teal-600 hover:bg-teal-50 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 truncate">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 relative">

            {/* 🔔 Notification Bell (Doctor Only) */}
            {role === UserRole.DOCTOR && (
              <div className="relative">
                <button
                  onClick={() => {
  setOpenNotifications(prev => {
    const next = !prev;
    if (next) {
      markAllAsRead(); // 👈 أول ما تفتح القائمة العداد يختفي
    }
    return next;
  });
}}
                  className="relative p-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <Bell size={20} className="text-gray-600" />
                {unreadCount > 0 && (
  <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
    {unreadCount}
  </span>
)}
                </button>

                {openNotifications && (
                  <div className="absolute left-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 font-bold border-b text-sm">
                      سجل الإشعارات
                    </div>
                    <div className="max-h-80 overflow-y-auto custom-scroll">
                      {notifications.length === 0 && (
                        <div className="p-6 text-center text-gray-400 text-sm">
                          لا يوجد إشعارات
                        </div>
                      )}
                      {notifications.map(n => (
  <div
    key={n.id}
    className={`p-4 border-b text-sm transition ${
      !n.read ? 'bg-teal-50' : 'hover:bg-gray-50'
    }`}
  >
    <div
      dangerouslySetInnerHTML={{ __html: n.message }}
    />

    {n.createdAt && (
      <div className="text-[10px] text-gray-400 mt-2">
        {new Date(n.createdAt).toLocaleString('ar-EG', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    )}
  </div>
))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Date */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border border-gray-100 text-[10px] md:text-xs text-gray-500 font-bold">
              <Calendar size={14} />
              <span className="hidden lg:inline">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <span className="lg:hidden">
                {new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            {/* Status */}
            <div className="bg-teal-50 text-teal-700 px-3 py-1.5 md:px-5 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold border border-teal-100 shadow-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-teal-600 rounded-full animate-pulse" />
              <span className="hidden xs:inline">الحالة: {role === UserRole.DOCTOR ? 'مدير' : 'استقبال'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;