"use client"

import { useMemo, useState } from "react"
import {
  Plus,
  Camera,
  MonitorSpeaker,
  Lightbulb,
  Wind,
  Projector,
  MapPin,
  Users,
  Cpu,
  CheckCircle2,
  XCircle,
  School,
  Search,
  Settings2,
} from "lucide-react"

type DeviceType =
  | "Lights"
  | "Air Conditioner"
  | "Fan"
  | "Projector"
  | "Smart Plug"

type Device = {
  id: number
  name: string
  type: DeviceType
  status: "Connected" | "Disconnected"
}

type Classroom = {
  id: number
  roomName: string
  building: string
  capacity: number
  camera: string
  cameraStatus: "Assigned" | "Not Assigned"
  devices: Device[]
  occupancySensor: boolean
  roomStatus: "Active" | "Inactive"
}

const initialClassrooms: Classroom[] = [
  {
    id: 1,
    roomName: "Room 101",
    building: "Main Building",
    capacity: 40,
    camera: "CCTV CAM-01",
    cameraStatus: "Assigned",
    occupancySensor: true,
    roomStatus: "Active",
    devices: [
      { id: 1, name: "Ceiling Lights", type: "Lights", status: "Connected" },
      { id: 2, name: "Aircon Unit A", type: "Air Conditioner", status: "Connected" },
      { id: 3, name: "Projector A", type: "Projector", status: "Connected" },
    ],
  },
  {
    id: 2,
    roomName: "Room 202",
    building: "Annex Building",
    capacity: 30,
    camera: "",
    cameraStatus: "Not Assigned",
    occupancySensor: false,
    roomStatus: "Inactive",
    devices: [
      { id: 4, name: "Wall Fan A", type: "Fan", status: "Connected" },
      { id: 5, name: "Smart Outlet A", type: "Smart Plug", status: "Disconnected" },
    ],
  },
]

const availableDevices: DeviceType[] = [
  "Lights",
  "Air Conditioner",
  "Fan",
  "Projector",
  "Smart Plug",
]

