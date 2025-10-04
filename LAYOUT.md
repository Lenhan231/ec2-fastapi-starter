# 📦 Easy Body — Layout Spec (v1)

## 0) Điều hướng & khung chung

* **Header**: Logo (về Home) + [Đăng nhập/Đăng ký]
* **Bottom Nav (4 tabs)**: **Home**, **Gym Offer Listing**, **PT Offer Listing**, **Profile**
* **Routing (Next.js app router)**

  * `/` → Home (Gym Listing)
  * `/gyms/[gymId]` → Gym Detail
  * `/offers/gyms` → Gym Offer Listing
  * `/offers/pts` → PT Offer Listing
  * `/profile` → Profile (role-aware)
  * `/manage/gym` (Gym_Staff) → quản lý Gym + tạo GymOffer
  * `/manage/pt` (PT) → quản lý Profile + tạo PTOffer
  * `/auth/*` → login/register/forgot

---

## 1) Home — Gym Listing (Airbnb card style)

**UI Components**

* `FilterBar`: search box, distance (slider), price range, rating, amenities chips
* `GymCard`: thumbnail, tên, "Cách bạn … km", rating (★ + count), price min–max
* `MapPeek` (optional sticky mini-map on mobile)

**Data cần**

* `GET /gyms?lat&lon&radius&price_min&price_max&rating_min&amenities[]&q`
* Response mỗi item: `{id, name, thumbnail, distance_km, rating_avg, rating_count, price_min, price_max, location}`

**Interaction**

* Click card → `/gyms/[gymId]`

---

## 2) Gym Detail

**Sections**

* Header: tên, address (map), phone, hours, amenities (chips)
* Actions: **[Gym Offers]** → `/offers/gyms?gym_id=...`, **[PT Listing]** → embedded list or `/gyms/[gymId]/pts`
* Reviews: list + form if logged‑in (rating + text + photos)

**Data cần**

* `GET /gyms/{id}` → core info + amenities + hours
* `GET /gyms/{id}/reviews?limit=...`
* `GET /gyms/{id}/pts?available_at=...` (filter theo giờ rảnh)

---

## 3) Gym Offer Listing

**UI**

* `OfferFilterBar`: search, distance, valid_to range, gym select, subscription tier sort
* `GymOfferCard`: ảnh deal, mô tả ngắn, gym, distance, valid_to, CTA → detail
* Badge: **Promoted** nếu gym có subscription tier cao

**Data**

* `GET /gym-offers?lat&lon&radius&q&valid_to_from&valid_to_to&gym_id`
* Item: `{id, title, cover, summary, gym: {id,name}, distance_km, valid_to, promoted}`

---

## 4) PT Offer Listing

**UI**

* `OfferFilterBar`: search, distance, price, gym, available_at (time)
* `PTOfferCard`: ảnh PT/bio ngắn, gym liên quan, giá deal, valid_to, CTA (gọi/Zalo/book)
* Badge **Promoted** nếu PT có subscription tier cao

**Data**

* `GET /pt-offers?lat&lon&radius&q&price_min&price_max&gym_id&available_at`
* Item: `{id, title, cover, pt:{id,name,avatar}, gym:{id,name}, price, valid_to, promoted}`

---

## 5) Profile (role-aware)

**Chưa login** → CTA: [Đăng nhập/Đăng ký]

**Đã login (Client)**

* Info: name, email
* **Bookmarks**: gyms, pts
* **My Reviews**: list
* Settings: change password, logout

**Đã login (PT)**

* Info + link **Quản lý PT** `/manage/pt`
* **Quản lý PT**: cập nhật bio, chứng chỉ, **khung giờ rảnh**, liên kết Gym
* **Tạo PT Offer** (wizard 3 bước: Nội dung → Ảnh → Review & Submit)
* **Trạng thái Offer**: draft/pending/gym_approved/approved/rejected

**Đã login (Gym_Staff)**

* Info + link **Quản lý Gym** `/manage/gym`
* **Quản lý Gym**: chỉnh info, amenities, giờ mở cửa, subscription range
* **Tạo Gym Offer**; **Duyệt PT Offer** (tab Pending)

---

## 6) Component Tree (rút gọn để code FE)

```
<RootLayout>
  <Header />
  <BottomNav />
  <PageContainer>
    <Route />
  </PageContainer>
</RootLayout>

HomePage
  ├─ FilterBar
  └─ GymGrid
      └─ GymCard*

GymDetailPage
  ├─ GymHeader
  ├─ GymActions (→ Offers/PT Listing)
  ├─ AmenityChips
  └─ ReviewSection

OfferListingPage (Gym/PT)
  ├─ OfferFilterBar
  └─ OfferGrid
      └─ OfferCard*

ProfilePage (role-aware)
  ├─ UserInfo
  ├─ RoleActions
  ├─ Bookmarks
  └─ Reviews
```

---

## 7) Form/Wizard & Validation (FE)

* React Hook Form + Zod
* `title` ≤ 80, `valid_from < valid_to`, bắt buộc chọn **Gym** với **PTOffer**
* Ảnh: giới hạn dung lượng, ratio 4:3/1:1, alt text cho SEO
* Upload: S3 presigned PUT → preview → submit metadata

---

## 8) RBAC (FE Guard)

* Route guards từ Cognito groups/claims:

  * `client`, `pt`, `gym_staff`, `admin`
* Hide/disable actions theo role + ownership + status

---

## 9) Tracking (basic)

* Page view, filter usage, CTR Offer (impression→detail), CTA clicks (call/zalo/book)
* Moderation funnel (submit→gymApproved→autoApprove/escalate→approved)

---

## 10) Performance & Empty States

* Infinite scroll theo tab Listing
* Skeletons + optimistic update cho duyệt offer (Gym_Staff)
* Empty: "Chưa có Offer phù hợp" + gợi ý filter khác

---

> Hết. Sẵn sàng code FE/BE theo spec này. Nếu cần, em có thể tách `OpenAPI.yaml` và `DB migration.sql` ở phiên bản kế tiếp.
