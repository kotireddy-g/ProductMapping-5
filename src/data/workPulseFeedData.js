// ─── Global KPI Data ────────────────────────────────────────────────────────
export const globalKPIs = [
    {
        id: 1,
        label: 'Productivity Score',
        value: '87.4%',
        trend: 'up',
        change: '+3.2%',
        changeLabel: 'vs last week',
        color: '#06B6D4',
        //            Mon   Tue   Wed   Thu   Fri   Mon   Tue   Wed  (trending up with dips)
        sparkData: [78.1, 81.4, 79.2, 83.7, 80.5, 84.9, 82.3, 87.4],
    },
    {
        id: 2,
        label: 'Idle Time',
        value: '12.6%',
        trend: 'down',
        change: '-1.8%',
        changeLabel: 'vs last week',
        color: '#10B981',
        //            (trending down with peaks — improving metric)
        sparkData: [16.8, 14.2, 15.9, 13.4, 15.1, 12.8, 14.3, 12.6],
    },
    {
        id: 3,
        label: 'Attendance Rate',
        value: '94.1%',
        trend: 'up',
        change: '+0.9%',
        changeLabel: 'vs last week',
        color: '#06B6D4',
        //            (gradual improvement with Mon dip — realistic attendance pattern)
        sparkData: [91.2, 93.8, 91.7, 94.5, 92.1, 95.2, 91.9, 94.1],
    },
    {
        id: 4,
        label: 'No-Shows Today',
        value: '7',
        trend: 'down',
        change: '-3 from avg',
        changeLabel: '',
        color: '#10B981',
        //            (volatile daily metric, trending down)
        sparkData: [14, 9, 12, 8, 11, 6, 9, 7],
    },
    {
        id: 5,
        label: 'JIRA Velocity',
        value: '42 pts/wk',
        trend: 'up',
        change: '+6 pts',
        changeLabel: 'vs last week',
        color: '#06B6D4',
        //            (weekly sprint points — rises mid-sprint, dips at start of new sprint)
        sparkData: [28, 35, 31, 38, 29, 41, 34, 42],
    },
    {
        id: 6,
        label: 'Biometric Check-ins',
        value: '218',
        trend: 'up',
        change: '+12 today',
        changeLabel: '',
        color: '#06B6D4',
        //            (daily check-ins — dips Fri/Mon, peaks mid-week)
        sparkData: [192, 208, 196, 215, 201, 219, 205, 218],
    },
];

