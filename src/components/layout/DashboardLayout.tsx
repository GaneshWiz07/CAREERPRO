import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useResume } from '@/contexts/ResumeContext';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: FilePenLine, label: 'Resume Editor', path: '/editor' },
  { icon: ScanSearch, label: 'Job Tailoring', path: '/tailor' },
  { icon: Wand2, label: 'Achievement Transformer', path: '/achievements' },
  { icon: ScanLine, label: 'ATS Analysis', path: '/analysis' },
  { icon: Eye, label: 'Recruiter Heatmap', path: '/heatmap' },
  { icon: MessagesSquare, label: 'Interview Coach', path: '/interview' },
  { icon: TrendingUp, label: 'Salary Negotiation', path: '/salary' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewResume } = useResume();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNewResume = () => {
    createNewResume();
    navigate('/editor');
    setMobileMenuOpen(false);
  };

  const NavContent = ({ isMobile = false }) => (
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
                    collapsed && !isMobile && 'px-0'
                  )}
                  size={collapsed && !isMobile ? 'icon' : 'default'}
                  onClick={handleNewResume}
                >
                  <Plus className="h-4 w-4" />
                  {(!collapsed || isMobile) && <span className="ml-2">New Resume</span>}
                </Button>
              </motion.div>
            </TooltipTrigger>
            {collapsed && !isMobile && <TooltipContent side="right">New Resume</TooltipContent>}
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
                  <Link to={item.path} onClick={() => isMobile && setMobileMenuOpen(false)}>
                    <div
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground',
                        collapsed && !isMobile && 'justify-center px-0'
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
                      {(!collapsed || isMobile) && <span className="relative z-10">{item.label}</span>}
                    </div>
                  </Link>
                </TooltipTrigger>
                {collapsed && !isMobile && (
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
              <Link to="/resumes" onClick={() => isMobile && setMobileMenuOpen(false)}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                    location.pathname === '/resumes'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && !isMobile && 'justify-center px-0'
                  )}
                >
                  {location.pathname === '/resumes' && (
                    <div
                      className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                    />
                  )}
                  <Files className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/resumes' && 'text-primary-foreground')} />
                  {(!collapsed || isMobile) && <span className="relative z-10">My Resumes</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {collapsed && !isMobile && <TooltipContent side="right">My Resumes</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Settings */}
      <div className="relative p-3 border-t border-border">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/settings" onClick={() => isMobile && setMobileMenuOpen(false)}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative hover:translate-x-1',
                    location.pathname === '/settings'
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                    collapsed && !isMobile && 'justify-center px-0'
                  )}
                >
                  {location.pathname === '/settings' && (
                    <div
                      className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                    />
                  )}
                  <Settings2 className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/settings' && 'text-primary-foreground')} />
                  {(!collapsed || isMobile) && <span className="relative z-10">Settings</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {collapsed && !isMobile && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-xl z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center">
            <img src="/logo.svg" alt="CareerPro Logo" className="h-8 w-8" />
          </div>
          <span className="font-semibold text-foreground">CareerPro</span>
        </Link>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80vw] p-0 flex flex-col pt-10">
            <SheetHeader className="px-6 mb-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <NavContent isMobile={true} />
          </SheetContent>
        </Sheet>
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
      <main className="flex-1 overflow-auto relative pt-16 md:pt-0">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
}
