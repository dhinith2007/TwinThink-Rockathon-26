import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { mockRequests } from '../data/requests';
import { mockVendors } from '../data/vendors';
import { mockPolicies } from '../data/policies';
import { mockAuditTrail } from '../data/audit';
import api from '../services/api';

const ProcurementContext = createContext();

export function ProcurementProvider({ children }) {
  // Session Identity
  const [sessionId, setSessionId] = useState("PROC-2026-0822-001");
  const [requestId, setRequestId] = useState(null);
  
  // Demo Mode vs Live Mode (Default: Live Mode if backend available)
  const [demoMode, setDemoMode] = useState(false);
  const [backendHealth, setBackendHealth] = useState({
    status: 'checking',
    api: 'unknown',
    database: 'unknown',
    ai_engine: 'unknown',
    vendor_engine: 'unknown'
  });
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Active Request State
  const [currentRequest, setCurrentRequest] = useState(mockRequests[0]);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, success, error
  const [errorMessage, setErrorMessage] = useState(null);

  // Live Backend Data Objects
  const [liveConstraints, setLiveConstraints] = useState(null);
  const [liveVendors, setLiveVendors] = useState(mockVendors);
  const [livePolicyChecks, setLivePolicyChecks] = useState(mockPolicies);
  const [liveDecision, setLiveDecision] = useState(null);
  const [liveAuditEvents, setLiveAuditEvents] = useState(mockAuditTrail);
  const [livePurchaseOrder, setLivePurchaseOrder] = useState(null);

  // Workflow Progress Step (1 to 6)
  const [activeStep, setActiveStep] = useState(1);

  // AI Reasoning Side Panel State
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);
  const [aiConfidence, setAiConfidence] = useState(94);
  const [reasoningSteps, setReasoningSteps] = useState([
    "Parsing natural language procurement intent for 10 × Dell Latitude 5440 Laptops.",
    "Extracted 4 Hard Constraints, 3 Soft Preferences, and resolved 2 Ambiguities.",
    "Queried active enterprise supplier database (12 suppliers indexed).",
    "Eliminated 7 non-compliant vendors failing mandatory RAM & SLA constraints.",
    "Normalized technical hardware specifications across 3 remaining candidates.",
    "Executed 5-dimension risk decomposition on top suppliers.",
    "Multi-objective scoring engine evaluated CompSource with highest score (93.5/100).",
    "Evaluated 5 Policy Firewall governance rules → Outcome: ESCALATE (Amount > ₹2.00L).",
    "Compiled Executive Decision Packet with alternatives and variance breakdown.",
    "Appended immutable SHA-256 hashed audit record to procurement ledger."
  ]);

  // Constraint Relaxation Simulator State
  const [relaxationDeliveryDays, setRelaxationDeliveryDays] = useState(7);
  const [relaxationResults, setRelaxationResults] = useState(null);

  // Purchase Order Status State ('idle', 'issuing', 'issued')
  const [poStatus, setPoStatus] = useState('idle');
  const [generatedPoNumber, setGeneratedPoNumber] = useState('PO-2026-8942');

  // AI Activity Feed Items for Dashboard
  const [activityFeed, setActivityFeed] = useState([
    { id: 1, time: "10s ago", action: "Multi-objective vendor scoring matrix completed", type: "success" },
    { id: 2, time: "42s ago", action: "Policy POL-001 triggered: Escalating order > ₹2.00L to VP Approval", type: "warning" },
    { id: 3, time: "2m ago", action: "Autonomous counter-offer accepted by CompSource Enterprise (Saved ₹20,000)", type: "success" },
    { id: 4, time: "5m ago", action: "Hard constraints parsed: 16GB RAM, 512GB SSD, Budget ≤ ₹45k", type: "info" },
    { id: 5, time: "12m ago", action: "Buying intent ingested: '10 laptops under ₹45,000 each'", type: "info" }
  ]);

  // Check Backend Health and Rehydrate State on Mount
  const checkHealthAndRehydrate = useCallback(async () => {
    try {
      const health = await api.getHealth();
      setBackendHealth(health);
      setIsBackendConnected(health.status === 'healthy');

      // Attempt state rehydration from database if saved request ID exists
      const savedRequestId = sessionStorage.getItem('procura_request_id');
      if (savedRequestId && health.status === 'healthy') {
        try {
          const response = await api.getProcurementById(savedRequestId);
          if (response) {
            setRequestId(response.request_id);
            setSessionId(response.session_id);
            setCurrentRequest({
              id: response.request_id,
              title: response.title,
              itemName: response.item_name,
              quantity: response.quantity,
              unitBudget: response.budget_per_unit,
              totalBudget: response.total_budget,
              deliveryDeadlineDays: response.delivery_days,
              priority: response.priority,
              status: response.status,
              originalPrompt: response.raw_request,
              hardConstraints: response.constraints.hard_constraints.map(c => `${c.name}: ${c.value}`),
              softPreferences: response.constraints.soft_preferences.map(c => `${c.name}: ${c.value}`),
              ambiguities: response.constraints.ambiguities.map(c => `${c.name}: ${c.value}`)
            });
            setLiveConstraints(response.constraints);
            setLiveVendors(response.vendors);
            setLivePolicyChecks(response.policy_checks);
            setLiveDecision(response.decision);
            setLiveAuditEvents(response.audit_events);
            if (response.reasoning_steps?.length > 0) {
              setReasoningSteps(response.reasoning_steps);
            }
            setAiConfidence(response.decision?.agent_confidence || 94);
          }
        } catch (rehydrateErr) {
          console.warn("Could not rehydrate previous request from DB:", rehydrateErr.message);
        }
      }
    } catch (err) {
      setBackendHealth({
        status: 'unreachable',
        api: 'down',
        database: 'unreachable',
        ai_engine: 'offline',
        vendor_engine: 'offline'
      });
      setIsBackendConnected(false);
      setDemoMode(true);
    }
  }, []);

  useEffect(() => {
    checkHealthAndRehydrate();
  }, [checkHealthAndRehydrate]);

  // Execute Procurement Analysis (Live FastAPI or Demo Mock)
  const runAnalysis = async (inputData) => {
    setAnalysisStatus('analyzing');
    setErrorMessage(null);

    const payload = {
      raw_request: inputData.naturalPrompt || currentRequest.originalPrompt,
      item_name: inputData.itemName || currentRequest.itemName,
      quantity: Number(inputData.quantity) || currentRequest.quantity,
      budget_per_unit: Number(inputData.unitBudget) || currentRequest.unitBudget,
      delivery_days: Number(inputData.deliveryDeadlineDays) || currentRequest.deliveryDeadlineDays,
      priority: inputData.priority || currentRequest.priority,
      session_id: sessionId
    };

    if (demoMode || !isBackendConnected) {
      // Demo Mode Execution: Local Mock
      updateRequestFromInput(inputData);
      setAnalysisStatus('success');
      return true;
    }

    try {
      const response = await api.analyzeRequest(payload);
      
      setRequestId(response.request_id);
      setSessionId(response.session_id);
      sessionStorage.setItem('procura_request_id', response.request_id);
      sessionStorage.setItem('procura_session_id', response.session_id);
      
      // Update Current Request state
      setCurrentRequest({
        id: response.request_id,
        title: response.title,
        itemName: response.item_name,
        quantity: response.quantity,
        unitBudget: response.budget_per_unit,
        totalBudget: response.total_budget,
        deliveryDeadlineDays: response.delivery_days,
        priority: response.priority,
        status: response.status,
        originalPrompt: response.raw_request,
        hardConstraints: response.constraints.hard_constraints.map(c => `${c.name}: ${c.value}`),
        softPreferences: response.constraints.soft_preferences.map(c => `${c.name}: ${c.value}`),
        ambiguities: response.constraints.ambiguities.map(c => `${c.name}: ${c.value}`)
      });

      // Update Live State Collections
      setLiveConstraints(response.constraints);
      setLiveVendors(response.vendors);
      setLivePolicyChecks(response.policy_checks);
      setLiveDecision(response.decision);
      setLiveAuditEvents(response.audit_events);
      if (response.reasoning_steps?.length > 0) {
        setReasoningSteps(response.reasoning_steps);
      }
      setAiConfidence(response.decision.agent_confidence || 94);
      setAnalysisStatus('success');
      return true;
    } catch (err) {
      console.warn("Backend analysis error, falling back to Demo Mode:", err.message);
      setErrorMessage(`Live AI Engine: ${err.message}. Seamlessly continuing with Demo Mode.`);
      updateRequestFromInput(inputData);
      setDemoMode(true);
      setAnalysisStatus('success');
      return true;
    }
  };

  // Update request from form submission (Local)
  const updateRequestFromInput = (inputData) => {
    const updated = {
      ...currentRequest,
      title: inputData.itemName || currentRequest.title,
      itemName: inputData.itemName || currentRequest.itemName,
      quantity: Number(inputData.quantity) || currentRequest.quantity,
      unitBudget: Number(inputData.unitBudget) || currentRequest.unitBudget,
      totalBudget: (Number(inputData.quantity) || 10) * (Number(inputData.unitBudget) || 45000),
      deliveryDeadlineDays: Number(inputData.deliveryDeadlineDays) || currentRequest.deliveryDeadlineDays,
      priority: inputData.priority || currentRequest.priority,
      originalPrompt: inputData.naturalPrompt || currentRequest.originalPrompt,
      additionalRequirements: inputData.additionalRequirements || currentRequest.additionalRequirements
    };
    setCurrentRequest(updated);
  };

  // Simulate Constraint Relaxation via Backend
  const simulateDeliveryRelaxation = async (days) => {
    setRelaxationDeliveryDays(days);
    if (demoMode || !requestId || !isBackendConnected) {
      return;
    }
    try {
      const res = await api.simulateRelaxation(requestId, days);
      setRelaxationResults(res);
      if (res.updated_vendors) {
        setLiveVendors(res.updated_vendors);
      }
    } catch (err) {
      console.warn("Relaxation simulation failed:", err.message);
    }
  };

  // Issue Purchase Order (Live FastAPI or Demo Mock)
  const issuePurchaseOrder = async (approverName = "Ravi Kumar (VP Engineering)") => {
    setPoStatus('issuing');

    if (demoMode || !requestId || !isBackendConnected) {
      setTimeout(() => {
        setPoStatus('issued');
        setActivityFeed((prev) => [
          { id: Date.now(), time: "Just now", action: `Purchase Order #${generatedPoNumber} Issued & Dispatched`, type: "success" },
          ...prev
        ]);
      }, 1200);
      return;
    }

    try {
      const res = await api.approveDecision(requestId, {
        action: "APPROVE",
        action_by: approverName,
        comments: "Approved with 3 Years Onsite ProSupport SLA."
      });

      if (res.purchase_order) {
        setLivePurchaseOrder(res.purchase_order);
        setGeneratedPoNumber(res.purchase_order.po_number);
      }

      // Refresh Audit Trail
      const auditRes = await api.getAuditTrail(requestId);
      if (auditRes) {
        setLiveAuditEvents(auditRes);
      }

      setPoStatus('issued');
      setActivityFeed((prev) => [
        { id: Date.now(), time: "Just now", action: `Purchase Order #${res.purchase_order?.po_number || generatedPoNumber} Issued & Dispatched`, type: "success" },
        ...prev
      ]);
    } catch (err) {
      console.warn("Live PO issuance failed, falling back to mock:", err.message);
      setPoStatus('issued');
    }
  };

  return (
    <ProcurementContext.Provider
      value={{
        sessionId,
        demoSessionId: sessionId,
        requestId,
        demoMode,
        setDemoMode,
        backendHealth,
        isBackendConnected,
        checkHealth,
        currentRequest,
        setCurrentRequest,
        runAnalysis,
        updateRequestFromInput,
        analysisStatus,
        errorMessage,
        liveConstraints,
        liveVendors,
        livePolicyChecks,
        liveDecision,
        liveAuditEvents,
        livePurchaseOrder,
        activeStep,
        setActiveStep,
        isReasoningOpen,
        setIsReasoningOpen,
        toggleReasoningPanel: () => setIsReasoningOpen((prev) => !prev),
        aiConfidence,
        reasoningSteps,
        relaxationDeliveryDays,
        setRelaxationDeliveryDays,
        simulateDeliveryRelaxation,
        relaxationResults,
        poStatus,
        issuePurchaseOrder,
        generatedPoNumber,
        activityFeed,
        mockVendors,
        mockPolicies,
        mockAuditTrail
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
}

export function useProcurement() {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
}

export default ProcurementContext;
