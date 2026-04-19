"use client"

import { useMemo, useState } from "react"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  BarChart3,
  CalendarRange,
  Zap,
  PhilippinePeso,
  TrendingUp,
  Activity,
  Download,
  Building2,
  ChevronDown,
  FileText,
  Gauge,
  Clock3,
} from "lucide-react"

type FilterType = "Daily" | "Weekly" | "Monthly"

type RoomEnergyData = {
  id: string
  name: string
  daily: { label: string; usage: number }[]
  weekly: { label: string; usage: number }[]
  monthly: { label: string; usage: number }[]
}

const pesoPerKwh = 12.5

const roomEnergyData: RoomEnergyData[] = [
  {
    id: "ab-3-2",
    name: "AB 3-2",
    daily: [
      { label: "8 AM", usage: 1.8 },
      { label: "10 AM", usage: 2.6 },
      { label: "12 PM", usage: 2.1 },
      { label: "2 PM", usage: 3.2 },
      { label: "4 PM", usage: 2.4 },
      { label: "6 PM", usage: 1.5 },
    ],
    weekly: [
      { label: "Mon", usage: 12.4 },
      { label: "Tue", usage: 13.8 },
      { label: "Wed", usage: 11.9 },
      { label: "Thu", usage: 14.5 },
      { label: "Fri", usage: 13.2 },
      { label: "Sat", usage: 8.1 },
      { label: "Sun", usage: 4.7 },
    ],
    monthly: [
      { label: "Jan", usage: 210 },
      { label: "Feb", usage: 228 },
      { label: "Mar", usage: 235 },
      { label: "Apr", usage: 221 },
      { label: "May", usage: 244 },
      { label: "Jun", usage: 238 },
    ],
  },
  {
    id: "lab-1",
    name: "IT Lab 1",
    daily: [
      { label: "8 AM", usage: 3.2 },
      { label: "10 AM", usage: 4.6 },
      { label: "12 PM", usage: 4.1 },
      { label: "2 PM", usage: 5.3 },
      { label: "4 PM", usage: 4.7 },
      { label: "6 PM", usage: 2.8 },
    ],
    weekly: [
      { label: "Mon", usage: 23.4 },
      { label: "Tue", usage: 24.6 },
      { label: "Wed", usage: 22.1 },
      { label: "Thu", usage: 25.7 },
      { label: "Fri", usage: 24.9 },
      { label: "Sat", usage: 14.2 },
      { label: "Sun", usage: 6.8 },
    ],
    monthly: [
      { label: "Jan", usage: 410 },
      { label: "Feb", usage: 425 },
      { label: "Mar", usage: 438 },
      { label: "Apr", usage: 420 },
      { label: "May", usage: 446 },
      { label: "Jun", usage: 452 },
    ],
  },
  {
    id: "rm-101",
    name: "Room 101",
    daily: [
      { label: "8 AM", usage: 1.2 },
      { label: "10 AM", usage: 1.8 },
      { label: "12 PM", usage: 1.5 },
      { label: "2 PM", usage: 2.2 },
      { label: "4 PM", usage: 1.9 },
      { label: "6 PM", usage: 1.1 },
    ],
    weekly: [
      { label: "Mon", usage: 9.2 },
      { label: "Tue", usage: 9.8 },
      { label: "Wed", usage: 8.9 },
      { label: "Thu", usage: 10.6 },
      { label: "Fri", usage: 9.7 },
      { label: "Sat", usage: 5.2 },
      { label: "Sun", usage: 3.1 },
    ],
    monthly: [
      { label: "Jan", usage: 168 },
      { label: "Feb", usage: 172 },
      { label: "Mar", usage: 179 },
      { label: "Apr", usage: 170 },
      { label: "May", usage: 185 },
      { label: "Jun", usage: 181 },
    ],
  },
]

