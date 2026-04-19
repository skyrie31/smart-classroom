"use client"

import { useMemo, useState } from "react"
import {
  Building2,
  Search,
  ChevronDown,
  Lightbulb,
  Wind,
  Snowflake,
  Tv,
  Power,
  ShieldCheck,
  CircleCheckBig,
  CircleAlert,
  Settings2,
  MonitorCog,
} from "lucide-react"

type Room = {
  id: string
  name: string
  building: string
  connectedDevices: {
    lights: boolean
    fan: boolean
    aircon: boolean
    tv: boolean
  }
  state: {
    lights: boolean
    fan: boolean
    airconPower: boolean
    airconMode: "Normal" | "Eco"
    tv: boolean
    manualOverride: boolean
  }
}

const initialRooms: Room[] = [
  {
    id: "ab-3-2",
    name: "AB 3-2",
    building: "Academic Building",
    connectedDevices: {
      lights: true,
      fan: true,
      aircon: true,
      tv: true,
    },
    state: {
      lights: true,
      fan: true,
      airconPower: true,
      airconMode: "Normal",
      tv: true,
      manualOverride: false,
    },
  },
  {
    id: "ab-2-1",
    name: "AB 2-1",
    building: "Academic Building",
    connectedDevices: {
      lights: true,
      fan: true,
      aircon: true,
      tv: false,
    },
    state: {
      lights: false,
      fan: false,
      airconPower: true,
      airconMode: "Eco",
      tv: false,
      manualOverride: false,
    },
  },
  {
    id: "lab-1",
    name: "IT Lab 1",
    building: "Computer Laboratory",
    connectedDevices: {
      lights: true,
      fan: false,
      aircon: true,
      tv: true,
    },
    state: {
      lights: true,
      fan: false,
      airconPower: true,
      airconMode: "Normal",
      tv: false,
      manualOverride: true,
    },
  },
  {
    id: "rm-101",
    name: "Room 101",
    building: "Main Building",
    connectedDevices: {
      lights: true,
      fan: true,
      aircon: false,
      tv: true,
    },
    state: {
      lights: false,
      fan: true,
      airconPower: false,
      airconMode: "Normal",
      tv: true,
      manualOverride: true,
    },
  },
]

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
        checked ? "bg-emerald-500" : "bg-slate-300"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}

