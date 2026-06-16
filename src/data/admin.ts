import type { Team, Stadium } from '@/types';

const ADMIN_PASSWORD = 'worldcup2026';

export const adminAuth = {
  isAuthenticated(): boolean {
    return localStorage.getItem('wc_admin_auth') === 'true';
  },
  login(password: string): boolean {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('wc_admin_auth', 'true');
      return true;
    }
    return false;
  },
  logout() {
    localStorage.removeItem('wc_admin_auth');
  },
};

// Data persistence with localStorage
const STORAGE_KEYS = {
  teams: 'wc_admin_teams',
  stadiums: 'wc_admin_stadiums',
  customData: 'wc_admin_custom',
};

export function getAdminTeams(defaultTeams: Team[]): Team[] {
  const stored = localStorage.getItem(STORAGE_KEYS.teams);
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultTeams; }
  }
  return defaultTeams;
}

export function saveAdminTeams(teams: Team[]) {
  localStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
}

export function getAdminStadiums(defaultStadiums: Stadium[]): Stadium[] {
  const stored = localStorage.getItem(STORAGE_KEYS.stadiums);
  if (stored) {
    try { return JSON.parse(stored); } catch { return defaultStadiums; }
  }
  return defaultStadiums;
}

export function saveAdminStadiums(stadiums: Stadium[]) {
  localStorage.setItem(STORAGE_KEYS.stadiums, JSON.stringify(stadiums));
}

export function exportAllData(teams: Team[], stadiums: Stadium[]): string {
  return JSON.stringify({ teams, stadiums, exportedAt: new Date().toISOString() }, null, 2);
}

export function importAllData(jsonStr: string): { teams: Team[]; stadiums: Stadium[] } | null {
  try {
    const data = JSON.parse(jsonStr);
    if (data.teams && data.stadiums) {
      return { teams: data.teams, stadiums: data.stadiums };
    }
    return null;
  } catch {
    return null;
  }
}

export function resetAdminData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}
