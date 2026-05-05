import { useHealthStatus } from './hooks/useHealthStatus';
import { StatusTable } from './components/StatusTable';
import { Shield, RefreshCw } from 'lucide-react';

function App() {
  const { data, loading, error, refetch } = useHealthStatus();

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Shield className="text-emerald-500" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Sentinel-TS</h1>
              <p className="text-neutral-500 text-sm">Enterprise Health Monitoring</p>
            </div>
          </div>
          
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </header>

        <main>
          {loading && data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-500">
              <RefreshCw className="animate-spin mb-4" size={48} />
              <p>Initializing monitors...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-1">Make sure the backend server is running and accessible.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <p className="text-neutral-500 text-sm mb-1">Total Services</p>
                  <p className="text-3xl font-bold text-white">{data.length}</p>
                </div>
                <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <p className="text-neutral-500 text-sm mb-1">Operational</p>
                  <p className="text-3xl font-bold text-emerald-500">
                    {data.filter(s => s.status === 'up').length}
                  </p>
                </div>
                <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <p className="text-neutral-500 text-sm mb-1">Down</p>
                  <p className="text-3xl font-bold text-rose-500">
                    {data.filter(s => s.status === 'down').length}
                  </p>
                </div>
              </div>

              <StatusTable data={data} />
            </div>
          )}
        </main>

        <footer className="mt-24 pt-8 border-t border-neutral-900 text-center text-neutral-600 text-sm">
          <p>© 2026 Sentinel-TS • High Availability Monitoring</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
