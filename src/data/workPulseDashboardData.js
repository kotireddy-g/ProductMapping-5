// ─── GLOBAL WORKFORCE KPIs (from KPIs sheet of IT KPI Data Mapping) ─────────
export const globalKPIs = [
    {
        id: 'delivery-predictability',
        label: 'Delivery Predictability',
        sublabel: 'On-time %',
        value: '84.2%',
        delta: '+3.1%',
        trend: 'up',
        spark: [72, 75, 78, 80, 79, 82, 84],
        color: '#0284C7',
        category: 'Delivery Excellence',
        formula: 'Delivered commitments ÷ Total commitments (adjusted for scope changes)',
        sources: 'Jira, Salesforce, ERP',
        cadence: 'Sprint / Weekly',
        description: 'How reliably we deliver what we commit (milestones/sprints) on time.',
    },
    {
        id: 'lead-time',
        label: 'Lead Time',
        sublabel: 'Request → Prod',
        value: '6.4 days',
        delta: '-0.8d',
        trend: 'up',
        spark: [9, 8.5, 8, 7.5, 7.2, 6.8, 6.4],
        color: '#7C3AED',
        category: 'Delivery Speed',
        formula: 'First request timestamp → Production deploy timestamp',
        sources: 'Jira, GitHub, CI/CD',
        cadence: 'Weekly / Monthly',
        description: 'Time from request creation to production release.',
    },
    {
        id: 'flow-efficiency',
        label: 'Flow Efficiency',
        sublabel: 'Active vs Waiting',
        value: '61.7%',
        delta: '+2.4%',
        trend: 'up',
        spark: [52, 54, 56, 58, 60, 61, 61.7],
        color: '#059669',
        category: 'Flow Efficiency',
        formula: 'Active time ÷ Total cycle time',
        sources: 'Jira (status durations), GitHub (review time)',
        cadence: 'Weekly / Sprint',
        description: 'How much of cycle time is real work vs waiting/review/blocked.',
    },
    {
        id: 'incident-productivity',
        label: 'Incident Productivity',
        sublabel: 'MTTA / MTTR / SLA%',
        value: '91.3%',
        delta: '+1.2%',
        trend: 'up',
        spark: [85, 86, 88, 89, 90, 91, 91.3],
        color: '#D97706',
        category: 'Operational Reliability',
        formula: 'MTTA = Incident created → Acknowledged; MTTR = Created → Resolved; SLA% = Within SLA ÷ Total',
        sources: 'Jira, ERP, Zoho Finance',
        cadence: 'Daily / Weekly',
        description: 'How quickly we acknowledge and resolve incidents & support tickets within SLA.',
    },
    {
        id: 'rework-ratio',
        label: 'Rework Ratio',
        sublabel: '& Escaped Defects',
        value: '7.8%',
        delta: '-1.3%',
        trend: 'up',
        spark: [12, 11, 10.5, 9.8, 9, 8.5, 7.8],
        color: '#DC2626',
        category: 'Quality Productivity',
        formula: 'Reopen % = Reopened ÷ Closed; Escaped defects = Prod defects ÷ Total',
        sources: 'Jira (bugs/reopens), GitHub (hotfix PRs)',
        cadence: 'Sprint / Monthly',
        description: 'How much capacity is lost to rework and defects that escape to production.',
    },
    {
        id: 'billable-utilization',
        label: 'Billable Utilization',
        sublabel: '& Focus Drag',
        value: '78.5%',
        delta: '+0.9%',
        trend: 'up',
        spark: [72, 73, 74, 75, 76, 77, 78.5],
        color: '#0891B2',
        category: 'Capacity & Focus',
        formula: 'Billable Util% = Billable hours ÷ Available hours',
        sources: 'ERP (timesheets), Zoho Finance, HRM (capacity)',
        cadence: 'Weekly / Monthly',
        description: 'How much capacity becomes billable output and how much is lost to coordination drag.',
    },
];

// ─── SOURCE INTELLIGENCE HIERARCHY ──────────────────────────────────────────
// Top buttons: All | Database (App) | Reality
// Database (App) → sources with Unstructured/Metadata type
// Reality        → sources with Structured type

export const SOURCE_HIERARCHY = {
    all: {
        label: 'All',
        subSources: null,
    },
    database: {
        label: 'Database (App)',
        subSources: ['Google Drive', 'Email', 'MS Teams', 'Slack'],
        sourceType: 'Unstructured/Metadata',
    },
    reality: {
        label: 'Reality',
        subSources: ['Jira', 'GitHub', 'ERP', 'Salesforce', 'Zoho Financial', 'HRM', 'Biometric', 'Camera'],
        sourceType: 'Structured',
    },
};

