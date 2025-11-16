# 📊 Data Model & Access Patterns

## Overview

This document describes the database schema, relationships, and common access patterns for the Soccer League Organizer application.

## Entity Relationship Diagram

```
League (1) ──────< (N) Group
                         │
                         │ (1)
                         │
                         ▼ (N)
                       Team ────────< (N) Player
                         │                  │
                         │                  │
                         ▼                  ▼
                       Match ──────< (N) MatchEvent
                         │
                         ▼
                    Standings
```

## Schema Details

### 1. Leagues Table

Represents a competition/tournament for a specific season.

```typescript
{
  id: integer (PK)
  name: string                    // e.g., "Premier League"
  season: string                  // e.g., "2024-25"
  description: string (nullable)
  startDate: ISO8601 date
  endDate: ISO8601 date
  status: enum                    // draft | active | completed | cancelled
  logoUrl: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes**: 
- Primary: `id`
- Composite: `(season, status)` for filtering active leagues

**Access Patterns**:
- Get all active leagues
- Get leagues by season
- Get league details with all groups

---

### 2. Groups Table

Divisions or groups within a league (e.g., "Group A", "Premier Division").

```typescript
{
  id: integer (PK)
  leagueId: integer (FK → leagues.id) CASCADE
  name: string                    // e.g., "Group A"
  description: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relationships**:
- `leagueId` → `leagues.id` (CASCADE delete)

**Indexes**:
- Primary: `id`
- Foreign: `leagueId`

**Access Patterns**:
- Get all groups in a league
- Get group details with teams

---

### 3. Teams Table

Represents a team within a group/division.

```typescript
{
  id: integer (PK)
  groupId: integer (FK → groups.id) CASCADE
  name: string
  shortName: string (nullable)    // e.g., "MUN"
  logoUrl: string (nullable)
  homeField: string (nullable)
  coachName: string (nullable)
  foundedYear: integer (nullable)
  primaryColor: string (nullable) // Hex color
  secondaryColor: string (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relationships**:
- `groupId` → `groups.id` (CASCADE delete)

**Indexes**:
- Primary: `id`
- Foreign: `groupId`
- Unique: `(groupId, name)` - no duplicate team names in same group

**Access Patterns**:
- Get all teams in a group
- Get team details with players
- Search teams by name

---

### 4. Players Table

Individual players associated with teams.

```typescript
{
  id: integer (PK)
  teamId: integer (FK → teams.id) CASCADE
  firstName: string
  lastName: string
  jerseyNumber: integer (nullable)
  position: enum                  // goalkeeper | defender | midfielder | forward
  dateOfBirth: ISO8601 date (nullable)
  nationality: string (nullable)
  photoUrl: string (nullable)
  height: integer (nullable)      // cm
  weight: integer (nullable)      // kg
  preferredFoot: enum (nullable)  // left | right | both
  status: enum                    // active | injured | suspended | inactive
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relationships**:
- `teamId` → `teams.id` (CASCADE delete)

**Indexes**:
- Primary: `id`
- Foreign: `teamId`
- Composite: `(teamId, jerseyNumber)` - unique jersey numbers per team

**Access Patterns**:
- Get all players for a team
- Get players by position
- Search players by name
- Get injured/suspended players

---

### 5. Matches Table

Scheduled or completed matches between two teams.

```typescript
{
  id: integer (PK)
  leagueId: integer (FK → leagues.id) CASCADE
  groupId: integer (FK → groups.id) SET NULL
  homeTeamId: integer (FK → teams.id) RESTRICT
  awayTeamId: integer (FK → teams.id) RESTRICT
  scheduledAt: ISO8601 datetime
  venue: string (nullable)
  matchday: integer (nullable)    // Round/Week number
  status: enum                    // scheduled | live | halftime | completed | postponed | cancelled
  homeScore: integer (default 0)
  awayScore: integer (default 0)
  homeHalfTimeScore: integer (nullable)
  awayHalfTimeScore: integer (nullable)
  attendance: integer (nullable)
  refereeId: integer (nullable)
  notes: text (nullable)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Relationships**:
- `leagueId` → `leagues.id` (CASCADE delete)
- `groupId` → `groups.id` (SET NULL)
- `homeTeamId` → `teams.id` (RESTRICT delete)
- `awayTeamId` → `teams.id` (RESTRICT delete)

**Indexes**:
- Primary: `id`
- Foreign: `leagueId`, `groupId`, `homeTeamId`, `awayTeamId`
- Composite: `(scheduledAt, status)` for fixture lists

**Access Patterns**:
- Get upcoming matches (status = scheduled, ordered by scheduledAt)
- Get matches for a team (homeTeamId OR awayTeamId)
- Get matches by matchday/round
- Get live matches
- Head-to-head records between two teams

---

### 6. Match Events Table

Events that occur during a match (goals, cards, substitutions).

```typescript
{
  id: integer (PK)
  matchId: integer (FK → matches.id) CASCADE
  playerId: integer (FK → players.id) RESTRICT
  teamId: integer (FK → teams.id) RESTRICT
  eventType: enum                 // goal | penalty_goal | own_goal | 
                                  // yellow_card | red_card | 
                                  // substitution_in | substitution_out
  minute: integer                 // Minute of match
  additionalTime: integer (default 0)  // e.g., 45+2
  assistPlayerId: integer (FK → players.id) SET NULL (nullable)
  notes: text (nullable)
  createdAt: timestamp
}
```

**Relationships**:
- `matchId` → `matches.id` (CASCADE delete)
- `playerId` → `players.id` (RESTRICT delete)
- `teamId` → `teams.id` (RESTRICT delete)
- `assistPlayerId` → `players.id` (SET NULL)

**Indexes**:
- Primary: `id`
- Foreign: `matchId`, `playerId`, `teamId`
- Composite: `(matchId, minute, additionalTime)` for timeline

**Access Patterns**:
- Get all events for a match (ordered by minute)
- Get player statistics (COUNT goals, cards by playerId)
- Get top scorers (GROUP BY playerId, COUNT where eventType = 'goal')
- Get players with cards

---

### 7. Standings Table

Calculated standings for teams within a group.

```typescript
{
  id: integer (PK)
  groupId: integer (FK → groups.id) CASCADE
  teamId: integer (FK → teams.id) CASCADE
  played: integer (default 0)
  won: integer (default 0)
  drawn: integer (default 0)
  lost: integer (default 0)
  goalsFor: integer (default 0)
  goalsAgainst: integer (default 0)
  goalDifference: integer (default 0)
  points: integer (default 0)     // typically 3 for win, 1 for draw
  form: string (nullable)         // e.g., "WWDLL" (last 5 matches)
  updatedAt: timestamp
}
```

**Relationships**:
- `groupId` → `groups.id` (CASCADE delete)
- `teamId` → `teams.id` (CASCADE delete)

**Indexes**:
- Primary: `id`
- Unique: `(groupId, teamId)`
- Composite: `(groupId, points, goalDifference, goalsFor)` for ranking

**Calculation Logic**:
- **Played**: Total matches completed
- **Points**: (won × 3) + (drawn × 1)
- **Goal Difference**: goalsFor - goalsAgainst
- **Form**: Last 5 match results (W/D/L)

**Update Triggers**:
- When match status changes to "completed"
- Recalculate both teams' standings

**Access Patterns**:
- Get standings for a group (ORDER BY points DESC, goalDifference DESC, goalsFor DESC)
- Get team's current position
- Compare two teams' standings

---

## Common Access Patterns

### 1. League Standings Page

**Query**: Get complete standings for a group with team details

```typescript
SELECT 
  s.*,
  t.name,
  t.logoUrl,
  t.shortName
FROM standings s
JOIN teams t ON s.teamId = t.id
WHERE s.groupId = :groupId
ORDER BY 
  s.points DESC,
  s.goalDifference DESC,
  s.goalsFor DESC,
  t.name ASC
```

**Drizzle ORM**:
```typescript
await db
  .select()
  .from(standings)
  .innerJoin(teams, eq(standings.teamId, teams.id))
  .where(eq(standings.groupId, groupId))
  .orderBy(
    desc(standings.points),
    desc(standings.goalDifference),
    desc(standings.goalsFor),
    asc(teams.name)
  );
```

---

### 2. Team Profile with Players

**Query**: Get team details with all players

```typescript
// Get team
const team = await db.query.teams.findFirst({
  where: eq(teams.id, teamId),
  with: {
    players: {
      orderBy: [asc(players.position), asc(players.jerseyNumber)],
    },
  },
});
```

---

### 3. Match Details with Events

**Query**: Get match with teams and all events

```typescript
const match = await db.query.matches.findFirst({
  where: eq(matches.id, matchId),
  with: {
    homeTeam: true,
    awayTeam: true,
    events: {
      with: {
        player: true,
      },
      orderBy: [asc(matchEvents.minute), asc(matchEvents.additionalTime)],
    },
  },
});
```

---

### 4. Player Statistics

**Query**: Get player's total goals, assists, and cards

```typescript
const stats = await db
  .select({
    goals: sql<number>`COUNT(CASE WHEN event_type IN ('goal', 'penalty_goal') THEN 1 END)`,
    assists: sql<number>`COUNT(CASE WHEN assist_player_id = ${playerId} THEN 1 END)`,
    yellowCards: sql<number>`COUNT(CASE WHEN event_type = 'yellow_card' THEN 1 END)`,
    redCards: sql<number>`COUNT(CASE WHEN event_type = 'red_card' THEN 1 END)`,
  })
  .from(matchEvents)
  .where(eq(matchEvents.playerId, playerId));
```

---

### 5. Upcoming Fixtures

**Query**: Get next 10 upcoming matches for a league

```typescript
await db
  .select()
  .from(matches)
  .where(
    and(
      eq(matches.leagueId, leagueId),
      eq(matches.status, 'scheduled'),
      gte(matches.scheduledAt, new Date().toISOString())
    )
  )
  .orderBy(asc(matches.scheduledAt))
  .limit(10);
```

---

### 6. Head-to-Head Record

**Query**: Get all matches between two teams

```typescript
await db
  .select()
  .from(matches)
  .where(
    or(
      and(
        eq(matches.homeTeamId, team1Id),
        eq(matches.awayTeamId, team2Id)
      ),
      and(
        eq(matches.homeTeamId, team2Id),
        eq(matches.awayTeamId, team1Id)
      )
    )
  )
  .orderBy(desc(matches.scheduledAt));
```

---

### 7. Top Scorers in League

**Query**: Get top 10 goal scorers

```typescript
await db
  .select({
    playerId: matchEvents.playerId,
    playerName: sql<string>`${players.firstName} || ' ' || ${players.lastName}`,
    teamName: teams.name,
    goals: sql<number>`COUNT(*)`,
  })
  .from(matchEvents)
  .innerJoin(players, eq(matchEvents.playerId, players.id))
  .innerJoin(teams, eq(players.teamId, teams.id))
  .innerJoin(matches, eq(matchEvents.matchId, matches.id))
  .where(
    and(
      eq(matches.leagueId, leagueId),
      inArray(matchEvents.eventType, ['goal', 'penalty_goal'])
    )
  )
  .groupBy(matchEvents.playerId, players.firstName, players.lastName, teams.name)
  .orderBy(desc(sql`COUNT(*)`))
  .limit(10);
```

---

## Performance Considerations

### Indexes

Key indexes for optimal performance:

1. **Composite Indexes**:
   - `standings(groupId, points, goalDifference, goalsFor)` - for rankings
   - `matches(scheduledAt, status)` - for fixture lists
   - `matchEvents(matchId, minute)` - for event timelines

2. **Foreign Key Indexes** (auto-created):
   - All foreign key columns

### Materialized Standings

The `standings` table is **materialized** (pre-calculated) rather than computed on-the-fly:

**Pros**:
- Fast reads (no aggregation needed)
- Consistent performance

**Cons**:
- Must update after each match
- Slight delay in updates

**Update Strategy**:
```typescript
// After match completion, update both teams
async function updateStandings(matchId: number) {
  // Get match details
  // Calculate new statistics
  // Update standings table
  // Can be done in a transaction
}
```

---

## Migration Strategy

### Local Development
```bash
npm run db:push  # Quick schema updates
```

### Production
```bash
npm run db:generate  # Create migration files
npm run db:migrate   # Apply migrations
```

---

## Future Enhancements

Potential schema additions:

1. **Referees Table**: Track referee assignments and statistics
2. **Venues Table**: Dedicated table for stadiums/fields
3. **Seasons Archive**: Historical data retention
4. **User Management**: Authentication and permissions
5. **Team Squad History**: Track player transfers
6. **Match Statistics**: Detailed stats (possession, shots, passes, etc.)
7. **Notifications**: Match reminders, score updates
8. **Media**: Match photos, videos

---

## Notes

- All dates use **ISO 8601** format for consistency
- Timestamps use SQLite's `CURRENT_TIMESTAMP`
- Foreign key constraints ensure **referential integrity**
- Cascade deletes prevent orphaned records
- RESTRICT deletes prevent accidental data loss for critical entities