// ─── Source KPI Data ─────────────────────────────────────────────────────────
export const sourceKPIs = {
    JIRA: [
        {
            id: 1, label: 'Open Tickets', value: '134', trend: 'up', change: '+12', color: '#EF4444',
            sparkData: [108, 119, 112, 126, 117, 131, 121, 134],
        },
        {
            id: 2, label: 'Closed This Week', value: '89', trend: 'up', change: '+7', color: '#10B981',
            sparkData: [63, 74, 68, 80, 71, 85, 76, 89],
        },
        {
            id: 3, label: 'In Progress', value: '47', trend: 'neutral', change: '→ same', color: '#F59E0B',
            sparkData: [44, 50, 43, 51, 45, 49, 44, 47],
        },
        {
            id: 4, label: 'Avg Resolution', value: '2.3 days', trend: 'down', change: '↓ improved', color: '#10B981',
            sparkData: [3.4, 2.8, 3.2, 2.6, 3.0, 2.4, 2.8, 2.3],
        },
    ],
    Teams: [
        {
            id: 1, label: 'Active Channels', value: '38', trend: 'up', change: '+3', color: '#3B82F6',
            sparkData: [29, 34, 31, 36, 32, 37, 33, 38],
        },
        {
            id: 2, label: 'Messages Today', value: '1,247', trend: 'up', change: '+18%', color: '#06B6D4',
            sparkData: [810, 980, 870, 1060, 920, 1150, 1040, 1247],
        },
        {
            id: 3, label: 'Meetings Today', value: '24', trend: 'down', change: '-2', color: '#10B981',
            sparkData: [29, 25, 28, 23, 27, 22, 26, 24],
        },
        {
            id: 4, label: 'Avg Response Time', value: '4.2 min', trend: 'down', change: '↓ faster', color: '#10B981',
            sparkData: [7.4, 5.9, 6.8, 5.3, 6.2, 4.9, 5.6, 4.2],
        },
    ],
    GitHub: [
        {
            id: 1, label: 'PRs Merged', value: '31', trend: 'up', change: '+5', color: '#10B981',
            sparkData: [19, 26, 21, 28, 23, 30, 25, 31],
        },
        {
            id: 2, label: 'Open PRs', value: '18', trend: 'down', change: '-3', color: '#10B981',
            sparkData: [26, 22, 25, 20, 24, 19, 22, 18],
        },
        {
            id: 3, label: 'Commits Today', value: '74', trend: 'up', change: '+9', color: '#8B5CF6',
            sparkData: [51, 63, 55, 68, 58, 71, 62, 74],
        },
        {
            id: 4, label: 'Code Review Cycle', value: '6.1 hrs', trend: 'down', change: '-0.8 hr', color: '#10B981',
            sparkData: [8.2, 7.1, 7.8, 6.7, 7.5, 6.3, 7.0, 6.1],
        },
    ],
    'CC Cams': [
        {
            id: 1, label: 'Employees On-Site', value: '203', trend: 'up', change: '+11', color: '#06B6D4',
            sparkData: [178, 194, 183, 198, 186, 202, 191, 203],
        },
        {
            id: 2, label: 'Restricted Alerts', value: '2', trend: 'up', change: '⚠ flag', color: '#EF4444',
            sparkData: [0, 2, 0, 3, 1, 2, 0, 2],
        },
        {
            id: 3, label: 'Avg Floor Occupancy', value: '78%', trend: 'up', change: '+4%', color: '#F59E0B',
            sparkData: [66, 73, 69, 76, 71, 77, 73, 78],
        },
        {
            id: 4, label: 'Tailgating Events', value: '0', trend: 'neutral', change: '✓ clear', color: '#10B981',
            sparkData: [2, 0, 1, 0, 2, 1, 0, 0],
        },
    ],
    Biometric: [
        {
            id: 1, label: 'Check-ins Today', value: '218', trend: 'up', change: '+12', color: '#10B981',
            sparkData: [191, 207, 196, 214, 202, 219, 207, 218],
        },
        {
            id: 2, label: 'Check-outs', value: '47', trend: 'neutral', change: '→ normal', color: '#06B6D4',
            sparkData: [41, 47, 43, 49, 44, 48, 45, 47],
        },
        {
            id: 3, label: 'Failed Scans', value: '3', trend: 'down', change: '-1', color: '#10B981',
            sparkData: [7, 4, 6, 3, 5, 4, 4, 3],
        },
        {
            id: 4, label: 'Avg Clock-in Time', value: '8:54 AM', trend: 'neutral', change: '→ on time', color: '#06B6D4',
            sparkData: [849, 857, 851, 858, 853, 856, 852, 854],
        },
    ],
};

