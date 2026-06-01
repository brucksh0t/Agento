import React from 'react';
import { type Task } from '../../types';

interface RunLogEntry {
  ts: string;
  agent: string;
  text: string;
}

// Parse the agent run-log lines that `task_log` writes into Implementation Notes:
//   "- <ISO timestamp> — <agent>: <note>"
function parseRunLog(notes?: string): RunLogEntry[] {
  if (!notes) return [];
  const re = /^-\s*(\S+)\s+—\s+([^:]+):\s*(.*)$/;
  const entries: RunLogEntry[] = [];
  for (const line of notes.split('\n')) {
    const m = line.match(re);
    if (m?.[1] && m[2]) entries.push({ ts: m[1], agent: m[2].trim(), text: (m[3] ?? '').trim() });
  }
  return entries;
}

function shortTime(ts: string): string {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString();
}

function leaseLabel(expiresAt?: string): string | null {
  if (!expiresAt) return null;
  const ms = new Date(expiresAt).getTime();
  if (Number.isNaN(ms)) return null;
  const min = Math.round((ms - Date.now()) / 60000);
  if (min <= 0) return 'lease expired';
  return min < 60 ? `${min}m left` : `${Math.floor(min / 60)}h left`;
}

const AgentActivityPanel: React.FC<{ task: Task }> = ({ task }) => {
  const entries = parseRunLog(task.implementationNotes);
  const hasCoordination = Boolean(
    task.assignedAgent || task.claimedBy || task.agentStatus || task.handoffTo || task.requiresHumanReview,
  );
  if (!hasCoordination && entries.length === 0) return null;

  const lease = leaseLabel(task.claimExpiresAt);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Agent Activity</h3>

      {/* Coordination state */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {task.requiresHumanReview && (
          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
            ⚑ Review required
          </span>
        )}
        {task.agentStatus && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            {task.agentStatus}
          </span>
        )}
        {task.claimedBy && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
            🔒 {task.claimedBy}{lease ? ` · ${lease}` : ''}
          </span>
        )}
        {!task.claimedBy && task.assignedAgent && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            @{task.assignedAgent}
          </span>
        )}
        {task.handoffTo && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
            → {task.handoffTo}
          </span>
        )}
      </div>

      {/* Run-log timeline */}
      {entries.length > 0 ? (
        <ol className="space-y-2">
          {entries.map((e, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400 dark:bg-indigo-500" />
              <div>
                <div className="text-gray-800 dark:text-gray-200">{e.text}</div>
                <div className="text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="font-medium text-gray-500 dark:text-gray-400">{e.agent}</span> · {shortTime(e.ts)}
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">No run-log entries yet.</div>
      )}

      {task.lastAgentNote && (
        <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">
          Latest note: <span className="text-gray-700 dark:text-gray-300">{task.lastAgentNote}</span>
        </div>
      )}
    </div>
  );
};

export default AgentActivityPanel;
