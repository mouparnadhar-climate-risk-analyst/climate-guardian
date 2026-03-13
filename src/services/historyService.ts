export interface HistoryEntry {
  propertyName: string;
  assetValue: string;
  riskScore: number;
  riskLevel: string;
  timestamp: number;
}

/**
 * Fetches the analysis history from the browser's local storage.
 * @returns An array of history entries, or an empty array if none exist or an error occurs.
 */
export const getHistory = (): HistoryEntry[] => {
  try {
    const historyStr = localStorage.getItem("climateVaultHistory");
    if (historyStr) {
      return JSON.parse(historyStr);
    }
  } catch (e) {
    console.error("Failed to parse history from localStorage", e);
  }
  return []; // This was the missing part
};

/**
 * Clears the entire analysis history from local storage.
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem("climateVaultHistory");
  } catch (e) {
    console.error("Failed to clear history from localStorage", e);
  }
};