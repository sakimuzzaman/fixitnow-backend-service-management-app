# FixItNow Frontend

FixItNow is a role-based home-service marketplace frontend. Customers can
discover services, choose a technician and available time slot, make a secure
Stripe payment, track bookings, and leave a review. Technicians can manage
their profile, services, availability, and incoming jobs. Administrators can
monitor platform activity, manage users, and maintain service categories.

The application is built with the Next.js App Router and connects to the
FixItNow backend through a configurable REST API.

## Highlights

- Public service catalogue with category, location, price, and rating filters.
- Technician profile pages with service details and available booking slots.
- Customer booking lifecycle: request, pay for accepted work, track status,
  cancel eligible bookings, and leave reviews after completion.
- Stripe Elements payment flow with dedicated success and cancellation pages.
- Technician workspace for profile setup, service listing, weekly availability,
  and booking status actions.
- Admin workspace for platform statistics, user ban/unban actions, and category
  management.
- Role-aware navigation and protected dashboard routes for customers,
  technicians, and administrators.
- Responsive UI, loading skeletons, toast feedback, and API error handling.

## Technology

| Area | Tools |
| --- | --- |
| Framework | Next.js 15, React 19, TypeScript |
| Styling and UI | Tailwind CSS, shadcn/ui, Base UI, Lucide icons |
| Server state | TanStack React Query |
| Forms and validation | React Hook Form, Zod |
| Client state | Zustand and browser cookies |
| Payments | Stripe Elements (`@stripe/react-stripe-js`) |
| Authentication | JWT bearer token, `jose`, route middleware |

## Prerequisites

Before running the project, install:

- Node.js 20 LTS or newer
- npm (included with Node.js)
- A running FixItNow backend API
- A Stripe publishable key for payment testing

## Getting started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fixitnow-frontend
```

If this frontend lives inside a larger repository, change into the
`fixitnow-frontend` directory before continuing.

### 2. Install dependencies

```bash
npm ci
```

Use `npm install` only when you intentionally need to update dependencies or
the lockfile is unavailable.

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Backend base URL. Include /api when the backend exposes that prefix.
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Stripe publishable key used by Stripe Elements in the payment page.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Must match the JWT signing secret used by the backend in local development.
# Required because middleware verifies the dashboard token before rendering.
JWT_SECRET=replace_with_your_backend_jwt_secret
```

Do not commit `.env` files or real credentials. `NEXT_PUBLIC_*` values are
deliberately exposed to the browser; only use Stripe's publishable key there,
never a Stripe secret key. Configure production secrets through your hosting
provider's environment-variable settings.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create or use test accounts

Register through `/auth/register` and choose one of these roles:

| Role | What to review |
| --- | --- |
| Customer | Browse services, choose a time slot, request a booking, pay after acceptance, and submit a review. |
| Technician | Complete profile details, add services, set availability, and accept, decline, start, or complete bookings. |
| Admin | View platform metrics, manage user status, and create, edit, or delete categories. |

> The backend controls authorization. Ensure the backend has suitable test
> data and role permissions before reviewing protected workflows.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server with Turbopack. |
| `npm run lint` | Runs ESLint checks. |
| `npm run build` | Creates an optimized production build. |
| `npm run start` | Serves the production build after `npm run build`. |

For a production-like local check:

```bash
npm run build
npm run start
```

## User journeys

### Customer

1. Register or sign in as a customer.
2. Browse and filter services, then open a technician profile.
3. Select an available time slot and submit the booking address and notes.
4. When the technician accepts the request, select **Pay Now**.
5. Complete payment through Stripe Elements and return to the success page.
6. Track the booking in the customer dashboard and leave a review after the
   technician marks it completed.

### Technician

1. Register or sign in as a technician.
2. Set up the profile, service listings, and weekly availability.
3. Review incoming requests and accept or decline them.
4. After customer payment, start the job and mark it completed when finished.

