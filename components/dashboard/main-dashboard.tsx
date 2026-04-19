"use client"

import { useState } from "react"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { RoomCard } from "@/components/dashboard/room-card"
import { DeviceCard } from "@/components/dashboard/device-card"
// import { AirConditioning } from "@/components/dashboard/air-conditioning"
import { UsersWidget } from "@/components/dashboard/users"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import { Shortcuts } from "@/components/dashboard/shortcuts"
import { LightPanels } from "@/components/dashboard/light-panels"
// import { Scenes } from "@/components/dashboard/scenes"
import EnergyWidget from "@/components/dashboard/energy-widget"

const buildingRooms: Record<string, string[]> = {
  "Academic Building": ["AB 1-7", "AB 1-5", "AB 1-6", "AB 1-2", "AB 1-3", "AB 1-4"],
  "Science Building": ["SB 2-1", "SB 2-2", "SB 2-3", "SB 2-4", "SB 2-5", "SB 2-6"],
  "Admin Building": ["ADM 101", "ADM 102", "ADM 103", "ADM 104", "ADM 105", "ADM 106"],
}

export function MainDashboard() {
  const [selectedBuilding, setSelectedBuilding] = useState("Academic Building")

  return (
    <div className="space-y-5">
      <WelcomeCard />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Rooms</h2>

              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                {Object.keys(buildingRooms).map((building) => (
                  <option key={building} value={building}>
                    {building}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {buildingRooms[selectedBuilding].map((room, i) => (
                <RoomCard key={i} title={room} />
              ))}
            </div>
          </section>

          {/* <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Popular Devices</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DeviceCard title="Refrigerator" icon="fridge" />
                <DeviceCard title="Washer" icon="washer" />
                <DeviceCard title="Desktop PC" icon="pc" />
                <DeviceCard title="Air Conditioning" icon="ac" />
              </div>
            </div>

            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Scene</h2>
              </div>
              <Scenes />
            </div>
          </section> */}

          {/* <EnergyWidget /> */}
        </div>

        <div className="space-y-5">
          {/* <AirConditioning /> */}
          {/* <UsersWidget /> */}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* <ConsumptionChart /> */}
        </div>
        {/* <Shortcuts /> */}
      </div>

      {/* <LightPanels /> */}
    </div>
  )
}