// ─── Feed Table Data ─────────────────────────────────────────────────────────
export const feedData = {
    JIRA: {
        columns: ['Ticket ID', 'Summary', 'Assignee', 'Status', 'Priority', 'Updated'],
        rows: [
            { id: 'PRJ-1042', summary: 'Fix login timeout on SSO flow', assignee: 'Arjun Mehta', status: 'In Progress', priority: 'High', updated: '2 min ago' },
            { id: 'PRJ-1039', summary: 'Dashboard filter not persisting', assignee: 'Sneha Rao', status: 'Open', priority: 'Medium', updated: '8 min ago' },
            { id: 'PRJ-1037', summary: 'Add export to CSV feature', assignee: 'Karan Nair', status: 'In Review', priority: 'High', updated: '15 min ago' },
            { id: 'PRJ-1035', summary: 'Refactor auth middleware', assignee: 'Divya Pillai', status: 'Closed', priority: 'Low', updated: '32 min ago' },
            { id: 'PRJ-1033', summary: 'Mobile layout breaks on Safari', assignee: 'Rahul Singh', status: 'Open', priority: 'Medium', updated: '47 min ago' },
            { id: 'PRJ-1030', summary: 'Write unit tests for billing module', assignee: 'Priya Sharma', status: 'In Progress', priority: 'Medium', updated: '1 hr ago' },
            { id: 'PRJ-1028', summary: 'Optimize DB queries on reports page', assignee: 'Amit Verma', status: 'Closed', priority: 'High', updated: '1.5 hr ago' },
            { id: 'PRJ-1025', summary: 'Setup CI/CD pipeline for staging', assignee: 'Neha Joshi', status: 'Closed', priority: 'Low', updated: '2 hr ago' },
            { id: 'PRJ-1021', summary: 'User onboarding flow UX revamp', assignee: 'Vikram Das', status: 'Open', priority: 'High', updated: '3 hr ago' },
            { id: 'PRJ-1019', summary: 'Add MFA support', assignee: 'Tanvi Bose', status: 'In Review', priority: 'High', updated: '4 hr ago' },
            { id: 'PRJ-1016', summary: 'API rate limiting not enforced', assignee: 'Suresh Kumar', status: 'Open', priority: 'Critical', updated: '5 hr ago' },
            { id: 'PRJ-1012', summary: 'Fix invoice number duplication', assignee: 'Meera Iyer', status: 'Closed', priority: 'Medium', updated: '6 hr ago' },
        ],
        summary: 'Total: 134 Open · 89 Closed · 47 In Progress · Avg Priority: High',
    },
    Teams: {
        columns: ['Channel', 'Sender', 'Message Preview', 'Time', 'Type'],
        rows: [
            { channel: '#engineering', sender: 'Arjun Mehta', preview: 'PR #342 is ready for review, please check...', time: '3 min ago', type: '💬 Message' },
            { channel: '#standups', sender: 'Sneha Rao', preview: 'Done: Dashboard fix. Doing: API integration', time: '8 min ago', type: '📋 Standup' },
            { channel: '#alerts', sender: 'Bot', preview: 'Build failed on staging — branch: feature/auth', time: '12 min ago', type: '🤖 Alert' },
            { channel: '#general', sender: 'Priya Sharma', preview: 'Team lunch today at 1 PM, conference room B', time: '20 min ago', type: '💬 Message' },
            { channel: '#design', sender: 'Tanvi Bose', preview: 'New mockups uploaded to Figma, link in...', time: '35 min ago', type: '📎 Share' },
            { channel: '#engineering', sender: 'Vikram Das', preview: 'Merged hotfix for session token expiry', time: '44 min ago', type: '✅ Update' },
            { channel: '#hr-updates', sender: 'HR Bot', preview: 'Reminder: Performance reviews due by Friday', time: '1 hr ago', type: '📢 Broadcast' },
        ],
        summary: 'Total: 38 Active Channels · 1,247 Messages Today · 24 Meetings · Avg Response: 4.2 min',
    },
    GitHub: {
        columns: ['Event', 'Author', 'Repository', 'Branch / PR', 'Status', 'Time'],
        rows: [
            { event: 'PR Merged', author: 'Rahul Singh', repo: 'workforce-ui', branch: 'feat/dashboard-v2', status: 'Merged', time: '5 min ago' },
            { event: 'PR Opened', author: 'Karan Nair', repo: 'workforce-api', branch: 'fix/token-refresh', status: 'Review', time: '11 min ago' },
            { event: 'Commit Pushed', author: 'Divya Pillai', repo: 'workforce-ui', branch: 'main', status: 'Success', time: '18 min ago' },
            { event: 'Build Failed', author: 'CI/CD Bot', repo: 'workforce-api', branch: 'feature/mfa', status: 'Failed', time: '22 min ago' },
            { event: 'PR Approved', author: 'Amit Verma', repo: 'workforce-db', branch: 'refactor/queries', status: 'Approved', time: '38 min ago' },
            { event: 'Issue Opened', author: 'Sneha Rao', repo: 'workforce-ui', branch: '—', status: 'Bug', time: '52 min ago' },
            { event: 'Release Tagged', author: 'Arjun Mehta', repo: 'workforce-api', branch: 'v2.4.1', status: 'Released', time: '1 hr ago' },
            { event: 'Code Review', author: 'Priya Sharma', repo: 'workforce-ui', branch: 'PR #189', status: 'Commented', time: '1.5 hr ago' },
        ],
        summary: 'This Week: 31 PRs Merged · 18 Open PRs · 74 Commits Today · Avg Review Cycle: 6.1 hrs',
    },
    'CC Cams': {
        columns: ['Camera ID', 'Location', 'Event Type', 'Person Detected', 'Confidence', 'Time'],
        rows: [
            { cam: 'CAM-07', location: 'Main Entrance', event: '✅ Entry', person: 'Arjun Mehta', confidence: '98.3%', time: '2 min ago' },
            { cam: 'CAM-12', location: 'Server Room Door', event: '⚠️ Restricted Access', person: 'Unknown', confidence: '91.7%', time: '9 min ago' },
            { cam: 'CAM-03', location: 'Floor 2 - East', event: '✅ Entry', person: 'Sneha Rao', confidence: '97.1%', time: '14 min ago' },
            { cam: 'CAM-01', location: 'Reception', event: '✅ Entry', person: 'Vikram Das', confidence: '99.0%', time: '21 min ago' },
            { cam: 'CAM-09', location: 'Parking Level B', event: '✅ Exit', person: 'Meera Iyer', confidence: '96.5%', time: '29 min ago' },
            { cam: 'CAM-15', location: 'Cafeteria', event: '👥 Occupancy High', person: '—', confidence: '—', time: '34 min ago' },
            { cam: 'CAM-07', location: 'Main Entrance', event: '✅ Entry', person: 'Tanvi Bose', confidence: '98.8%', time: '41 min ago' },
            { cam: 'CAM-12', location: 'Server Room Door', event: '✅ Authorized', person: 'Suresh Kumar', confidence: '99.2%', time: '55 min ago' },
        ],
        summary: '203 On-Site · 2 Restricted Alerts · 78% Floor Occupancy · 0 Tailgating Events',
    },
    Biometric: {
        columns: ['Employee', 'Department', 'Event', 'Device ID', 'Location', 'Time'],
        rows: [
            { employee: 'Arjun Mehta', dept: 'Engineering', event: '✅ Clock In', device: 'BIO-04', location: 'Floor 2', time: '8:47 AM' },
            { employee: 'Sneha Rao', dept: 'Product', event: '✅ Clock In', device: 'BIO-01', location: 'Reception', time: '8:52 AM' },
            { employee: 'Rahul Singh', dept: 'Engineering', event: '✅ Clock In', device: 'BIO-04', location: 'Floor 2', time: '9:01 AM' },
            { employee: 'Priya Sharma', dept: 'HR', event: '✅ Clock In', device: 'BIO-02', location: 'Floor 1', time: '9:06 AM' },
            { employee: 'Karan Nair', dept: 'Engineering', event: '❌ Failed Scan', device: 'BIO-04', location: 'Floor 2', time: '9:11 AM' },
            { employee: 'Karan Nair', dept: 'Engineering', event: '✅ Clock In', device: 'BIO-04', location: 'Floor 2', time: '9:12 AM' },
            { employee: 'Divya Pillai', dept: 'Design', event: '✅ Clock In', device: 'BIO-03', location: 'Floor 1', time: '9:18 AM' },
            { employee: 'Meera Iyer', dept: 'Finance', event: '✅ Clock Out', device: 'BIO-01', location: 'Reception', time: '12:34 PM' },
            { employee: 'Vikram Das', dept: 'Engineering', event: '✅ Clock In', device: 'BIO-05', location: 'Floor 3', time: '9:33 AM' },
            { employee: 'Tanvi Bose', dept: 'Design', event: '✅ Clock In', device: 'BIO-03', location: 'Floor 1', time: '9:41 AM' },
        ],
        summary: '218 Check-ins · 47 Check-outs · 3 Failed Scans · Avg Clock-in: 8:54 AM',
    },
};