export default function ClassroomManagementPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms)
  const [search, setSearch] = useState("")
  const [selectedDevices, setSelectedDevices] = useState<DeviceType[]>([])
  const [form, setForm] = useState({
    roomName: "",
    building: "",
    capacity: "",
    camera: "",
    occupancySensor: false,
  })

  const filteredClassrooms = useMemo(() => {
    return classrooms.filter((room) => {
      const keyword = search.toLowerCase()
      return (
        room.roomName.toLowerCase().includes(keyword) ||
        room.building.toLowerCase().includes(keyword) ||
        room.camera.toLowerCase().includes(keyword)
      )
    })
  }, [classrooms, search])

  const stats = {
    totalRooms: classrooms.length,
    activeRooms: classrooms.filter((room) => room.roomStatus === "Active").length,
    assignedCameras: classrooms.filter((room) => room.cameraStatus === "Assigned").length,
    totalDevices: classrooms.reduce((sum, room) => sum + room.devices.length, 0),
  }

  const handleDeviceToggle = (device: DeviceType) => {
    setSelectedDevices((prev) =>
      prev.includes(device)
        ? prev.filter((item) => item !== device)
        : [...prev, device]
    )
  }

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.roomName || !form.building || !form.capacity) return

    const newRoom: Classroom = {
      id: Date.now(),
      roomName: form.roomName,
      building: form.building,
      capacity: Number(form.capacity),
      camera: form.camera,
      cameraStatus: form.camera ? "Assigned" : "Not Assigned",
      occupancySensor: form.occupancySensor,
      roomStatus: "Active",
      devices: selectedDevices.map((device, index) => ({
        id: Date.now() + index,
        name: `${device} Device`,
        type: device,
        status: "Connected",
      })),
    }

    setClassrooms((prev) => [newRoom, ...prev])
    setForm({
      roomName: "",
      building: "",
      capacity: "",
      camera: "",
      occupancySensor: false,
    })
    setSelectedDevices([])
  }

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case "Lights":
        return <Lightbulb size={16} />
      case "Air Conditioner":
        return <MonitorSpeaker size={16} />
      case "Fan":
        return <Wind size={16} />
      case "Projector":
        return <Projector size={16} />
      case "Smart Plug":
        return <Cpu size={16} />
      default:
        return <Cpu size={16} />
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
                Classroom Management
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Smart Classroom Setup
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage classroom spaces, assign CCTV cameras, and connect devices
                for future IoT monitoring and automation.
              </p>
            </div>

            <div className="w-full lg:w-[320px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Search classroom..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Classrooms",
              value: stats.totalRooms,
              icon: <School size={20} />,
              style: "bg-violet-100 text-violet-600",
            },
            {
              label: "Active Rooms",
              value: stats.activeRooms,
              icon: <CheckCircle2 size={20} />,
              style: "bg-emerald-100 text-emerald-600",
            },
            {
              label: "Assigned Cameras",
              value: stats.assignedCameras,
              icon: <Camera size={20} />,
              style: "bg-sky-100 text-sky-600",
            },
            {
              label: "Connected Devices",
              value: stats.totalDevices,
              icon: <Cpu size={20} />,
              style: "bg-amber-100 text-amber-600",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {item.value}
                  </h3>
                </div>
                <div className={`rounded-2xl p-3 ${item.style}`}>{item.icon}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Layout */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* Form */}
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:sticky xl:top-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Add Classroom</h2>
              <p className="mt-1 text-sm text-slate-500">
                Add a new room and assign its smart components.
              </p>
            </div>

            <form onSubmit={handleAddClassroom} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Classroom Name
                </label>
                <input
                  type="text"
                  value={form.roomName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, roomName: e.target.value }))
                  }
                  placeholder="e.g. Room 303"
                  className="h-11 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Building / Location
                </label>
                <input
                  type="text"
                  value={form.building}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, building: e.target.value }))
                  }
                  placeholder="e.g. Main Building"
                  className="h-11 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Capacity</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, capacity: e.target.value }))
                  }
                  placeholder="e.g. 40"
                  className="h-11 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Assign Camera
                </label>
                <input
                  type="text"
                  value={form.camera}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, camera: e.target.value }))
                  }
                  placeholder="e.g. CCTV CAM-03"
                  className="h-11 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Assign Devices
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {availableDevices.map((device) => {
                    const active = selectedDevices.includes(device)

                    return (
                      <button
                        key={device}
                        type="button"
                        onClick={() => handleDeviceToggle(device)}
                        className={`flex min-h-[48px] items-center justify-between rounded-2xl border px-4 text-sm font-medium transition ${
                          active
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {getDeviceIcon(device)}
                          {device}
                        </span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            active ? "bg-violet-600" : "bg-slate-300"
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.occupancySensor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      occupancySensor: e.target.checked,
                    }))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <span>
                  <span className="block font-medium text-slate-800">
                    Enable occupancy sensor
                  </span>
                  <span className="text-slate-500">
                    Prepare this room for automatic presence detection.
                  </span>
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Plus size={18} />
                Add Classroom
              </button>
            </form>
          </aside>

          {/* List */}
          <div className="space-y-5">
            {filteredClassrooms.length > 0 ? (
              filteredClassrooms.map((room) => (
                <article
                  key={room.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6">
                    {/* Top */}
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-semibold text-slate-900">
                            {room.roomName}
                          </h3>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              room.roomStatus === "Active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {room.roomStatus}
                          </span>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              room.cameraStatus === "Assigned"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {room.cameraStatus === "Assigned"
                              ? "Camera Assigned"
                              : "No Camera"}
                          </span>

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              room.occupancySensor
                                ? "bg-violet-100 text-violet-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {room.occupancySensor
                              ? "Sensor Enabled"
                              : "No Sensor"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                              <MapPin size={16} />
                              Location
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-800">
                              {room.building}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                              <Users size={16} />
                              Capacity
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-800">
                              {room.capacity} Students
                            </p>
                          </div>

                          <div className="rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                              <Camera size={16} />
                              Camera
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-800">
                              {room.camera || "Not assigned"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 xl:justify-end">
                        <button className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                          Edit Room
                        </button>
                        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-700">
                          <Settings2 size={16} />
                          Manage Devices
                        </button>
                      </div>
                    </div>

                    {/* Devices */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-800">
                          Assigned Devices
                        </h4>
                        <span className="text-xs text-slate-400">
                          {room.devices.length} device{room.devices.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {room.devices.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                          {room.devices.map((device) => (
                            <div
                              key={device.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                    {getDeviceIcon(device.type)}
                                    <span className="truncate">{device.name}</span>
                                  </div>
                                  <p className="mt-1 text-xs text-slate-500">
                                    Type: {device.type}
                                  </p>
                                </div>

                                <span
                                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                                    device.status === "Connected"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-rose-100 text-rose-700"
                                  }`}
                                >
                                  {device.status === "Connected" ? (
                                    <CheckCircle2 size={13} />
                                  ) : (
                                    <XCircle size={13} />
                                  )}
                                  {device.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                          No devices assigned yet.
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  No classrooms found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Try another search or add a new classroom.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}