"use client";

import { useMemo, useState } from "react";

import EmptyState from "./EmptyState";
import FilterBar, { DEFAULT_FILTER_STATE, FilterState } from "./FilterBar";
import GymCard from "./GymCard";
import MapPeek from "./MapPeek";
import type { Gym } from "../types";

interface Props {
  gyms: Gym[];
}

const createDefaultFilter = (): FilterState => ({ ...DEFAULT_FILTER_STATE });

function matchesFilter(gym: Gym, filter: FilterState): boolean {
  if (!gym) {
    return false;
  }

  const rating = gym.rating_avg ?? 0;
  if (rating < filter.rating) {
    return false;
  }

  if (gym.distance_km != null && gym.distance_km > filter.distance) {
    return false;
  }

  const [minPrice, maxPrice] = filter.priceRange;
  const gymMin = gym.price_min ?? minPrice;
  const gymMax = gym.price_max ?? maxPrice;
  if (gymMax < minPrice || gymMin > maxPrice) {
    return false;
  }

  const q = filter.query.trim().toLowerCase();
  if (q.length > 0) {
    const haystack = [
      gym.name,
      gym.summary ?? "",
      gym.location?.district ?? "",
      gym.location?.city ?? ""
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) {
      return false;
    }
  }

  return true;
}

function HomeClient({ gyms }: Props) {
  const [filter, setFilter] = useState<FilterState>(() => createDefaultFilter());

  const filteredGyms = useMemo(() => gyms.filter((gym) => matchesFilter(gym, filter)), [gyms, filter]);

  return (
    <div style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <section style={{ marginBottom: "2rem" }}>
        <div className="badge">Khám phá phòng gym hợp gu</div>
        <h1 className="page-title">Tìm gym phù hợp với lịch và ngân sách của bạn</h1>
        <p style={{ maxWidth: "620px", color: "#475569" }}>
          Lọc theo khoảng cách, đánh giá thực tế và ngân sách. Kết hợp với PT được xác thực bởi phòng gym để đạt kết quả nhanh hơn.
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 320px) 1fr", gap: "1.75rem" }}>
        <div className="sticky-pane">
          <FilterBar initialState={filter} onChange={setFilter} />
          <div style={{ marginTop: "1.5rem" }}>
            <MapPeek />
          </div>
        </div>

        <div>
          <header className="section-title">Phòng gym nổi bật gần bạn</header>
          {filteredGyms.length === 0 ? (
            <EmptyState
              title="Không tìm thấy phòng gym phù hợp"
              description="Thử điều chỉnh khoảng cách, giá hoặc đánh giá tối thiểu để khám phá thêm lựa chọn."
            />
          ) : (
            <div className="card-grid">
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeClient;
