import { api } from "./client";

export interface IssueResponse {
  id: number;
  title: string;
  description: string;
  category: string;
  area: string;
  society: string | null;
  street: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  progress: number;
  supportCount: number;
  raisedAmount: number;
  reportedByName: string;
  reportedAt: string;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  category: string;
  area: string;
  society?: string;
  street: string;
  latitude?: number;
  longitude?: number;
  beforePhotoUrls?: string[];
}

export const issuesApi = {
  list: (params: { area?: string; status?: string; page?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.area) query.set("area", params.area);
    if (params.status) query.set("status", params.status);
    if (params.page !== undefined) query.set("page", String(params.page));
    return api.get<{ content: IssueResponse[]; totalPages: number }>(`/issues?${query.toString()}`, { auth: false });
  },
  get: (id: number) => api.get<IssueResponse>(`/issues/${id}`, { auth: false }),
  photos: (id: number) => api.get<{ before: string[]; progress: string[]; after: string[] }>(`/issues/${id}/photos`, { auth: false }),
  report: (payload: CreateIssueRequest) => api.post<IssueResponse>("/issues", payload),
  toggleSupport: (id: number) => api.post<void>(`/issues/${id}/support`),
  donate: (id: number, amount: number) => api.post(`/issues/${id}/donate`, { amount }),
  supporters: (id: number) => api.get(`/issues/${id}/supporters`, { auth: false }),
  postProgress: (id: number, payload: { phase: string; photoUrl: string; note?: string; newStatus?: string }) =>
    api.post<IssueResponse>(`/issues/${id}/progress`, payload),
};