function StatusBadge({
  label,
  variant,
}: {
  label: string
  variant: "on" | "off" | "eco" | "info"
}) {
  const styles =
    variant === "on"
      ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
      : variant === "off"
      ? "bg-slate-500/10 text-slate-600 ring-slate-500/20"
      : variant === "eco"
      ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
      : "bg-sky-500/10 text-sky-600 ring-sky-500/20"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${styles}`}>
      {label}
    </span>
  )
}

function DeviceCard({
  title,
  subtitle,
  icon,
  connected,
  statusLabel,
  statusVariant,
  toggleChecked,
  onToggle,
  extra,
}: {
  title: string
  subtitle: string
  icon: React.ReactNode
  connected: boolean
  statusLabel: string
  statusVariant: "on" | "off" | "eco" | "info"
  toggleChecked: boolean
  onToggle?: () => void
  extra?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-background p-5 ring-1 ring-border shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {connected ? (
          <ToggleSwitch checked={toggleChecked} onChange={onToggle ?? (() => {})} />
        ) : (
          <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-500/20">
            Not Connected
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <StatusBadge label={statusLabel} variant={statusVariant} />
        {extra}
      </div>
    </div>
  )
}

export default function ApplianceControlPage() {
  const [search, setSearch] = useState("")
  const [showRoomList, setShowRoomList] = useState(false)
  const [rooms, setRooms] = useState(initialRooms)
  const [selectedRoomId, setSelectedRoomId] = useState(initialRooms[0].id)
  const [feedback, setFeedback] = useState<{
    type: "success" | "warning"
    message: string
  } | null>({
    type: "success",
    message: "Appliance control is ready. Select a room to manage connected devices.",
  })

  const filteredRooms = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return rooms
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(term) ||
        room.building.toLowerCase().includes(term)
    )
  }, [search, rooms])

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0]

  const connectedCount = Object.values(selectedRoom.connectedDevices).filter(Boolean).length
  const activeCount = [
    selectedRoom.connectedDevices.lights && selectedRoom.state.lights,
    selectedRoom.connectedDevices.fan && selectedRoom.state.fan,
    selectedRoom.connectedDevices.aircon && selectedRoom.state.airconPower,
    selectedRoom.connectedDevices.tv && selectedRoom.state.tv,
  ].filter(Boolean).length

  const updateSelectedRoom = (updater: (room: Room) => Room, message: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoomId ? updater(room) : room
      )
    )
    setFeedback({
      type: "success",
      message,
    })
  }

  const handleToggleLights = () => {
    if (!selectedRoom.connectedDevices.lights) return
    const next = !selectedRoom.state.lights

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          lights: next,
        },
      }),
      `Lights turned ${next ? "on" : "off"} successfully for ${selectedRoom.name}.`
    )
  }

  const handleToggleFan = () => {
    if (!selectedRoom.connectedDevices.fan) return
    const next = !selectedRoom.state.fan

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          fan: next,
        },
      }),
      `Fan turned ${next ? "on" : "off"} successfully for ${selectedRoom.name}.`
    )
  }

  const handleToggleTV = () => {
    if (!selectedRoom.connectedDevices.tv) return
    const next = !selectedRoom.state.tv

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          tv: next,
        },
      }),
      `TV turned ${next ? "on" : "off"} successfully for ${selectedRoom.name}.`
    )
  }

  const handleToggleAirconPower = () => {
    if (!selectedRoom.connectedDevices.aircon) return
    const next = !selectedRoom.state.airconPower

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          airconPower: next,
          airconMode: next ? room.state.airconMode : "Normal",
        },
      }),
      `Air conditioner turned ${next ? "on" : "off"} successfully for ${selectedRoom.name}.`
    )
  }

  const handleAirconEcoMode = () => {
    if (!selectedRoom.connectedDevices.aircon || !selectedRoom.state.airconPower) {
      setFeedback({
        type: "warning",
        message: `Turn on the air conditioner first before enabling Eco Mode in ${selectedRoom.name}.`,
      })
      return
    }

    const nextMode = selectedRoom.state.airconMode === "Eco" ? "Normal" : "Eco"

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          airconMode: nextMode,
        },
      }),
      `Air conditioner set to ${nextMode} mode successfully for ${selectedRoom.name}.`
    )
  }

  const handleManualOverride = () => {
    const next = !selectedRoom.state.manualOverride

    updateSelectedRoom(
      (room) => ({
        ...room,
        state: {
          ...room.state,
          manualOverride: next,
        },
      }),
      `Manual override ${next ? "enabled" : "disabled"} successfully for ${selectedRoom.name}.`
    )
  }

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Appliance Control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage connected classroom devices with clear status feedback and room-based control.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-600 ring-1 ring-sky-500/20">
          <ShieldCheck className="h-4 w-4" />
          Admin Control Active
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`mt-6 flex items-start gap-3 rounded-2xl px-4 py-4 ring-1 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20"
              : "bg-amber-500/10 text-amber-700 ring-amber-500/20"
          }`}
        >
          {feedback.type === "success" ? (
            <CircleCheckBig className="mt-0.5 h-5 w-5 shrink-0" />
          ) : (
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <p className="text-sm">{feedback.message}</p>
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.95fr]">
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <label htmlFor="room-search" className="text-sm font-medium text-foreground">
              Search Room
            </label>
          </div>

          <div className="mt-3">
            <input
              id="room-search"
              type="text"
              placeholder="Search by room name or building..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

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
            <span className="truncate pr-4">
              {selectedRoom.name} • {selectedRoom.building}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition ${
                showRoomList ? "rotate-180" : ""
              }`}
            />
          </button>

          {showRoomList && (
            <div className="absolute left-4 right-4 top-[88px] z-20 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-xl">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => {
                  const active = room.id === selectedRoomId

                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(room.id)
                        setShowRoomList(false)
                        setFeedback({
                          type: "success",
                          message: `${room.name} selected. You can now manage its connected devices.`,
                        })
                      }}
                      className={`flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition ${
                        active
                          ? "bg-primary/10 ring-1 ring-primary/15"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground">{room.building}</p>
                      </div>

                      <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium text-sky-600">
                        {Object.values(room.connectedDevices).filter(Boolean).length} devices
                      </span>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-xl px-3 py-4 text-sm text-muted-foreground">
                  No rooms found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Room overview */}
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Selected Room
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">{selectedRoom.name}</p>
          <p className="text-sm text-muted-foreground">{selectedRoom.building}</p>
        </div>

        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Connected Devices
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">{connectedCount}</p>
          <p className="text-sm text-muted-foreground">Available for control</p>
        </div>

        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Active Devices
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">{activeCount}</p>
          <p className="text-sm text-muted-foreground">Currently powered on</p>
        </div>

        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Control Mode
          </p>
          <p className="mt-3 text-base font-semibold text-foreground">
            {selectedRoom.state.manualOverride ? "Manual Override" : "Automatic"}
          </p>
          <p className="text-sm text-muted-foreground">Current operating behavior</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        {/* Left: Device cards */}
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DeviceCard
              title="Lights"
              subtitle="Main classroom lighting control"
              icon={<Lightbulb className="h-5 w-5" />}
              connected={selectedRoom.connectedDevices.lights}
              statusLabel={selectedRoom.connectedDevices.lights ? (selectedRoom.state.lights ? "ON" : "OFF") : "NOT CONNECTED"}
              statusVariant={
                !selectedRoom.connectedDevices.lights
                  ? "off"
                  : selectedRoom.state.lights
                  ? "on"
                  : "off"
              }
              toggleChecked={selectedRoom.state.lights}
              onToggle={handleToggleLights}
            />

            <DeviceCard
              title="Fan"
              subtitle="Classroom ventilation and airflow"
              icon={<Wind className="h-5 w-5" />}
              connected={selectedRoom.connectedDevices.fan}
              statusLabel={selectedRoom.connectedDevices.fan ? (selectedRoom.state.fan ? "ON" : "OFF") : "NOT CONNECTED"}
              statusVariant={
                !selectedRoom.connectedDevices.fan
                  ? "off"
                  : selectedRoom.state.fan
                  ? "on"
                  : "off"
              }
              toggleChecked={selectedRoom.state.fan}
              onToggle={handleToggleFan}
            />

            <DeviceCard
              title="Air Conditioner"
              subtitle="Cooling and energy-saving operation"
              icon={<Snowflake className="h-5 w-5" />}
              connected={selectedRoom.connectedDevices.aircon}
              statusLabel={
                !selectedRoom.connectedDevices.aircon
                  ? "NOT CONNECTED"
                  : !selectedRoom.state.airconPower
                  ? "OFF"
                  : selectedRoom.state.airconMode === "Eco"
                  ? "ECO MODE"
                  : "ON"
              }
              statusVariant={
                !selectedRoom.connectedDevices.aircon
                  ? "off"
                  : !selectedRoom.state.airconPower
                  ? "off"
                  : selectedRoom.state.airconMode === "Eco"
                  ? "eco"
                  : "on"
              }
              toggleChecked={selectedRoom.state.airconPower}
              onToggle={handleToggleAirconPower}
              extra={
                selectedRoom.connectedDevices.aircon ? (
                  <button
                    type="button"
                    onClick={handleAirconEcoMode}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted/40"
                  >
                    {selectedRoom.state.airconMode === "Eco" ? "Set Normal Mode" : "Enable Eco Mode"}
                  </button>
                ) : null
              }
            />

            <DeviceCard
              title="TV"
              subtitle="Presentation and classroom display screen"
              icon={<Tv className="h-5 w-5" />}
              connected={selectedRoom.connectedDevices.tv}
              statusLabel={selectedRoom.connectedDevices.tv ? (selectedRoom.state.tv ? "ON" : "OFF") : "NOT CONNECTED"}
              statusVariant={
                !selectedRoom.connectedDevices.tv
                  ? "off"
                  : selectedRoom.state.tv
                  ? "on"
                  : "off"
              }
              toggleChecked={selectedRoom.state.tv}
              onToggle={handleToggleTV}
            />
          </div>
        </div>

        {/* Right: System controls */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <MonitorCog className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Manual Override</h2>
            </div>

            <div className="mt-4 rounded-2xl bg-card p-4 ring-1 ring-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Enable Manual Override
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Allow the admin to manually control connected appliances for the selected room.
                  </p>
                </div>

                <ToggleSwitch
                  checked={selectedRoom.state.manualOverride}
                  onChange={handleManualOverride}
                />
              </div>

              <div className="mt-4">
                <StatusBadge
                  label={selectedRoom.state.manualOverride ? "Manual Active" : "Automatic Active"}
                  variant={selectedRoom.state.manualOverride ? "info" : "on"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Connected Devices</h2>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <span className="text-sm text-foreground">Lights</span>
                <StatusBadge
                  label={selectedRoom.connectedDevices.lights ? "Connected" : "Not Connected"}
                  variant={selectedRoom.connectedDevices.lights ? "on" : "off"}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <span className="text-sm text-foreground">Fan</span>
                <StatusBadge
                  label={selectedRoom.connectedDevices.fan ? "Connected" : "Not Connected"}
                  variant={selectedRoom.connectedDevices.fan ? "on" : "off"}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <span className="text-sm text-foreground">Air Conditioner</span>
                <StatusBadge
                  label={selectedRoom.connectedDevices.aircon ? "Connected" : "Not Connected"}
                  variant={selectedRoom.connectedDevices.aircon ? "on" : "off"}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                <span className="text-sm text-foreground">TV</span>
                <StatusBadge
                  label={selectedRoom.connectedDevices.tv ? "Connected" : "Not Connected"}
                  variant={selectedRoom.connectedDevices.tv ? "on" : "off"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <Power className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Control Guidance</h2>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                Turning a switch updates the device state immediately.
              </div>
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                Success messages appear at the top after each action.
              </div>
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                Eco Mode is only available when the air conditioner is turned on.
              </div>
              <div className="rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                Only connected devices can be controlled for the selected room.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}