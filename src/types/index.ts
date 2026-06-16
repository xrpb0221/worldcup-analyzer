export interface Team {
  id: string;
  name: string;
  nameEn: string;
  flag: string;
  group: string;
  ranking: number;
  coach: string;
  coachNationality: string;
  coachAge: number;
  coachExperience: number;
  coachRating: number;
  attackRating: number;
  defenseRating: number;
  midRating: number;
  overallRating: number;
  avgAge: number;
  totalValue: string;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  form: ('W' | 'D' | 'L')[];
  keyPlayers: Player[];
  style: string;
  confederation: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  club: string;
  nationality: string;
  rating: number;
  goals: number;
  assists: number;
  matches: number;
  value: string;
  injured: boolean;
  injuryDetail?: string;
  fitness: number;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  date: string;
  time: string;
  stadiumId: string;
  group?: string;
  stage: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  weather?: Weather;
  attendance?: number;
  scorers?: string[];
}

export interface Stadium {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  cityEn: string;
  country: string;
  capacity: number;
  surface: string;
  altitude: number;
  builtYear: number;
  description: string;
  matches: number;
  keyMatches: string[];
  coordinates: { lat: number; lng: number };
}

export interface Weather {
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface SimulationResult {
  homeScore: number;
  awayScore: number;
  winner: 'home' | 'away' | 'draw';
  events: SimEvent[];
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  xG: { home: number; away: number };
  scoreProbabilities: ScoreProbability[];
}

export interface SimEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'substitution' | 'var' | 'injury';
  team: 'home' | 'away';
  player: string;
  description: string;
}

export interface ScoreProbability {
  home: number;
  away: number;
  probability: number;
}

export interface GroupStanding {
  teamId: string;
  teamName: string;
  flag: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  heatLevel: number;
  qualified: boolean;
}

export interface SearchResult {
  type: 'team' | 'player' | 'match' | 'news' | 'stadium';
  title: string;
  summary: string;
  source: string;
  time: string;
  url?: string;
  image?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  category: 'match_result' | 'transfer' | 'injury' | 'preview' | 'analysis' | 'general';
  relatedTeams?: string[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  avatar?: string;
  favoriteTeams: string[];
  createdAt: string;
  lastLogin: string;
  role: 'user' | 'admin';
}
