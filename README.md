# ⚽ Matchday - Soccer League Organizer

A modern web application for managing soccer leagues, teams, players, matches, and standings. Built with Next.js 14, shadcn/ui, and Drizzle ORM.

## 🚀 Features

### League Management
- **League Operations**: Create and manage multiple leagues with seasons
- **Group/Division Management**: Organize teams into groups or divisions
- **Team Management**: Track team details, rosters, and statistics
- **Player Tracking**: Comprehensive player profiles with statistics
- **Match Scheduling**: Schedule and manage matches with real-time updates
- **Live Standings**: Automatic calculation of league standings
- **Match Events**: Track goals, cards, substitutions, and assists

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS
- **Database**: SQLite (local) / Cloudflare D1 (production)
- **ORM**: Drizzle ORM
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 📁 Project Structure

```
matchday/
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── leagues/          # League management pages
│   │   ├── teams/            # Team management pages
│   │   ├── players/          # Player management pages
│   │   ├── matches/          # Match management pages
│   │   └── standings/        # Standings pages
│   ├── api/                  # API routes
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── db/
│   ├── schema/               # Database schema definitions
│   │   ├── leagues.ts        # Leagues & Groups
│   │   ├── teams.ts          # Teams
│   │   ├── players.ts        # Players
│   │   ├── matches.ts        # Matches
│   │   ├── match-events.ts   # Match events (goals, cards, etc.)
│   │   ├── standings.ts      # Standings
│   │   └── index.ts          # Schema exports
│   ├── migrations/           # Database migrations
│   └── client.ts             # Database client
├── lib/
│   ├── actions/              # Server actions
│   ├── queries/              # Database queries
│   ├── validations/          # Zod schemas
│   └── utils.ts              # Utility functions
├── hooks/                    # Custom React hooks
└── types/                    # TypeScript type definitions
```

## 📊 Data Model

### Core Entities

#### League
- Manages multiple seasons
- Contains groups/divisions
- Tracks league-wide statistics

#### Group/Division
- Organizes teams within a league
- Maintains group-specific standings

#### Team
- Team details (name, logo, colors, home field)
- Links to players and coach
- Part of a group/division

#### Player
- Personal information
- Position and statistics
- Team association
- Status tracking (active, injured, suspended)

#### Match
- Home and away teams
- Venue and schedule
- Match status and scores
- Links to match events

#### Match Event
- Goals (regular, penalty, own goal)
- Cards (yellow, red)
- Substitutions
- Assists tracking

#### Standings
- Automatically calculated from match results
- Tracks: played, won, drawn, lost
- Goals for/against, goal difference
- Points and form

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd matchday
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Generate database migrations**
   ```bash
   npm run db:generate
   ```

5. **Push schema to database**
   ```bash
   npm run db:push
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Commands

```bash
# Generate migrations from schema
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## 🌐 Deployment

### Cloudflare Pages + D1

This project is optimized for Cloudflare deployment:

1. **Create a D1 database**
   ```bash
   npx wrangler d1 create matchday-db
   ```

2. **Update wrangler.toml** (create if needed)
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "matchday-db"
   database_id = "your-database-id"
   ```

3. **Deploy to Cloudflare Pages**
   ```bash
   npm run build
   npx wrangler pages deploy ./out
   ```

### Alternative Deployments

The project uses Drizzle ORM which supports multiple databases:
- PostgreSQL (Vercel, Railway, Supabase)
- MySQL (PlanetScale)
- SQLite (Turso)

Simply update the `db/client.ts` and `drizzle.config.ts` accordingly.

## 📈 Access Patterns

The database schema is optimized for common queries:

1. **League Standings by Group**
   - Get all teams with statistics
   - Sorted by points, goal difference

2. **Team Profile**
   - Team details with players
   - Recent match history

3. **Match Details**
   - Teams, scores, events
   - Player statistics

4. **Player Statistics**
   - Goals, assists, cards
   - Match participation

5. **Fixture Schedule**
   - Upcoming/past matches
   - Filtered by team, date, group

## 🎨 UI Components (shadcn/ui)

To add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add table
# etc.
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Cloudflare](https://www.cloudflare.com/)
