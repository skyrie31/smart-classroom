"use client"

import { useState } from "react"
import {
  Settings,
  Save,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Bell,
  Camera,
  Zap,
  Globe,
  Shield,
} from "lucide-react"

type SettingsState = {
  systemName: string
  themeMode: string
  language: string

  enableYolo: boolean
  confidenceThreshold: number
  noPersonTimer: number
  automaticControl: boolean
  manualOverride: boolean
  autoOffDelay: number
  defaultOccupiedAction: string

  anomalyDetection: boolean
  emptyRoomAlert: boolean
  outsideScheduleAlert: boolean
  energySpikeAlert: boolean
  notifications: boolean
  notificationSound: boolean

  cameraSource: string
  cameraStatus: string
  electricityRate: number
  peakUsageThreshold: number

  monitoringHours: string
  weekendMonitoring: boolean
  sessionTimeout: number
}

const defaultSettings: SettingsState = {
  systemName: "Smart Classroom Energy Monitoring and Control System",
  themeMode: "Light",
  language: "English",

  enableYolo: true,
  confidenceThreshold: 85,
  noPersonTimer: 5,
  automaticControl: true,
  manualOverride: true,
  autoOffDelay: 10,
  defaultOccupiedAction: "Turn ON essential devices",

  anomalyDetection: true,
  emptyRoomAlert: true,
  outsideScheduleAlert: true,
  energySpikeAlert: true,
  notifications: true,
  notificationSound: true,

  cameraSource: "CCTV Camera 01",
  cameraStatus: "Connected",
  electricityRate: 12.5,
  peakUsageThreshold: 5,

  monitoringHours: "7:00 AM - 6:00 PM",
  weekendMonitoring: false,
  sessionTimeout: 30,
}

function Section({
  title,
  description,
  icon,
  children,
}: {
  title: string
  description: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  )
}