// ─── Notification Pool ────────────────────────────────────────────────────────
export const notifications = [
    { type: 'jira', icon: 'Ticket', title: 'New Ticket Assigned', body: 'PRJ-1047 assigned to Arjun Mehta — High priority' },
    { type: 'github', icon: 'GitMerge', title: 'PR Merged', body: 'Rahul Singh merged feat/dashboard-v2 into main' },
    { type: 'teams', icon: 'MessageSquare', title: 'Standup Posted', body: 'Sneha Rao posted daily standup in #standups' },
    { type: 'biometric', icon: 'Fingerprint', title: 'New Employee Check-in', body: 'Ananya Krishnan checked in for the first time today' },
    { type: 'github', icon: 'GitPullRequest', title: 'PR Approved', body: 'Amit Verma approved PR #342 — ready to merge' },
    { type: 'jira', icon: 'AlertCircle', title: 'Critical Bug Reported', body: 'PRJ-1048 opened: API rate limit bypass — Critical' },
    { type: 'cams', icon: 'Camera', title: 'Restricted Zone Alert', body: 'Unrecognized person detected near Server Room CAM-12' },
    { type: 'teams', icon: 'Video', title: 'Meeting Started', body: 'Sprint Planning started in #engineering — 8 attendees' },
    { type: 'github', icon: 'GitCommit', title: 'Build Fixed', body: 'Divya Pillai fixed failing build on feature/mfa branch' },
    { type: 'biometric', icon: 'UserCheck', title: 'New Joiner On-site', body: 'Rohan Patel (Day 1) checked in via biometric at 9:05 AM' },
    { type: 'jira', icon: 'CheckCircle', title: 'Sprint Goal Met', body: 'Team completed 89 story points — sprint goal achieved ✅' },
    { type: 'github', icon: 'Tag', title: 'New Release', body: 'workforce-api v2.4.1 tagged and deployed to staging' },
];

export const typeColors = {
    jira: '#06B6D4',
    github: '#8B5CF6',
    teams: '#3B82F6',
    biometric: '#10B981',
    cams: '#F59E0B',
};
