import React from 'react';
import { Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import type { HealthStatus } from '../types';

interface StatusTableProps {
  data: HealthStatus[];
}

export const StatusTable: React.FC<StatusTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-400 text-sm uppercase tracking-wider">
            <th className="px-6 py-4 font-medium">Service</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Latency</th>
            <th className="px-6 py-4 font-medium">Last Checked</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {data.map((item) => (
            <tr key={item.url} className="hover:bg-neutral-800/30 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'up' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
                  <span className="font-medium text-neutral-200">{item.url}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {item.status === 'up' ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 size={16} />
                    <span>Operational</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-400">
                    <XCircle size={16} />
                    <span>Down</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Activity size={16} />
                  <span>{item.latency}ms</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock size={16} />
                  <span>{new Date(item.lastChecked).toLocaleTimeString()}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
