"use client";

import { useEffect, useState } from "react";
import styles from "./FilterBar.module.css";

export type FilterState = {
  query: string;
  distance: number;
  priceRange: [number, number];
  rating: number;
};

export type FilterBarProps = {
  initialState?: FilterState;
  onChange?: (state: FilterState) => void;
};

export const DEFAULT_FILTER_STATE: FilterState = {
  query: "",
  distance: 5,
  priceRange: [300000, 1500000],
  rating: 4
};

function FilterBar({ initialState = DEFAULT_FILTER_STATE, onChange }: FilterBarProps) {
  const [state, setState] = useState<FilterState>(initialState);

  useEffect(() => {
    onChange?.({ ...state });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (partial: Partial<FilterState>) => {
    const next = { ...state, ...partial };
    setState(next);
    onChange?.(next);
  };

  return (
    <aside className={styles.wrapper}>
      <div className={styles.fieldGroup}>
        <label htmlFor="query">Tìm kiếm</label>
        <input
          id="query"
          placeholder="Tên phòng gym, quận, tuyến đường..."
          value={state.query}
          onChange={(event) => update({ query: event.target.value })}
        />
      </div>

      <div className={styles.inlineGroup}>
        <div className={styles.fieldGroup}>
          <label htmlFor="distance">Khoảng cách (km)</label>
          <input
            id="distance"
            type="range"
            min={1}
            max={20}
            value={state.distance}
            onChange={(event) => update({ distance: Number(event.target.value) })}
          />
          <span className={styles.help}>{state.distance} km</span>
        </div>

        <div className={styles.fieldGroup}>
          <label>Giá (tháng)</label>
          <div className={styles.priceRow}>
            <input
              type="number"
              value={state.priceRange[0]}
              min={0}
              onChange={(event) =>
                update({ priceRange: [Number(event.target.value), state.priceRange[1]] })
              }
            />
            <span>→</span>
            <input
              type="number"
              value={state.priceRange[1]}
              min={state.priceRange[0]}
              onChange={(event) =>
                update({ priceRange: [state.priceRange[0], Number(event.target.value)] })
              }
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="rating">Đánh giá tối thiểu</label>
          <select
            id="rating"
            value={state.rating}
            onChange={(event) => update({ rating: Number(event.target.value) })}
          >
            {[3, 3.5, 4, 4.5, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} ★ trở lên
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}

export default FilterBar;
