// A simple browser-local personalization store using localStorage.
// Methods: addEvent, getEvents, setProfile, getProfile, clearAll, exportData
export type AriseEvent = {
  id: string;
  type: string; // e.g., "practice", "journal", "task"
  content?: string;
  metadata?: Record<string, any>;
  timestamp: number;
  score?: number; // optional numeric score for 'performance' events
};

const STORE_KEY = 'arise_personal_data_v1';

export function loadStore() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    const base = { profile: null, events: [] as AriseEvent[] };
    localStorage.setItem(STORE_KEY, JSON.stringify(base));
    return base;
  }
  return JSON.parse(raw);
}

export function saveStore(store: any) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function setProfile(profile: any) {
  const s = loadStore();
  s.profile = profile;
  saveStore(s);
}

export function getProfile() {
  return loadStore().profile;
}

export function addEvent(event: AriseEvent) {
  const s = loadStore();
  s.events.push(event);
  saveStore(s);
}

export function getEvents() {
  return loadStore().events as AriseEvent[];
}

export function exportData() {
  return JSON.stringify(loadStore(), null, 2);
}

export function clearAll() {
  const base = { profile: null, events: [] };
  saveStore(base);
}