// ─── KPIs per sub-source (from Source KPI Registry) ─────────────────────────
export const SOURCE_KPIS = {
    // ── Structured / Reality sources
    'Jira': [
        { id: 'JIRA-01', name: 'Cycle Time', category: 'Delivery Speed', value: '4.2d', delta: '-0.6d', trend: 'up', spark: [6, 5.5, 5.1, 4.8, 4.5, 4.3, 4.2], color: '#0284C7' },
        { id: 'JIRA-02', name: 'Lead Time', category: 'End-to-end Speed', value: '7.1d', delta: '-0.9d', trend: 'up', spark: [10, 9.2, 8.8, 8, 7.7, 7.3, 7.1], color: '#7C3AED' },
        { id: 'JIRA-03', name: 'Throughput', category: 'Output', value: '38/wk', delta: '+5', trend: 'up', spark: [28, 30, 32, 34, 35, 37, 38], color: '#059669' },
        { id: 'JIRA-04', name: 'WIP Breach Rate', category: 'Flow Control', value: '18%', delta: '-4%', trend: 'up', spark: [28, 26, 24, 22, 20, 19, 18], color: '#D97706' },
        { id: 'JIRA-05', name: 'Reopen/Rework Rate', category: 'Quality', value: '8.3%', delta: '-1.2%', trend: 'up', spark: [13, 12, 11, 10.5, 9.8, 8.9, 8.3], color: '#DC2626' },
        { id: 'JIRA-06', name: 'SLA Breach Rate', category: 'Reliability', value: '4.1%', delta: '-0.8%', trend: 'up', spark: [7, 6.5, 6, 5.5, 5, 4.5, 4.1], color: '#0891B2' },
    ],
    'GitHub': [
        { id: 'GITH-01', name: 'PR Cycle Time', category: 'Engineering Speed', value: '1.8d', delta: '-0.4d', trend: 'up', spark: [3.2, 2.9, 2.6, 2.4, 2.1, 1.9, 1.8], color: '#D97706' },
        { id: 'GITH-02', name: 'Review Latency', category: 'Collaboration Speed', value: '3.2h', delta: '-0.6h', trend: 'up', spark: [5, 4.5, 4.2, 3.9, 3.6, 3.4, 3.2], color: '#7C3AED' },
        { id: 'GITH-03', name: 'Review Coverage %', category: 'Quality Gate', value: '94%', delta: '+2%', trend: 'up', spark: [86, 88, 89, 91, 92, 93, 94], color: '#059669' },
        { id: 'GITH-04', name: 'CI Pass Rate', category: 'Build Health', value: '96.4%', delta: '+1.1%', trend: 'up', spark: [91, 92, 93, 94, 95, 96, 96.4], color: '#0284C7' },
        { id: 'GITH-05', name: 'Hotfix Rate', category: 'Stability', value: '6.2%', delta: '-1.4%', trend: 'up', spark: [11, 10, 9, 8, 7.5, 6.8, 6.2], color: '#DC2626' },
        { id: 'GITH-06', name: 'Revert/Rollback Proxy', category: 'Change Risk', value: '2.1%', delta: '-0.3%', trend: 'up', spark: [4, 3.5, 3.2, 2.8, 2.5, 2.2, 2.1], color: '#0891B2' },
    ],
    'ERP': [
        { id: 'ERP-01', name: 'PO Processing Time', category: 'Procurement Speed', value: '2.4d', delta: '-0.3d', trend: 'up', spark: [4, 3.8, 3.5, 3.2, 3, 2.6, 2.4], color: '#0284C7' },
        { id: 'ERP-02', name: 'Invoice Match Rate', category: 'Accuracy', value: '97.2%', delta: '+0.8%', trend: 'up', spark: [94, 95, 95.5, 96, 96.5, 97, 97.2], color: '#059669' },
        { id: 'ERP-03', name: 'Budget Utilization', category: 'Financial Control', value: '82.4%', delta: '+2.1%', trend: 'up', spark: [76, 78, 79, 80, 81, 82, 82.4], color: '#D97706' },
        { id: 'ERP-04', name: 'Vendor SLA Compliance', category: 'Reliability', value: '88.6%', delta: '+1.4%', trend: 'up', spark: [83, 84, 85, 86, 87, 88, 88.6], color: '#7C3AED' },
    ],
    'Salesforce': [
        { id: 'SFDC-01', name: 'Pipeline Coverage', category: 'Sales Health', value: '3.4x', delta: '+0.2x', trend: 'up', spark: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4], color: '#0284C7' },
        { id: 'SFDC-02', name: 'Win Rate', category: 'Conversion', value: '31.2%', delta: '+2.8%', trend: 'up', spark: [24, 26, 27, 28, 29, 30, 31.2], color: '#059669' },
        { id: 'SFDC-03', name: 'Sales Cycle Time', category: 'Efficiency', value: '28d', delta: '-3d', trend: 'up', spark: [38, 36, 34, 33, 31, 30, 28], color: '#7C3AED' },
        { id: 'SFDC-04', name: 'Forecast Accuracy', category: 'Predictability', value: '87.4%', delta: '+3.2%', trend: 'up', spark: [80, 82, 83, 84, 85, 86, 87.4], color: '#D97706' },
    ],
    'Zoho Financial': [
        { id: 'ZOHO-01', name: 'DSO (Days Sales Outstanding)', category: 'Cash Flow', value: '34d', delta: '-4d', trend: 'up', spark: [44, 42, 40, 38, 37, 36, 34], color: '#0284C7' },
        { id: 'ZOHO-02', name: 'Collections Effectiveness', category: 'Revenue Recovery', value: '91.3%', delta: '+2.1%', trend: 'up', spark: [85, 87, 88, 89, 90, 91, 91.3], color: '#059669' },
        { id: 'ZOHO-03', name: 'Close Efficiency (Days)', category: 'Finance Ops', value: '4.2d', delta: '-0.6d', trend: 'up', spark: [6.5, 6, 5.5, 5.2, 5, 4.5, 4.2], color: '#7C3AED' },
        { id: 'ZOHO-04', name: 'Payment Processing Time', category: 'Execution Speed', value: '1.8d', delta: '-0.2d', trend: 'up', spark: [3, 2.7, 2.5, 2.3, 2.1, 2, 1.8], color: '#D97706' },
    ],
    'HRM': [
        { id: 'HRM-01', name: 'Time-to-Fill', category: 'Hiring Productivity', value: '22d', delta: '-4d', trend: 'up', spark: [32, 30, 28, 27, 25, 24, 22], color: '#0284C7' },
        { id: 'HRM-02', name: 'Onboarding Completion Time', category: 'Ops Readiness', value: '8.4d', delta: '-1.6d', trend: 'up', spark: [14, 13, 12, 11, 10, 9, 8.4], color: '#059669' },
        { id: 'HRM-03', name: 'Training Completion Rate', category: 'Capability', value: '88.7%', delta: '+4.1%', trend: 'up', spark: [78, 80, 82, 84, 85, 87, 88.7], color: '#D97706' },
        { id: 'HRM-04', name: 'Attendance Reliability', category: 'Stability', value: '94.1%', delta: '+0.9%', trend: 'up', spark: [90, 91, 92, 93, 93.5, 94, 94.1], color: '#7C3AED' },
    ],
    'Biometric': [
        { id: 'BIOM-01', name: 'Attendance Reliability %', category: 'Workforce Stability', value: '93.8%', delta: '+0.7%', trend: 'up', spark: [89, 90, 91, 92, 92.5, 93, 93.8], color: '#EC4899' },
        { id: 'BIOM-02', name: 'On-Time Arrival Rate', category: 'Discipline', value: '87.4%', delta: '+1.8%', trend: 'up', spark: [82, 83, 84, 85, 86, 87, 87.4], color: '#0284C7' },
        { id: 'BIOM-03', name: 'Shift Adherence %', category: 'Coverage', value: '91.2%', delta: '+0.6%', trend: 'up', spark: [87, 88, 89, 90, 90.5, 91, 91.2], color: '#059669' },
        { id: 'BIOM-04', name: 'Late/No-Show Rate', category: 'Reliability', value: '4.6%', delta: '-0.9%', trend: 'up', spark: [8, 7.5, 7, 6.5, 5.8, 5.2, 4.6], color: '#D97706' },
    ],
    // ── Unstructured / Database (App) sources
    'Google Drive': [
        { id: 'GOOG-01', name: 'Doc Cycle Time', category: 'Knowledge Throughput', value: '3.1d', delta: '-0.5d', trend: 'up', spark: [5, 4.5, 4.2, 3.8, 3.5, 3.2, 3.1], color: '#0284C7' },
        { id: 'GOOG-02', name: 'Collaboration Index', category: 'Collaboration', value: '72.4', delta: '+4.2', trend: 'up', spark: [62, 64, 66, 68, 70, 71, 72.4], color: '#059669' },
        { id: 'GOOG-03', name: 'Duplicate Doc Rate', category: 'Waste Reduction', value: '6.8%', delta: '-1.4%', trend: 'up', spark: [11, 10, 9, 8.5, 8, 7.2, 6.8], color: '#DC2626' },
        { id: 'GOOG-04', name: 'Findability Score', category: 'Knowledge Hygiene', value: '81.3%', delta: '+3.2%', trend: 'up', spark: [72, 74, 76, 78, 79, 80, 81.3], color: '#7C3AED' },
    ],
    'Email': [
        { id: 'EMAI-01', name: 'Median Response Time', category: 'Speed-to-Respond', value: '2.4h', delta: '-0.6h', trend: 'up', spark: [4.5, 4, 3.7, 3.4, 3.1, 2.7, 2.4], color: '#0284C7' },
        { id: 'EMAI-02', name: 'Unresolved Thread Backlog', category: 'Backlog Control', value: '34', delta: '-8', trend: 'up', spark: [54, 50, 46, 43, 41, 38, 34], color: '#DC2626' },
        { id: 'EMAI-03', name: 'Approval Turnaround', category: 'Decision Latency', value: '1.6d', delta: '-0.4d', trend: 'up', spark: [3, 2.7, 2.5, 2.2, 2, 1.8, 1.6], color: '#D97706' },
        { id: 'EMAI-04', name: 'Escalation Signal Rate', category: 'Risk Signals', value: '3.2%', delta: '-0.6%', trend: 'up', spark: [5.8, 5.2, 4.8, 4.2, 3.9, 3.5, 3.2], color: '#7C3AED' },
    ],
    'MS Teams': [
        { id: 'MSTE-01', name: 'Response Latency (Channels)', category: 'Collaboration Speed', value: '18min', delta: '-4min', trend: 'up', spark: [32, 28, 26, 24, 22, 20, 18], color: '#6366F1' },
        { id: 'MSTE-02', name: 'Meeting Load', category: 'Time Allocation', value: '6.2h/wk', delta: '-0.8h', trend: 'up', spark: [9, 8.5, 8, 7.5, 7, 6.5, 6.2], color: '#D97706' },
        { id: 'MSTE-03', name: 'Action Item Capture Rate', category: 'Execution', value: '78.4%', delta: '+4.8%', trend: 'up', spark: [65, 68, 70, 72, 74, 76, 78.4], color: '#059669' },
        { id: 'MSTE-04', name: 'Cross-Team Collaboration Score', category: 'Alignment', value: '0.68', delta: '+0.06', trend: 'up', spark: [0.55, 0.58, 0.60, 0.62, 0.64, 0.66, 0.68], color: '#0284C7' },
    ],
    'Slack': [
        { id: 'SLAC-01', name: 'Response Latency (Channels)', category: 'Collaboration Speed', value: '12min', delta: '-3min', trend: 'up', spark: [22, 20, 18, 17, 15, 14, 12], color: '#E11D48' },
        { id: 'SLAC-02', name: 'Interruption Density', category: 'Focus/Noise', value: '4.2/h', delta: '-0.8/h', trend: 'up', spark: [7, 6.5, 6, 5.5, 5, 4.5, 4.2], color: '#D97706' },
        { id: 'SLAC-03', name: 'Action Item Capture Rate', category: 'Execution', value: '71.8%', delta: '+3.4%', trend: 'up', spark: [60, 63, 65, 67, 69, 70, 71.8], color: '#059669' },
        { id: 'SLAC-04', name: 'Escalation Signal Trend', category: 'Risk Signals', value: '2.8%', delta: '-0.4%', trend: 'up', spark: [5, 4.5, 4, 3.8, 3.4, 3.1, 2.8], color: '#7C3AED' },
    ],
    // ── Camera / Physical Security
    'Camera': [
        { id: 'CAM-01', name: 'Presence Verification %', category: 'Attendance Corroboration', value: '97.2%', delta: '+1.4%', trend: 'up', spark: [92, 93, 94, 95, 96, 96.8, 97.2], color: '#475569' },
        { id: 'CAM-02', name: 'Visitor Count (Today)', category: 'Facility Intelligence', value: '142', delta: '+18', trend: 'up', spark: [98, 105, 112, 118, 124, 136, 142], color: '#0891B2' },
        { id: 'CAM-03', name: 'Zone Occupancy %', category: 'Space Utilization', value: '68.4%', delta: '+5.2%', trend: 'up', spark: [52, 55, 58, 61, 64, 66, 68.4], color: '#059669' },
        { id: 'CAM-04', name: 'Security Alert Rate', category: 'Safety Index', value: '0.8%', delta: '-0.3%', trend: 'up', spark: [2.1, 1.8, 1.5, 1.2, 1.0, 0.9, 0.8], color: '#DC2626' },
    ],
};

