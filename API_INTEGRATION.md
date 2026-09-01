# FixItNow API Integration

This document describes the backend endpoints consumed by the FixItNow
frontend. The API client is centralized in [`lib/api`](./lib/api), while
screens generally access it through the React Query hooks in [`hooks`](./hooks).

## Configuration and request conventions

Set the following public environment variable before running the application:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

`lib/api/fetcher.ts` prefixes every endpoint in this document with
`NEXT_PUBLIC_API_URL`, sends JSON request bodies, and disables fetch caching.
For authenticated requests, it automatically sends:

```http
Authorization: Bearer <token>
```

The token is stored by the authentication flow and is not attached to endpoints
marked **Public** below. Most endpoint wrappers expect the response envelope:

```ts
{
  success: boolean;
  message: string;
  data: T;
  meta?: { total: number; page: number; limit: number; totalPages: number };
}
```

The profile and review wrappers currently consume their returned resource
directly, as noted in their tables. Backend responses must match the wrapper in
`lib/api` used by the calling screen.

## Frontend feature-to-endpoint map

| Frontend area | Component, route, or hook | Endpoint(s) | Purpose |
| --- | --- | --- | --- |
| Authentication | `/auth/login` | `POST /auth/login` | Sign in and receive `{ token, user }`. |
| Authentication | `/auth/register` | `POST /auth/register` | Create a customer, technician, or admin account. |
| Session restoration and access control | `app/providers.tsx`, `components/shared/RoleGuard.tsx` | `GET /auth/me` | Load the authenticated user and validate dashboard access. |
| Home and service catalogue | `app/page.tsx`, `app/(public)/services/page.tsx`, `useServices` | `GET /services`, `GET /categories` | Show services, filters, and category labels. |
| Service details / technician selection | `app/(public)/technicians/[id]/page.tsx`, `useTechnician` | `GET /technicians/:id`, `GET /services/:id`, `GET /technicians/:id/availability` | Load technician details, a selected service, and bookable slots. |
| New customer booking | `app/dashboard/customer/bookings/new/page.tsx`, `TimeSlotPicker` | `POST /bookings` | Create a booking for the selected service, technician, time, and address. |
| Customer dashboard | `app/dashboard/customer/page.tsx`, `useBookings`, `usePayments` | `GET /bookings`, `PATCH /bookings/:id/cancel`, `GET /payments` | List the customer’s bookings and payment history; cancel eligible bookings. |
| Checkout | `app/dashboard/customer/bookings/[id]/pay/page.tsx`, `CheckoutForm` | `POST /payments/create` | Create the Stripe PaymentIntent data used by Stripe Elements. |
| Payment result | `app/payment/success/page.tsx` | `POST /payments/confirm` | Confirm the completed Stripe PaymentIntent in the backend. |
| Customer review | `app/dashboard/customer/bookings/[id]/review/page.tsx` | `POST /bookings/:id/reviews` | Submit a rating and comment after a completed booking. |
| Technician overview and bookings | `app/dashboard/technician/page.tsx`, `app/dashboard/technician/bookings/page.tsx`, `useIncomingBookings` | `GET /bookings/technician/bookings`, `PATCH /bookings/:id/status` | Display incoming work and update booking status. |
| Technician profile | `app/dashboard/technician/profile/page.tsx`, `useTechnicianProfile` | `GET /technician/profile/me`, `PUT /technician/profile` | Read and update the technician’s own profile. |
| Technician availability | `components/features/technician/AvailabilityForm.tsx`, `useAvailability` | `GET /technicians/availability`, `PUT /technicians/availability` | Read and save weekly availability slots. |
| Technician services | `app/dashboard/technician/services/page.tsx`, `useMyServices` | `GET /services/my-services`, `DELETE /services/:id` | List and remove services owned by the current technician. |
| Create technician service | `app/dashboard/technician/services/new/page.tsx` | `POST /services`, `GET /categories` | Create a service and populate its category selector. |
| Administration overview | `app/dashboard/admin/page.tsx`, `useAllUsers`, `useAllBookingsAdmin` | `GET /admin/users`, `GET /admin/bookings` | Supply platform totals and activity statistics. |
| User administration | `app/dashboard/admin/users/page.tsx`, `useUpdateUserStatus` | `GET /admin/users`, `PATCH /admin/users/:id` | List accounts and update `ACTIVE` / `BANNED` status. |
| Category administration | `app/dashboard/admin/categories/page.tsx`, `CategoryDialog`, category hooks | `GET /admin/categories`, `POST /admin/categories`, `PATCH /admin/categories/:id`, `DELETE /admin/categories/:id` | List, create, rename, and remove service categories. |

## Endpoint reference

### Authentication

| Method and path | Access | Request body | Response `data` |
| --- | --- | --- | --- |
| `POST /auth/login` | Public | `{ email, password }` | `{ token, user }` |
| `POST /auth/register` | Public | `{ name, email, password, role }` | `user` |
| `GET /auth/me` | Authenticated | — | `user` |

`role` is one of `CUSTOMER`, `TECHNICIAN`, or `ADMIN`. A user contains at
least `id`, `name`, `email`, and `role`.

