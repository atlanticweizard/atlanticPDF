(THE PROJECT DOES NOT MEANT TO BE DEPLOYED OR CONFIGURE FOR REPLIT, THE PROJECT WILL BE HOSTED OR DEPLOYED ON CUSTOM EC2 UBUNTU SERVER. MAKE SURE TO ANALYSE AND CONFIGURE THE PROJECT AS PER EC2 AS THERE ARE COMPONENTS WHICH STILL CARRY THE REPLIT DEPLOY METHOD REMOVE IT AND MAKE SURE THE PROJECT CAN BE EASILY DEPLOYED ON EC2 SERVER.)


# Atlantic Weizard - Digital Products Marketplace

**A full-stack e-commerce platform for selling digital products and online courses.**

Complete documentation for development, deployment, and operation.

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [System Architecture](#system-architecture)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Development](#development)
10. [Deployment Guide](#deployment-guide)
11. [Configuration](#configuration)
12. [Security](#security)
13. [Troubleshooting](#troubleshooting)
14. [Development Notes](#development-notes)

---

## Overview

Atlantic Weizard is a modern, production-ready digital products marketplace built with React, TypeScript, Express.js, and PostgreSQL. The platform enables customers to browse and purchase premium digital products (PDFs, guides, templates) and online courses with instant access after payment.

### Key Highlights

- **Digital Products**: PDFs, guides, templates with instant downloads
- **Online Courses**: Multi-module courses with video, PDF, and text content
- **Secure Downloads**: HMAC-signed download tokens with automatic expiration
- **Lifetime Access**: Users retain permanent access to purchased content via dashboard
- **PayU Integration**: Support for all major payment methods in India
- **User Accounts**: Optional registration with purchase history and dashboard
- **Admin Panel**: Complete product, course, and order management
- **Responsive Design**: Mobile-first UI with dark/light theme support

### Current Catalog (November 28, 2025)

**PDF Products**:
- Business Growth Mastery Guide - $49
- Digital Marketing Blueprint - $39
- Productivity Power System - $29
- Financial Freedom Roadmap - $59

**Online Courses**:
- Complete Web Development Bootcamp - $199
- Python Programming Masterclass - $149
- Leadership & Management Excellence - $129

---

## Quick Start

### Prerequisites

- **Node.js**: 20.x or higher
- **PostgreSQL**: 14 or higher (required - enforced at startup)
- **Git**: For cloning repository
- **PayU Account**: For payment processing (TEST credentials provided)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/atlantic-weizard.git
cd atlantic-weizard

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env  # or create from template below
nano .env

# 4. Create database and tables
npm run db:push

# 5. Seed initial data (4 PDFs + 3 courses)
npm run db:seed

# 6. Start development server
npm run dev
```

**Access the application:**
- **Website**: http://localhost:5000
- **Admin Panel**: http://localhost:5000/admin
  - Email: `admin@atlantic.com`
  - Password: `admin123` (⚠️ change immediately)

---

## Technology Stack

### Frontend
- **React** 18 with TypeScript and Vite bundler
- **Tailwind CSS** with shadcn/ui component library (Radix UI primitives)
- **TanStack Query** (React Query) for server state management
- **React Hook Form** with Zod validation
- **Wouter** lightweight routing
- **Custom theming** with CSS variables for dark/light mode support

### Backend
- **Express.js** with TypeScript
- **Node.js** runtime
- **Drizzle ORM** with type-safe queries
- **Passport.js** authentication with scrypt password hashing
- **Express-session** with PostgreSQL-backed storage

### Database
- **PostgreSQL** (required - no fallback)
- **Neon serverless** driver with WebSocket support
- **Drizzle migrations** for schema management

### Payment & Email
- **PayU Payment Gateway** (India-focused, supports Cards, UPI, Net Banking, Wallets)
- **Resend Email Service** (optional, gracefully degrades)

---

## Features

### User Features
1. **Product Catalog**: Browse and filter digital products by type (PDF/Course)
2. **Shopping Cart**: Add/remove products with real-time updates
3. **Secure Checkout**: Simple contact form + PayU payment
4. **User Dashboard**: Access all purchased products and courses
5. **Course Viewer**: Stream modules with sidebar navigation
6. **Secure Downloads**: HMAC-signed tokens with 1-hour expiration
7. **User Accounts**: Optional registration with purchase history
8. **Responsive Design**: Works perfectly on mobile, tablet, desktop

### Admin Features
1. **Product Management**: Create, edit, delete products
2. **Product Types**: Select PDF or Course during creation
3. **Course Management**: Auto-create courses when selecting type
4. **Module Management**: Add video, PDF, or text modules
5. **Order Management**: View all orders with payment status
6. **Payment Verification**: PayU hash verification and validation

### Payment & Access
1. **PayU Integration**: Working in TEST mode (default) and LIVE mode
2. **Secure Download Tokens**: HMAC-SHA256 signed, 1-hour expiry
3. **Auto Access Granting**: Access auto-granted on successful payment
4. **Guest Checkout**: Users don't need accounts to purchase
5. **User Purchases**: Authenticated users see purchase history

---

## Project Structure

```
atlantic-weizard/
├── client/                      # React frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── components/         # UI components (navbar, cart, product-grid)
│   │   │   └── ui/            # shadcn/ui component library
│   │   ├── pages/              # Page components (home, shop, checkout, dashboard, course)
│   │   ├── hooks/              # Custom hooks (useAuth, useCart, useToast)
│   │   ├── lib/                # Utilities (cart context, theme, query client)
│   │   └── index.css           # Global styles
│   ├── public/
│   │   ├── assets/products/   # Product images (PDFs and courses)
│   │   └── favicon.png
│   └── index.html
├── server/                      # Express backend (TypeScript)
│   ├── index.ts                # Server entry point
│   ├── routes.ts               # API endpoints
│   ├── storage.ts              # Storage interface
│   ├── storage-pg.ts           # PostgreSQL implementation
│   ├── auth.ts                 # Authentication middleware
│   ├── payu.ts                 # PayU payment gateway
│   ├── email.ts                # Resend email service
│   ├── db.ts                   # Database connection
│   ├── vite.ts                 # Vite development setup
│   └── seed.ts                 # Database seeding script
├── shared/
│   └── schema.ts               # Drizzle ORM database schema
├── README.md                    # This file
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── drizzle.config.ts           # Drizzle ORM configuration
├── ecosystem.config.cjs        # PM2 process manager configuration
└── .gitignore
```

---

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite bundler

**UI System**: Tailwind CSS with shadcn/ui component library
- Custom theming with CSS variables for dark/light mode support
- Professional brand aesthetic with Playfair Display serif font for headings
- Responsive design with mobile-first approach

**State Management**:
- TanStack Query (React Query) for server state caching
- React Context API for cart state and authentication
- LocalStorage persistence for shopping cart items

**Key Design Patterns**:
- Context providers for cross-cutting concerns (cart, auth, theme)
- Custom hooks for encapsulating business logic
- Component composition with shadcn/ui patterns
- Optimistic UI updates with React Query mutations

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Design**: RESTful API with JSON payloads
- `/api/products` - Product catalog operations
- `/api/courses/:productId/modules` - Course module management
- `/api/orders` - Order creation and retrieval
- `/api/user` - Authentication and user management
- `/api/user/purchases` - User's purchased products
- `/api/user/access/:productId` - Check user access
- `/api/download/:token` - Secure download with token verification
- `/api/payment/*` - Payment processing endpoints

**Session Management**: Express-session with PostgreSQL-backed session store
- Cookie-based sessions with 30-day expiration
- Trust proxy configuration for deployment behind reverse proxies

**Authentication**: Passport.js with LocalStrategy
- Scrypt-based password hashing with random salts
- Optional authentication (guests can checkout without accounts)

**Data Access**: Drizzle ORM for type-safe database operations
- Schema-first approach with shared TypeScript types
- Neon serverless PostgreSQL driver with WebSocket support

**Secure Downloads**: 
- HMAC-SHA256 signed download tokens with expiration
- Token-based access verification for PDF downloads

### Database Schema

**PostgreSQL Database** (required - enforced at startup)

**Tables**:
| Table | Purpose |
|-------|---------|
| `products` | Product catalog (id, name, description, price, category, image, type: pdf\|course, fileUrl) |
| `courses` | Course records linked to products (id, productId, createdAt) |
| `course_modules` | Course content (id, courseId, title, description, type: video\|pdf\|text, contentUrl, textContent, orderIndex) |
| `users` | Customer accounts (id, username, password, email) |
| `orders` | Purchase orders with customer info and payment status |
| `user_access` | Tracks product ownership (userId, productId, orderId, grantedAt) |
| `admins` | Admin accounts (id, email, password) |
| `session` | Express session storage (auto-created by connect-pg-simple) |

**Design Decisions**:
- JSONB columns for flexible nested data (customer info, cart items, PayU responses)
- UUID primary keys for products, orders, courses, modules
- Auto-incrementing integer IDs for users
- Decimal type for monetary values to prevent floating-point errors

### Payment Integration

**PayU Payment Gateway** (India-focused)

**Implementation**:
- Server-side hash generation using merchant key and salt
- Redirect-based payment flow (user redirected to PayU, returns via callback)
- Hash verification on payment response to prevent tampering
- Support for multiple payment methods (Cards, UPI, Net Banking, Wallets, EMI)

**Payment Flow**:
1. Order created with "pending" status
2. Payment form generated with hash
3. User redirected to PayU
4. PayU processes payment and redirects back
5. Server verifies hash and updates order status
6. User access granted to purchased products
7. User redirected to success/failure page

**Security**: 
- Transaction IDs generated server-side
- Hash-based request signing
- Response verification prevents tampering
- Secure download tokens with HMAC signatures

---

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Courses & Modules
- `GET /api/courses/:productId/modules` - Get course modules
- `POST /api/courses/:productId/modules` - Create module (admin)
- `PUT /api/modules/:id` - Update module (admin)
- `DELETE /api/modules/:id` - Delete module (admin)

### Downloads
- `GET /api/download/:token` - Download PDF with token verification

### Orders & Payments
- `POST /api/payment/initiate` - Initiate payment
- `POST /api/payment/success` - PayU success callback
- `POST /api/payment/failure` - PayU failure callback
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/my` - Get user's orders (authenticated)

### User Purchases
- `GET /api/user/purchases` - Get user's purchased products
- `GET /api/user/access/:productId` - Check if user has access

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user info
- `POST /api/admin/login` - Admin login

---

## Database Schema

### Products Table
```typescript
{
  id: varchar (UUID, primary key)
  name: text
  description: text
  price: decimal(10, 2)
  category: text
  image: text (URL to product image)
  type: text ('pdf' | 'course')
  fileUrl: text (optional, for PDF files)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Courses Table
```typescript
{
  id: varchar (UUID, primary key)
  productId: varchar (foreign key to products)
  createdAt: timestamp
}
```

### Course Modules Table
```typescript
{
  id: varchar (UUID, primary key)
  courseId: varchar (foreign key to courses)
  title: text
  description: text
  type: text ('video' | 'pdf' | 'text')
  contentUrl: text (URL to video or PDF)
  textContent: text (for text type modules)
  orderIndex: integer (module order)
  createdAt: timestamp
}
```

### Users Table
```typescript
{
  id: integer (serial, primary key)
  username: text (unique)
  password: text (hashed with scrypt)
  email: text (unique)
  createdAt: timestamp
}
```

### Orders Table
```typescript
{
  id: varchar (UUID, primary key)
  customerInfo: jsonb {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  items: jsonb [
    { product: {...}, quantity: 1 }
  ]
  total: decimal(10, 2)
  paymentStatus: text ('pending' | 'success' | 'failure')
  paymentResponse: jsonb (PayU response data)
  transactionId: text (unique)
  createdAt: timestamp
}
```

### User Access Table
```typescript
{
  id: integer (serial, primary key)
  userId: integer (foreign key to users, nullable for guests)
  productId: varchar (foreign key to products)
  orderId: varchar (foreign key to orders)
  grantedAt: timestamp
}
```

---

## Development

### Commands

```bash
# Start development server with hot reload
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push      # Sync schema with database
npm run db:seed      # Seed initial data
npm run db:setup     # Push + seed (both)
```

### Development Workflow

1. **Start dev server**: `npm run dev`
   - Frontend hot reload via Vite
   - Backend auto-restart via tsx
   - Both on port 5000

2. **Make changes**: Edit files in `client/src/` or `server/`
   - Frontend changes reflect immediately
   - Backend changes require manual restart (or add file watcher)

3. **Test locally**: Visit http://localhost:5000
   - Admin panel at http://localhost:5000/admin
   - API endpoints at http://localhost:5000/api/*

4. **Build for production**: `npm run build`
   - Creates `dist/public/` (frontend)
   - Creates `dist/index.js` (backend bundle)

### Adding Features

**Example: Add a new product via admin**
1. Visit http://localhost:5000/admin
2. Click "Add Product"
3. Fill in product details
4. Select type (PDF or Course)
5. For courses, add modules after creation
6. Click Save

**Example: Add course modules**
1. Visit http://localhost:5000/admin
2. Select a course product
3. Click "Add Module"
4. Enter module details (title, type, content URL)
5. Click Save

---

## Deployment Guide

### Prerequisites

**Required Software**
- **Linux Server**: Ubuntu 22.04 LTS or similar (CentOS, Debian)
- **Node.js**: Version 20.x or higher
- **PostgreSQL**: Version 14 or higher
- **Git**: For cloning repository
- **Nginx**: For reverse proxy (recommended)
- **Domain Name**: Configured DNS pointing to your server

**Required Accounts**
- **PayU Account**: For payment gateway (https://payu.in)
- **Resend Account**: For email service (https://resend.com) - optional

**Server Resources (Minimum)**
- **CPU**: 2 cores
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB available
- **Network**: Public IP address, ports 80/443/5000 accessible

### Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git build-essential

# Configure firewall (UFW on Ubuntu)
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 5000    # Node.js app (temporary - will proxy via Nginx)
sudo ufw enable

# Create application user (optional but recommended)
sudo adduser atlantic --disabled-password --gecos ""
sudo usermod -aG sudo atlantic
sudo su - atlantic
```

### Install Node.js

```bash
# Add NodeSource repository for Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs

# Verify installation
node --version   # Should show v20.x.x
npm --version    # Should show 10.x.x
```

### Clone and Install

```bash
cd ~

# Clone the repository
git clone https://github.com/yourusername/atlantic-weizard.git
cd atlantic-weizard

# Install dependencies
npm install
```

### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql <<EOF
CREATE DATABASE atlantic_weizard;
CREATE USER atlantic_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE atlantic_weizard TO atlantic_user;
\c atlantic_weizard
GRANT ALL ON SCHEMA public TO atlantic_user;
\q
EOF

# Test connection
psql -U atlantic_user -d atlantic_weizard -h localhost
```

### Environment Configuration

```bash
cd ~/atlantic-weizard

# Create .env file
cat > .env << 'EOF'
# Database (REQUIRED)
DATABASE_URL=postgresql://atlantic_user:your_secure_password_here@localhost:5432/atlantic_weizard

# PayU Payment Gateway (REQUIRED)
# Use TEST credentials for development
PAYU_MERCHANT_KEY=cLHbnq
PAYU_MERCHANT_SALT=gAATiDecGQBQbSmQnl2yViES9dsEI050
PAYU_MODE=TEST

# Switch to LIVE for production (get credentials from PayU dashboard)
# PAYU_MERCHANT_KEY=your_live_merchant_key
# PAYU_MERCHANT_SALT=your_live_merchant_salt
# PAYU_MODE=LIVE

# Email Service (OPTIONAL)
# RESEND_API_KEY=re_your_api_key_here
# EMAIL_FROM=noreply@yourdomain.com

# Session & Security
SESSION_SECRET=$(openssl rand -base64 32)

# Application
NODE_ENV=production
PORT=5000
EOF

# Set proper permissions
chmod 600 .env
```

### Database Initialization

```bash
# Push database schema
npm run db:push

# Seed initial data
npm run db:seed

# Verify
psql -U atlantic_user -d atlantic_weizard -h localhost
```

### Build for Production

```bash
npm run build

# Expected output:
# vite v5.x.x building for production...
# ✓ built in 15s
# Build complete!
```

### Process Management (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start npm --name "atlantic-weizard" -- start

# Configure auto-start on boot
pm2 save
pm2 startup

# Useful commands
pm2 status                          # Check status
pm2 logs atlantic-weizard           # View logs
pm2 logs atlantic-weizard --lines 100  # Last 100 lines
pm2 restart atlantic-weizard        # Restart app
pm2 stop atlantic-weizard          # Stop app
pm2 delete atlantic-weizard        # Remove from PM2
```

### Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create configuration
sudo tee /etc/nginx/sites-available/atlantic-weizard > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    access_log /var/log/nginx/atlantic-weizard.access.log;
    error_log /var/log/nginx/atlantic-weizard.error.log;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/atlantic-weizard /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot automatically configures Nginx for HTTPS
# Certificates auto-renew via systemd timer
```

### Domain Configuration

```bash
# Get your server's public IP
curl ifconfig.me

# Add these DNS records at your DNS provider:
# Type: A, Name: @, Value: YOUR_SERVER_IP
# Type: A, Name: www, Value: YOUR_SERVER_IP

# Wait for DNS propagation (5-30 minutes)
nslookup yourdomain.com
```

---

## Configuration

### Environment Variables

**Required**:
- `DATABASE_URL` - PostgreSQL connection string
- `PAYU_MERCHANT_KEY` - PayU merchant key (TEST or LIVE)
- `PAYU_MERCHANT_SALT` - PayU merchant salt (TEST or LIVE)
- `PAYU_MODE` - TEST or LIVE
- `SESSION_SECRET` - Random session encryption key (generate with `openssl rand -hex 32`)

**Optional**:
- `RESEND_API_KEY` - Resend API key for emails
- `EMAIL_FROM` - Sender email address
- `NODE_ENV` - development or production
- `PORT` - Application port (default: 5000)

**Example .env file:**
```env
DATABASE_URL=postgresql://atlantic_user:password@localhost:5432/atlantic_weizard
PAYU_MERCHANT_KEY=cLHbnq
PAYU_MERCHANT_SALT=gAATiDecGQBQbSmQnl2yViES9dsEI050
PAYU_MODE=TEST
SESSION_SECRET=8f3a9c2e1d7b4f6a8c9e0d1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a
NODE_ENV=production
PORT=5000
```

### PayU Configuration

**Getting TEST Credentials** (for development):
- Already provided in default .env
- `PAYU_MERCHANT_KEY`: `cLHbnq`
- `PAYU_MERCHANT_SALT`: `gAATiDecGQBQbSmQnl2yViES9dsEI050`
- `PAYU_MODE`: `TEST`
- No real charges

**Getting LIVE Credentials** (for production):
1. Sign up at https://payu.in
2. Complete business verification
3. Navigate to Settings → API Keys
4. Copy Merchant Key and Merchant Salt
5. Update .env with LIVE credentials
6. Set `PAYU_MODE=LIVE`

### Resend Email Configuration

**Setup** (optional but recommended):
1. Sign up at https://resend.com
2. Verify your domain
3. Create API key (starts with `re_`)
4. Add to `.env`:
   - `RESEND_API_KEY=re_your_api_key`
   - `EMAIL_FROM=noreply@yourdomain.com`

**Graceful Degradation**: If not configured, emails are skipped but app continues working.

---

## Security

### Critical Security Reminders

1. **Change default admin password immediately**
   - Default: `admin@atlantic.com` / `admin123`
   - Change in admin panel before production

2. **Generate strong session secret**
   ```bash
   openssl rand -base64 32
   ```

3. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Use environment variables in production

4. **Use HTTPS in production**
   - Configure SSL certificate (Let's Encrypt free)
   - Redirect HTTP to HTTPS

5. **Secure download tokens**
   - HMAC-SHA256 signed
   - 1-hour automatic expiration
   - Token-based access verification

6. **Password security**
   - Scrypt-based hashing with salt
   - No plaintext passwords stored

7. **Keep credentials secure**
   - Don't share `.env` file
   - Rotate PayU credentials regularly
   - Use secrets management in production

### Security Best Practices

- **Database**: Only accessible from application server
- **Session storage**: In PostgreSQL (secure by default)
- **Payment**: Server-side hash generation and verification
- **Downloads**: Time-limited tokens for PDF access
- **Authentication**: Scrypt password hashing with random salts
- **API**: RESTful endpoints with proper HTTP status codes
- **CORS**: Configured for same-origin by default

---

## Troubleshooting

### Database Connection Error
```
ERROR: DATABASE_URL=postgresql://user:password@localhost:5432/atlantic_weizard
```
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `psql -l`
- Verify user permissions
- Test connection: `psql -U atlantic_user -d atlantic_weizard -h localhost`

### PayU Payment Failures
- Ensure `PAYU_MODE=TEST` for testing
- Test with provided test credentials
- Verify callback URLs are accessible
- Check PayU merchant credentials in dashboard
- Verify transaction ID is unique

### Email Service Not Sending
- Email service is optional and gracefully degrades
- Verify `RESEND_API_KEY` is correct
- Ensure domain is verified in Resend dashboard
- Check `EMAIL_FROM` matches verified domain
- Look for warnings in logs

### Application Won't Start
```bash
npm run build      # Rebuild
npm start          # Check logs for errors
pm2 logs           # If using PM2
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Schema Out of Sync
```bash
npm run db:push --force
npm run db:seed
```

### 401 Unauthorized on `/api/user`
- **Expected behavior**: Guest users see 401 (not logged in)
- Application handles gracefully
- Not an error

---

## Development Notes

### Project Status (November 28, 2025)

**Completed Work:**
- ✅ Converted from luxury clothing to digital products marketplace
- ✅ Implemented PDF downloads and online courses
- ✅ Added course modules with video/PDF/text content
- ✅ Implemented user purchase dashboard
- ✅ Added course viewer with module navigation
- ✅ Implemented secure downloads with expiring tokens
- ✅ Set up PayU payment integration
- ✅ Created admin panel for product/course management
- ✅ Seeded 4 PDF products and 3 online courses

**What Changed:**
- Database schema updated with courses and user_access tables
- All clothing product images replaced with digital product images
- Frontend updated with digital products messaging
- Backend endpoints added for courses and modules
- Admin panel updated to support product types

**Future Enhancements:**
1. Course progress tracking
2. Advanced search and filtering
3. User reviews and ratings
4. Better email templates and certificates
5. Analytics dashboard with sales tracking
6. Video streaming optimization (CDN)
7. Wishlist/favorites functionality

### Key Files

1. **`shared/schema.ts`** - Database schema using Drizzle ORM
2. **`server/routes.ts`** - All API endpoints
3. **`server/storage-pg.ts`** - Database operations
4. **`server/payu.ts`** - PayU payment gateway
5. **`server/seed.ts`** - Database seeding with initial data
6. **`client/src/pages/dashboard.tsx`** - User purchase dashboard
7. **`client/src/pages/course.tsx`** - Course viewer
8. **`vite.config.ts`** - Frontend build configuration
9. **`.env`** - Environment configuration (CRITICAL)

### Adding New Features

**Adding a new product:**
1. Visit admin panel: `/admin`
2. Click "Add Product"
3. Fill in product details
4. Select type: PDF or Course
5. Save

**For courses, add modules:**
1. Click on course in admin
2. Click "Add Module"
3. Enter module details
4. Click Save

### Common Commands

```bash
npm run dev              # Start development
npm run build           # Build for production
npm start               # Start production server
npm run db:push         # Sync database schema
npm run db:seed         # Add sample data
npm run check           # TypeScript type check
```

### Important URLs (Local Development)

```
http://localhost:5000               # Main website
http://localhost:5000/admin         # Admin panel
http://localhost:5000/shop          # Product shop
http://localhost:5000/dashboard     # User dashboard
http://localhost:5000/api/products  # API endpoint
```

### Admin Credentials

```
Email: admin@atlantic.com
Password: admin123
⚠️ CHANGE IMMEDIATELY - this is default/test only
```

---

## Support & Resources

- **PayU Documentation**: https://payu.in
- **Resend Documentation**: https://resend.com
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Drizzle ORM**: https://orm.drizzle.team
- **React Documentation**: https://react.dev
- **Express.js**: https://expressjs.com
- **TypeScript**: https://www.typescriptlang.org

---

## License

MIT

---

**Built with TypeScript, React, Express.js, and PostgreSQL** ✨

**Last Updated**: November 28, 2025  
**Project Phase**: MVP Complete - Ready for Enhancement
