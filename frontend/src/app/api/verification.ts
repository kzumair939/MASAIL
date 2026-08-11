import { api } from "./client";

export interface ApplyRequest {
  fullName: string;
  cnicNumber: string;
  email: string;
  mobileNumber: string;
  area: string;
  society?: string;
  street?: string;
  utilityBillNumber?: string;
  utilityBillPhotoUrl?: string;
  cnicFrontPhotoUrl?: string;
  cnicBackPhotoUrl?: string;
  profilePhotoUrl?: string;
}

export const verificationApi = {
  apply: (payload: ApplyRequest) => api.post("/verification/apply", payload),
  myApplication: () => api.get("/verification/me"),
  queue: (page = 0) => api.get(`/verification/review-queue?page=${page}`),
  getOne: (id: number) => api.get(`/verification/review-queue/${id}`),
  review: (id: number, decision: "APPROVE" | "REJECT" | "NEEDS_MORE_INFO", notes?: string) =>
    api.post(`/verification/review-queue/${id}/review`, { decision, notes }),
};