### Services and public discovery

| Method and path | Access | Request / query | Response `data` |
| --- | --- | --- | --- |
| `GET /services` | Public | Optional `category`, `location`, `minPrice`, `maxPrice`, `rating` query parameters | `Service[]`; optional pagination metadata is read from `meta` |
| `GET /services/:id` | Public | Service ID path parameter | `Service` |
| `GET /categories` | Public | — | `{ id, name }[]` |
| `GET /technicians/:id` | Public | Technician profile ID path parameter | `Technician` |
| `GET /technicians/:id/availability` | Public | Technician profile ID path parameter | Dated availability slots |

| Method and path | Access | Request body | Response `data` |
| --- | --- | --- | --- |
| `POST /services` | Technician | `{ title, description, price, duration, location?, categoryId }` | Created `Service` |
| `GET /services/my-services` | Technician | — | Current technician’s `Service[]` |
| `PATCH /services/:id` | Technician / owner | Any subset of the create-service fields | Updated `Service` |
| `DELETE /services/:id` | Technician / owner | — | `null` |

### Bookings, availability, and reviews

| Method and path | Access | Request body | Response `data` |
| --- | --- | --- | --- |
| `POST /bookings` | Customer | `{ serviceId, technicianId, scheduledAt, address, notes? }` | Created `Booking` |
| `GET /bookings` | Customer | — | Current customer’s `Booking[]` |
| `GET /bookings/:id` | Authenticated participant | — | `Booking` |
| `PATCH /bookings/:id/cancel` | Customer / owner | — | Cancelled `Booking` |
| `GET /bookings/technician/bookings` | Technician | — | Current technician’s `Booking[]` |
| `PATCH /bookings/:id/status` | Technician / assigned booking | `{ status }` | Updated `Booking` |
| `GET /technicians/availability` | Technician | — | Current technician’s weekly slots |
| `PUT /technicians/availability` | Technician | `{ slots: WeeklyHours[] }` | Saved weekly slots |
| `POST /bookings/:id/reviews` | Customer / completed booking owner | `{ rating, comment }` | `Review` (consumed directly, without an envelope) |

Booking statuses used by the frontend are `REQUESTED`, `ACCEPTED`, `DECLINED`,
`PAID`, `IN_PROGRESS`, `COMPLETED`, and `CANCELLED`. The backend should enforce
allowed status transitions and participant ownership.

### Technician profile

| Method and path | Access | Request body | Client response expectation |
| --- | --- | --- | --- |
| `GET /technician/profile/me` | Technician | — | `TechnicianProfile` directly |
| `PUT /technician/profile` | Technician | Partial `TechnicianProfile` | Updated `TechnicianProfile` directly |

The profile shape includes `id`, `name`, and optional `bio`, `skills`,
`experienceYears`, `avatar`, and `hourlyRate`.

### Payments

| Method and path | Access | Request body | Response `data` |
| --- | --- | --- | --- |
| `POST /payments/create` | Customer / booking owner | `{ bookingId }` | `{ clientSecret, paymentIntentId, paymentId, amount, currency, bookingId }` |
| `POST /payments/confirm` | Customer / booking owner | `{ paymentIntentId }` | Confirmed `Payment` |
| `GET /payments` | Customer | — | Current customer’s `Payment[]` |

Stripe Elements completes card collection in the browser using `clientSecret`.
The frontend then calls `/payments/confirm` from the success page so the backend
can record the result and update the relevant booking.

### Administration

| Method and path | Access | Request body | Response `data` |
| --- | --- | --- | --- |
| `GET /admin/users` | Admin | — | `AdminUser[]` |
| `PATCH /admin/users/:id` | Admin | `{ status: "ACTIVE" | "BANNED" }` | Updated `AdminUser` |
| `GET /admin/bookings` | Admin | — | `Booking[]` |
| `GET /admin/categories` | Admin | — | `Category[]` |
| `POST /admin/categories` | Admin | `{ name }` | Created `Category` |
| `PATCH /admin/categories/:id` | Admin | `{ name }` | Updated `Category` |
| `DELETE /admin/categories/:id` | Admin | — | `null` |

## Implementation ownership

- API paths, HTTP methods, types, and request payloads belong in `lib/api/*`.
- React Query caching, invalidation, and UI-oriented unwrapping belong in
  `hooks/*`.
- Route components and feature components should call hooks or API wrapper
  functions, rather than using `fetch` directly.
- When adding an endpoint, add its typed wrapper first, then its hook/component
  integration, and update both tables in this document.

## Verification checklist

- `NEXT_PUBLIC_API_URL` points to the backend API root without an extra trailing
  path mismatch.
- The backend accepts the bearer token format used by `apiFetch`.
- Public endpoints allow unauthenticated requests; protected endpoints enforce
  the stated role and resource ownership.
- Envelope endpoints return `{ success, message, data }`; profile and review
  endpoints match their direct-resource client wrappers, or those wrappers are
  updated together.
- Stripe’s publishable key is set as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and
  the payment create response includes a usable `clientSecret`.