function formatPeso(value: number) {
  return `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function EnergyMonitoringPage() {
  const [filter, setFilter] = useState<FilterType>("Weekly")
  const [showRoomList, setShowRoomList] = useState(false)
  const [selectedRoomId, setSelectedRoomId] = useState(roomEnergyData[0].id)

  const selectedRoom =
    roomEnergyData.find((room) => room.id === selectedRoomId) ?? roomEnergyData[0]

  const chartData = useMemo(() => {
    if (filter === "Daily") return selectedRoom.daily
    if (filter === "Weekly") return selectedRoom.weekly
    return selectedRoom.monthly
  }, [filter, selectedRoom])

  const totalKwh = useMemo(
    () => chartData.reduce((sum, item) => sum + item.usage, 0),
    [chartData]
  )

  const avgKwh = useMemo(
    () => (chartData.length ? totalKwh / chartData.length : 0),
    [chartData, totalKwh]
  )

  const peakUsage = useMemo(
    () => Math.max(...chartData.map((item) => item.usage)),
    [chartData]
  )

  const estimatedCost = totalKwh * pesoPerKwh
  const efficiencyStatus =
    avgKwh <= 10 ? "Efficient" : avgKwh <= 20 ? "Moderate" : "High Consumption"

  const handleExportPdf = () => {
    window.print()
  }

  return (
    <section className="rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border md:p-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Energy Monitoring
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyze classroom energy consumption, monitor usage trends, and export reports.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportPdf}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted/40"
        >
          <Download className="h-4 w-4" />
          Export PDF Report
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="relative rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">Select Room</label>
          </div>

          <button
            type="button"
            onClick={() => setShowRoomList((prev) => !prev)}
            className="mt-3 flex h-11 w-full items-center justify-between rounded-xl border border-border bg-card px-4 text-left text-sm text-foreground transition hover:bg-muted/30"
          >
            <span>{selectedRoom.name}</span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition ${
                showRoomList ? "rotate-180" : ""
              }`}
            />
          </button>

          {showRoomList && (
            <div className="absolute left-4 right-4 top-[88px] z-20 rounded-2xl border border-border bg-card p-2 shadow-xl">
              {roomEnergyData.map((room) => {
                const active = room.id === selectedRoomId

                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => {
                      setSelectedRoomId(room.id)
                      setShowRoomList(false)
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition ${
                      active
                        ? "bg-primary/10 ring-1 ring-primary/15"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{room.name}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Time Filter</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["Daily", "Weekly", "Monthly"] as FilterType[]).map((item) => {
              const active = filter === item

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-muted/40"
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Total kWh
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {totalKwh.toFixed(2)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
              <PhilippinePeso className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Estimated Cost
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {formatPeso(estimatedCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Peak Usage
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {peakUsage.toFixed(2)} kWh
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-500/10 p-2 text-violet-600">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Efficiency Status
              </p>
              <p className="mt-1 text-xl font-semibold text-foreground">
                {efficiencyStatus}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.65fr_0.95fr]">
        <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Energy Usage Trend
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {filter} energy usage for {selectedRoom.name}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-600 ring-1 ring-sky-500/20">
              <BarChart3 className="h-4 w-4" />
              Analytics View
            </div>
          </div>

          <div className="mt-6 h-96 w-full rounded-2xl bg-card p-4 ring-1 ring-border">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="usage"
                  name="Energy Usage (kWh)"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Report Export</h2>
            </div>

            <div className="mt-4 rounded-2xl bg-card p-4 ring-1 ring-border">
              <p className="text-sm font-medium text-foreground">
                Generate Printable Energy Report
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Export the selected room’s energy analytics as a printable PDF report.
              </p>

              <button
                type="button"
                onClick={handleExportPdf}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Download className="h-4 w-4" />
                Export PDF Report
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Monitoring Insights</h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <p className="text-sm font-medium text-foreground">Highest Demand Point</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Peak usage reached <span className="font-semibold text-foreground">{peakUsage.toFixed(2)} kWh</span>.
                </p>
              </div>

              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <p className="text-sm font-medium text-foreground">Average Consumption</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average usage is <span className="font-semibold text-foreground">{avgKwh.toFixed(2)} kWh</span>.
                </p>
              </div>

              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <p className="text-sm font-medium text-foreground">Suggestion</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Use occupancy-based automation and eco mode to reduce classroom power costs.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <p className="text-sm font-medium text-foreground">Weekly report reviewed</p>
                <p className="mt-1 text-xs text-muted-foreground">AB 3-2 • 10:24 AM</p>
              </div>

              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <p className="text-sm font-medium text-foreground">Monthly data exported</p>
                <p className="mt-1 text-xs text-muted-foreground">IT Lab 1 • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}