import Image from "next/image"

export function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Left Side (Text) */}
        <div className="max-w-xl md:w-3/5">
          <h1 className="text-balance text-3xl font-semibold">Welcome back, AJ Sky !</h1>

          <p className="mt-2 text-sm leading-6 text-white/90">
            Smart Classroom Energy Monitoring is running. View live occupancy, appliance status,
            anomaly alerts, and energy analytics for today.
          </p>

          {/* Energy Saved Today Card */}
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-sm">
            {/* Big Value */}
            <span className="text-2xl font-semibold tabular-nums">₱24</span>

            {/* Details */}
            <div className="flex-1">
              <div className="font-medium">Estimated savings today</div>
              <div className="text-white/80">
                Based on auto shutoff &amp; eco mode • <span className="tabular-nums">1.8 kWh</span>
              </div>
            </div>

            {/* Badge */}
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
              Auto Mode: ON
            </span>
          </div>
        </div>

        {/* Right Side (Image fills 50%) */}
        <div className="relative lg:w-2/5">
          <div className="relative h-64 w-full min-h-[250px] md:h-full">
            <Image
              src="./images/smart-classroom.jpg"
              alt="Smart home illustration"
              fill
              className="rounded-2xl object-cover opacity-90"
              sizes="50vw"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
    </section>
  )
}