# Social Media Application

A production-ready social media platform built with Next.js 14+, featuring real-time interactions, user authentication, and a modern responsive UI.

## 🚀 Features

### Authentication
- ✅ Email/Password registration and login
- ✅ OAuth support (GitHub, Google)
- ✅ JWT-based session management
- ✅ Protected routes with middleware
- ✅ Password hashing with bcrypt

### User Profiles
- ✅ Customizable profile (avatar, bio, name)
- ✅ Public profile viewing
- ✅ Profile editing
- ✅ Follower/Following counts

### Posts
- ✅ Create posts with text and images
- ✅ Delete own posts
- ✅ Image upload via UploadThing
- ✅ Post feed with infinite scroll

### Social Features
- ✅ Like/Unlike posts
- ✅ Comment on posts
- ✅ Follow/Unfollow users
- ✅ Following feed (posts from followed users)
- ✅ Explore feed (all posts)

### Notifications
- ✅ Like notifications
- ✅ Comment notifications
- ✅ Follow notifications
- ✅ Mark as read functionality

### UI/UX
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Dark mode support
- ✅ Loading states and skeletons
- ✅ Optimistic UI updates
- ✅ Error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **File Upload**: UploadThing
- **Validation**: Zod
- **Icons**: Lucide React

## 📁 Project Structure

```
web/
├── app/                    # Next.js App Router
│   ├── (main)/            # Authenticated routes
│   │   ├── feed/          # Main feed page
│   │   ├── profile/       # User profiles
│   │   ├── post/          # Single post view
│   │   ├── notifications/ # Notifications page
│   │   ├── settings/      # User settings
│   │   ├── explore/       # Explore page
│   │   └── create/        # Create post page
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth handlers
│   │   └── uploadthing/   # File upload handlers
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── error.tsx          # Error boundary
│   ├── loading.tsx        # Loading state
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── avatar.tsx
│   │   ├── card.tsx
│   │   └── skeleton.tsx
│   ├── features/          # Feature components
│   │   ├── post-card.tsx
│   │   ├── post-feed.tsx
│   │   ├── create-post-form.tsx
│   │   ├── comment-section.tsx
│   │   ├── follow-button.tsx
│   │   └── tabs.tsx
│   └── layout/            # Layout components
│       ├── navbar.tsx
│       └── sidebar.tsx
├── actions/               # Server Actions
│   ├── auth.ts           # Authentication actions
│   ├── posts.ts          # Post actions
│   ├── comments.ts       # Comment actions
│   ├── follows.ts        # Follow actions
│   ├── users.ts          # User actions
│   └── notifications.ts  # Notification actions
├── lib/                   # Utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── validations.ts    # Zod schemas
│   ├── utils.ts          # Helper functions
│   └── uploadthing.ts    # UploadThing client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── types/
│   └── next-auth.d.ts    # Type declarations
├── middleware.ts          # Route protection
└── .env.example          # Environment template
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- UploadThing account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/social_media_db"
   
   # NextAuth
   AUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth (optional)
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   
   # UploadThing
   UPLOADTHING_TOKEN=""
   ```

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

5. **Push database schema**
   ```bash
   npm run db:push
   ```

6. **Seed the database (optional)**
   ```bash
   npm run db:seed
   ```
   
   This creates test accounts:
   - Email: `john@example.com` | Password: `password123`
   - Email: `jane@example.com` | Password: `password123`
   - Email: `bob@example.com` | Password: `password123`

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000)

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes to database
npm run db:push

# Run migrations (production)
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

## 🔐 Authentication

The application uses NextAuth.js v5 with the following providers:

- **Credentials**: Email/password authentication
- **GitHub**: OAuth authentication
- **Google**: OAuth authentication

### Protected Routes

Routes are protected via middleware. The following routes require authentication:
- `/feed`
- `/notifications`
- `/settings`
- `/create`

Public routes:
- `/` (landing page)
- `/explore`
- `/profile/[username]`
- `/auth/*`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎨 Customization

### Theming

The application uses Tailwind CSS with a custom color palette. Modify `tailwind.config.ts` to customize:

```ts
theme: {
  extend: {
    colors: {
      primary: {...},
      secondary: {...},
    },
  },
}
```

### Components

All UI components are in `components/ui/` and can be customized or extended as needed.

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | No |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | No |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `UPLOADTHING_TOKEN` | UploadThing API token | Yes |

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the repository.
