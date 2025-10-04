# 📦 Easy Body — Flow & Layout Spec (v1)

> Deliverable includes **two files** inside this spec:
>
> * `FLOW.md` — duyệt Offer & moderation pipeline (swimlane + state machine + events)
> * `LAYOUT.md` — cấu trúc màn hình, component tree, routing, dữ liệu tối thiểu
>
> Stack target: **Next.js (TS)** + **Spring Boot** + **AWS** (Cognito, S3, CloudFront, SQS, Lambda, RDS Postgres + PostGIS, SageMaker/Bedrock, OpenSearch), CI/CD GitHub Actions.

---

## FILE: `FLOW.md`

### 0) Scope

* Roles: **Client**, **PT_User (PT)**, **Gym_Staff**, **Admin**, **SageMaker Moderation** (text/image), **System (Policy Engine / Indexer)**.
* Flows: **PT Offer**, **Gym Offer**, **Report → Re‑review**, **Expire**.
* Outputs: state transitions, events, API points.

---

### 1) Swimlane — PT Offer

```mermaid
sequenceDiagram
  autonumber
  participant PT as PT_User (App)
  participant GS as Gym_Staff (Dashboard)
  participant API as Backend API
  participant MQ as SQS offer_submitted
  participant MOD as SageMaker Moderation
  participant POL as Policy Engine
  participant ADM as Admin (only if flagged)
  participant IDX as Search Indexer

  PT->>API: POST /pt-offers (draft)
  PT->>API: POST /pt-offers/{id}/submit (pending)
  API->>GS: Notify "PTOffer pending gym approval"
  GS->>API: POST /pt-offers/{id}/approve-gym (gym_approved)
  API->>MQ: Enqueue moderation job (payload: text, media S3 URLs)
  MQ-->>MOD: Invoke moderation endpoint
  MOD-->>API: labels + risk_score + model_version
  API->>POL: Evaluate (risk, reputation, policy)
  alt risk_score < threshold_low
    POL-->>API: auto-approve
    API->>IDX: Index PTOffer (OpenSearch/GIN)
    API-->>PT: status=approved
  else risk_score >= threshold_low
    POL-->>ADM: escalate for review
    ADM->>API: approve/reject (reason)
    API->>IDX: (index if approved)
    API-->>PT: status=approved/rejected
  end
```

---

### 2) Swimlane — Gym Offer

```mermaid
sequenceDiagram
  autonumber
  participant GS as Gym_Staff (Dashboard)
  participant API as Backend API
  participant MQ as SQS offer_submitted
  participant MOD as SageMaker Moderation
  participant POL as Policy Engine
  participant ADM as Admin (only if flagged)
  participant IDX as Search Indexer

  GS->>API: POST /gym-offers (draft)
  GS->>API: POST /gym-offers/{id}/submit (pending)
  API->>MQ: Enqueue moderation job
  MQ-->>MOD: Moderation text/image
  MOD-->>API: labels + risk_score
  API->>POL: Evaluate policy (risk, gym reputation)
  alt risk_score < threshold_low
    POL-->>API: auto-approve
    API->>IDX: Index GymOffer
    API-->>GS: status=approved
  else escalate
    POL-->>ADM: request manual review
    ADM->>API: approve/reject (reason)
    API->>IDX: (index if approved)
    API-->>GS: status=approved/rejected
  end
```

---

### 3) State Machines (rút gọn)

**PTOffer**

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending: submit()
  pending --> gym_approved: gymStaffApprove()
  gym_approved --> approved: moderationRiskLow → autoApprove
  gym_approved --> admin_review: risk≥threshold → escalate
  admin_review --> approved: adminApprove()
  admin_review --> rejected: adminReject(reason)
  approved --> expired: now > valid_to
  pending --> rejected: withdraw/delete (owner) or gymReject(reason)
  rejected --> [*]
  expired --> archived
```

**GymOffer**

```mermaid
stateDiagram-v2
  [*] --> draft
  draft --> pending: submit()
  pending --> approved: moderationRiskLow → autoApprove
  pending --> admin_review: risk≥threshold → escalate
  admin_review --> approved: adminApprove()
  admin_review --> rejected: adminReject(reason)
  approved --> expired: now > valid_to
  expired --> archived
```

---

### 4) Events & Queues

* **SQS `offer_submitted`**: `{offerType, offerId, gymId, ptUserId?, title, mediaKeys[], locale}`
* **EventBridge `offer.moderated`**: `{offerType, offerId, riskScore, labels[], modelVersion}`
* **SNS email/push**: notify creator, Gym_Staff, Admin if escalate or rejected.
* **DLQ**: moderation failures.

---

### 5) API Endpoints (rút gọn để code)

* **PT Offers**

  * `POST /pt-offers` → create draft
  * `POST /pt-offers/{id}/submit`
  * `POST /pt-offers/{id}/approve-gym` (Gym_Staff)
  * `POST /pt-offers/{id}/reject` (Gym_Staff/Admin) {reason}
  * `GET /pt-offers?gym_id&status&q&lat&lon&radius&price_min&price_max`
* **Gym Offers**

  * `POST /gym-offers` → create draft
  * `POST /gym-offers/{id}/submit`
  * `POST /gym-offers/{id}/reject` (Admin when escalated)
  * `GET /gym-offers?gym_id&status&q&lat&lon&radius`
* **Moderation Queue**

  * `GET /moderation/queue?flagged_only=true`
  * `POST /offers/{type}/{id}/admin-approve|admin-reject`
* **Reports**

  * `POST /reports` {offerType, offerId, reason}
  * `GET /reports?status=open`

---

### 6) Policy & Thresholds (starter)

* `threshold_low = 0.35`, `threshold_high = 0.75` (tùy model scale)
* Auto‑reject nếu label thuộc nhóm **cấm** (NSFW explicit, scam, hateful terms…)
* **Reputation boost**: gym/pt có score cao → trừ 0.05–0.1 risk.
* **Penalty**: tài khoản có strikes gần đây → +0.05–0.15 risk.

---

# Xem thêm: cấu trúc màn hình, component tree, routing chi tiết ở `LAYOUT.md`.