// ─── EMPLOYEES (all departments) ────────────────────────────────────────────
export const EMPLOYEES = [
    // Engineering
    { id: 'EMP-1001', name: 'Karan Nair', dept: 'Engineering', role: 'Sr Software Engineer', designation: 'Team Leader', doj: '26-02-2020', experience: '5 Years', type: 'Full Time', avatar: 'KN', color: '#0284C7' },
    { id: 'EMP-1002', name: 'Ananya Krishnan', dept: 'Engineering', role: 'Sr Front-End Developer', designation: 'Senior Developer', doj: '10-05-2021', experience: '4 Years', type: 'Full Time', avatar: 'AK', color: '#7C3AED' },
    { id: 'EMP-1003', name: 'Arjun Mehta', dept: 'Engineering', role: 'Backend Engineer', designation: 'Engineer II', doj: '03-01-2022', experience: '3 Years', type: 'Full Time', avatar: 'AM', color: '#059669' },
    { id: 'EMP-1004', name: 'Sneha Rao', dept: 'Engineering', role: 'QA Engineer', designation: 'QA Lead', doj: '15-08-2020', experience: '4.5 Years', type: 'Full Time', avatar: 'SR', color: '#D97706' },
    { id: 'EMP-1005', name: 'Vikram Das', dept: 'Engineering', role: 'DevOps Engineer', designation: 'Sr DevOps', doj: '20-03-2019', experience: '6 Years', type: 'Full Time', avatar: 'VD', color: '#DC2626' },
    // Sales
    { id: 'EMP-2001', name: 'Rahul Singh', dept: 'Sales', role: 'Director of Sales', designation: 'Director', doj: '11-06-2018', experience: '7 Years', type: 'Full Time', avatar: 'RS', color: '#0891B2' },
    { id: 'EMP-2002', name: 'Priya Sharma', dept: 'Sales', role: 'Sales Manager', designation: 'Manager', doj: '02-09-2020', experience: '4 Years', type: 'Full Time', avatar: 'PS', color: '#6366F1' },
    { id: 'EMP-2003', name: 'Amit Joshi', dept: 'Sales', role: 'Account Executive', designation: 'AE', doj: '17-01-2022', experience: '3 Years', type: 'Full Time', avatar: 'AJ', color: '#D97706' },
    // Operations
    { id: 'EMP-3001', name: 'Divya Pillai', dept: 'Operations', role: 'Business Analyst', designation: 'Senior BA', doj: '08-04-2021', experience: '3.5 Years', type: 'Full Time', avatar: 'DP', color: '#059669' },
    { id: 'EMP-3002', name: 'Tanvi Bose', dept: 'Operations', role: 'Project Manager', designation: 'PM', doj: '22-07-2019', experience: '5.5 Years', type: 'Full Time', avatar: 'TB', color: '#7C3AED' },
    { id: 'EMP-3003', name: 'Rohan Patel', dept: 'Operations', role: 'Operations Analyst', designation: 'Analyst', doj: '05-11-2022', experience: '2 Years', type: 'Full Time', avatar: 'RP', color: '#0284C7' },
    // Finance
    { id: 'EMP-4001', name: 'Deepak Rao', dept: 'Finance', role: 'Sr Accountant', designation: 'Senior Accountant', doj: '14-03-2017', experience: '8 Years', type: 'Full Time', avatar: 'DR', color: '#D97706' },
    { id: 'EMP-4002', name: 'Aisha Khan', dept: 'Finance', role: 'Finance Analyst', designation: 'Analyst II', doj: '30-06-2021', experience: '3 Years', type: 'Full Time', avatar: 'AK2', color: '#DC2626' },
    // HR
    { id: 'EMP-5001', name: 'Meera Joshi', dept: 'HR', role: 'HR Manager', designation: 'Manager', doj: '19-02-2018', experience: '7 Years', type: 'Full Time', avatar: 'MJ', color: '#EC4899' },
    { id: 'EMP-5002', name: 'Suresh Kumar', dept: 'HR', role: 'HR Executive', designation: 'Executive', doj: '01-12-2022', experience: '1.5 Years', type: 'Full Time', avatar: 'SK', color: '#6366F1' },
    { id: 'EMP-5003', name: 'Neha Sharma', dept: 'HR', role: 'L&D Specialist', designation: 'Specialist', doj: '28-07-2020', experience: '4 Years', type: 'Full Time', avatar: 'NS', color: '#059669' },
];

