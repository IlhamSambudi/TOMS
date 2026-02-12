import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    Users,
    Plane,
    Bus,
    UserCheck,
    FileText,
    Settings,
    Briefcase,
    BadgeCheck,
    Building2,
    Search,
    Bell,
    Menu
} from 'lucide-react';

const navSections = [
    {
        title: 'MAIN',
        items: [
            { path: '/', label: 'Dashboard', icon: LayoutDashboard }
        ]
    },
    {
        title: 'OPERATIONS',
        items: [
            { path: '/groups', label: 'Groups', icon: Users },
            { path: '/flights', label: 'Flights', icon: Plane },
            { path: '/transport', label: 'Transport', icon: Bus }
        ]
    },
    {
        title: 'ASSIGNMENTS',
        items: [
            { path: '/assignments', label: 'Team Assignment', icon: UserCheck }
        ]
    },
    {
        title: 'MASTER DATA',
        items: [
            { path: '/muthawif', label: 'Muthawif', icon: BadgeCheck },
            { path: '/tour-leaders', label: 'Tour Leaders', icon: Briefcase },
            { path: '/handling-companies', label: 'Handling Companies', icon: Building2 }
        ]
    },
    {
        title: 'REPORTS',
        items: [
            { path: '/reports', label: 'Reports', icon: FileText }
        ]
    },
    {
        title: 'SYSTEM',
        items: [
            { path: '/settings', label: 'Settings', icon: Settings }
        ]
    }
];

const Layout = () => {
    const location = useLocation();
    const [sidebarMode, setSidebarMode] = useState('desktop');
    const [mobileOpen, setMobileOpen] = useState(false);

    // Responsive Logic
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setSidebarMode('desktop');
                setMobileOpen(false);
            } else if (width >= 768) {
                setSidebarMode('tablet');
                setMobileOpen(false);
            } else {
                setSidebarMode('mobile');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        // APP SHELL: Strict 3-Level Hierarchy
        // 1. Sidebar (Fixed 248px)
        // 2. Main Wrapper (ml-[248px])
        <div className="min-h-screen bg-[#F8FAF9] font-['Inter']">

            {/* ── Mobile Overlay ── */}
            {sidebarMode === 'mobile' && mobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── Level 1: Sidebar (Fixed) ── */}
            <aside
                className={clsx(
                    'fixed inset-y-0 left-0 z-40 bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300',
                    // Width Rules
                    sidebarMode === 'desktop' ? 'w-[248px]' :
                        sidebarMode === 'tablet' ? 'w-[72px]' :
                            sidebarMode === 'mobile' ? (mobileOpen ? 'w-[248px] translate-x-0' : 'w-[248px] -translate-x-full') : 'w-[248px]'
                )}
            >
                {/* Sidebar Header (64px) */}
                <div className="h-[64px] flex items-center px-[20px] flex-shrink-0 border-b border-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-[32px] h-[32px] bg-[var(--primary)] rounded-[8px] flex items-center justify-center text-white shadow-md shadow-teal-700/20">
                            <Building2 size={18} strokeWidth={2.5} />
                        </div>
                        <span className={clsx("text-[18px] font-bold text-slate-900 tracking-tight transition-opacity duration-300", sidebarMode === 'tablet' && 'opacity-0 w-0 overflow-hidden')}>
                            TOMS
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-[12px] py-6">
                    <nav className="flex flex-col gap-6">
                        {navSections.map((section, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                <div className={clsx(
                                    "px-4 mb-2 text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] transition-opacity duration-300",
                                    sidebarMode === 'tablet' && "opacity-0 h-0 overflow-hidden"
                                )}>
                                    {section.title}
                                </div>

                                {section.items.map(item => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => sidebarMode === 'mobile' && setMobileOpen(false)}
                                            className={clsx(
                                                'group flex items-center h-[40px] px-[12px] gap-[12px] rounded-[10px] transition-all duration-150',
                                                active
                                                    ? 'bg-[#E0F2F1] text-[#0F766E] font-semibold'
                                                    : 'text-[#64748B] font-medium hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                                            )}
                                        >
                                            <item.icon
                                                size={20}
                                                strokeWidth={2}
                                                className={clsx(active ? "text-[#0F766E]" : "text-[#64748B] group-hover:text-[#0F172A]")}
                                            />
                                            <span className={clsx(
                                                "whitespace-nowrap text-[14px] transition-all duration-300",
                                                sidebarMode === 'tablet' ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                                            )}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-[16px] border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                        <div className="w-[36px] h-[36px] rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shrink-0">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=e2e8f0"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className={clsx("flex flex-col transition-all duration-300 overflow-hidden", sidebarMode === 'tablet' && "w-0 opacity-0")}>
                            <span className="text-[13px] font-semibold text-[#0F172A] truncate">Admin User</span>
                            <span className="text-[11px] text-[#64748B] truncate">Operations Lead</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Level 2: Main Wrapper ── */}
            <main
                className="flex flex-col min-h-screen bg-[#F8FAF9] transition-all duration-300"
                style={{
                    marginLeft: sidebarMode === 'desktop' ? '248px' :
                        sidebarMode === 'tablet' ? '72px' : '0px'
                }}
            >
                {/* Mobile Header Trigger */}
                {sidebarMode === 'mobile' && (
                    <div className="h-[64px] px-4 flex items-center border-b border-[#E2E8F0] bg-white sticky top-0 z-30">
                        <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2 text-slate-600">
                            <Menu size={20} />
                        </button>
                        <span className="ml-3 font-bold text-lg text-slate-800">TOMS</span>
                    </div>
                )}

                {/* Navbar (Sticky Top) */}
                <header className={clsx("h-[64px] bg-white border-b border-[#E2E8F0] sticky top-0 z-20 px-[32px] flex items-center justify-between", sidebarMode === 'mobile' && 'hidden')}>
                    {/* Page Title / Breadcrumb Area */}
                    <div className="flex items-center gap-4">
                        {/* Title is typically handled in PageHeader now, but keeping generic title here if needed or blank */}
                        <div className="text-[14px] font-medium text-[#64748B]">
                            {/* Optional: Add Breadcrumbs here later */}
                            Start / {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
                        </div>
                    </div>

                    {/* Global Actions */}
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-[280px] h-[36px] pl-[36px] pr-4 bg-[#F1F5F9] border-none rounded-[8px] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 transition-all"
                            />
                            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#94A3B8] group-focus-within:text-[#0F766E] transition-colors" />
                        </div>
                        <div className="h-5 w-[1px] bg-[#E2E8F0] mx-1"></div>
                        <button className="relative w-[36px] h-[36px] flex items-center justify-center text-[#64748B] hover:text-[#0F766E] hover:bg-[#F1F5F9] rounded-[8px] transition-all">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#DC2626] rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* ── Level 3: Content Area ── */}
                {/* Padding Top 24px, Bottom 48px */}
                <div className="flex-1 pt-[24px] pb-[48px]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
