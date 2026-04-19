"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  Camera,
  Clock3,
  Leaf,
  Power,
  Users,
  ShieldCheck,
  Search,
  ChevronDown,
  Maximize2,
  X,
  Building2,
  MapPin,
  Video,
  Play,
  Square,
  MonitorSmartphone,
  Lightbulb,
  Wind,
  Tv,
  Snowflake,
} from "lucide-react"

type Room = {
  id: string
  name: string
  building: string
  status: "Occupied" | "Empty"
  detectedPersons: number
  cameraStatus: "Online" | "Offline"
  mode: "Automatic" | "Manual"
}

const rooms: Room[] = [
  {
    id: "ab-3-2",
    name: "AB 3-2",
    building: "Academic Building",
    status: "Occupied",
    detectedPersons: 2,
    cameraStatus: "Online",
    mode: "Automatic",
  },
  {
    id: "ab-2-1",
    name: "AB 2-1",
    building: "Academic Building",
    status: "Empty",
    detectedPersons: 0,
    cameraStatus: "Online",
    mode: "Automatic",
  },
  {
    id: "lab-1",
    name: "IT Lab 1",
    building: "Computer Laboratory",
    status: "Occupied",
    detectedPersons: 5,
    cameraStatus: "Online",
    mode: "Automatic",
  },
  {
    id: "rm-101",
    name: "Room 101",
    building: "Main Building",
    status: "Empty",
    detectedPersons: 0,
    cameraStatus: "Offline",
    mode: "Manual",
  },
]

