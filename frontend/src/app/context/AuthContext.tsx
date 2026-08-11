import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'resident' | 'verification_officer' | 'field_officer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area: string;
  avatar: string;
  verified: boolean;
}

export interface IssueBill {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export interface IssueContribution {
  id: string;
  donorName: string;
  amount: number;
  date: string;
}

export interface AppNotification {
  id: string;
  userId: string; // Target recipient user ID (or 'all')
  title: string;
  message: string;
  type: 'verification' | 'issue_confirmed' | 'work_update' | 'system';
  createdAt: string;
  read: boolean;
}

export interface LocalIssue {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  area: string;
  society: string;
  street: string;
  status: 'reported' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
  reportedAt: string;
  progress: number;
  supportCount: number;
  urgency: string;
  assignedOfficer?: string;
  confirmedByOfficer?: boolean;

  // Multiple Site Photo progression
  beforePhotoUrl?: string;
  inProgressPhotoUrl?: string;
  inProgressPhotos?: string[];
  afterPhotoUrl?: string;
  afterPhotos?: string[];

  // Field updates history
  updateNotes?: string[];

  // Financial / Funding fields
  targetBudget: number;
  raisedAmount: number;
  bills: IssueBill[];
  contributions: IssueContribution[];
}

export interface VerificationApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  phone: string;
  cnicNumber: string;
  area: string;
  society: string;
  street: string;
  utilityBillNumber: string;
  utilityBillPhotoUrl?: string;
  cnicFrontPhotoUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export function getCalculatedUrgency(supportCount: number): string {
  if (supportCount >= 15) return 'high';
  if (supportCount >= 5) return 'medium';
  return 'low';
}

const AREA_MAPPINGS: Record<string, string> = {
  sadar: 'Saddar',
  saddar: 'Saddar',
  gulshan: 'Gulshan-e-Iqbal',
  pechs: 'PECHS',
  dha: 'Defence (DHA)',
  defense: 'Defence (DHA)',
  orangi: 'Orangi Town',
  lyari: 'Lyari',
  clifton: 'Clifton',
  northkarachi: 'North Karachi',
  malir: 'Malir',
  korangi: 'Korangi',
  nazimabad: 'Nazimabad',
};

export const MOCK_ACCOUNTS: Record<string, AuthUser & { password: string }> = {
  'user@masail.pk': {
    id: 'u0',
    name: 'Normal Resident (Unverified)',
    email: 'user@masail.pk',
    password: 'user123',
    role: 'resident',
    area: 'Gulshan-e-Iqbal, Karachi',
    avatar: 'NR',
    verified: false,
  },
  'resident@masail.pk': {
    id: 'u1',
    name: 'Ali Hassan (Verified Resident)',
    email: 'resident@masail.pk',
    password: 'resident123',
    role: 'resident',
    area: 'DHA Phase 6, Karachi',
    avatar: 'AH',
    verified: true,
  },
  'officer@masail.pk': {
    id: 'u2',
    name: 'Inspector Amna Shah',
    email: 'officer@masail.pk',
    password: 'officer123',
    role: 'verification_officer',
    area: 'District East, Karachi',
    avatar: 'AS',
    verified: true,
  },
  'field@masail.pk': {
    id: 'fo_general',
    name: 'Chief Field Officer Tariq Mahmood',
    email: 'field@masail.pk',
    password: 'field123',
    role: 'field_officer',
    area: 'All Areas',
    avatar: 'TM',
    verified: true,
  },
  'admin@masail.pk': {
    id: 'u4',
    name: 'UMAIR KHAN (Super Admin)',
    email: 'admin@masail.pk',
    password: 'admin123',
    role: 'admin',
    area: 'Karachi Metropolitan',
    avatar: 'UK',
    verified: true,
  },
};

const INITIAL_ISSUES: LocalIssue[] = [
  {
    id: 'ISS-101',
    userId: 'u1',
    title: 'Dangerous Potholes on Main University Road near NIPA Chowrangi',
    description: 'Deep road crater causing severe traffic jams and motorcycle accidents during peak commuting hours.',
    category: 'Road & Pothole',
    area: 'Gulshan-e-Iqbal',
    society: 'Block 5, NIPA Sector',
    street: 'Main University Road',
    status: 'in_progress',
    reportedAt: '2026-08-01',
    progress: 60,
    supportCount: 48,
    urgency: 'high',
    assignedOfficer: 'Chief Field Officer Tariq Mahmood',
    confirmedByOfficer: true,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=1080&auto=format&fit=crop',
    inProgressPhotoUrl: 'https://images.unsplash.com/photo-1624812449802-99c34cb56654?w=1080&auto=format&fit=crop',
    inProgressPhotos: [
      'https://images.unsplash.com/photo-1624812449802-99c34cb56654?w=1080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1080&auto=format&fit=crop'
    ],
    updateNotes: [
      'Field inspection complete. Excavation crew assigned.',
      'Base asphalt layer compacted. Final hot-mix topping scheduled.'
    ],
    targetBudget: 120000,
    raisedAmount: 95000,
    bills: [
      { id: 'b1', category: 'Cement, Asphalt & Raw Materials', description: 'Crushed stone, cement bags & tar patching mix', amount: 60000 },
      { id: 'b2', category: 'Labor Crew & Heavy Machinery', description: 'Roller compactor & excavation team (2 shifts)', amount: 36000 },
      { id: 'b3', category: 'Safety Cones & KMC Clearances', description: 'Traffic barriers & municipal clearance fee', amount: 24000 },
    ],
    contributions: [
      { id: 'c1', donorName: 'Ali Hassan', amount: 5000, date: '2026-08-02' },
      { id: 'c2', donorName: 'Gulshan Resident Association', amount: 45000, date: '2026-08-03' },
    ],
  },
  {
    id: 'ISS-102',
    userId: 'u1',
    title: 'Monsoon Waterlogging & Choked Drainage Culvert',
    description: 'Stagnant rainwater accumulation of 2 feet near Commercial Avenue disrupting local shops & residents.',
    category: 'Waterlogging',
    area: 'Defence (DHA)',
    society: 'DHA Phase 6',
    street: '26th Commercial Street',
    status: 'in_progress',
    progress: 85,
    supportCount: 62,
    urgency: 'high',
    reportedAt: '2026-08-03',
    assignedOfficer: 'Chief Field Officer Tariq Mahmood',
    confirmedByOfficer: true,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1080&auto=format&fit=crop',
    inProgressPhotoUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1080&auto=format&fit=crop',
    inProgressPhotos: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1080&auto=format&fit=crop'],
    updateNotes: ['Dredging pump installed. Water level lowered by 80%.'],
    targetBudget: 150000,
    raisedAmount: 150000,
    bills: [
      { id: 'b1', category: 'Heavy Water Pumps', description: '200 GPM Diesel De-watering Pumps', amount: 75000 },
      { id: 'b2', category: 'Dredging Machinery', description: 'Suction tanker & culvert cleaner crew', amount: 75000 },
    ],
    contributions: [
      { id: 'c1', donorName: 'DHA Traders Union', amount: 100000, date: '2026-08-04' },
    ],
  },
  {
    id: 'ISS-103',
    userId: 'u0',
    title: 'Overflowing Sewage Water in Khadda Market Lanes',
    description: 'Burst 12-inch sewer line creating unhygienic conditions and foul odor across the entire residential block.',
    category: 'Sewerage / Nala',
    area: 'Lyari',
    society: 'Khadda Market Zone',
    street: 'Mir Mohammad Baloch Road',
    status: 'reported',
    progress: 10,
    supportCount: 35,
    urgency: 'high',
    reportedAt: '2026-08-05',
    confirmedByOfficer: false,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1080&auto=format&fit=crop',
    targetBudget: 85000,
    raisedAmount: 12000,
    bills: [
      { id: 'b1', category: 'Sewer Pipe Replacement', description: 'RCC 12-inch reinforced pipes', amount: 45000 },
      { id: 'b2', category: 'Manhole Cover & Excavation', description: 'Cast iron manhole covers and labor', amount: 40000 },
    ],
    contributions: [],
  },
  {
    id: 'ISS-104',
    userId: 'u1',
    title: 'Uncollected Solid Waste & Open Garbage Dump Cleared',
    description: 'Accumulated garbage pile cleared and replaced with 2 new SSWMB closed dumpsters.',
    category: 'Garbage Collection',
    area: 'PECHS',
    society: 'Block 2',
    street: 'Tariq Road Extension',
    status: 'resolved',
    progress: 100,
    supportCount: 74,
    urgency: 'high',
    reportedAt: '2026-07-25',
    assignedOfficer: 'Chief Field Officer Tariq Mahmood',
    confirmedByOfficer: true,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=1080&auto=format&fit=crop',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop',
    afterPhotos: ['https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1080&auto=format&fit=crop'],
    updateNotes: ['Waste completely lifted by SSWMB. Site disinfected and bins deployed.'],
    targetBudget: 60000,
    raisedAmount: 60000,
    bills: [],
    contributions: [],
  },
  {
    id: 'ISS-105',
    userId: 'u0',
    title: 'Broken KWSB Water Supply Pipeline Leakage',
    description: 'Clean drinking water wasting on street while residents experience zero water pressure.',
    category: 'Water Supply (KWSB)',
    area: 'North Karachi',
    society: 'Sector 11-B',
    street: 'Shahrah-e-Usman',
    status: 'in_progress',
    progress: 40,
    supportCount: 29,
    urgency: 'medium',
    reportedAt: '2026-08-04',
    assignedOfficer: 'Chief Field Officer Tariq Mahmood',
    confirmedByOfficer: true,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1080&auto=format&fit=crop',
    targetBudget: 95000,
    raisedAmount: 40000,
    bills: [],
    contributions: [],
  },
  {
    id: 'ISS-106',
    userId: 'u1',
    title: 'Faulty Street Lights & Dark Corridor Fixed',
    description: 'Replaced 16 burnt sodium bulbs with 100W bright LED solar street lamps.',
    category: 'Street Lights',
    area: 'Clifton',
    society: 'Block 4',
    street: 'Sea View Road Avenue',
    status: 'resolved',
    progress: 100,
    supportCount: 51,
    urgency: 'medium',
    reportedAt: '2026-07-28',
    assignedOfficer: 'Chief Field Officer Tariq Mahmood',
    confirmedByOfficer: true,
    beforePhotoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&auto=format&fit=crop',
    afterPhotos: ['https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1080&auto=format&fit=crop'],
    updateNotes: ['All LED fixtures mounted and connected to automatic daylight sensors.'],
    targetBudget: 70000,
    raisedAmount: 70000,
    bills: [],
    contributions: [],
  }
];

const INITIAL_VERIFICATIONS: VerificationApplication[] = [
  {
    id: 'verif-101',
    userId: 'u0',
    userName: 'Umair Khan',
    userEmail: 'user@masail.pk',
    phone: '0300-1234567',
    cnicNumber: '41701-0596289-1',
    area: 'Saddar',
    society: 'ACAS Block',
    street: 'Preedy Street',
    utilityBillNumber: 'KE-9920194-A',
    cnicFrontPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop',
    utilityBillPhotoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop',
    status: 'pending',
    appliedAt: '2026-08-04',
  },
  {
    id: 'verif-102',
    userId: 'u102',
    userName: 'Kashif Mehmood',
    userEmail: 'kashif@masail.pk',
    phone: '0333-9876543',
    cnicNumber: '42101-8841920-3',
    area: 'Gulshan-e-Iqbal',
    society: 'Block 13-D',
    street: 'University Road',
    utilityBillNumber: 'KWSB-4412091',
    cnicFrontPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop',
    utilityBillPhotoUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop',
    status: 'pending',
    appliedAt: '2026-08-05',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

interface AuthContextValue {
  user: AuthUser | null;
  allIssues: LocalIssue[];
  myIssues: LocalIssue[];
  verifications: VerificationApplication[];
  notifications: AppNotification[];
  login: (email: string, password?: string) => { success: boolean; role?: UserRole; error?: string };
  register: (name: string, email: string, password: string, area?: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  addMyIssue: (issue: Omit<LocalIssue, 'userId' | 'targetBudget' | 'raisedAmount' | 'bills' | 'contributions'>) => void;
  confirmIssueByFieldOfficer: (issueId: string, budget?: number, customBills?: IssueBill[], inProgressPhoto?: string) => void;
  updateIssueProgressByFieldOfficer: (issueId: string, progress: number, note?: string, photos?: string[]) => void;
  resolveIssueByFieldOfficer: (issueId: string, afterPhoto?: string, photos?: string[]) => void;
  rejectIssueByFieldOfficer: (issueId: string) => void;
  contributeToIssue: (issueId: string, amount: number) => void;
  toggleSupportIssue: (issueId: string) => void;
  submitVerification: (app: Omit<VerificationApplication, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'appliedAt'>) => void;
  approveVerification: (appId: string) => void;
  rejectVerification: (appId: string) => void;
  markNotificationsRead: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sanitizeIssue(i: any): LocalIssue {
  const budget = typeof i.targetBudget === 'number' && !isNaN(i.targetBudget) ? i.targetBudget : 50000;
  const raised = typeof i.raisedAmount === 'number' && !isNaN(i.raisedAmount) ? i.raisedAmount : 0;
  const supports = typeof i.supportCount === 'number' ? i.supportCount : 0;
  return {
    ...i,
    targetBudget: budget,
    raisedAmount: raised,
    supportCount: supports,
    urgency: getCalculatedUrgency(supports),
    progress: typeof i.progress === 'number' ? i.progress : 5,
    contributions: Array.isArray(i.contributions) ? i.contributions : [],
    inProgressPhotos: Array.isArray(i.inProgressPhotos) ? i.inProgressPhotos : (i.inProgressPhotoUrl ? [i.inProgressPhotoUrl] : []),
    afterPhotos: Array.isArray(i.afterPhotos) ? i.afterPhotos : (i.afterPhotoUrl ? [i.afterPhotoUrl] : []),
    updateNotes: Array.isArray(i.updateNotes) ? i.updateNotes : [],
    bills: Array.isArray(i.bills) && i.bills.length > 0 ? i.bills : [
      { id: 'b1', category: 'Cement, Asphalt & Raw Materials', description: 'Crushed stone, cement bags & tar patching mix', amount: Math.round(budget * 0.5) },
      { id: 'b2', category: 'Labor Crew & Heavy Machinery', description: 'Roller compactor & excavation team (2 shifts)', amount: Math.round(budget * 0.3) },
      { id: 'b3', category: 'Safety Cones & KMC Clearances', description: 'Traffic barriers & municipal clearance fee', amount: Math.round(budget * 0.2) },
    ],
  };
}

function getStoredAllIssues(): LocalIssue[] {
  try {
    const raw = localStorage.getItem('masail_all_issues');
    if (!raw) return INITIAL_ISSUES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(sanitizeIssue) : INITIAL_ISSUES;
  } catch {
    return INITIAL_ISSUES;
  }
}

function getStoredVerifications(): VerificationApplication[] {
  try {
    const raw = localStorage.getItem('masail_verifications');
    return raw ? JSON.parse(raw) : INITIAL_VERIFICATIONS;
  } catch {
    return INITIAL_VERIFICATIONS;
  }
}

function getStoredNotifications(): AppNotification[] {
  try {
    const raw = localStorage.getItem('masail_notifications');
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = sessionStorage.getItem('masail_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [allIssues, setAllIssues] = useState<LocalIssue[]>(getStoredAllIssues);
  const [verifications, setVerifications] = useState<VerificationApplication[]>(getStoredVerifications);
  const [notifications, setNotifications] = useState<AppNotification[]>(getStoredNotifications);

  const myIssues = user ? allIssues.filter(i => i.userId === user.id) : [];

  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    const updated = [newNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('masail_notifications', JSON.stringify(updated));
  };

  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password?.trim() || '';

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password.' };
    }

    const storedUsers = JSON.parse(localStorage.getItem('masail_registered_users') || '{}');
    let account = MOCK_ACCOUNTS[cleanEmail] || storedUsers[cleanEmail];

    // Dynamic field officer email pattern: field.<area>@domain
    if (!account && (cleanEmail.startsWith('field.') || cleanEmail.startsWith('field_') || cleanEmail.startsWith('field@'))) {
      const emailPrefix = cleanEmail.split('@')[0];
      const parts = emailPrefix.split(/[._]/);
      const rawArea = parts.length > 1 ? parts[1] : 'general';
      const capitalizedArea = rawArea.charAt(0).toUpperCase() + rawArea.slice(1);
      const targetArea = AREA_MAPPINGS[rawArea.toLowerCase()] || capitalizedArea;
      account = {
        id: `fo_${rawArea}`,
        name: `Field Officer (${targetArea})`,
        email: cleanEmail,
        password: 'field123',
        role: 'field_officer',
        area: targetArea === 'General' ? 'All Areas' : targetArea,
        avatar: targetArea.substring(0, 2).toUpperCase(),
        verified: true,
      };
    }

    // 1. Verify account exists
    if (!account) {
      return {
        success: false,
        error: `No account registered with email "${cleanEmail}". Please check your email or click "Register free" to create an account.`
      };
    }

    // 2. Verify password matches
    if (account.password !== cleanPass) {
      return {
        success: false,
        error: `Invalid password for "${cleanEmail}". Please check your password and try again.`
      };
    }

    const userAccount = { ...account };
    const currentVerifs = getStoredVerifications();
    const userVerif = currentVerifs.find(v => v.userId === userAccount.id || v.userEmail === cleanEmail);
    if (userVerif) {
      userAccount.verified = userVerif.status === 'approved';
    } else if (cleanEmail === 'user@masail.pk') {
      userAccount.verified = false;
    }

    const { password: _pw, ...userData } = userAccount;
    setUser(userData);
    sessionStorage.setItem('masail_user', JSON.stringify(userData));
    localStorage.removeItem('masail_user');
    return { success: true, role: userData.role };
  };

  const register = (name: string, email: string, password: string, area?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPass = password.trim();
    const cleanArea = area || 'Gulshan-e-Iqbal, Karachi';

    if (!cleanName) return { success: false, error: 'Please enter your full name.' };
    if (!cleanEmail) return { success: false, error: 'Please enter your email address.' };
    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const storedUsers = JSON.parse(localStorage.getItem('masail_registered_users') || '{}');
    if (MOCK_ACCOUNTS[cleanEmail] || storedUsers[cleanEmail]) {
      return {
        success: false,
        error: `An account with email "${cleanEmail}" already exists. Please login instead.`,
      };
    }

    const avatarInitials = cleanName
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'K';

    const newUserObj = {
      id: `user_${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: 'resident' as UserRole,
      area: cleanArea,
      avatar: avatarInitials,
      verified: false,
    };

    storedUsers[cleanEmail] = newUserObj;
    localStorage.setItem('masail_registered_users', JSON.stringify(storedUsers));

    const { password: _pw, ...userData } = newUserObj;
    setUser(userData);
    sessionStorage.setItem('masail_user', JSON.stringify(userData));
    localStorage.removeItem('masail_user');
    return { success: true, role: userData.role };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('masail_user');
    localStorage.removeItem('masail_user');
  };

  const addMyIssue = (issueData: Omit<LocalIssue, 'userId' | 'targetBudget' | 'raisedAmount' | 'bills' | 'contributions'>) => {
    if (!user) return;
    const defaultBudget = 50000;
    const newIssue: LocalIssue = {
      ...issueData,
      userId: user.id,
      status: 'reported',
      confirmedByOfficer: false,
      targetBudget: defaultBudget,
      raisedAmount: 0,
      supportCount: 0,
      urgency: 'low',
      contributions: [],
      inProgressPhotos: [],
      afterPhotos: [],
      updateNotes: [],
      beforePhotoUrl: issueData.beforePhotoUrl || 'https://images.unsplash.com/photo-1715163694958-0af07a963763?w=1080&auto=format&fit=crop',
      bills: [
        { id: 'b1', category: 'Cement, Asphalt & Raw Materials', description: 'Crushed stone, cement bags & tar patching mix', amount: Math.round(defaultBudget * 0.5) },
        { id: 'b2', category: 'Labor Crew & Heavy Machinery', description: 'Roller compactor & excavation team (2 shifts)', amount: Math.round(defaultBudget * 0.3) },
        { id: 'b3', category: 'Safety Cones & KMC Clearances', description: 'Traffic barriers & municipal clearance fee', amount: Math.round(defaultBudget * 0.2) },
      ],
    };
    const updated = [newIssue, ...allIssues].map(sanitizeIssue);
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));
  };

  const confirmIssueByFieldOfficer = (issueId: string, budget = 50000, customBills?: IssueBill[], inProgressPhoto?: string) => {
    let targetUserId = '';
    let issueTitle = '';
    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        targetUserId = i.userId;
        issueTitle = i.title;
        const initialPhotos = inProgressPhoto ? [inProgressPhoto] : (i.inProgressPhotos?.length ? i.inProgressPhotos : ['https://images.unsplash.com/photo-1624812449802-99c34cb56654?w=1080&auto=format&fit=crop']);
        return sanitizeIssue({
          ...i,
          status: 'in_progress' as const,
          confirmedByOfficer: true,
          assignedOfficer: user?.name || 'Field Officer',
          progress: 25,
          targetBudget: budget,
          inProgressPhotos: initialPhotos,
          inProgressPhotoUrl: initialPhotos[0],
          bills: customBills && customBills.length > 0 ? customBills : [
            { id: 'b1', category: 'Cement, Asphalt & Raw Materials', description: 'Crushed stone, cement bags & tar patching mix', amount: Math.round(budget * 0.5) },
            { id: 'b2', category: 'Labor Crew & Heavy Machinery', description: 'Roller compactor & excavation team (2 shifts)', amount: Math.round(budget * 0.3) },
            { id: 'b3', category: 'Safety Cones & KMC Clearances', description: 'Traffic barriers & municipal clearance fee', amount: Math.round(budget * 0.2) },
          ],
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));

    if (targetUserId) {
      addNotification({
        userId: targetUserId,
        title: '🏗️ Issue Confirmed & Inspected',
        message: `Field Officer inspected and confirmed your reported issue "${issueTitle}". Repair budget allocated: ₨ ${budget.toLocaleString()}`,
        type: 'issue_confirmed',
      });
    }
  };

  const updateIssueProgressByFieldOfficer = (issueId: string, progress: number, note?: string, photos?: string[]) => {
    let targetUserId = '';
    let issueTitle = '';
    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        targetUserId = i.userId;
        issueTitle = i.title;
        const existingPhotos = i.inProgressPhotos || [];
        const mergedPhotos = photos && photos.length ? [...photos, ...existingPhotos] : existingPhotos;
        const existingNotes = i.updateNotes || [];
        const newNotes = note && note.trim() ? [`Progress set to ${progress}%: ${note.trim()}`, ...existingNotes] : existingNotes;
        const newStatus = progress >= 100 ? ('resolved' as const) : ('in_progress' as const);

        return sanitizeIssue({
          ...i,
          progress,
          status: newStatus,
          inProgressPhotos: mergedPhotos,
          inProgressPhotoUrl: mergedPhotos[0] || i.inProgressPhotoUrl,
          updateNotes: newNotes,
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));

    if (targetUserId) {
      addNotification({
        userId: targetUserId,
        title: '🚧 Field Work Progress Updated',
        message: `Progress on "${issueTitle}" updated to ${progress}% by Field Officer. ${note ? `Note: ${note}` : ''}`,
        type: 'work_update',
      });
    }
  };

  const resolveIssueByFieldOfficer = (issueId: string, afterPhoto?: string, photos?: string[]) => {
    let targetUserId = '';
    let issueTitle = '';
    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        targetUserId = i.userId;
        issueTitle = i.title;
        const mergedPhotos = photos && photos.length ? photos : (afterPhoto ? [afterPhoto] : ['https://images.unsplash.com/photo-1582468415647-4d65b3799dc6?w=1080&auto=format&fit=crop']);
        return sanitizeIssue({
          ...i,
          status: 'resolved' as const,
          progress: 100,
          afterPhotos: mergedPhotos,
          afterPhotoUrl: mergedPhotos[0],
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));

    if (targetUserId) {
      addNotification({
        userId: targetUserId,
        title: '✅ Issue 100% Resolved & Completed',
        message: `Field Officer completed physical repair work for "${issueTitle}". Final resolution photos published!`,
        type: 'work_update',
      });
    }
  };

  const rejectIssueByFieldOfficer = (issueId: string) => {
    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        return sanitizeIssue({
          ...i,
          status: 'rejected' as const,
          confirmedByOfficer: false,
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));
  };

  const contributeToIssue = (issueId: string, amount: number) => {
    const donorName = user?.name || 'Anonymous Resident';
    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        const newRaised = (i.raisedAmount || 0) + amount;
        const fundingPct = Math.min(100, Math.round((newRaised / (i.targetBudget || 50000)) * 100));
        let newProgress = i.progress || 5;
        if (fundingPct >= 100 && newProgress < 50) {
          newProgress = 50;
        }

        const newContribution: IssueContribution = {
          id: `contrib_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          donorName,
          amount,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const existingContribs = Array.isArray(i.contributions) ? i.contributions : [];

        return sanitizeIssue({
          ...i,
          raisedAmount: newRaised,
          progress: newProgress,
          contributions: [newContribution, ...existingContribs],
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));
  };

  const toggleSupportIssue = (issueId: string) => {
    if (!user) return;
    const currentUserId = user.id;

    const updated = allIssues.map(i => {
      if (i.id === issueId) {
        const supportedList = Array.isArray(i.supportedByUsers) ? i.supportedByUsers : [];
        const isCurrentlySupported = supportedList.includes(currentUserId);

        const newSupportedList = isCurrentlySupported
          ? supportedList.filter(id => id !== currentUserId)
          : [...supportedList, currentUserId];

        const baseCount = typeof i.supportCount === 'number' && i.supportCount > 0 ? i.supportCount : 12;
        const newCount = Math.max(1, isCurrentlySupported ? baseCount - 1 : baseCount + 1);

        return sanitizeIssue({
          ...i,
          supportedByUsers: newSupportedList,
          supportCount: newCount,
          urgency: getCalculatedUrgency(newCount),
        });
      }
      return i;
    });
    setAllIssues(updated);
    localStorage.setItem('masail_all_issues', JSON.stringify(updated));
  };

  const submitVerification = (appData: Omit<VerificationApplication, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'appliedAt'>) => {
    if (!user) return;
    const newApp: VerificationApplication = {
      ...appData,
      id: `VAPP-${Math.floor(Math.random() * 900) + 100}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newApp, ...verifications.filter(v => v.userId !== user.id)];
    setVerifications(updated);
    localStorage.setItem('masail_verifications', JSON.stringify(updated));

    addNotification({
      userId: user.id,
      title: '📄 Verification Application Submitted',
      message: 'Your verification application with CNIC & Utility bill was submitted. Verification Officer will review it shortly.',
      type: 'verification',
    });
  };

  const approveVerification = (appId: string) => {
    const updated = verifications.map(v => v.id === appId ? { ...v, status: 'approved' as const } : v);
    setVerifications(updated);
    localStorage.setItem('masail_verifications', JSON.stringify(updated));

    const targetApp = verifications.find(v => v.id === appId);
    if (targetApp) {
      addNotification({
        userId: targetApp.userId,
        title: '🎉 Resident Identity Verified!',
        message: `Congratulations ${targetApp.userName}! Your residence verification was approved by Inspector Amna Shah. You can now report civic issues for ${targetApp.area}.`,
        type: 'verification',
      });
    }

    if (user && targetApp && (user.id === targetApp.userId || user.email === targetApp.userEmail)) {
      const updatedUser = { ...user, verified: true };
      setUser(updatedUser);
      localStorage.setItem('masail_user', JSON.stringify(updatedUser));
    }
  };

  const rejectVerification = (appId: string) => {
    const updated = verifications.map(v => v.id === appId ? { ...v, status: 'rejected' as const } : v);
    setVerifications(updated);
    localStorage.setItem('masail_verifications', JSON.stringify(updated));

    const targetApp = verifications.find(v => v.id === appId);
    if (targetApp) {
      addNotification({
        userId: targetApp.userId,
        title: '⚠️ Verification Application Update',
        message: `Your verification application could not be verified. Please ensure CNIC and utility bill details match.`,
        type: 'verification',
      });
    }
  };

  const markNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('masail_notifications', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user,
      allIssues,
      myIssues,
      verifications,
      notifications,
      login,
      register,
      logout,
      addMyIssue,
      confirmIssueByFieldOfficer,
      updateIssueProgressByFieldOfficer,
      resolveIssueByFieldOfficer,
      rejectIssueByFieldOfficer,
      contributeToIssue,
      toggleSupportIssue,
      submitVerification,
      approveVerification,
      rejectVerification,
      markNotificationsRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
