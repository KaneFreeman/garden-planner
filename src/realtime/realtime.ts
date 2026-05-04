export const REALTIME_PATH = '/socket';

export const REALTIME_EVENTS = {
  gardenSubscribe: 'realtime.garden.subscribe',
  gardenUnsubscribe: 'realtime.garden.unsubscribe',
  gardenSync: 'realtime.sync.garden',
  userSync: 'realtime.sync.user'
} as const;

export function getRealtimeServerUrl() {
  const apiUrl = new URL(import.meta.env.VITE_API_URL);
  return apiUrl.origin;
}
