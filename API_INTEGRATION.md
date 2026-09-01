# API Integration Map

Every FixItNow frontend page and component is mapped below to the backend
endpoint(s) it calls. The base URL is `NEXT_PUBLIC_API_URL` (see `.env`), and
all requests go through `lib/api/fetcher.ts`. The shared client attaches
`Authorization: Bearer <token>` when a stored session token exists and throws
an `ApiError` for every non-2xx response.

> The endpoint paths below are relative to `NEXT_PUBLIC_API_URL`. If the value
> of that environment variable ends with `/api`, each listed path is requested
> under that `/api` prefix.

## Public

| **Page / Component** | **Backend Endpoint(s)** |
| --- | --- |
| `app/page.tsx` (home / featured services) | `GET /services`, `GET /categories` |
| `app/(public)/services/page.tsx` and `components/features/service/Services.tsx` (browse and filter) | `GET /services?category=&location=&minPrice=&maxPrice=&rating=`, `GET /categories` |
| `app/(public)/technicians/[id]/page.tsx` (technician profile and booking CTA) | `GET /technicians/:id`, `GET /services/:id`, `GET /technicians/:id/availability` |
| `components/features/booking/TimeSlotPicker.tsx` | Uses availability data returned by `GET /technicians/:id/availability`; it does not call the API directly. |

## Authentication

| **Page / Component** | **Backend Endpoint(s)** |
| --- | --- |
| `app/(auth)/auth/register/page.tsx` | `POST /auth/register` |
| `app/(auth)/auth/login/page.tsx` | `POST /auth/login` |
| `app/providers.tsx` (global session sync on app load) | `GET /auth/me` |
| `middleware.ts` and `components/shared/RoleGuard.tsx` | No direct API calls. They protect routes using the stored session and role; the backend remains the authority for JWT and permission validation. |

## Customer

| **Page / Component** | **Backend Endpoint(s)** |
| --- | --- |
| `app/dashboard/customer/page.tsx` (booking and payment history) | `GET /bookings`, `GET /payments` |
| `app/dashboard/customer/page.tsx` (cancel booking) | `PATCH /bookings/:id/cancel` |
| `app/dashboard/customer/bookings/new/page.tsx` (submit booking request) | `POST /bookings` |
| `app/dashboard/customer/bookings/[id]/pay/page.tsx` (Stripe payment form) | `POST /payments/create` |
| `app/payment/success/page.tsx` | `POST /payments/confirm` |
| `app/payment/cancel/page.tsx` | No API calls. |
| `app/dashboard/customer/bookings/[id]/review/page.tsx` (leave review) | `POST /bookings/:id/reviews` |

## Technician

| **Page / Component** | **Backend Endpoint(s)** |
| --- | --- |
| `app/dashboard/technician/page.tsx` (overview) | `GET /bookings/technician/bookings` |
| `app/dashboard/technician/profile/page.tsx` | `GET /technician/profile/me`, `PUT /technician/profile` |
| `app/dashboard/technician/services/page.tsx` (service list and delete action) | `GET /services/my-services`, `DELETE /services/:id` |
| `app/dashboard/technician/services/new/page.tsx` | `GET /categories`, `POST /services` |
| `components/features/technician/AvailabilityForm.tsx` | `GET /technicians/availability`, `PUT /technicians/availability` |
| `app/dashboard/technician/bookings/page.tsx` (incoming bookings) | `GET /bookings/technician/bookings` |
| `components/features/technician/BookingActions.tsx` (accept, decline, start, complete) | `PATCH /bookings/:id/status` |

## Admin

| **Page / Component** | **Backend Endpoint(s)** |
| --- | --- |
| `app/dashboard/admin/page.tsx` (overview statistics) | `GET /admin/users`, `GET /admin/bookings` |
| `app/dashboard/admin/users/page.tsx` (search, pagination, ban/unban) | `GET /admin/users`, `PATCH /admin/users/:id` |
| `app/dashboard/admin/categories/page.tsx` (category management) | `GET /admin/categories`, `POST /admin/categories`, `PATCH /admin/categories/:id`, `DELETE /admin/categories/:id` |
| `components/features/admin/CategoryDialog.tsx` | Receives category actions from the admin categories page; it does not call the API directly. |

## Notes on shared endpoints

- **`GET /services`** is shared by the home page and service browse page. The
  browse page sends selected `category`, `location`, `minPrice`, `maxPrice`,
  and `rating` query parameters; the home page requests the unfiltered list
  and displays the first six services.
- **`GET /categories`** is shared by public service browsing and the technician
  service-creation form. Admin category management uses the separate protected
  endpoint, **`GET /admin/categories`**.
- **`GET /bookings/technician/bookings`** powers both the technician dashboard
  overview and the incoming-bookings management page. Booking status updates
  use `PATCH /bookings/:id/status` and refresh the affected React Query data.
- **`GET /payments`** returns the signed-in customer's payment history on the
  customer dashboard. Payment creation is handled through Stripe Elements:
  `POST /payments/create` returns the client secret, then the success page
  confirms the Stripe payment with `POST /payments/confirm`.
- The API helpers `GET /bookings/:id` and `PATCH /services/:id` are available
  in `lib/api`, but no current page invokes them. They are ready for future
  booking-detail and service-edit interfaces.
