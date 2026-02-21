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
    Menu,
    Hotel,
    Train,
    BookOpen
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
            { path: '/transport', label: 'Transport', icon: Bus },
            { path: '/hotels', label: 'Hotels', icon: Hotel },
            { path: '/trains', label: 'Trains', icon: Train },
            { path: '/rawdah', label: 'Rawdah', icon: BookOpen },
            { path: '/assignments', label: 'Team Assignment', icon: UserCheck }
        ]
    },
    {
        title: 'MASTER DATA',
        items: [
            { path: '/flights', label: 'Flights', icon: Plane },
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
    }
];

const Layout = () => {
    const location = useLocation();
    // Only strictly needed state is for Mobile Menu toggle
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        // ── APP ROOT ──
        <div className="min-h-screen bg-[#F8FAF9] font-sans">

            {/* ── MOBILE OVERLAY (Visible only on < md when open) ── */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ── SIDEBAR (Fixed) ── */}
            {/* 
                DESKTOP (>= 1280px): 248px
                TABLET (>= 768px): 72px
                MOBILE (< 768px): Hidden by default, standard drawer when open 
            */}
            <aside
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out",
                    // Width Logic
                    "w-sidebar xl:w-sidebar md:w-sidebar-collapsed",
                    // Mobile Visibility Logic (Translate off-screen by default on mobile)
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* 1. Sidebar Header */}
                <div className="h-navbar flex items-center px-[20px] md:px-[20px] xl:px-[20px] md:justify-center xl:justify-start border-b border-transparent">
                    <div className="flex items-center gap-3">
                        <div className="size-[32px] bg-[#0F766E] rounded-[8px] flex items-center justify-center text-white shadow-sm shrink-0">
                            <Building2 size={18} strokeWidth={2.5} />
                        </div>
                        {/* Hide text on tablet, show on desktop/mobile */}
                        <span className="text-[18px] font-bold text-slate-900 tracking-tight md:hidden xl:block whitespace-nowrap overflow-hidden">
                            TOMS
                        </span>
                    </div>
                </div>

                {/* 2. Navigation */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3">
                    <nav className="flex flex-col gap-6">
                        {navSections.map((section, idx) => (
                            <div key={idx} className="flex flex-col gap-1">
                                {/* Section Title */}
                                <div className="px-4 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider md:hidden xl:block whitespace-nowrap overflow-hidden">
                                    {section.title}
                                </div>
                                <div className="hidden md:block xl:hidden text-center mb-2">
                                    <div className="h-[1px] w-8 bg-slate-200 mx-auto" />
                                </div>

                                {/* Items */}
                                {section.items.map(item => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={clsx(
                                                "group flex items-center h-[40px] px-3 gap-3 rounded-[10px] transition-all duration-200",
                                                // Active State
                                                active
                                                    ? "bg-teal-50 text-teal-700 font-semibold"
                                                    : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-900",
                                                // Icon Centering for Tablet
                                                "md:justify-center xl:justify-start"
                                            )}
                                        >
                                            <item.icon
                                                size={20}
                                                strokeWidth={2}
                                                className={clsx(
                                                    "shrink-0 transition-colors",
                                                    active ? "text-[#0F766E]" : "text-slate-400 group-hover:text-slate-700"
                                                )}
                                            />
                                            {/* Label hiding for Tablet */}
                                            <span className="text-[14px] whitespace-nowrap md:hidden xl:block overflow-hidden">
                                                {item.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                </div>

                {/* 3. User Profile Footer */}
                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-2 rounded-[10px] hover:bg-slate-50 cursor-pointer transition-colors md:justify-center xl:justify-start">
                        <div className="size-[36px] rounded-full bg-slate-100 shrink-0 border border-slate-200 overflow-hidden">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col md:hidden xl:flex overflow-hidden">
                            <span className="text-[13px] font-semibold text-slate-900 truncate">Admin User</span>
                            <span className="text-[11px] text-slate-500 truncate">Operations Lead</span>
                        </div>
                    </div>
                </div>
            </aside>


            {/* ── MAIN WRAPPER ── */}
            {/* 
                Desktop Margin: 248px
                Tablet Margin: 72px
                Mobile Margin: 0
            */}
            <main className={clsx(
                "flex flex-col min-h-screen transition-[margin] duration-300 ease-in-out",
                // Responsive Margins using Theme Variables
                "ml-0 md:ml-sidebar-collapsed xl:ml-sidebar"
            )}>

                {/* ── NAVBAR (Sticky) ── */}
                <header className="h-navbar bg-white border-b border-slate-200 sticky top-0 z-30">
                    <div className="h-full flex items-center justify-between w-full max-w-content mx-auto px-[24px] xl:px-[32px]">

                        {/* Left: Mobile Toggle & Breadcrumb Placeholder */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700"
                            >
                                <Menu size={20} />
                            </button>

                            {/* Breadcrumb / Title */}
                            <div className="hidden md:flex items-center text-[14px] font-medium text-slate-500">
                                Start <span className="mx-2 text-slate-300">/</span>
                                <span className="text-slate-900">
                                    {location.pathname === '/' ? 'Dashboard' :
                                        location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
                                </span>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block group">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-[36px] w-[240px] pl-[36px] pr-4 bg-slate-50 border-none rounded-[8px] text-[13px] text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden sm:block" />
                            <button className="relative p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-[8px] transition-all">
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 size-1.5 bg-red-500 rounded-full ring-2 ring-white" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* ── CONTENT AREA ── */}
                {/* Global Padding Container */}
                <div className="flex-1 px-[24px] xl:px-[32px] pt-[24px] pb-[48px]">
                    {/* Inner Max-Width Constraint */}
                    <div className="w-full max-w-content mx-auto">
                        <Outlet />
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Layout;