### Administrator

1. Sign in with an administrator account.
2. Review user and booking totals on the dashboard.
3. Search users and change their status between `ACTIVE` and `BANNED`.
4. Create, rename, and delete service categories.

## Routes

| Area | Routes |
| --- | --- |
| Public | `/`, `/services`, `/technicians/[id]` |
| Authentication | `/auth/register`, `/auth/login` |
| Customer | `/dashboard/customer`, `/dashboard/customer/bookings/new`, `/dashboard/customer/bookings/[id]/pay`, `/dashboard/customer/bookings/[id]/review` |
| Technician | `/dashboard/technician`, `/dashboard/technician/profile`, `/dashboard/technician/services`, `/dashboard/technician/services/new`, `/dashboard/technician/bookings` |
| Admin | `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/categories` |
| Payments | `/payment/success`, `/payment/cancel` |

## Project structure

```text
fixitnow-frontend/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── login/page.tsx                 # Sign-in page
│   │       └── register/page.tsx              # Role-based registration
│   ├── (public)/
│   │   ├── services/page.tsx                  # Service catalogue
│   │   └── technicians/[id]/page.tsx          # Technician profile and booking CTA
│   ├── dashboard/
│   │   ├── admin/
│   │   │   ├── categories/page.tsx            # Category management
│   │   │   ├── users/page.tsx                 # User management
│   │   │   ├── layout.tsx                     # Admin role guard
│   │   │   └── page.tsx                       # Admin overview
│   │   ├── customer/
│   │   │   ├── bookings/
│   │   │   │   ├── [id]/pay/page.tsx          # Stripe payment page
│   │   │   │   ├── [id]/review/page.tsx       # Review submission page
│   │   │   │   └── new/page.tsx               # Booking confirmation form
│   │   │   ├── layout.tsx                     # Customer role guard
│   │   │   └── page.tsx                       # Bookings and payment history
│   │   └── technician/
│   │       ├── bookings/page.tsx              # Incoming booking management
│   │       ├── profile/page.tsx               # Technician profile editor
│   │       ├── services/
│   │       │   ├── new/page.tsx               # New-service form
│   │       │   └── page.tsx                   # Technician service list
│   │       ├── layout.tsx                     # Technician role guard
│   │       └── page.tsx                       # Technician overview
│   ├── payment/
│   │   ├── cancel/page.tsx                    # Cancelled payment state
│   │   └── success/page.tsx                   # Payment confirmation state
│   ├── error.tsx                              # Route error fallback
│   ├── favicon.ico
│   ├── globals.css                            # Global Tailwind styles
│   ├── layout.tsx                             # Root layout and navigation
│   ├── not-found.tsx                          # 404 page
│   ├── page.tsx                               # Home page
│   └── providers.tsx                          # React Query and session initialization
├── components/
│   ├── features/
│   │   ├── admin/CategoryDialog.tsx
│   │   ├── booking/{StatusBadge,TimeSlotPicker}.tsx
│   │   ├── payment/{CheckoutForm,StripeProvider}.tsx
│   │   ├── review/StarRating.tsx
│   │   ├── service/{ServiceCard,ServiceCardSkeleton,Services}.tsx
│   │   └── technician/
│   │       ├── availability/page.tsx
│   │       ├── AvailabilityForm.tsx
│   │       └── BookingActions.tsx
│   ├── shared/{Navbar,RoleGuard}.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── sonner.tsx
│       ├── table.tsx
│       └── textarea.tsx                      # Reusable shadcn/UI primitives
├── hooks/
│   ├── useAdmin.ts                           # Admin queries and mutations
│   ├── useBookings.ts                        # Customer booking queries and mutations
│   ├── usePayments.ts                        # Payment history query
│   ├── useServices.ts                        # Service and category queries
│   ├── useTechnician.ts                      # Public technician queries
│   └── useTechnicianDashboard.ts             # Technician dashboard operations
├── lib/
│   ├── api/
│   │   ├── admin.ts                          # Admin endpoint wrappers
│   │   ├── auth.ts                           # Authentication endpoint wrappers
│   │   ├── bookings.ts                       # Booking endpoint wrappers
│   │   ├── fetcher.ts                        # Shared HTTP client and ApiError
│   │   ├── payment.ts                        # Stripe payment endpoint wrappers
│   │   ├── reviews.ts                        # Review endpoint wrapper
│   │   ├── services.ts                       # Service and public category endpoints
│   │   ├── technician.ts                     # Technician dashboard endpoints
│   │   └── technicians.ts                    # Public technician endpoints
│   ├── auth/token.ts                         # Browser cookie token helpers
│   ├── validators/auth.ts                    # Zod authentication schemas
│   └── utils.ts                              # Shared utility functions
├── store/
│   └── authStore.ts                          # Zustand authentication store
├── public/                                   # Static public assets (currently empty)
├── .env                                      # Local environment variables (not committed)
├── .gitignore                                # Git ignore rules
├── API_INTEGRATION.md                        # Frontend-to-backend endpoint map
├── components.json                           # shadcn/ui configuration
├── eslint.config.mjs                         # ESLint configuration
├── middleware.ts                             # Dashboard JWT and role verification
├── next.config.ts                            # Next.js configuration
├── package.json                              # Scripts and dependencies
├── package-lock.json                         # Locked dependency versions
├── postcss.config.mjs                        # PostCSS/Tailwind configuration
├── README.md                                 # Project documentation
└── tsconfig.json                             # TypeScript configuration
```

