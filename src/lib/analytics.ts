/**
 * Analytics facade. Events are named per PRD §23 and sent to PostHog
 * (see components/analytics/PostHogProvider). Events fired before PostHog
 * finishes initializing are queued and flushed afterwards. In dev they are
 * also logged to the console.
 */
export type AnalyticsEvent =
  | "landing_view"
  | "start_click"
  | "weekly_games_selected"
  | "manual_number_selected"
  | "auto_number_selected"
  | "simulation_started"
  | "simulation_speed_changed"
  | "simulation_100_years"
  | "simulation_1000_years"
  | "simulation_10000_years"
  | "first_prize_reached"
  | "simulation_stopped"
  | "simulation_resumed"
  | "result_share_click"
  | "result_share_card_view"
  | "result_share_success"
  | "replay_same_numbers"
  | "replay_new_numbers"
  | "ad_impression"
  | "golden_started"
  | "golden_message_entered"
  | "golden_pressed"
  | "golden_draw_done"
  | "win_screen_opened";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

interface Sink {
  capture: (event: string, props?: AnalyticsProps) => void;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: Sink;
  }
}

const queue: { event: AnalyticsEvent; props?: AnalyticsProps }[] = [];
let sink: Sink | null = null;

/** Called by the analytics provider once the SDK is ready. Flushes anything queued. */
export function setAnalyticsSink(s: Sink) {
  sink = s;
  while (queue.length) {
    const q = queue.shift()!;
    try {
      s.capture(q.event, q.props);
    } catch {
      /* ignore */
    }
  }
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps) {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props ?? "");
  try {
    if (sink) sink.capture(event, props);
    else if (window.gtag) window.gtag("event", event, props);
    else if (queue.length < 100) queue.push({ event, props });
  } catch {
    /* never break the app for analytics */
  }
}
