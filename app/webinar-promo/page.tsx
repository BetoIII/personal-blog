"use client";

import Image from "next/image";

export default function WebinarPromo() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-muted p-8">
      {/* 1600x900 Canvas */}
      <div
        className="relative bg-background overflow-hidden"
        style={{ width: '1600px', height: '900px' }}
      >
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
          }}
        />

        {/* Abstract Geometric Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] transform translate-x-1/4 -translate-y-1/4"
          style={{ backgroundColor: '#D4573B', opacity: 0.2 }}
        />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] transform -translate-x-1/4 translate-y-1/4 rotate-12"
          style={{ backgroundColor: '#6B7A5A', opacity: 0.2 }}
        />

        {/* Main Content Container */}
        <div className="relative z-20 flex flex-col h-full p-16">

          {/* TOP THIRD */}
          <div className="mb-12">
            {/* Live Workshop Badge */}
            <div className="inline-block mb-8 px-6 py-3 thick-border bg-primary">
              <span className="text-primary-foreground font-sans font-medium tracking-[0.2em]" style={{ fontSize: '14px' }}>
                LIVE WORKSHOP
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 font-serif" style={{
              fontSize: '80px',
              lineHeight: '0.95',
              letterSpacing: '-0.03em',
              fontWeight: 600,
              color: '#1A1A1A'
            }}>
              Turn Dead Leads<br />into Revenue
            </h1>

            {/* Subheadline */}
            <p className="font-sans" style={{
              fontSize: '36px',
              color: '#4A4A4A',
              fontWeight: 400
            }}>
              Voice AI Lead Reactivation Workshop
            </p>
          </div>

          {/* MIDDLE SECTION */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            {/* Benefit 1 */}
            <div className="thick-border p-8" style={{ backgroundColor: '#6B7A5A' }}>
              <div className="font-serif text-primary-foreground mb-3" style={{ fontSize: '56px', fontWeight: 600 }}>
                25-35%
              </div>
              <p className="font-sans text-primary-foreground" style={{ fontSize: '18px', fontWeight: 500 }}>
                Higher Contact Rates
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="thick-border p-8 bg-primary">
              <div className="font-serif text-primary-foreground mb-3" style={{ fontSize: '56px', fontWeight: 600 }}>
                6-10
              </div>
              <p className="font-sans text-primary-foreground" style={{ fontSize: '18px', fontWeight: 500 }}>
                Automated Attempts<br />Per Lead
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="thick-border p-8" style={{ backgroundColor: '#E8E4DD' }}>
              <div className="font-serif mb-3" style={{ fontSize: '56px', fontWeight: 600, color: '#1A1A1A' }}>
                $0.05
              </div>
              <p className="font-sans" style={{ fontSize: '18px', fontWeight: 500, color: '#1A1A1A' }}>
                Cost Per Attempt
              </p>
            </div>
          </div>

          {/* BOTTOM THIRD */}
          <div className="mt-auto">
            <div className="grid grid-cols-12 gap-8 items-end">
              {/* Left Column - Details */}
              <div className="col-span-8">
                {/* Date & Time */}
                <div className="mb-4 font-sans" style={{ fontSize: '24px', fontWeight: 500, color: '#1A1A1A' }}>
                  January 28, 2026 | 2:00 PM EST
                </div>

                {/* Location */}
                <div className="mb-6 font-sans" style={{ fontSize: '20px', color: '#4A4A4A' }}>
                  Virtual Workshop via Zoom
                </div>

                {/* Price with Scarcity */}
                <div className="mb-6 font-serif" style={{
                  fontSize: '48px',
                  fontWeight: 600,
                  color: '#D4573B',
                  letterSpacing: '-0.02em'
                }}>
                  $25 - LIMITED TO 30 PEOPLE
                </div>

                {/* CTA Button */}
                <button className="thick-border bg-primary px-12 py-5 mb-4 hover:bg-foreground transition-colors duration-300">
                  <span className="text-primary-foreground font-sans font-medium tracking-[0.15em]" style={{ fontSize: '16px' }}>
                    REGISTER NOW
                  </span>
                </button>

                {/* Target Audience */}
                <p className="font-sans" style={{ fontSize: '14px', color: '#4A4A4A' }}>
                  For Real Estate Agents & Mortgage Lenders
                </p>
              </div>

              {/* Right Column - Avatar */}
              <div className="col-span-4 flex justify-end">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-full h-full thick-border bg-accent -z-10" />
                  <div className="thick-border bg-background overflow-hidden" style={{ width: '280px', height: '280px' }}>
                    <Image
                      src="/avatar.png"
                      alt="Workshop Host"
                      width={280}
                      height={280}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
