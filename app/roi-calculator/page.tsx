"use client";

import { useState, useEffect } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

const PRICING = {
  baseFee: 1000,
  includedAttempts: 1000,
  costPerAttempt: 0.05,
  costPerPickup: 1.5,
};

// Helper function to format currency - show cents only if non-zero
const formatCurrency = (value: number): string => {
  const cents = value % 1;
  if (cents === 0) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function ROICalculatorPage() {
  const [leadsPerMonth, setLeadsPerMonth] = useState(500);
  const [attemptsPerLead, setAttemptsPerLead] = useState(9);
  const [pickupRate, setPickupRate] = useState(30);
  const [contactToAppointment, setContactToAppointment] = useState(15);
  const [appointmentRate, setAppointmentRate] = useState(10);
  const [commissionPerDeal, setCommissionPerDeal] = useState(7000);
  const [setupFee, setSetupFee] = useState(1500);

  const [results, setResults] = useState({
    totalAttempts: 0,
    successfulPickups: 0,
    appointmentsSet: 0,
    dealsClosed: 0,
    baseFee: 0,
    additionalAttemptsCost: 0,
    pickupsCost: 0,
    totalCost: 0,
    monthlyRevenue: 0,
    netProfit: 0,
    costPerDeal: 0,
    roi: 0,
    roiMultiple: 0,
  });

  useEffect(() => {
    const totalAttempts = leadsPerMonth * attemptsPerLead;
    const successfulPickups = Math.round(leadsPerMonth * (pickupRate / 100));
    const appointmentsSet = Math.round(
      successfulPickups * (contactToAppointment / 100)
    );
    const dealsClosed = appointmentsSet * (appointmentRate / 100);
    const monthlyRevenue = dealsClosed * commissionPerDeal;

    const baseFee = PRICING.baseFee;
    const additionalAttempts = Math.max(
      0,
      totalAttempts - PRICING.includedAttempts
    );
    const additionalAttemptsCost = additionalAttempts * PRICING.costPerAttempt;
    const pickupsCost = successfulPickups * PRICING.costPerPickup;
    const totalCost = baseFee + additionalAttemptsCost + pickupsCost;

    const netProfit = monthlyRevenue - totalCost;
    const costPerDeal = dealsClosed > 0 ? totalCost / dealsClosed : 0;
    const roi = totalCost > 0 ? ((monthlyRevenue - totalCost) / totalCost) * 100 : 0;
    const roiMultiple = totalCost > 0 ? monthlyRevenue / totalCost : 0;

    setResults({
      totalAttempts,
      successfulPickups,
      appointmentsSet,
      dealsClosed,
      baseFee,
      additionalAttemptsCost,
      pickupsCost,
      totalCost,
      monthlyRevenue,
      netProfit,
      costPerDeal,
      roi,
      roiMultiple,
    });
  }, [
    leadsPerMonth,
    attemptsPerLead,
    pickupRate,
    contactToAppointment,
    appointmentRate,
    commissionPerDeal,
  ]);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding px-6 md:px-12 bg-foreground text-background">
        <div className="mx-auto w-full max-w-7xl relative z-10">
          <BlurFade delay={BLUR_FADE_DELAY}>
            <div className="inline-block mb-6 px-5 py-2 thick-border border-background bg-background text-foreground">
              <span className="text-sm font-medium uppercase tracking-wider">
                ROI Calculator
              </span>
            </div>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h1 className="mb-8 text-background">
              Voice AI ROI Calculator
            </h1>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="text-xl md:text-2xl font-light text-background/90 max-w-3xl leading-relaxed">
              Calculate your return on investment for automated voice AI lead
              reactivation campaigns. Built for real estate agents and mortgage
              lenders who want to maximize conversion from their database.
            </p>
          </BlurFade>
        </div>

        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary opacity-20 -z-0 transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent opacity-20 -z-0 transform -translate-x-1/4 rotate-6"></div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding px-6 md:px-12 bg-muted">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="mb-12">
              <h2 className="mb-6">Why Voice AI for Lead Reactivation?</h2>
              <div className="w-32 h-1 bg-primary"></div>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BlurFade delay={BLUR_FADE_DELAY * 5} className="h-full">
              <div className="thick-border bg-background p-8 relative overflow-hidden group hover-lift h-full">
                <div className="absolute top-4 right-4 w-16 h-16 bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-serif text-primary mb-4">25-35%</div>
                  <h3 className="mb-3 text-2xl">Higher Contact Rates</h3>
                  <p className="text-muted-foreground">
                    Voice AI achieves 25-35% pickup rates vs. 5-8% industry
                    average for cold outreach, reconnecting you with aged leads
                    others can&apos;t reach.
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 6} className="h-full">
              <div className="thick-border bg-background p-8 relative overflow-hidden group hover-lift h-full">
                <div className="absolute top-4 right-4 w-16 h-16 bg-accent opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-serif text-primary mb-4">24/7</div>
                  <h3 className="mb-3 text-2xl">Automated Persistence</h3>
                  <p className="text-muted-foreground">
                    Make 6-10 attempts per lead automatically. No manual dialing,
                    no missed opportunities. Your database works while you sleep.
                  </p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 7} className="h-full">
              <div className="thick-border bg-background p-8 relative overflow-hidden group hover-lift h-full">
                <div className="absolute top-4 right-4 w-16 h-16 bg-accent opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-serif text-primary mb-4">$0.05</div>
                  <h3 className="mb-3 text-2xl">Per Attempt Cost</h3>
                  <p className="text-muted-foreground">
                    Dramatically cheaper than hiring ISAs or manual calling.
                    Scale your outreach without scaling your labor costs.
                  </p>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="section-padding px-6 md:px-12 bg-background">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <div className="text-center mb-16">
              <h2 className="mb-6">Calculate Your ROI</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Adjust the sliders below to match your business metrics and see
                how Voice AI can transform your lead reactivation strategy.
              </p>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-8">
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <div className="thick-border bg-muted p-8">
                  <h3 className="mb-8 text-2xl">Your Inputs</h3>

                  {/* Leads Per Month */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Monthly Leads to Contact
                    </label>
                    <input
                      type="text"
                      value={leadsPerMonth.toLocaleString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value === '' || !isNaN(Number(value))) {
                          setLeadsPerMonth(value === '' ? 0 : Number(value));
                        }
                      }}
                      className="w-full px-4 py-3 thick-border bg-background text-foreground font-medium text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      How many leads from your database will you contact monthly?
                    </p>
                  </div>

                  {/* Attempts Per Lead */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Call Attempts Per Lead
                      <span className="ml-3 text-primary text-lg font-serif">
                        {attemptsPerLead}
                      </span>
                    </label>
                    <input
                      type="range"
                      value={attemptsPerLead}
                      onChange={(e) => setAttemptsPerLead(Number(e.target.value))}
                      className="w-full h-2 bg-secondary dark:bg-accent rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:rounded-none"
                      min="1"
                      max="15"
                      step="1"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 6-10 attempts for optimal contact rates
                    </p>
                  </div>

                  {/* Pickup Rate */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Expected Pickup Rate
                      <span className="ml-3 text-primary text-lg font-serif">
                        {pickupRate}%
                      </span>
                    </label>
                    <input
                      type="range"
                      value={pickupRate}
                      onChange={(e) => setPickupRate(Number(e.target.value))}
                      className="w-full h-2 bg-secondary dark:bg-accent rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:rounded-none"
                      min="10"
                      max="50"
                      step="1"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Industry avg: 5-8% | Voice AI avg: 25-35%
                    </p>
                  </div>

                  {/* Contact to Appointment */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Contact → Appointment Rate
                      <span className="ml-3 text-primary text-lg font-serif">
                        {contactToAppointment}%
                      </span>
                    </label>
                    <input
                      type="range"
                      value={contactToAppointment}
                      onChange={(e) =>
                        setContactToAppointment(Number(e.target.value))
                      }
                      className="w-full h-2 bg-secondary dark:bg-accent rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:rounded-none"
                      min="5"
                      max="50"
                      step="1"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      % of successful contacts that schedule appointments
                    </p>
                  </div>

                  {/* Appointment to Deal */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Appointment → Deal Rate
                      <span className="ml-3 text-primary text-lg font-serif">
                        {appointmentRate}%
                      </span>
                    </label>
                    <input
                      type="range"
                      value={appointmentRate}
                      onChange={(e) => setAppointmentRate(Number(e.target.value))}
                      className="w-full h-2 bg-secondary dark:bg-accent rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-foreground [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-foreground [&::-moz-range-thumb]:rounded-none"
                      min="5"
                      max="40"
                      step="1"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      % of appointments that result in closed deals
                    </p>
                  </div>

                  {/* Commission Per Deal */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      Average Commission Per Deal ($)
                    </label>
                    <input
                      type="text"
                      value={commissionPerDeal.toLocaleString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value === '' || !isNaN(Number(value))) {
                          setCommissionPerDeal(value === '' ? 0 : Number(value));
                        }
                      }}
                      className="w-full px-4 py-3 thick-border bg-background text-foreground font-medium text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Your average commission/revenue per closed transaction
                    </p>
                  </div>

                  {/* Setup Fee */}
                  <div>
                    <label className="block text-sm font-medium uppercase tracking-wider mb-3">
                      One-Time Setup Fee ($)
                    </label>
                    <input
                      type="text"
                      value={setupFee.toLocaleString()}
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, '');
                        if (value === '' || !isNaN(Number(value))) {
                          setSetupFee(value === '' ? 0 : Number(value));
                        }
                      }}
                      className="w-full px-4 py-3 thick-border bg-background text-foreground font-medium text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Initial setup cost (one-time charge)
                    </p>
                  </div>
                </div>
              </BlurFade>
            </div>

            {/* Results */}
            <div className="space-y-8">
              <BlurFade delay={BLUR_FADE_DELAY * 10}>
                <div className="thick-border bg-primary text-primary-foreground p-8 sticky top-24">
                  <h3 className="mb-8 text-2xl text-primary-foreground">
                    Your Results
                  </h3>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="thick-border border-primary-foreground bg-primary-foreground/10 p-4">
                      <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                        Call Attempts
                      </div>
                      <div className="text-3xl font-serif">
                        {results.totalAttempts.toLocaleString()}
                      </div>
                    </div>
                    <div className="thick-border border-primary-foreground bg-primary-foreground/10 p-4">
                      <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                        Connections
                      </div>
                      <div className="text-3xl font-serif">
                        {results.successfulPickups.toLocaleString()}
                      </div>
                    </div>
                    <div className="thick-border border-primary-foreground bg-primary-foreground/10 p-4">
                      <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                        Appointments
                      </div>
                      <div className="text-3xl font-serif">
                        {results.appointmentsSet.toLocaleString()}
                      </div>
                    </div>
                    <div className="thick-border border-primary-foreground bg-primary-foreground/10 p-4">
                      <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                        Deals Closed
                      </div>
                      <div className="text-3xl font-serif">
                        {results.dealsClosed.toLocaleString(undefined, {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}
                      </div>
                    </div>
                    <div className="thick-border border-primary-foreground bg-primary-foreground/10 p-4 col-span-2">
                      <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                        Voice AI Cost Per Deal
                      </div>
                      <div className="text-3xl font-serif">
                        ${formatCurrency(results.costPerDeal)}
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="mb-8 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/30">
                      <span className="text-sm uppercase tracking-wider">
                        Base Platform Fee
                      </span>
                      <span className="font-serif text-lg">
                        ${formatCurrency(results.baseFee)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/30">
                      <span className="text-sm uppercase tracking-wider">
                        Additional Attempts
                      </span>
                      <span className="font-serif text-lg">
                        ${formatCurrency(results.additionalAttemptsCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/30">
                      <span className="text-sm uppercase tracking-wider">
                        Connections
                      </span>
                      <span className="font-serif text-lg">
                        ${formatCurrency(results.pickupsCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-primary-foreground/30">
                      <span className="text-sm uppercase tracking-wider">
                        Setup Cost (One-Time)
                      </span>
                      <span className="font-serif text-lg">
                        ${formatCurrency(setupFee)}
                      </span>
                    </div>
                  </div>

                  {/* Total Investment */}
                  <div className="thick-border border-primary-foreground bg-foreground text-background p-6 mb-8">
                    <div className="text-xs uppercase tracking-wider mb-2 opacity-90">
                      Total Monthly Investment
                    </div>
                    <div className="text-5xl font-serif">
                      $
                      {results.totalCost.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </div>

                  {/* ROI Highlight */}
                  <div className="thick-border border-primary-foreground bg-accent text-accent-foreground p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2">
                          Monthly Revenue
                        </div>
                        <div className="text-3xl font-serif">
                          $
                          {results.monthlyRevenue.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2">
                          Net Profit
                        </div>
                        <div className="text-3xl font-serif">
                          $
                          {results.netProfit.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-wider mb-2">
                          ROI
                        </div>
                        <div className="text-3xl font-serif">
                          {results.roi.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                          %
                        </div>
                        <div className="text-xs mt-1 opacity-80">
                          ${results.roiMultiple.toFixed(0)} per $1 invested
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="section-padding px-6 md:px-12 bg-muted">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <div className="text-center mb-16">
              <h2 className="mb-6">Perfect For</h2>
              <div className="w-32 h-1 bg-primary mx-auto"></div>
            </div>
          </BlurFade>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <BlurFade delay={BLUR_FADE_DELAY * 12} className="h-full">
              <div className="thick-border bg-background p-10 hover-lift h-full">
                <div className="w-16 h-16 bg-primary thick-border flex items-center justify-center mb-6">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="mb-4">Real Estate Agents</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Reactivate aged buyer/seller leads from your CRM
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Nurture past clients for repeat business and referrals
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Follow up on open house attendees automatically
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Screen and qualify leads before spending time on calls
                    </span>
                  </li>
                </ul>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 13} className="h-full">
              <div className="thick-border bg-background p-10 hover-lift h-full">
                <div className="w-16 h-16 bg-accent thick-border flex items-center justify-center mb-6">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="mb-4">Mortgage Lenders</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Reconnect with pre-approved leads who didn&apos;t close
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Reach out for refinance opportunities at scale
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Generate renewal business from past clients
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-1 font-serif">→</span>
                    <span>
                      Qualify leads based on current interest rates and timing
                    </span>
                  </li>
                </ul>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding px-6 md:px-12 bg-primary text-primary-foreground">
        <div className="mx-auto w-full max-w-4xl text-center">
          <BlurFade delay={BLUR_FADE_DELAY * 14}>
            <h2 className="mb-6 text-primary-foreground">
              Ready to Transform Your Database?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-10 leading-relaxed">
              Stop letting qualified leads go cold. Start turning your existing
              database into consistent revenue with Voice AI automation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#contact"
                className="thick-border border-primary-foreground bg-primary-foreground text-primary px-10 py-5 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider"
              >
                Get in Touch
              </a>
              <a
                href="https://tidycal.com/beto1/ai-consultation"
                className="thick-border border-primary-foreground bg-transparent text-primary-foreground px-10 py-5 hover:bg-primary-foreground hover:text-primary transition-all duration-300 font-medium uppercase text-sm tracking-wider"
              >
                See a Demo
              </a>
            </div>
            <p className="text-xs text-primary-foreground/70 mt-8 max-w-2xl mx-auto">
              * Estimates based on industry averages and actual client results.
              Your costs may vary based on campaign performance. Pricing includes
              platform fee, telephony, and per-connection charges. No long-term
              contracts required.
            </p>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