Generated folders such as `node_modules/` and `.next/` are intentionally
excluded from this tree.

### Data and authentication flow

1. `lib/api/fetcher.ts` builds requests from `NEXT_PUBLIC_API_URL`.
2. When a session token exists, it sends `Authorization: Bearer <token>`.
3. `app/providers.tsx` restores the session with `GET /auth/me` and provides
   React Query plus global toast notifications.
4. `middleware.ts` checks dashboard access before a protected page loads, while
   `RoleGuard` verifies the current role client-side.
5. React Query caches server data, refreshes lists after mutations, and uses
   optimistic UI updates for technician booking-status and admin user-status
   changes.

## API integration

The endpoint-to-component mapping is maintained in
[API_INTEGRATION.md](./API_INTEGRATION.md). It documents public,
authentication, customer, technician, and admin API calls, plus the shared
Stripe payment flow.

## Booking statuses

```text
REQUESTED -> ACCEPTED -> PAID -> IN_PROGRESS -> COMPLETED
     |           |
     |           +-> CANCELLED
     +-> DECLINED
     +-> CANCELLED
```

The UI only exposes actions that match the current state: technicians can
accept or decline requested work, start paid work, and complete work in
progress; customers can pay accepted bookings and review completed bookings.

## Troubleshooting

| Problem | Check |
| --- | --- |
| Services or dashboards cannot load | Confirm `NEXT_PUBLIC_API_URL`, start the backend, and verify its CORS configuration allows the frontend origin. |
| Redirected to login from a dashboard | Sign in again and confirm `JWT_SECRET` matches the backend token-signing secret in the current environment. |
| Payment page says it is unavailable | Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and use a valid Stripe test key in local development. |
| Payment cannot be created or confirmed | Verify the backend payment endpoints and Stripe credentials are configured, and use an accepted booking. |
| Build or lint failure | Run `npm ci`, then run `npm run lint` or `npm run build` again to view the exact error. |

## Client review checklist

- Verify the public service search and filters.
- Review the interface at desktop and mobile widths.
- Use separate customer, technician, and admin accounts to verify each portal.
- Confirm booking status changes appear promptly after an action.
- Test a Stripe test-mode payment only with backend-provided test credentials.
- Review the API mapping in [API_INTEGRATION.md](./API_INTEGRATION.md).
