"use client";

import { useState } from "react";
import styles from "./OfferFilterBar.module.css";

type OfferFilterState = {
  query: string;
  distance: number;
  validTo?: string;
  priceRange?: [number, number];
  gymId?: string;
};

export interface OfferFilterBarProps {
  variant: "gym" | "pt";
  onChange?: (state: OfferFilterState) => void;
}

const gymOptions = [
  { label: "Tất cả", value: "" },
  { label: "Future Fitness", value: "1" },
  { label: "Beast Mode", value: "2" }
];

function OfferFilterBar({ variant, onChange }: OfferFilterBarProps) {
  const [state, setState] = useState<OfferFilterState>({
    query: "",
    distance: 10,
    validTo: "",
    priceRange: variant === "pt" ? [300000, 900000] : undefined,
    gymId: ""
  });

  const update = (partial: Partial<OfferFilterState>) => {
    const next = { ...state, ...partial };
    setState(next);
    onChange?.(next);
  };

  return (
    <aside className={styles.wrapper}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="query">Tìm kiếm</label>
          <input
            id="query"
            placeholder="Tên ưu đãi, PT, hoặc phòng gym"
            value={state.query}
            onChange={(event) => update({ query: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="distance">Khoảng cách</label>
          <input
            id="distance"
            type="range"
            min={1}
            max={30}
            value={state.distance}
            onChange={(event) => update({ distance: Number(event.target.value) })}
          />
          <span className={styles.help}>{state.distance} km</span>
        </div>

        <div className={styles.field}>
          <label htmlFor="validTo">Hiệu lực đến</label>
          <input
            id="validTo"
            type="date"
            value={state.validTo}
            onChange={(event) => update({ validTo: event.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="gym">Phòng gym</label>
          <select
            id="gym"
            value={state.gymId}
            onChange={(event) => update({ gymId: event.target.value })}
          >
            {gymOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {variant === "pt" && state.priceRange && (
          <div className={styles.field}>
            <label>Giá / buổi</label>
            <div className={styles.priceRow}>
              <input
                type="number"
                min={0}
                value={state.priceRange[0]}
                onChange={(event) =>
                  update({ priceRange: [Number(event.target.value), state.priceRange?.[1] ?? 0] })
                }
              />
              <span>→</span>
              <input
                type="number"
                min={state.priceRange[0]}
                value={state.priceRange[1]}
                onChange={(event) =>
                  update({ priceRange: [state.priceRange?.[0] ?? 0, Number(event.target.value)] })
                }
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

export default OfferFilterBar;
