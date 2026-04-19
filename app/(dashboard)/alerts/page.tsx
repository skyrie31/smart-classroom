"use client"

import { useMemo, useState } from "react"
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  Search,
  ShieldAlert,
  Clock3,
  Filter,
  Siren,
  Cpu,
  CalendarClock,
} from "lucide-react"

type AlertType = "Warning" | "Info" | "Critical"
type AlertStatus = "New" | "Acknowledged" | "Resolved"
type AlertSource = "YOLO" | "IoT" | "Schedule" | "System" | "Anomaly Detection"

type AlertItem = {
  id: number
  title: string
  message: string
  room: string
  type: AlertType
  status: AlertStatus
  timestamp: string
  source: AlertSource
}

const alertsData: AlertItem[] = [
  {
    id: 1,
    title: "Room Empty but Devices Still ON",
    message:
      "No occupancy detected in Room 101, but lights and air conditioner are still active.",
    room: "Room 101",
    type: "Warning",
    status: "New",
    timestamp: "2026-04-19 08:15 AM",
    source: "YOLO",
  },
  {
    id: 2,
    title: "Camera Disconnected",
    message:
      "The assigned CCTV camera in Room 202 is not responding and may be offline.",
    room: "Room 202",
    type: "Critical",
    status: "New",
    timestamp: "2026-04-19 08:32 AM",
    source: "System",
  },
  {
    id: 3,
    title: "Occupancy Detection Updated",
    message:
      "YOLO-based monitoring successfully detected students in Room 103.",
    room: "Room 103",
    type: "Info",
    status: "Acknowledged",
    timestamp: "2026-04-19 09:05 AM",
    source: "YOLO",
  },
  {
    id: 4,
    title: "High Power Usage Detected",
    message:
      "Power consumption in Room 104 is higher than expected during idle time.",
    room: "Room 104",
    type: "Warning",
    status: "New",
    timestamp: "2026-04-19 09:20 AM",
    source: "IoT",
  },
  {
    id: 5,
    title: "Sensor Error",
    message:
      "Occupancy sensor in Room 105 failed to send data to the system.",
    room: "Room 105",
    type: "Critical",
    status: "Acknowledged",
    timestamp: "2026-04-19 10:01 AM",
    source: "IoT",
  },
  {
    id: 6,
    title: "Automatic Shutdown Completed",
    message:
      "Devices in Room 106 were automatically turned off after vacancy detection.",
    room: "Room 106",
    type: "Info",
    status: "Resolved",
    timestamp: "2026-04-19 10:30 AM",
    source: "System",
  },
  {
    id: 7,
    title: "Unauthorized Fan Activation Detected",
    message:
      "Anomaly detected in Room 107: the fan was turned on even though no scheduled class is assigned at this time. Possible student manual activation or unauthorized use.",
    room: "Room 107",
    type: "Critical",
    status: "New",
    timestamp: "2026-04-19 10:42 AM",
    source: "Anomaly Detection",
  },
  {
    id: 8,
    title: "Device Activated Outside Class Schedule",
    message:
      "Projector in Room 108 was turned on outside the approved class schedule. System flagged this as unusual behavior.",
    room: "Room 108",
    type: "Warning",
    status: "New",
    timestamp: "2026-04-19 11:05 AM",
    source: "Schedule",
  },
  {
    id: 9,
    title: "Unexpected Room Usage",
    message:
      "Occupancy was detected in Room 109 during an unscheduled period. Review whether the room is being used without authorization.",
    room: "Room 109",
    type: "Warning",
    status: "Acknowledged",
    timestamp: "2026-04-19 11:18 AM",
    source: "Anomaly Detection",
  },
]