function StatusPill({
  value,
  onLabel = "ON",
  offLabel = "OFF",
  ecoLabel = "ECO MODE",
  coolingLabel = "COOLING",
}: {
  value: string
  onLabel?: string
  offLabel?: string
  ecoLabel?: string
  coolingLabel?: string
}) {
  let classes =
    "bg-red-500/10 text-red-600 ring-red-500/20"
  if (value === onLabel) {
    classes = "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
  } else if (value === ecoLabel) {
    classes = "bg-amber-500/10 text-amber-600 ring-amber-500/20"
  } else if (value === coolingLabel) {
    classes = "bg-sky-500/10 text-sky-600 ring-sky-500/20"
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${classes}`}>
      {value}
    </span>
  )
}

export default function MonitoringPage() {
  const [search, setSearch] = useState("")
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].id)
  const [showRoomList, setShowRoomList] = useState(false)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraLoading, setCameraLoading] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [usingWebcam, setUsingWebcam] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fullVideoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const filteredRooms = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return rooms
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(term) ||
        room.building.toLowerCase().includes(term)
    )
  }, [search])

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0]

  const occupied = selectedRoom.status === "Occupied"

  const deviceStatus = occupied
    ? {
        lights: "ON",
        fan: "ON",
        aircon: "COOLING",
        tv: "ON",
      }
    : {
        lights: "OFF",
        fan: "OFF",
        aircon: "ECO MODE",
        tv: "OFF",
      }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    if (fullVideoRef.current) {
      fullVideoRef.current.srcObject = null
    }

    setCameraEnabled(false)
    setUsingWebcam(false)
    setCameraLoading(false)
  }

  const startCamera = async () => {
    try {
      setCameraError("")
      setCameraLoading(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      if (fullVideoRef.current) {
        fullVideoRef.current.srcObject = stream
      }

      setCameraEnabled(true)
      setUsingWebcam(true)
    } catch (error) {
      setCameraError("Unable to access webcam. Please allow camera permission.")
      setUsingWebcam(false)
      setCameraEnabled(false)
    } finally {
      setCameraLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  useEffect(() => {
    if (cameraEnabled && streamRef.current && fullVideoRef.current) {
      fullVideoRef.current.srcObject = streamRef.current
    }
  }, [cameraEnabled, showFullscreen])

  return (
    <>
      <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
        {/* Header */}
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Live Classroom Monitoring
            </h1>
            <p className="text-sm text-muted-foreground">
              View classroom occupancy in real time and monitor automated control behavior.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              occupied
                ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20"
                : "bg-red-500/10 text-red-600 ring-1 ring-red-500/20"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                occupied ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {occupied ? "Occupied" : "Empty"}
          </div>
        </div>

        {/* Top controls */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.95fr]">
          <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <label
                htmlFor="room-search"
                className="text-sm font-medium text-foreground"
              >
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
              <label className="text-sm font-medium text-foreground">
                Select Room
              </label>
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
                        }}
                        className={`flex w-full items-start justify-between rounded-xl px-3 py-3 text-left transition ${
                          active
                            ? "bg-primary/10 ring-1 ring-primary/15"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {room.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {room.building}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                            room.status === "Occupied"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {room.status}
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

        {/* Main content */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.75fr_0.95fr]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Camera feed */}
            <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-border">
              <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Camera className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Live Camera Feed
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedRoom.name} • {selectedRoom.building}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      selectedRoom.cameraStatus === "Online"
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                        : "bg-red-500/10 text-red-600 ring-red-500/20"
                    }`}
                  >
                    {selectedRoom.cameraStatus}
                  </span>

                  {!cameraEnabled ? (
                    <button
                      type="button"
                      onClick={startCamera}
                      disabled={cameraLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Play className="h-4 w-4" />
                      {cameraLoading ? "Starting..." : "Start Camera"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted/40"
                    >
                      <Square className="h-4 w-4" />
                      Stop Camera
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowFullscreen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition hover:bg-muted/40"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Full Screen
                  </button>
                </div>
              </div>

              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0B1220]">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)]" />
                    <div className="absolute inset-0 bg-black/25" />
                    <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:38px_38px]" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-2xl bg-black/35 px-6 py-5 text-center backdrop-blur-md ring-1 ring-white/10">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                          <MonitorSmartphone className="h-6 w-6" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-white">
                          Camera is currently disabled
                        </p>
                        <p className="mt-1 text-xs text-white/70">
                          Click “Start Camera” to view live webcam feed
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="absolute inset-0 bg-black/15" />

                {occupied && (
                  <>
                    <div className="absolute left-[18%] top-[24%] h-[40%] w-[16%] rounded-md border-2 border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]">
                      <div className="absolute -top-7 left-0 rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white shadow">
                        Person 98%
                      </div>
                    </div>

                    <div className="absolute left-[46%] top-[22%] h-[44%] w-[17%] rounded-md border-2 border-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]">
                      <div className="absolute -top-7 left-0 rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white shadow">
                        Person 96%
                      </div>
                    </div>
                  </>
                )}

                {!occupied && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-2xl bg-black/35 px-5 py-4 text-center backdrop-blur-md ring-1 ring-white/10">
                      <p className="text-sm font-semibold text-white">
                        No Person Detected
                      </p>
                      <p className="mt-1 text-xs text-white/70">
                        Waiting for occupancy detection
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl bg-black/40 px-4 py-3 backdrop-blur-md ring-1 ring-white/10 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {cameraEnabled ? "Live Detection Active" : "Monitoring Standby"}
                    </p>
                    <p className="text-xs text-white/70">
                      {cameraEnabled
                        ? `Monitoring occupancy in ${selectedRoom.name}`
                        : "Camera access is disabled until started by admin"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-white/10">
                    <Users className="h-4 w-4" />
                    {selectedRoom.detectedPersons} people detected
                  </div>
                </div>
              </div>

              {cameraError && (
                <div className="border-t border-border px-4 py-3 text-sm text-red-600">
                  {cameraError}
                </div>
              )}
            </div>

            {/* Complementary overview cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Room
                  </p>
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {selectedRoom.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedRoom.building}
                </p>
              </div>

              <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Camera
                  </p>
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {cameraEnabled ? "Enabled" : "Disabled"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {usingWebcam ? "Using local webcam feed" : "Waiting for admin action"}
                </p>
              </div>

              <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Mode
                  </p>
                </div>
                <p className="mt-3 text-base font-semibold text-foreground">
                  {selectedRoom.mode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Current system control mode
                </p>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
              <div className="flex items-center gap-2">
                <Clock3 className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Detection Timer
                </h2>
              </div>

              <div className="mt-4 rounded-2xl bg-card px-4 py-5 text-center ring-1 ring-border">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {occupied ? "Occupancy Active" : "No Person Detected"}
                </p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                  {occupied ? "LIVE" : "00:48"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {occupied
                    ? "Detection timer resets while people are present."
                    : "Timer starts when the classroom becomes empty."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                  Occupancy Status
                </h2>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <span className="text-sm text-foreground">Current Status</span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      occupied
                        ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20"
                        : "bg-red-500/10 text-red-600 ring-red-500/20"
                    }`}
                  >
                    {selectedRoom.status}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <span className="text-sm text-foreground">Detected Persons</span>
                  <span className="text-sm font-semibold text-foreground">
                    {selectedRoom.detectedPersons}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <span className="text-sm text-foreground">Camera Status</span>
                  <span
                    className={`text-sm font-semibold ${
                      selectedRoom.cameraStatus === "Online"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedRoom.cameraStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
              <h2 className="text-sm font-semibold text-foreground">
                Auto Control Status
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
                  <div className="mt-0.5 rounded-xl bg-emerald-500/10 p-2 text-emerald-600 ring-1 ring-emerald-500/20">
                    <Leaf className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Eco Mode Trigger
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Air conditioner switches to eco mode after 1 minute with no person detected.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
                  <div className="mt-0.5 rounded-xl bg-red-500/10 p-2 text-red-600 ring-1 ring-red-500/20">
                    <Power className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Automatic Power Off
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Lights, fans, and connected devices turn off after 5 minutes of no occupancy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-5 ring-1 ring-border">
              <h2 className="text-sm font-semibold text-foreground">
                Device Status Summary
              </h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Quick view of connected classroom appliances for the selected room.
              </p>

              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Lights</p>
                      <p className="text-xs text-muted-foreground">Ceiling lighting system</p>
                    </div>
                  </div>
                  <StatusPill value={deviceStatus.lights} />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                      <Wind className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Fan</p>
                      <p className="text-xs text-muted-foreground">Ventilation support</p>
                    </div>
                  </div>
                  <StatusPill value={deviceStatus.fan} />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600">
                      <Snowflake className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Air Conditioner</p>
                      <p className="text-xs text-muted-foreground">Cooling control</p>
                    </div>
                  </div>
                  <StatusPill value={deviceStatus.aircon} />
                </div>

                <div className="flex items-center justify-between rounded-xl bg-card px-4 py-3 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-violet-500/10 p-2 text-violet-600">
                      <Tv className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">TV</p>
                      <p className="text-xs text-muted-foreground">Display and presentation screen</p>
                    </div>
                  </div>
                  <StatusPill value={deviceStatus.tv} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 md:p-6">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B1220]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 text-white">
              <div>
                <h2 className="text-base font-semibold">
                  Full Screen Live View
                </h2>
                <p className="text-xs text-white/65">
                  {selectedRoom.name} • {selectedRoom.building}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!cameraEnabled ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    disabled={cameraLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-900 transition hover:opacity-90 disabled:opacity-60"
                  >
                    <Play className="h-4 w-4" />
                    {cameraLoading ? "Starting..." : "Start Camera"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
                  >
                    <Square className="h-4 w-4" />
                    Stop Camera
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowFullscreen(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden">
              {cameraEnabled ? (
                <video
                  ref={fullVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)]" />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:42px_42px]" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-2xl bg-black/35 px-6 py-5 text-center backdrop-blur-md ring-1 ring-white/10">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                        <MonitorSmartphone className="h-7 w-7" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-white">
                        Camera is currently disabled
                      </p>
                      <p className="mt-1 text-xs text-white/70">
                        Start the camera to enable full screen live monitoring
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="absolute inset-0 bg-black/15" />

              {occupied && (
                <>
                  <div className="absolute left-[18%] top-[24%] h-[40%] w-[16%] rounded-md border-2 border-emerald-400">
                    <div className="absolute -top-7 left-0 rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white">
                      Person 98%
                    </div>
                  </div>

                  <div className="absolute left-[46%] top-[22%] h-[44%] w-[17%] rounded-md border-2 border-emerald-400">
                    <div className="absolute -top-7 left-0 rounded-md bg-emerald-500 px-2 py-1 text-[11px] font-medium text-white">
                      Person 96%
                    </div>
                  </div>
                </>
              )}

              {!occupied && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl bg-black/35 px-5 py-4 text-center backdrop-blur-md ring-1 ring-white/10">
                    <p className="text-sm font-semibold text-white">
                      No Person Detected
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Waiting for occupancy detection
                    </p>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/40 px-4 py-3 text-white backdrop-blur-md ring-1 ring-white/10">
                <div>
                  <p className="text-sm font-semibold">
                    {cameraEnabled ? "Live Detection Active" : "Monitoring Standby"}
                  </p>
                  <p className="text-xs text-white/70">
                    {cameraEnabled
                      ? `Monitoring occupancy in ${selectedRoom.name}`
                      : "Camera access is disabled until started by admin"}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/10">
                  <Users className="h-4 w-4" />
                  {selectedRoom.detectedPersons} people detected
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}