// Role-level KPIs per employee (based on Role Performance KPI Data Mapping)
const ENG_KPIS = [
    { label: 'Delivery Throughput & Predictability', value: '87%', delta: '+3.4%', trend: 'up', desc: 'Commit-to-Done % this sprint', spark: [78, 80, 82, 84, 85, 86, 87] },
    { label: 'Quality & Rework Rate', value: '6.2%', delta: '-1.1%', trend: 'up', desc: 'Reopen + regression rate', spark: [11, 10, 9, 8.5, 8, 7, 6.2] },
    { label: 'PR Lead Time', value: '1.6d', delta: '-0.3d', trend: 'up', desc: 'PR opened → merged (median)', spark: [3.2, 2.8, 2.5, 2.2, 2, 1.8, 1.6] },
];
const SALES_KPIS = [
    { label: 'Pipeline Health & Forecast Accuracy', value: '87.4%', delta: '+3.2%', trend: 'up', desc: 'Forecast vs actual outcomes', spark: [80, 82, 83, 84, 85, 86, 87.4] },
    { label: 'Win Rate & Sales Cycle', value: '31.2%', delta: '+2.8%', trend: 'up', desc: 'Won ÷ (Won + Lost)', spark: [24, 26, 27, 28, 29, 30, 31.2] },
    { label: 'Expansion & Renewal %', value: '94.6%', delta: '+1.4%', trend: 'up', desc: 'Renewed ÷ Up for renewal', spark: [88, 89, 90, 91, 92, 93, 94.6] },
];
const OPS_KPIS = [
    { label: 'Requirement Quality (CR Rate)', value: '8.4%', delta: '-2.1%', trend: 'up', desc: 'Post sign-off CRs ÷ Total requirements', spark: [14, 13, 12, 11, 10, 9.5, 8.4] },
    { label: 'Blocker Resolution SLA', value: '78.3%', delta: '+4.8%', trend: 'up', desc: 'Blockers resolved within SLA', spark: [65, 68, 70, 72, 74, 76, 78.3] },
    { label: 'Acceptance First-Pass %', value: '84.7%', delta: '+3.2%', trend: 'up', desc: 'Accepted without rework ÷ Total delivered', spark: [74, 76, 78, 80, 82, 83, 84.7] },
];
const FIN_KPIS = [
    { label: 'Close Efficiency', value: '4.2d', delta: '-0.6d', trend: 'up', desc: 'Days to close period-end', spark: [6.5, 6, 5.5, 5, 4.8, 4.5, 4.2] },
    { label: 'Reconciliation Accuracy', value: '96.8%', delta: '+1.4%', trend: 'up', desc: 'Exception rate vs total reconciled', spark: [92, 93, 94, 95, 95.5, 96, 96.8] },
    { label: 'Collections Effectiveness', value: '91.3%', delta: '+2.1%', trend: 'up', desc: 'Collected ÷ Due (DSO proxy)', spark: [85, 87, 88, 89, 90, 91, 91.3] },
];
const HR_KPIS = [
    { label: 'Time-to-Fill', value: '22d', delta: '-4d', trend: 'up', desc: 'Req open → offer accepted', spark: [32, 30, 28, 27, 25, 24, 22] },
    { label: 'Training Completion Rate', value: '88.7%', delta: '+4.1%', trend: 'up', desc: '% assigned trainings completed on time', spark: [78, 80, 82, 84, 85, 87, 88.7] },
    { label: 'Attendance Reliability', value: '94.1%', delta: '+0.9%', trend: 'up', desc: 'Planned vs actual presence', spark: [90, 91, 92, 93, 93.5, 94, 94.1] },
];

