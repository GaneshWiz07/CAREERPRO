import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FileText,
  Target,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderOpen,
  MessageSquare,
  DollarSign,
  Flame,
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
  { icon: FileText, label: 'Resume Editor', path: '/editor' },
  { icon: Target, label: 'Job Tailoring', path: '/tailor' },
  { icon: Sparkles, label: 'Achievement Transformer', path: '/achievements' },
  { icon: BarChart3, label: 'ATS Analysis', path: '/analysis' },
  { icon: Flame, label: 'Recruiter Heatmap', path: '/heatmap' },
  { icon: MessageSquare, label: 'Interview Coach', path: '/interview' },
  { icon: DollarSign, label: 'Salary Negotiation', path: '/salary' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { createNewResume } = useResume();
  const [collapsed, setCollapsed] = React.useState(false);

  const handleNewResume = () => {
    createNewResume();
    navigate('/editor');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex flex-col border-r border-border bg-card relative overflow-hidden"
      >
        {/* Gradient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
        
        {/* Logo */}
        <div className="relative flex h-16 items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
              >
                <FileText className="h-4 w-4 text-primary-foreground" />
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
            {NAV_ITEMS.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ x: 4 }}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                          isActive
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground',
                          collapsed && 'justify-center px-0'
                        )}
                      >
                        {/* Active background with glow */}
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                            transition={{ type: 'spring', duration: 0.5 }}
                          />
                        )}
                        
                        {/* Hover background */}
                        {!isActive && (
                          <div className="absolute inset-0 rounded-lg bg-accent opacity-0 hover:opacity-100 transition-opacity" />
                        )}
                        
                        <item.icon className={cn('h-5 w-5 flex-shrink-0 relative z-10', isActive && 'text-primary-foreground')} />
                        {!collapsed && <span className="relative z-10">{item.label}</span>}
                      </motion.div>
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
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                      location.pathname === '/resumes'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    {location.pathname === '/resumes' && (
                      <motion.div
                        layoutId="activeNavBottom"
                        className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                    <FolderOpen className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/resumes' && 'text-primary-foreground')} />
                    {!collapsed && <span className="relative z-10">My Resumes</span>}
                  </motion.div>
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
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all relative',
                      location.pathname === '/settings'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                      collapsed && 'justify-center px-0'
                    )}
                  >
                    {location.pathname === '/settings' && (
                      <motion.div
                        layoutId="activeNavSettings"
                        className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/30"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                    <Settings className={cn('h-5 w-5 flex-shrink-0 relative z-10', location.pathname === '/settings' && 'text-primary-foreground')} />
                    {!collapsed && <span className="relative z-10">Settings</span>}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Settings</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
}
