import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { Dashboard } from '../pages/Dashboard';
import { NewRequest } from '../pages/NewRequest';
import { ConstraintAnalysis } from '../pages/ConstraintAnalysis';
import { VendorComparison } from '../pages/VendorComparison';
import { AuthorizationFirewall } from '../pages/AuthorizationFirewall';
import { HumanApproval } from '../pages/HumanApproval';
import { AuditTimeline } from '../pages/AuditTimeline';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/constraint-analysis" element={<ConstraintAnalysis />} />
        <Route path="/vendor-comparison" element={<VendorComparison />} />
        <Route path="/authorization-firewall" element={<AuthorizationFirewall />} />
        <Route path="/human-approval" element={<HumanApproval />} />
        <Route path="/audit-timeline" element={<AuditTimeline />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
