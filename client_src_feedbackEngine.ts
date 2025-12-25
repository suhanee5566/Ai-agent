// Basic feedback engine: computes simple metrics and returns a short summary.
// Input: events array
import { AriseEvent } from './personalizationStore';

type Metrics = {
  frequencyPerWeek: number;
  avgScore?: number | null;
  sentiment?: number | null;
  improvement: number; // percent delta between two windows
};

function average(arr: number[]) {
  if (!arr.length) return null;
  return arr.reduce((a,b)=>a+b,0)/arr.length;
}

export function computeMetrics(events: AriseEvent[], now = Date.now()): Metrics {
  // Window sizes: last 14 days vs previous 14 days
  const DAY = 24*60*60*1000;
  const window = 14 * DAY;
  const endA = now;
  const startA = now - window;
  const startB = startA - window;
  const endB = startA;

  const eventsA = events.filter(e => e.timestamp >= startA && e.timestamp <= endA);
  const eventsB = events.filter(e => e.timestamp >= startB && e.timestamp < endB);

  // Frequency per week
  const freqA = (eventsA.length) / (window / (7*DAY)); // events per week in window A

  // avg score (if present)
  const scoresA = eventsA.map(e => e.score).filter(s => typeof s === 'number') as number[];
  const avgScoreA = scoresA.length ? average(scoresA) : null;

  const scoresB = eventsB.map(e => e.score).filter(s => typeof s === 'number') as number[];
  const avgScoreB = scoresB.length ? average(scoresB) : null;

  // improvement: relative change in frequency (simple example)
  const freqB = (eventsB.length) / (window / (7*DAY));
  const improvement = freqB === 0 ? (freqA === 0 ? 0 : 100) : ((freqA - freqB) / (freqB)) * 100;

  return {
    frequencyPerWeek: Math.round(freqA*100)/100,
    avgScore: avgScoreA ? Math.round(avgScoreA*100)/100 : null,
    sentiment: null, // can plug in a sentiment function
    improvement: Math.round(improvement*100)/100
  };
}

export function summarizeFeedback(metrics: Metrics) {
  const lines: string[] = [];
  lines.push(`Sessions per week (recent): ${metrics.frequencyPerWeek}`);
  if (metrics.avgScore !== null) lines.push(`Average score (recent): ${metrics.avgScore}`);
  if (metrics.improvement >= 10) {
    lines.push(`Significant improvement: +${metrics.improvement}% vs previous window.`);
  } else if (metrics.improvement > 1) {
    lines.push(`Small improvement: +${metrics.improvement}% vs previous window.`);
  } else if (Math.abs(metrics.improvement) <= 1) {
    lines.push(`Stable: little change vs previous window.`);
  } else {
    lines.push(`Decrease: ${metrics.improvement}% vs previous window. Consider reviewing schedule.`);
  }
  lines.push('Suggested next steps: set a small, time-boxed daily goal and review weekly.');
  return lines.join('\\n');
}