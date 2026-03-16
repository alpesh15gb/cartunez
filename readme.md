Create a production-ready headless ecommerce storefront for a car accessories brand called "Cartunez".



The website domain will be cartunez.in and it will be hosted on a Linux server using Docker containers with host-level Nginx as reverse proxy.



The store must be mobile-first and responsive because most users will come from mobile devices.



Architecture



Build a headless ecommerce architecture with the following stack:



Backend



Medusa.js ecommerce backend



Node.js + TypeScript



PostgreSQL database



Redis for caching and background jobs



Frontend



Next.js (React) storefront



TailwindCSS for UI



Mobile-first design



Infrastructure



Docker Compose for container orchestration



Host-level Nginx reverse proxy



Domain: cartunez.in



System Structure



Create the following project structure:



cartunez/



docker-compose.yml



nginx/



medusa-backend/



storefront/



postgres-data/



redis-data/



Step 1 — Backend Setup (Medusa)



Initialize Medusa backend



Configure PostgreSQL database



Configure Redis



Enable plugins



Required Medusa features:



Product management



Categories



Inventory



Orders



Discount codes



Shipping options



Payment integration



Admin dashboard



Create product categories for car accessories:



Seat Covers



Floor Mats



Car Lighting



Car Audio



Mobile Holders



Car Cleaning



Interior Accessories



Exterior Accessories



Each product must support:



Multiple images



Variants



SKU



Stock quantity



Price



Description



Step 2 — Storefront (Next.js)



Build a modern mobile-first ecommerce storefront.



Pages required:



Home page



hero banner



featured products



categories grid



promotions



Shop page



product grid



filters



sorting



Product page



product gallery



description



price



add to cart



variant selection



Cart page



Checkout page



Order confirmation page



Account page



login



order history



Step 3 — UI Requirements



Design style:



modern automotive theme



dark / performance look



clean product grid



large mobile buttons



Use TailwindCSS.



Primary colors:



black



red accent



white text



Must be fully responsive for:



phones



tablets



desktops



Step 4 — Docker Setup



Create a Docker Compose configuration including:



services:



medusa-backend

storefront

postgres

redis



Expose ports internally.



Example structure:



medusa backend port 9000



storefront port 3000



postgres



redis



Ensure containers restart automatically.



Step 5 — Nginx Reverse Proxy (Host Level)



Configure Nginx on the host server.



Routes:



cartunez.in → Next.js storefront

cartunez.in/api → Medusa backend



Enable:



gzip



caching



SSL support



Step 6 — SEO Optimization



Implement:



product structured data



meta tags



sitemap



OpenGraph tags



Step 7 — Performance



Implement:



image optimization



lazy loading



caching



CDN readiness



Target:



Lighthouse score >90 mobile



Step 8 — Admin Operations



The system must allow admin to:



add products



update inventory



manage orders



create discount codes



upload product images



Admin panel should be accessible at:



cartunez.in/admin



Step 9 — Security



Implement:



rate limiting



CORS protection



secure cookies



HTTPS support



Step 10 — Deployment



Provide full instructions for:



Server preparation



Docker installation



Project setup



Running docker-compose



Nginx configuration



SSL setup



The final system must run with:



docker compose up -d



and be production ready.

