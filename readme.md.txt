You are a senior product engineer + solution architect. 
Build a full-fledged ecommerce website for my car accessories business “Car Tunez”.

GOALS:
- Modern, fast, mobile-first storefront
- Full admin portal to upload/edit stock items (products, price, images, inventory)
- Vehicle compatibility shopping (Make→Model→Year/Variant) + fitment checks
- India-ready payments (Razorpay) + COD rules + shipping integrations (Shiprocket/Delhivery)
- SEO optimized, scalable, Docker deployable

REFERENCE PATTERNS (do not copy UI, copy features):
- Amazon/Flipkart style category browsing + filters + sorting
- Shopify-style checkout simplicity
- Car accessory sites: shop by car model, fitment notes, installation add-on

TECH STACK (use this unless you have a better reason):
Frontend: Next.js (App Router) + TypeScript + Tailwind
Backend: MedusaJS v2 (or equivalent open-source commerce) + PostgreSQL + Redis
Search: Meilisearch
Storage: S3-compatible for images
Payments: Razorpay
Shipping: Shiprocket integration
Auth: OTP-based login + email optional
Infra: Docker Compose + Nginx reverse proxy
Monitoring: Sentry

DELIVERABLES:
1) PRD: User personas, user journeys, and complete feature list
2) Data model: tables/entities for products, variants, inventory, vehicle fitment mapping, orders, coupons, users/roles
3) System architecture diagram description: frontend, backend, DB, search, cache, storage
4) API contract: key endpoints (products, search, cart, checkout, orders, fitment)
5) UI pages list (Storefront + Admin) with components per page
6) Admin portal spec: bulk CSV upload template + validation rules + audit logs
7) Security checklist
8) Performance checklist: caching, image optimization, pagination, search tuning
9) Docker setup: docker-compose.yml outline for all services + env variables list
10) Implementation plan: milestones for 2-week sprints (MVP → v1 → v2)

STORE FEATURES TO INCLUDE:
- Home: banners, featured categories, best sellers, deals, shop by car brand
- Category listing with filters: price, brand, rating, vehicle compatibility, stock, discount
- Search with autocomplete and typo tolerance
- Product detail: gallery, fitment checker, pincode delivery estimate, reviews, FAQs, installation option add-on
- Cart: coupons, shipping estimate, COD eligibility
- Checkout: guest + login, address book, GST invoice fields, Razorpay + COD rules
- Account: order tracking, invoices, returns/replacements, wishlist, saved vehicles (“My Garage”)
- Admin: products, inventory, orders, promotions, CMS pages, users/roles, reports

ADMIN/INVENTORY REQUIREMENTS:
- Create/edit products with variants
- Bulk import via CSV: products + inventory + fitment mapping
- Bulk image upload and assignment
- Low stock alerts
- Order management: status flow (placed→confirmed→packed→shipped→delivered), refunds, returns
- Audit log of all price/stock changes

OUTPUT FORMAT:
- Use headings, checklists, and clear structured tables where useful.
- Be specific and production-oriented, not generic.
