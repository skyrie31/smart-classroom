"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Shield } from "lucide-react"

export default function SignInPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const HERO_IMAGE = "/images/smart-classroom.jpg"
  const LOGO_IMAGE = "/images/scemcs-logo.png"

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[#EEF0F5] p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-black/5 md:h-[500px]">
        <div className="grid h-full md:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT PANEL */}
          <section className="relative hidden h-full md:block">
            <Image
              src={HERO_IMAGE}
              alt="Smart classroom monitoring"
              fill
              priority
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.30)_0%,rgba(2,6,23,0.55)_55%,rgba(2,6,23,0.82)_100%)]" />

            {/* Brand text only */}
            <div className="absolute inset-0 z-10 flex items-start justify-center pt-10">
              <div className="px-6 text-center">
                <div className="text-xl font-semibold tracking-tight text-white">
                  Smart Classroom Energy Monitoring <br />
                  and Control System
                </div>

                <div className="mt-2 text-[11px] text-white/80">
                  Real-time occupancy detection and smart classroom energy control
                </div>
              </div>
            </div>

            {/* Bottom profile card */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <div className="flex items-center justify-between rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                    <Shield className="h-4 w-4 text-white" />
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-white">
                      Admin Control Center
                    </div>
                    <div className="text-[11px] text-white/75">
                      Real-time monitoring • appliance control • energy insights
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/70" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                  <span className="h-2 w-2 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="flex h-full flex-col justify-center bg-[#F8F8FA] px-8 py-10 sm:px-10 md:px-12">
            <div className="mx-auto w-full max-w-[390px]">
              <div className="mb-4 flex h-14 items-center justify-start -ml-10">
                <Image
                  src={LOGO_IMAGE}
                  alt="Logo"
                  width={160}
                  height={160}
                  className="object-contain"
                  priority
                />
              </div>

              <div className="w-full text-center">
                <h1 className="text-[2.1rem] font-bold leading-tight tracking-tight text-foreground">
                  Welcome Admin!
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Login to access your dashboard.
                </p>
              </div>

              <div className="mt-6 w-full space-y-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-black/20 bg-white px-4 text-base text-foreground outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-black/20 bg-white px-4 pr-12 text-base text-foreground outline-none transition focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
                  />

                  {password.length > 0 && (
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-2 h-12 w-full rounded-2xl bg-brand text-lg font-semibold text-background transition hover:opacity-95 active:scale-[0.99]"
                >
                  Log in
                </button>

                <div className="pt-1 text-center">
                  <Link
                    href="/forgot-password"
                    className="text-[1rem] font-medium text-[#0F766E] hover:underline"
                  >
                    Lost password?
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}