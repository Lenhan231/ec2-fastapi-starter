export type UserRole = "CLIENT" | "PT" | "GYM_STAFF" | "ADMIN";

export interface Location {
  id: number;
  street?: string | null;
  district?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Gym {
  id: number;
  name: string;
  thumbnail?: string | null;
  summary?: string | null;
  distance_km?: number | null;
  rating_avg?: number | null;
  rating_count?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  location?: Location | null;
}

export interface Offer {
  id: number;
  offer_type: "GYM" | "PT";
  title: string;
  description?: string | null;
  summary?: string | null;
  valid_from: string;
  valid_to: string;
  promoted?: boolean;
  status?: OfferStatus;
  gym?: { id: number; name: string } | null;
  pt?: { id: number; name: string; avatar?: string | null } | null;
}

export interface PTProfile {
  id: number;
  name?: string | null;
  avatar?: string | null;
  experience_years?: number | null;
  price_per_session?: number | null;
  specialties?: string[] | null;
  promoted?: boolean;
}

export type OfferStatus =
  | "draft"
  | "pending"
  | "gym_approved"
  | "admin_review"
  | "approved"
  | "rejected"
  | "expired";

export interface Review {
  id: number;
  author: string;
  rating: number;
  content: string;
  created_at: string;
}

export interface Bookmark {
  id: number;
  type: "GYM" | "PT";
  name: string;
  href: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  bookmarks?: Bookmark[];
  reviews?: Review[];
}

export interface ModerationItem {
  id: number;
  offer: Offer;
  submitted_by: {
    id: number;
    name: string;
    role: "GYM_STAFF" | "PT";
  };
  risk_score: number;
  flagged_labels: string[];
  escalated: boolean;
  submitted_at: string;
}

export interface ReportItem {
  id: number;
  offer: Offer;
  reporter: {
    id: number;
    name: string;
  };
  reason: string;
  status: "open" | "investigating" | "resolved";
  created_at: string;
}