export default function AlertsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sourceFilter, setSourceFilter] = useState("All")

  const filteredAlerts = useMemo(() => {
    return alertsData.filter((alert) => {
      const keyword = search.toLowerCase()

      const matchesSearch =
        alert.title.toLowerCase().includes(keyword) ||
        alert.message.toLowerCase().includes(keyword) ||
        alert.room.toLowerCase().includes(keyword) ||
        alert.source.toLowerCase().includes(keyword)

      const matchesType = typeFilter === "All" ? true : alert.type === typeFilter
      const matchesStatus =
        statusFilter === "All" ? true : alert.status === statusFilter
      const matchesSource =
        sourceFilter === "All" ? true : alert.source === sourceFilter

      return matchesSearch && matchesType && matchesStatus && matchesSource
    })
  }, [search, typeFilter, statusFilter, sourceFilter])

  const stats = {
    total: alertsData.length,
    warnings: alertsData.filter((a) => a.type === "Warning").length,
    critical: alertsData.filter((a) => a.type === "Critical").length,
    anomalies: alertsData.filter((a) => a.source === "Anomaly Detection").length,
  }

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case "Warning":
        return <AlertTriangle size={18} />
      case "Critical":
        return <ShieldAlert size={18} />
      case "Info":
        return <Info size={18} />
      default:
        return <Bell size={18} />
    }
  }

  const getTypeStyle = (type: AlertType) => {
    switch (type) {
      case "Warning":
        return {
          iconBg: "bg-amber-100 text-amber-600",
          badge: "bg-amber-100 text-amber-700",
          line: "bg-amber-500",
        }
      case "Critical":
        return {
          iconBg: "bg-rose-100 text-rose-600",
          badge: "bg-rose-100 text-rose-700",
          line: "bg-rose-500",
        }
      case "Info":
        return {
          iconBg: "bg-sky-100 text-sky-600",
          badge: "bg-sky-100 text-sky-700",
          line: "bg-sky-500",
        }
      default:
        return {
          iconBg: "bg-slate-100 text-slate-600",
          badge: "bg-slate-100 text-slate-700",
          line: "bg-slate-500",
        }
    }
  }

  const getStatusStyle = (status: AlertStatus) => {
    switch (status) {
      case "New":
        return "bg-violet-100 text-violet-700"
      case "Acknowledged":
        return "bg-slate-200 text-slate-700"
      case "Resolved":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getSourceStyle = (source: AlertSource) => {
    switch (source) {
      case "YOLO":
        return "bg-indigo-100 text-indigo-700"
      case "IoT":
        return "bg-cyan-100 text-cyan-700"
      case "Schedule":
        return "bg-orange-100 text-orange-700"
      case "Anomaly Detection":
        return "bg-fuchsia-100 text-fuchsia-700"
      case "System":
        return "bg-slate-100 text-slate-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  const getSourceIcon = (source: AlertSource) => {
    switch (source) {
      case "IoT":
        return <Cpu size={14} />
      case "Schedule":
        return <CalendarClock size={14} />
      case "Anomaly Detection":
        return <Siren size={14} />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-violet-600">
                Alerts & Notifications
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Smart Alerts Monitoring
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Monitor classroom warnings, critical issues, IoT events, schedule
                violations, and anomaly detection alerts in one place.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <Bell size={22} />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Alerts</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</h3>
              </div>
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <Bell size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Warnings</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stats.warnings}</h3>
              </div>
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
                <AlertTriangle size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Critical</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stats.critical}</h3>
              </div>
              <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
                <ShieldAlert size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Anomalies</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{stats.anomalies}</h3>
              </div>
              <div className="rounded-2xl bg-fuchsia-100 p-3 text-fuchsia-600">
                <Siren size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div className="relative lg:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search alerts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="All">All Types</option>
              <option value="Warning">Warning</option>
              <option value="Info">Info</option>
              <option value="Critical">Critical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
            >
              <option value="All">All Sources</option>
              <option value="YOLO">YOLO</option>
              <option value="IoT">IoT</option>
              <option value="Schedule">Schedule</option>
              <option value="System">System</option>
              <option value="Anomaly Detection">Anomaly Detection</option>
            </select>
          </div>
        </section>

        {/* Alert List */}
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Alert Notifications</h2>
            <p className="mt-1 text-sm text-slate-500">
              Includes room warnings, IoT device issues, schedule conflicts, and anomaly detection events.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const typeStyle = getTypeStyle(alert.type)

                return (
                  <div
                    key={alert.id}
                    className="group relative flex gap-4 px-6 py-5 transition hover:bg-slate-50"
                  >
                    <div
                      className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${typeStyle.line}`}
                    />

                    <div
                      className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${typeStyle.iconBg}`}
                    >
                      {getTypeIcon(alert.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">
                              {alert.title}
                            </h3>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeStyle.badge}`}
                            >
                              {alert.type}
                            </span>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(alert.status)}`}
                            >
                              {alert.status}
                            </span>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getSourceStyle(alert.source)}`}
                            >
                              {getSourceIcon(alert.source)}
                              {alert.source}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {alert.message}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                            <span className="font-medium text-slate-600">
                              {alert.room}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={14} />
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                            View
                          </button>
                          <button className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
                            Acknowledge
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-slate-900">No alerts found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try changing your filters or search keyword.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}