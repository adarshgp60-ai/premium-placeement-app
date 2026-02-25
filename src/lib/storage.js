const HISTORY_KEY = "placement_history_v1";
const SELECTED_ID_KEY = "placement_selected_analysis_id";

export function getHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function saveHistoryEntry(entry) {
  const current = getHistory();
  const next = [entry, ...current].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  localStorage.setItem(SELECTED_ID_KEY, entry.id);
}

export function getSelectedAnalysisId() {
  return localStorage.getItem(SELECTED_ID_KEY);
}

export function setSelectedAnalysisId(id) {
  if (!id) {
    return;
  }
  localStorage.setItem(SELECTED_ID_KEY, id);
}

export function getSelectedOrLatestEntry(idFromQuery) {
  const history = getHistory();
  if (history.length === 0) {
    return null;
  }

  const targetId = idFromQuery || getSelectedAnalysisId();
  if (targetId) {
    const match = history.find((entry) => entry.id === targetId);
    if (match) {
      return match;
    }
  }

  return history[0];
}
