import type {
  Gym,
  ModerationItem,
  Offer,
  PTProfile,
  ReportItem,
  Review,
  UserProfile
} from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API ${path} → ${response.status}`);
  }

  return (await response.json()) as T;
}

const mockGyms: Gym[] = [
  {
    id: 1,
    name: "Future Fitness District 1",
    thumbnail: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=600&q=60",
    summary: "Phòng tập 3 tầng, khu boxing, sauna, PT 1:1",
    distance_km: 2.4,
    rating_avg: 4.9,
    rating_count: 128,
    price_min: 690000,
    price_max: 1590000,
    location: {
      id: 10,
      district: "Quận 1",
      city: "Hồ Chí Minh"
    }
  },
  {
    id: 2,
    name: "Beast Mode Phú Nhuận",
    thumbnail: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=600&q=60",
    summary: "Functional training, crossfit cage, personal coaching",
    distance_km: 4.2,
    rating_avg: 4.7,
    rating_count: 96,
    price_min: 590000,
    price_max: 1290000,
    location: {
      id: 11,
      district: "Phú Nhuận",
      city: "Hồ Chí Minh"
    }
  }
];

const now = Date.now();
const sevenDays = 7 * 86400000;

const mockGymOffers: Offer[] = [
  {
    id: 101,
    offer_type: "GYM",
    title: "Miễn phí 7 ngày trải nghiệm",
    summary: "Tặng 1 tuần tập luyện + đánh giá thể hình bởi PT lead.",
    valid_from: new Date(now).toISOString(),
    valid_to: new Date(now + sevenDays).toISOString(),
    promoted: true,
    status: "approved",
    gym: { id: 1, name: "Future Fitness District 1" }
  },
  {
    id: 102,
    offer_type: "GYM",
    title: "Giảm 25% gói 3 tháng",
    summary: "Ưu đãi thành viên mới kèm lớp yoga không giới hạn.",
    valid_from: new Date(now).toISOString(),
    valid_to: new Date(now + sevenDays * 2).toISOString(),
    promoted: false,
    status: "pending",
    gym: { id: 2, name: "Beast Mode Phú Nhuận" }
  }
];

const mockPTOffers: Offer[] = [
  {
    id: 201,
    offer_type: "PT",
    title: "Combo 10 buổi PT cá nhân",
    summary: "Tặng thêm 2 buổi đánh giá dinh dưỡng.",
    valid_from: new Date(now).toISOString(),
    valid_to: new Date(now + sevenDays * 3).toISOString(),
    promoted: true,
    status: "gym_approved",
    pt: { id: 31, name: "Coach Linh" },
    gym: { id: 1, name: "Future Fitness District 1" }
  },
  {
    id: 202,
    offer_type: "PT",
    title: "Buổi trải nghiệm 199k",
    summary: "Phù hợp người mới bắt đầu, thiết kế giáo án riêng.",
    valid_from: new Date(now).toISOString(),
    valid_to: new Date(now + sevenDays * 2).toISOString(),
    promoted: false,
    status: "pending",
    pt: { id: 32, name: "Coach Huy" },
    gym: { id: 2, name: "Beast Mode Phú Nhuận" }
  }
];

const mockPTs: PTProfile[] = [
  {
    id: 31,
    name: "Coach Linh",
    avatar: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?auto=format&fit=crop&w=300&q=60",
    experience_years: 6,
    price_per_session: 800000,
    specialties: ["Body recomposition", "Cross training"],
    promoted: true
  },
  {
    id: 32,
    name: "Coach Huy",
    avatar: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=300&q=60",
    experience_years: 4,
    price_per_session: 550000,
    specialties: ["Fat loss", "Strength"],
    promoted: false
  }
];

const mockProfile: UserProfile = {
  id: 501,
  name: "Nguyễn Khánh Linh",
  email: "linh.nguyen@example.com",
  role: "GYM_STAFF",
  bookmarks: [
    { id: 1, type: "GYM", name: "Future Fitness District 1", href: "/gyms/1" },
    { id: 31, type: "PT", name: "Coach Linh", href: "/pts/31" }
  ],
  reviews: []
};

const mockModerationQueue: ModerationItem[] = [
  {
    id: 9001,
    offer: {
      ...mockPTOffers[1],
      status: "admin_review",
      summary: mockPTOffers[1].summary ?? undefined
    },
    submitted_by: { id: 802, name: "Coach Huy", role: "PT" },
    risk_score: 0.42,
    flagged_labels: ["discount_high"],
    escalated: true,
    submitted_at: new Date(now - 3600_000).toISOString()
  },
  {
    id: 9002,
    offer: {
      ...mockGymOffers[1],
      status: "pending",
      summary: mockGymOffers[1].summary ?? undefined
    },
    submitted_by: { id: 602, name: "Future Fitness Reception", role: "GYM_STAFF" },
    risk_score: 0.18,
    flagged_labels: [],
    escalated: false,
    submitted_at: new Date(now - 7200_000).toISOString()
  }
];

const mockReports: ReportItem[] = [
  {
    id: 3001,
    offer: mockPTOffers[0],
    reporter: { id: 1201, name: "Trần Minh" },
    reason: "PT không xuất hiện đúng giờ",
    status: "open",
    created_at: new Date(now - sevenDays).toISOString()
  },
  {
    id: 3002,
    offer: mockGymOffers[0],
    reporter: { id: 1202, name: "Lưu Ly" },
    reason: "Ảnh offer chưa phản ánh thực tế",
    status: "investigating",
    created_at: new Date(now - sevenDays * 2).toISOString()
  }
];

export const api = {
  async listGyms() {
    try {
      return await request<Gym[]>(`/gyms`);
    } catch (error) {
      console.warn("Fallback listGyms", error);
      return mockGyms;
    }
  },

  async getGym(id: number) {
    try {
      return await request<Gym>(`/gyms/${id}`);
    } catch (error) {
      console.warn("Fallback getGym", error);
      return mockGyms.find((gym) => gym.id === id) ?? mockGyms[0];
    }
  },

  async getGymOffer(id: number) {
    try {
      return await request<Offer>(`/gym-offers/${id}`);
    } catch (error) {
      console.warn("Fallback getGymOffer", error);
      return mockGymOffers.find((offer) => offer.id === id) ?? mockGymOffers[0];
    }
  },

  async listGymOffers(params?: Record<string, string | number | undefined>) {
    try {
      const query = params
        ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)])).toString()}`
        : "";
      return await request<Offer[]>(`/gym-offers${query}`);
    } catch (error) {
      console.warn("Fallback listGymOffers", error);
      return mockGymOffers;
    }
  },

  async listPTOffers(params?: Record<string, string | number | undefined>) {
    try {
      const query = params
        ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)])).toString()}`
        : "";
      return await request<Offer[]>(`/pt-offers${query}`);
    } catch (error) {
      console.warn("Fallback listPTOffers", error);
      return mockPTOffers;
    }
  },

  async getPTOffer(id: number) {
    try {
      return await request<Offer>(`/pt-offers/${id}`);
    } catch (error) {
      console.warn("Fallback getPTOffer", error);
      return mockPTOffers.find((offer) => offer.id === id) ?? mockPTOffers[0];
    }
  },

  async listPTs(params?: Record<string, string | number | undefined>) {
    try {
      const query = params
        ? `?${new URLSearchParams(Object.entries(params).filter(([, value]) => value != null).map(([key, value]) => [key, String(value)])).toString()}`
        : "";
      return await request<PTProfile[]>(`/pts${query}`);
    } catch (error) {
      console.warn("Fallback listPTs", error);
      return mockPTs;
    }
  },

  async getPTProfile(id: number) {
    try {
      return await request<PTProfile>(`/pts/${id}`);
    } catch (error) {
      console.warn("Fallback getPTProfile", error);
      return mockPTs.find((pt) => pt.id === id) ?? mockPTs[0];
    }
  },

  async getGymReviews(id: number) {
    try {
      return await request<Review[]>(`/gyms/${id}/reviews`);
    } catch (error) {
      console.warn("Fallback getGymReviews", error);
      return [];
    }
  },

  async getProfile() {
    try {
      return await request<UserProfile>(`/profile/me`);
    } catch (error) {
      console.warn("Fallback getProfile", error);
      return mockProfile;
    }
  },

  async getModerationQueue() {
    try {
      return await request<ModerationItem[]>(`/moderation/queue`);
    } catch (error) {
      console.warn("Fallback getModerationQueue", error);
      return mockModerationQueue;
    }
  },

  async getReports() {
    try {
      return await request<ReportItem[]>(`/reports?status=open`);
    } catch (error) {
      console.warn("Fallback getReports", error);
      return mockReports;
    }
  }
};
