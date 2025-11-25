export type ItemStatus = 'pending' | 'approved' | 'rejected' | 'revision';
export type ItemPriority = 'normal' | 'urgent';

export interface Item {
  id: number;
  title: string;
  price: number;
  category: string;
  createdAt: string;
  status: ItemStatus;
  priority: ItemPriority;
  thumbnailUrl?: string;
}

export interface ItemDetails extends Item {
  description: string;
  specs: Record<string, string>;
  images: string[];
  seller: Seller;
}

export interface Seller {
  id: number;
  name: string;
  rating: number;
  itemsCount: number;
  registeredAt: string;
}

export interface ModerationRecord {
  id: number;
  itemId: number;
  moderatorName: string;
  decision: ItemStatus;
  comment?: string;
  createdAt: string;
}

export type ModerationDecision = 'approve' | 'reject' | 'revision';

export interface ModerationRequest {
  decision: ModerationDecision;
  reason?: string;
  templateReason?: string;
}

export interface ItemsListParams {
  page?: number;
  limit?: number;
  statuses?: ItemStatus[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortField?: 'createdAt' | 'price' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export type StatsPeriod = 'today' | '7d' | '30d';

export interface StatsSummary {
  checkedTotal: number;
  approvedPercent: number;
  rejectedPercent: number;
  revisionPercent: number;
  avgCheckTimeSeconds: number;
}

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface DecisionDistributionEntry {
  decision: 'approved' | 'rejected' | 'revision';
  count: number;
}

export interface CategoryStatsEntry {
  category: string;
  count: number;
}
