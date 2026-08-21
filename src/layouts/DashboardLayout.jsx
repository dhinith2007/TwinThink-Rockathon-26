import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNavbar } from '../components/navigation/TopNavbar';
import { AIReasoningPanel } from '../components/common/AIReasoningPanel';

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg flex text-text-primary selection:bg-primary/30 selection:text-text-primary">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Header Bar */}
        <TopNavbar />

        {/* Dynamic Screen View with 300ms Route Animation */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-border/50 text-xs text-text-muted flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div>
            ProcuraAI Autonomous Procurement Platform • <span className="text-text-secondary">ROCKATHON'26 MVP</span>
          </div>
          <div>
            Firewall Policy Engine: <span className="text-success font-bold">Active & Enforcing</span>
          </div>
        </footer>
      </div>

      {/* Global AI Reasoning Secret Drawer */}
      <AIReasoningPanel />
    </div>
  );
}

export default DashboardLayout;
