export const KARACHI_AREAS = [
  'Clifton', 'Defence (DHA)', 'Gulshan-e-Iqbal', 'PECHS', 'Saddar',
  'F.B. Area', 'Malir', 'Korangi', 'Orangi Town', 'North Karachi',
  'Lyari', 'Landhi', 'Baldia Town', 'Keamari', 'Gulberg',
];

export const ISSUE_CATEGORIES = [
  { id: 'road', label: 'Road & Pothole', icon: '🚧', color: 'bg-orange-100 text-orange-700' },
  { id: 'waterlogging', label: 'Waterlogging', icon: '💧', color: 'bg-blue-100 text-blue-700' },
  { id: 'garbage', label: 'Garbage Collection', icon: '🗑️', color: 'bg-gray-100 text-gray-700' },
  { id: 'streetlight', label: 'Street Lights', icon: '💡', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'sewerage', label: 'Sewerage / Nala', icon: '🏚️', color: 'bg-red-100 text-red-700' },
  { id: 'water', label: 'Water Supply (KWSB)', icon: '💦', color: 'bg-cyan-100 text-cyan-700' },
  { id: 'parks', label: 'Parks & Green Spaces', icon: '🌳', color: 'bg-green-100 text-green-700' },
  { id: 'traffic', label: 'Traffic Signal', icon: '🚦', color: 'bg-purple-100 text-purple-700' },
  { id: 'encroachment', label: 'Encroachment', icon: '🏗️', color: 'bg-rose-100 text-rose-700' },
];

export type IssueStatus = 'reported' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  area: string;
  society: string;
  street: string;
  status: IssueStatus;
  reportedBy: string;
  reportedAt: string;
  supportCount: number;
  commentsCount: number;
  images: string[];
  progress: number;
  contractor?: string;
  assignedOfficer?: string;
}

export const ISSUES: Issue[] = [];

export interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  area: string;
  category: string;
  endDate: string;
  supporters: number;
  image: string;
  status: 'active' | 'funded' | 'completed';
  relatedIssue?: string;
}

export const CAMPAIGNS: Campaign[] = [];

export const RECENT_ACTIVITIES: { id: number; type: string; message: string; time: string; icon: string }[] = [];

export const STATS = {
  totalIssues: 42,
  resolvedIssues: 28,
  activeUsers: 18450,
  areasServed: 18,
  activeCampaigns: 4,
  totalFunded: 7570000,
};

export const NOTIFICATIONS = [
  { id: 1, title: 'Issue Update', message: 'Your reported issue ISS-001 (Pothole on Shaheed-e-Millat) has been assigned to KMC Road Works.', time: '30 minutes ago', read: false, type: 'update' },
  { id: 2, title: 'Campaign Milestone', message: 'The Storm Drain Campaign you support has reached 100% of its goal!', time: '2 hours ago', read: false, type: 'campaign' },
  { id: 3, title: 'Verification Approved', message: 'Your account has been successfully verified. You can now report issues and support campaigns.', time: '1 day ago', read: true, type: 'verification' },
  { id: 4, title: 'New Issue Nearby', message: 'A new waterlogging issue has been reported in Gulshan Block 13, near your registered area.', time: '2 days ago', read: true, type: 'nearby' },
  { id: 5, title: 'Issue Resolved', message: 'ISS-005 (Sewage overflow in Lyari) that you supported has been resolved!', time: '3 days ago', read: true, type: 'resolved' },
];