function Field({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {description ? (
        <p className="text-sm leading-6 text-slate-500">{description}</p>
      ) : null}
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string | number
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
    />
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6 last:border-b-0 last:pb-0">
      <div className="max-w-xl">
        <p className="text-sm font-medium text-slate-800">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative mt-1 inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          checked ? "bg-violet-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const [saved, setSaved] = useState(false)

  const updateField = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setSaved(false)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-violet-600">Settings</p>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
                <Settings size={24} />
                Smart Classroom Settings
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Configure the core settings for monitoring, automation, alerts,
                camera connection, and energy tracking.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <RotateCcw size={16} />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {saved && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              Settings saved successfully.
            </div>
          </div>
        )}

        <Section
          title="General"
          description="Basic system identity, appearance, and localization."
          icon={<Globe size={20} />}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="System Name">
              <Input
                value={settings.systemName}
                onChange={(value) => updateField("systemName", value)}
              />
            </Field>

            <Field label="Theme Mode">
              <Select
                value={settings.themeMode}
                onChange={(value) => updateField("themeMode", value)}
                options={["Light", "Dark"]}
              />
            </Field>

            <Field label="Language">
              <Select
                value={settings.language}
                onChange={(value) => updateField("language", value)}
                options={["English", "Filipino"]}
              />
            </Field>

            <Field label="Session Timeout (minutes)">
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(value) =>
                  updateField("sessionTimeout", Number(value))
                }
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Detection & Automation"
          description="Main controls for occupancy detection and automatic appliance response."
          icon={<Cpu size={20} />}
        >
          <ToggleRow
            title="Enable YOLO Detection"
            description="Use the camera to detect classroom occupancy."
            checked={settings.enableYolo}
            onChange={(checked) => updateField("enableYolo", checked)}
          />

          <ToggleRow
            title="Enable Automatic Device Control"
            description="Automatically control appliances based on room occupancy."
            checked={settings.automaticControl}
            onChange={(checked) => updateField("automaticControl", checked)}
          />

          <ToggleRow
            title="Allow Manual Override"
            description="Allow authorized users to manually control devices when needed."
            checked={settings.manualOverride}
            onChange={(checked) => updateField("manualOverride", checked)}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Field label="Confidence Threshold (%)">
              <Input
                type="number"
                value={settings.confidenceThreshold}
                onChange={(value) =>
                  updateField("confidenceThreshold", Number(value))
                }
              />
            </Field>

            <Field label="No-person Timer (minutes)">
              <Input
                type="number"
                value={settings.noPersonTimer}
                onChange={(value) => updateField("noPersonTimer", Number(value))}
              />
            </Field>

            <Field label="Auto-off Delay (minutes)">
              <Input
                type="number"
                value={settings.autoOffDelay}
                onChange={(value) => updateField("autoOffDelay", Number(value))}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Default Occupied Action">
              <Select
                value={settings.defaultOccupiedAction}
                onChange={(value) =>
                  updateField("defaultOccupiedAction", value)
                }
                options={[
                  "Turn ON essential devices",
                  "Turn ON all assigned devices",
                  "Keep current device state",
                ]}
              />
            </Field>

            <Field label="Monitoring Hours">
              <Input
                value={settings.monitoringHours}
                onChange={(value) => updateField("monitoringHours", value)}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Alerts"
          description="Important warnings for unusual classroom or device activity."
          icon={<Bell size={20} />}
        >
          <ToggleRow
            title="Enable Anomaly Detection"
            description="Detect suspicious or unusual device activity."
            checked={settings.anomalyDetection}
            onChange={(checked) => updateField("anomalyDetection", checked)}
          />

          <ToggleRow
            title="Alert if Room is Empty but Devices are ON"
            description="Warn when devices remain active while no person is detected."
            checked={settings.emptyRoomAlert}
            onChange={(checked) => updateField("emptyRoomAlert", checked)}
          />

          <ToggleRow
            title="Alert if Device is ON Outside Class Schedule"
            description="Detect cases like a student turning on a fan when there is no class."
            checked={settings.outsideScheduleAlert}
            onChange={(checked) =>
              updateField("outsideScheduleAlert", checked)
            }
          />

          <ToggleRow
            title="Alert for Unusual Energy Spike"
            description="Notify when energy usage suddenly exceeds the expected threshold."
            checked={settings.energySpikeAlert}
            onChange={(checked) => updateField("energySpikeAlert", checked)}
          />

          <ToggleRow
            title="Enable Notifications"
            description="Show important real-time system notifications."
            checked={settings.notifications}
            onChange={(checked) => updateField("notifications", checked)}
          />

          <ToggleRow
            title="Enable Notification Sound"
            description="Play a sound for important alerts and critical warnings."
            checked={settings.notificationSound}
            onChange={(checked) => updateField("notificationSound", checked)}
          />
        </Section>

        <Section
          title="Camera & Energy"
          description="Camera connection details and energy monitoring values."
          icon={<Camera size={20} />}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Camera Source">
              <Input
                value={settings.cameraSource}
                onChange={(value) => updateField("cameraSource", value)}
              />
            </Field>

            <Field label="Camera Status">
              <Select
                value={settings.cameraStatus}
                onChange={(value) => updateField("cameraStatus", value)}
                options={["Connected", "Disconnected", "Maintenance"]}
              />
            </Field>

            <Field label="Electricity Rate per kWh">
              <Input
                type="number"
                value={settings.electricityRate}
                onChange={(value) =>
                  updateField("electricityRate", Number(value))
                }
              />
            </Field>

            <Field label="Peak Usage Threshold (kWh)">
              <Input
                type="number"
                value={settings.peakUsageThreshold}
                onChange={(value) =>
                  updateField("peakUsageThreshold", Number(value))
                }
              />
            </Field>
          </div>

          <ToggleRow
            title="Enable Weekend Monitoring"
            description="Continue monitoring and alerts during weekends or holidays."
            checked={settings.weekendMonitoring}
            onChange={(checked) => updateField("weekendMonitoring", checked)}
          />

          <div>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Reconnect Camera
            </button>
          </div>
        </Section>

        <Section
          title="Security"
          description="Basic protection and access behavior for the dashboard."
          icon={<Shield size={20} />}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Session Timeout (minutes)">
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(value) =>
                  updateField("sessionTimeout", Number(value))
                }
              />
            </Field>

            <Field label="Manual Override Access">
              <Select
                value={settings.manualOverride ? "Allowed" : "Restricted"}
                onChange={(value) =>
                  updateField("manualOverride", value === "Allowed")
                }
                options={["Allowed", "Restricted"]}
              />
            </Field>
          </div>
        </Section>
      </div>
    </main>
  )
}