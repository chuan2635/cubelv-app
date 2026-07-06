import { useNavigate, useParams } from 'react-router-dom'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useChart } from '../hooks/useContent'

export default function ChartPage() {
  const { chartId } = useParams<{ chartId: string }>()
  const navigate = useNavigate()
  const { data: chart, isLoading } = useChart(chartId ?? '')

  if (isLoading) return <div className="p-4 text-text-secondary">載入中…</div>
  if (!chart) return <div className="p-4 text-text-secondary">找不到這個圖表</div>

  return (
    <div className="min-h-screen pb-12">
      <header className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-sm text-link">
          {'<'}
        </button>
        <h1 className="text-base font-semibold">{chart.title}</h1>
      </header>

      <main className="space-y-6 px-4">
        <div className="h-72 rounded-card bg-surface p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid stroke="#3A3A3C" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#8E8E93" fontSize={12} />
              <YAxis stroke="#8E8E93" fontSize={12} />
              <Tooltip contentStyle={{ background: '#2C2C2E', border: '1px solid #3A3A3C' }} />
              <Legend />
              {chart.series.map((s, i) => (
                <Line key={s} type="monotone" dataKey={s} stroke={i === 0 ? '#7B61FF' : '#0A84FF'} strokeWidth={2} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-hidden rounded-card border border-divider">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-text-secondary">
              <tr>
                <th className="px-3 py-2 font-medium">標的</th>
                {chart.series.map((s) => (
                  <th key={s} className="px-3 py-2 font-medium">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chart.data.map((row) => (
                <tr key={row.label} className="border-t border-divider">
                  <td className="px-3 py-2">{row.label}</td>
                  {chart.series.map((s) => (
                    <td key={s} className="px-3 py-2">
                      {row[s]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
