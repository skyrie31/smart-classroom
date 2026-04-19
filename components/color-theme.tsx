"use client"

import { useEffect, useState } from "react"

const BRANDS = [
  { key: "purple", label: "Purple", color: "#7c3aed" }, 
  { key: "dark-purple", label: "Dark Purple", color: "#4c1d95" }, 
  { key: "blue", label: "Blue", color: "hsl(220, 90%, 56%)" },
  { key: "teal", label: "Teal", color: "hsl(174, 63%, 45%)" },
  { key: "green", label: "Green", color: "#0f6b46" },
  
  
] as const

export function ColorThemePicker() {
  const [current, setCurrent] = useState<string>("purple")

  useEffect(() => {
    const saved = localStorage.getItem("brand") || "purple"
    setCurrent(saved)
    document.documentElement.setAttribute("data-brand", saved)
  }, [])

  function setBrand(key: string) {
    setCurrent(key)
    document.documentElement.setAttribute("data-brand", key)
    localStorage.setItem("brand", key)
  }

  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">Color theme</p>
      <div className="flex items-center gap-2">
        {BRANDS.map((b) => (
          <button
            key={b.key}
            aria-label={`Use ${b.label} theme`}
            onClick={() => setBrand(b.key)}
            className={`size-6 rounded-full ring-2 transition ${current === b.key ? "ring-ring" : "ring-transparent"} outline-none focus-visible:ring-2`}
            style={{ backgroundColor: b.color }}
          />
        ))}
      </div>
    </div>
  )
}
