    "use client"

import { useMemo, useState } from "react"
import {
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  Activity,
  Users,
  Power,
  ClipboardList,
} from "lucide-react"

type ReportLog = {
  id: number
  timestamp: string
  date: string
  status: "Occupied" | "Vacant"
  deviceActions: string
}

const reportLogs: ReportLog[] = [
  {
    id: 1,
    timestamp: "2026-04-19 08:15 AM",
    date: "2026-04-19",
    status: "Occupied",
    deviceActions: "Lights ON, Aircon ON, CCTV Active",
  },
  {
    id: 2,
    timestamp: "2026-04-19 09:02 AM",
    date: "2026-04-19",
    status: "Vacant",
    deviceActions: "Lights OFF, Aircon OFF",
  },
  {
    id: 3,
    timestamp: "2026-04-19 10:30 AM",
    date: "2026-04-19",
    status: "Occupied",
    deviceActions: "Lights ON, Projector ON",
  },
  {
    id: 4,
    timestamp: "2026-04-19 11:45 AM",
    date: "2026-04-19",
    status: "Vacant",
    deviceActions: "Lights OFF, Projector OFF, Aircon OFF",
  },
  {
    id: 5,
    timestamp: "2026-04-19 01:10 PM",
    date: "2026-04-19",
    status: "Occupied",
    deviceActions: "Lights ON, Fan ON, CCTV Active",
  },
  {
    id: 6,
    timestamp: "2026-04-18 03:00 PM",
    date: "2026-04-18",
    status: "Vacant",
    deviceActions: "Lights OFF, Fan OFF",
  },
]

export default function ReportsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("")

  const filteredLogs = useMemo(() => {
    return reportLogs.filter((log) => {
      const matchesSearch =
        log.timestamp.toLowerCase().includes(search.toLowerCase()) ||
        log.status.toLowerCase().includes(search.toLowerCase()) ||
        log.deviceActions.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "All" ? true : log.status === statusFilter

      const matchesDate = dateFilter ? log.date === dateFilter : true

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [search, statusFilter, dateFilter])

  const totalLogs = filteredLogs.length
  const occupiedCount = filteredLogs.filter((log) => log.status === "Occupied").length
  const vacantCount = filteredLogs.filter((log) => log.status === "Vacant").length
  const deviceEvents = filteredLogs.reduce((count, log) => {
    return count + log.deviceActions.split(",").length
  }, 0)

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Occupancy Status", "Device Actions"]
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.status,
      log.deviceActions,
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((item) => `"${item}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "smart-classroom-reports.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">Reports Management</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Smart Classroom Reports
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor classroom occupancy records and device activity logs.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700"
            >
              <FileSpreadsheet size={18} />
              Export CSV
            </button>

            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FileText size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Logs</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{totalLogs}</h3>
              </div>
              <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                <ClipboardList size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Occupied</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{occupiedCount}</h3>
              </div>
              <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                <Users size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Vacant</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{vacantCount}</h3>
              </div>
              <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                <Activity size={20} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Device Events</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{deviceEvents}</h3>
              </div>
              <div className="rounded-xl bg-sky-100 p-3 text-sky-600">
                <Power size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search logs, status, device actions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="relative">
              <Filter
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="All">All Status</option>
                <option value="Occupied">Occupied</option>
                <option value="Vacant">Vacant</option>
              </select>
            </div>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </section>

        {/* Reports Table */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">System Logs</h2>
            <p className="text-sm text-slate-500">
              Occupancy activity and smart device actions recorded by the system.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-slate-100">
                <tr className="text-sm font-semibold text-slate-700">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Occupancy Status</th>
                  <th className="px-6 py-4">Device Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr
                      key={log.id}
                      className={`border-t border-slate-200 text-sm text-slate-700 transition hover:bg-violet-50/40 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-4">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            log.status === "Occupied"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{log.deviceActions}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      No reports found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  )
}