const DEPT_KPIS = { Engineering: ENG_KPIS, Sales: SALES_KPIS, Operations: OPS_KPIS, Finance: FIN_KPIS, HR: HR_KPIS };

// Activities per employee
function genActivities(name, dept) {
    const sources = dept === 'Engineering' ? ['Task', 'JIRA', 'GitHub', 'Biometric']
        : dept === 'Sales' ? ['Task', 'Salesforce', 'Teams', 'Biometric']
            : dept === 'Finance' ? ['Task', 'ERP', 'Email', 'Biometric']
                : dept === 'HR' ? ['Task', 'HRM', 'Teams', 'Biometric']
                    : ['Task', 'JIRA', 'Teams', 'Biometric'];
    return [
        { icon: 'B', label: `${name} clock in at 9:02 AM`, time: '9:02 AM', when: 'Today', source: 'Biometric' },
        { icon: 'T', label: `Completed daily standup`, time: '9:30 AM', when: 'Today', source: sources[1] },
        { icon: 'G', label: `Submitted ${dept === 'Engineering' ? 'PR #' + Math.floor(Math.random() * 500 + 100) : 'report update'}`, time: '11:15 AM', when: 'Today', source: sources[2] },
        { icon: 'T', label: `${name} updated task status`, time: '1 day ago', when: '1 day ago', source: sources[0] },
        { icon: 'G', label: `${dept === 'Engineering' ? 'Created feature branch' : 'Reviewed pipeline data'}`, time: '5 days ago', when: '5 days ago', source: sources[2] },
    ];
}

