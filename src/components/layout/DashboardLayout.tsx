import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FilePenLine,
  ScanSearch,
  Wand2,
  ScanLine,
  Eye,
  MessagesSquare,
  TrendingUp,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Files,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useResume } from '@/contexts/ResumeContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: FilePenLine, label: 'Resume Editor', shortLabel: 'Editor', path: '/editor' },
  { icon: ScanSearch, label: 'Job Tailoring', shortLabel: 'Tailor', path: '/tailor' },
  { icon: Wand2, label: 'Achievement Transformer', shortLabel: 'Achieve', path: '/achievements' },
  { icon: ScanLine, label: 'ATS Analysis', shortLabel: 'ATS', path: '/analysis' },
  { icon: Eye, label: 'Recruiter Heatmap', shortLabel: 'Heatmap', path: '/heatmap' },
  { icon: MessagesSquare, label: 'Interview Coach', shortLabel: 'Interview', path: '/interview' },
  { icon: TrendingUp, label: 'Salary Negotiation', shortLabel: 'Salary', path: '/salary' },
];

// Bottom nav shows first 4 items + more menu
const BOTTOM_NAV_ITEMS = NAV_ITEMS.slice(0, 4);
const MORE_NAV_ITEMS = NAV_ITEMS.slice(4);

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewResume } = useResume();
  const [collapsed, setCollapsed] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleNewResume = () => {
    createNewResume();
    navigate('/editor');
  };

  // Desktop sidebar navigation content
  const NavContent = () => (
    <>
      {/* Quick Actions */}
      <div className="relative p-3">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className={cn(
                    'w-full shadow-lg shadow-primary/20 transition-all',
                    collapsed && 'px-0'
                  )}
                  size={collapsed ? 'icon' : 'default'}
                  onClick={handleNewResume}
                >
                  <Plus className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">New Resume</span>}
                </Button>
              </motion.div>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">New Resume</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link to={item.path}>
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                        collapsed && 'justify-center px-0'
                      )}
                    >
                      {/* Active background with glow */}
                      {isActive && (
                        <div
                          className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                        />
                      )}

                      {/* Hover background */}
                      {!isActive && (
                        <div className="absolute inset-0 rounded-lg bg-accent opacity-0 hover:opacity-100 transition-opacity" />
                      )}

                      <item.icon className={cn('h-5 w-5 flex-shrink-0 relative z-10', isActive && 'text-primary-foreground')} />
                      {!collapsed && <span className="relative z-10">{item.label}</span>}
                    </div>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <Separator />

      {/* My Resumes Section */}
      <div className="relative p-3">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/resumes">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                    location.pathname === '/resumes'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  {location.pathname === '/resumes' && (
                    <div
                      className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                    />
                  )}
                  <Files className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/resumes' && 'text-primary-foreground')} />
                  {!collapsed && <span className="relative z-10">My Resumes</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">My Resumes</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Settings */}
      <div className="relative p-3 border-t border-border">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/settings">
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                    location.pathname === '/settings'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && 'justify-center px-0'
                  )}
                >
                  {location.pathname === '/settings' && (
                    <div
                      className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                    />
                  )}
                  <Settings2 className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/settings' && 'text-primary-foreground')} />
                  {!collapsed && <span className="relative z-10">Settings</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );

  // Check if current path is in "more" items
  const isMoreItemActive = MORE_NAV_ITEMS.some(item => location.pathname === item.path) || 
                           location.pathname === '/resumes' || 
                           location.pathname === '/settings';

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header - Simplified */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background z-50 flex items-center justify-center px-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center">
            <img src="/logo.svg" alt="CareerPro Logo" className="h-7 w-7" />
          </div>
          <span className="font-semibold text-foreground text-sm">CareerPro</span>
        </Link>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-card rounded-2xl px-2 py-2 shadow-2xl shadow-black/20 dark:shadow-black/40 border border-border">
          <div className="flex items-center justify-around relative">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center py-1 px-3"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <motion.div
                    className={cn(
                      "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors",
                      isActive ? "bg-primary" : "bg-transparent"
                    )}
                    animate={{
                      y: isActive ? -12 : 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <item.icon 
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )} 
                    />
                    {isActive && (
                      <motion.div
                        layoutId="bottomNavGlow"
                        className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/30 -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-[10px] font-medium text-foreground mt-1 absolute -bottom-4"
                      >
                        {item.shortLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}

            {/* More Menu Button */}
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="relative flex flex-col items-center py-1 px-3"
            >
              <motion.div
                className={cn(
                  "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors",
                  (moreMenuOpen || isMoreItemActive) ? "bg-primary" : "bg-transparent"
                )}
                animate={{
                  y: (moreMenuOpen || isMoreItemActive) ? -12 : 0,
                  scale: (moreMenuOpen || isMoreItemActive) ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {moreMenuOpen ? (
                  <X className={cn(
                    "h-5 w-5 transition-colors",
                    (moreMenuOpen || isMoreItemActive) ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                ) : (
                  <MoreHorizontal className={cn(
                    "h-5 w-5 transition-colors",
                    (moreMenuOpen || isMoreItemActive) ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                )}
                {(moreMenuOpen || isMoreItemActive) && (
                  <motion.div
                    layoutId="bottomNavGlow"
                    className="absolute inset-0 rounded-xl bg-primary shadow-lg shadow-primary/30 -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>
              <AnimatePresence>
                {(moreMenuOpen || isMoreItemActive) && (
                  <motion.span
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-medium text-foreground mt-1 absolute -bottom-4"
                  >
                    More
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* More Menu Popup */}
        <AnimatePresence>
          {moreMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-full mb-3 left-0 right-0 bg-card rounded-2xl p-3 shadow-2xl shadow-black/20 dark:shadow-black/40 border border-border"
            >
              <div className="grid grid-cols-3 gap-2">
                {MORE_NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                        isActive 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-[10px] font-medium">{item.shortLabel}</span>
                    </Link>
                  );
                })}
                
                {/* My Resumes */}
                <Link
                  to="/resumes"
                  onClick={() => setMoreMenuOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                    location.pathname === '/resumes'
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Files className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Resumes</span>
                </Link>

                {/* Settings */}
                <Link
                  to="/settings"
                  onClick={() => setMoreMenuOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                    location.pathname === '/settings'
                      ? "bg-primary text-primary-foreground" 
                      : "bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Settings2 className="h-5 w-5" />
                  <span className="text-[10px] font-medium">Settings</span>
                </Link>

                {/* New Resume */}
                <button
                  onClick={() => {
                    handleNewResume();
                    setMoreMenuOpen(false);
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-all border border-primary/30"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[10px] font-medium">New</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col border-r border-border bg-card relative overflow-hidden h-screen sticky top-0"
      >
        {/* Gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="h-8 w-8 rounded-lg flex items-center justify-center"
              >
                <img src="/logo.svg" alt="CareerPro Logo" className="h-8 w-8" />
              </motion.div>
              <span className="font-semibold text-foreground">CareerPro</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(collapsed && 'mx-auto')}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </motion.div>
          </Button>
        </div>

        <NavContent />
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative pt-14 pb-24 md:pt-0 md:pb-0">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
        <div className="relative">
          {children}
        </div>
      </main>

      {/* Backdrop overlay for more menu */}
      <AnimatePresence>
        {moreMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMoreMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
