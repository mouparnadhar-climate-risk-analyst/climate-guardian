const STORAGE_KEY = "climatevault_history";
const MAX_ENTRIES = 20;

export interface HistoryEntry {
  propertyName: string;
  assetValue: string;
  riskScore: number;
  riskLevel: string;
  timestamp: number;
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAnalysisToHistory(entry: HistoryEntry): void {
  const history = getHistory();
  // Remove duplicate property names
  const filtered = history.filter((h) => h.propertyName !== entry.propertyName);
  filtered.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ENTRIES)));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