export function getEmployeeDetail(emp) {
    return {
        ...emp,
        productivity: { weekly: Math.floor(82 + Math.random() * 12), attendance: Math.floor(91 + Math.random() * 7) },
        kpis: DEPT_KPIS[emp.dept] || ENG_KPIS,
        activities: genActivities(emp.name, emp.dept),
        activityTabs: ['All', 'Task', emp.dept === 'Engineering' ? 'JIRA' : emp.dept === 'Sales' ? 'Salesforce' : 'ERP', 'GitHub', 'Biometric'],
    };
}

// ─── LIVE TABLE DATA (all sources) ───────────────────────────────────────────
const EMP_NAMES = ['Karan Nair', 'Ananya Krishnan', 'Rahul Singh', 'Sneha Rao', 'Arjun Mehta',
    'Divya Pillai', 'Tanvi Bose', 'Deepak Rao', 'Meera Joshi', 'Priya Sharma',
    'Vikram Das', 'Amit Joshi', 'Rohan Patel', 'Aisha Khan', 'Suresh Kumar', 'Neha Sharma'];

function nextId(prefix, n) { return `${prefix}-${1000 + n}`; }
const STATUSES = ['Open', 'In Progress', 'Done', 'Blocked', 'Review'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const SOURCE_LIST = ['Jira', 'GitHub', 'MS Teams', 'Slack', 'Email', 'HRM', 'ERP', 'Biometric', 'Google Drive', 'Salesforce'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeLiveRows() {
    const rows = [];
    let n = 0;
    // Jira tickets
    const jiraSummaries = [
        'Performance regression in search API', 'Fix OAuth token refresh loop',
        'Cache invalidation bug on logout', 'Improve error messages in form validation',
        'Add dark mode toggle to settings', 'CI pipeline failing on main branch',
        'Memory leak in worker pool', 'API rate limit exceeded alert',
        'Mobile layout broken on Safari', 'Database connection pool exhausted',
    ];
    jiraSummaries.forEach((summary, i) => {
        rows.push({ id: nextId('PRJ', n++), summary, assignee: pick(EMP_NAMES), status: pick(STATUSES), priority: pick(PRIORITIES), source: 'Jira', updated: `${2 + i * 4}min ago`, dept: 'Engineering' });
    });
    // GitHub PRs
    const ghSummaries = [
        'feat/rate-limiter merged to main', 'fix/oauth-loop: PR approved', 'feat/dark-mode: Review requested',
        'hotfix/payment-gateway: Critical merge', 'chore/deps: Dependency updates',
        'refactor/auth-service: PR Review', 'feat/analytics-v2: CI Passed', 'build: Update webpack config',
    ];
    ghSummaries.forEach((summary, i) => {
        rows.push({ id: `PR-${380 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Merged', 'In Progress', 'Review', 'Open']), priority: pick(PRIORITIES), source: 'GitHub', updated: `${1 + i * 3}h ago`, dept: 'Engineering' });
    });
    // MS Teams
    const teamsSummaries = [
        'Sprint planning meeting scheduled', 'Incident #1047 resolved update', 'Hotfix deploy in 5 mins',
        'Cross-team sync on Q1 roadmap', 'Client escalation follow-up', 'Budget review meeting notes',
    ];
    teamsSummaries.forEach((summary, i) => {
        rows.push({ id: `MSG-${200 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Open', 'Done', 'Review']), priority: pick(['High', 'Medium', 'Low']), source: 'MS Teams', updated: `${30 + i * 20}min ago`, dept: pick(['Engineering', 'Sales', 'Operations']) });
    });
    // HRM records
    const hrmSummaries = [
        'New hire onboarding - Karan batch', 'Performance review cycle Q1', 'Training completion reminder',
        'Leave request pending approval', 'Attendance policy update', 'Recruitment pipeline update',
    ];
    hrmSummaries.forEach((summary, i) => {
        rows.push({ id: `HRM-${100 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Open', 'In Progress', 'Done']), priority: pick(['Medium', 'Low', 'High']), source: 'HRM', updated: `${1 + i}d ago`, dept: 'HR' });
    });
    // ERP entries
    const erpSummaries = [
        'Invoice #INV-2024-0112 pending', 'PO approval required for Q1 budget', 'Expense report submitted',
        'Vendor payment scheduled', 'Budget utilization review', 'Quarter-end close initiated',
    ];
    erpSummaries.forEach((summary, i) => {
        rows.push({ id: `ERP-${300 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Open', 'Done', 'Blocked']), priority: pick(['High', 'Medium', 'Critical']), source: 'ERP', updated: `${2 + i}d ago`, dept: 'Finance' });
    });
    // Biometric
    const bioSummaries = [
        'Late arrival flagged - Engineering', 'No-show alert - Floor 2', 'Overtime threshold exceeded',
        'Shift adherence below target', 'Anomaly pattern detected - repeated short stays',
    ];
    bioSummaries.forEach((summary, i) => {
        rows.push({ id: `BIO-${50 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Open', 'In Progress', 'Done']), priority: pick(['High', 'Medium', 'Low']), source: 'Biometric', updated: `${1 + i}h ago`, dept: pick(['Engineering', 'HR', 'Operations']) });
    });
    // Salesforce
    const sfSummaries = [
        'Enterprise deal - Stage 4 close', 'Renewal at risk - TechCorp', 'Upsell opportunity flagged',
        'Forecast vs actuals gap detected', 'New lead qualified - FinanceCo',
    ];
    sfSummaries.forEach((summary, i) => {
        rows.push({ id: `OPP-${800 + i}`, summary, assignee: pick(EMP_NAMES), status: pick(['Open', 'In Progress', 'Done']), priority: pick(['High', 'Critical', 'Medium']), source: 'Salesforce', updated: `${1 + i}h ago`, dept: 'Sales' });
    });
    // Camera events
    const camSummaries = [
        '📷 CAM-04 — Main entrance activity spike detected',
        '📷 CAM-07 — Zone B occupancy at 89% (threshold: 85%)',
        '📷 CAM-12 — After-hours motion detected — Floor 3',
    ];
    camSummaries.forEach((summary, i) => {
        rows.push({ id: `CAM-${10 + i}`, summary, assignee: 'Security AI', status: pick(['Open', 'In Progress', 'Done']), priority: pick(['High', 'Critical', 'Medium']), source: 'Camera', updated: `${5 + i * 8}min ago`, dept: 'Operations', hasVideo: true });
    });
    return rows;
}

export const LIVE_ROWS = makeLiveRows();

// Source → category mapping for filter sync
export const SOURCE_CATEGORY = {
    Jira: 'reality', GitHub: 'reality', ERP: 'reality', Salesforce: 'reality',
    'Zoho Financial': 'reality', HRM: 'reality', Biometric: 'reality', Camera: 'reality',
    'Google Drive': 'database', Email: 'database', 'MS Teams': 'database', Slack: 'database',
};

// Feed data (keeps FeedPanel working)
export const feedData = {
    JIRA: {
        rows: [
            { id: 'PRJ-1054', summary: 'Performance regression in search API', assignee: 'Rahul Singh', status: 'In Progress', priority: 'Critical', updated: 'Just now' },
            { id: 'PRJ-1053', summary: 'Fix OAuth token refresh loop', assignee: 'Ananya Krishnan', status: 'Open', priority: 'High', updated: '18s ago' },
            { id: 'PRJ-1057', summary: 'Improve error messages in form validation', assignee: 'Sneha Rao', status: 'Open', priority: 'Medium', updated: '28s ago' },
            { id: 'PRJ-1056', summary: 'Cache invalidation bug on logout', assignee: 'Karan Nair', status: 'In Progress', priority: 'High', updated: '38s ago' },
        ]
    },
    Teams: {
        rows: [
            { channel: '#incident-mgmt', sender: 'Arjun Mehta', preview: 'Incident #1047 resolved', time: '2m ago', type: '✅ Update' },
            { channel: '#ops', sender: 'Vikram Das', preview: 'Prod deploy starting in 2 mins', time: '3m ago', type: '📢 Alert' },
        ]
    },
    GitHub: {
        rows: [
            { event: 'PR Merged', author: 'Ananya Krishnan', repo: 'workforce-api', branch: 'feat/rate-limiter', status: 'Merged', time: '2m ago' },
            { event: 'Build Failed', author: 'CI/CD Bot', repo: 'workforce-ui', branch: 'main', status: 'Failed', time: '5m ago' },
        ]
    },
    'CC Cams': {
        rows: [
            { cam: 'CAM-09', location: 'Floor 4', event: '✅ Entry', person: 'Suresh Kumar', confidence: '96.2%', time: '1m ago' },
            { cam: 'CAM-02', location: 'Lobby', event: '⚠️ Unknown Person', person: '—', confidence: '61.4%', time: '3m ago' },
        ]
    },
    Biometric: {
        rows: [
            { employee: 'Karan Nair', dept: 'Engineering', event: '✅ Clock Out', device: 'BIO-04', location: 'Floor 2', time: '3m ago' },
            { employee: 'Meera Joshi', dept: 'HR', event: '✅ Clock In', device: 'BIO-03', location: 'Floor 1', time: '5m ago' },
        ]
    },
};
