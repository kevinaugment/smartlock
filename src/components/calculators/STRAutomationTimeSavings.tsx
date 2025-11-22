import { useState } from 'react';

interface StrAutomationInputs {
  propertyCount: number;
  monthlyBookingsPerProperty: number;
  avgHandoffsPerBooking: number;
  manualMinutesPerHandoff: number;
  automatedMinutesPerHandoff: number;
  hourlyRate: number;
  errorRateManual: number; // %
  errorRateAutomated: number; // %
  bookingPlatform: 'airbnb' | 'booking' | 'vrbo' | 'direct' | 'mixed';
  cleanerAccessMode: 'keys' | 'codes' | 'app';
}

interface StrAutomationResult {
  hoursSavedPerYear: number;
  valueOfTimeSavedPerYear: number;
  manualHoursPerYear: number;
  automatedHoursPerYear: number;
  manualErrorsPerYear: number;
  automatedErrorsPerYear: number;
  errorReductionPercent: number;
}

function calculateAutomation(inputs: StrAutomationInputs): StrAutomationResult {
  const {
    propertyCount,
    monthlyBookingsPerProperty,
    avgHandoffsPerBooking,
    manualMinutesPerHandoff,
    automatedMinutesPerHandoff,
    hourlyRate,
    errorRateManual,
    errorRateAutomated,
  } = inputs;

  const bookingsPerMonthTotal = propertyCount * monthlyBookingsPerProperty;
  const handoffsPerYear = bookingsPerMonthTotal * 12 * avgHandoffsPerBooking;

  const manualHoursPerYear =
    (handoffsPerYear * manualMinutesPerHandoff) / 60;
  const automatedHoursPerYear =
    (handoffsPerYear * automatedMinutesPerHandoff) / 60;

  const hoursSavedPerYear = manualHoursPerYear - automatedHoursPerYear;
  const valueOfTimeSavedPerYear = hoursSavedPerYear * hourlyRate;

  const manualErrorsPerYear =
    handoffsPerYear * (errorRateManual / 100);
  const automatedErrorsPerYear =
    handoffsPerYear * (errorRateAutomated / 100);

  const errorReductionPercent =
    manualErrorsPerYear > 0
      ? ((manualErrorsPerYear - automatedErrorsPerYear) /
          manualErrorsPerYear) * 100
      : 0;

  return {
    hoursSavedPerYear,
    valueOfTimeSavedPerYear,
    manualHoursPerYear,
    automatedHoursPerYear,
    manualErrorsPerYear,
    automatedErrorsPerYear,
    errorReductionPercent,
  };
}

export default function STRAutomationTimeSavings() {
  const [inputs, setInputs] = useState<StrAutomationInputs>({
    propertyCount: 3,
    monthlyBookingsPerProperty: 15,
    avgHandoffsPerBooking: 2, // check-in + check-out
    manualMinutesPerHandoff: 30,
    automatedMinutesPerHandoff: 5,
    hourlyRate: 25,
    errorRateManual: 3,
    errorRateAutomated: 0.5,
    bookingPlatform: 'airbnb',
    cleanerAccessMode: 'keys',
  });

  const [result, setResult] = useState<StrAutomationResult | null>(null);

  const onChange = <K extends keyof StrAutomationInputs>(
    key: K,
    value: StrAutomationInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateAutomation(inputs);
    setResult(computed);
  };

  const workflowSummary =
    inputs.avgHandoffsPerBooking >= 3 || inputs.manualMinutesPerHandoff >= 45
      ? 'Your current workflow is high-touch and time-consuming; automation has a strong impact on coordinator and cleaner workloads.'
      : 'Your current workflow is relatively lean, but automation still reduces repetitive coordination as your portfolio scales.';

  let integrationSuggestion: string;
  if (inputs.bookingPlatform === 'airbnb' || inputs.bookingPlatform === 'vrbo') {
    integrationSuggestion =
      'Consider connecting your locks to your PMS or channel manager so check-in/check-out codes sync automatically from Airbnb/VRBO reservations.';
  } else if (inputs.bookingPlatform === 'booking') {
    integrationSuggestion =
      'Booking.com workflows often rely on a PMS; prioritize a lock vendor or middleware that supports your PMS API directly.';
  } else if (inputs.bookingPlatform === 'direct') {
    integrationSuggestion =
      'With mostly direct bookings, choose a lock platform that integrates with your own website engine or CRM, or offers a simple API you can script against.';
  } else {
    integrationSuggestion =
      'For mixed channels, centralize everything in a PMS or unified calendar and pick a lock integration that reads from that single source of truth.';
  }

  if (inputs.cleanerAccessMode === 'keys') {
    integrationSuggestion +=
      ' Upgrading cleaners from shared keys to unique, time-bound codes further reduces lost key risk and weekend callouts.';
  } else if (inputs.cleanerAccessMode === 'app') {
    integrationSuggestion +=
      ' Make sure cleaners have reliable app access and notifications so they can handle last-minute turnovers without coordinator intervention.';
  } else {
    integrationSuggestion +=
      ' Using per-cleaning PIN codes keeps cleaners independent of guest credentials and simplifies turnover scheduling.';
  }

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your STR operations
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Properties
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={inputs.propertyCount}
                  onChange={(e) =>
                    onChange('propertyCount', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Bookings / month / property
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={inputs.monthlyBookingsPerProperty}
                  onChange={(e) =>
                    onChange(
                      'monthlyBookingsPerProperty',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Handoffs per booking
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={inputs.avgHandoffsPerBooking}
                  onChange={(e) =>
                    onChange(
                      'avgHandoffsPerBooking',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Time per handoff
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Manual (minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={inputs.manualMinutesPerHandoff}
                    onChange={(e) =>
                      onChange(
                        'manualMinutesPerHandoff',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Automated (minutes)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={inputs.automatedMinutesPerHandoff}
                    onChange={(e) =>
                      onChange(
                        'automatedMinutesPerHandoff',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600">
                  Effective hourly rate ($/h)
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={inputs.hourlyRate}
                  onChange={(e) =>
                    onChange('hourlyRate', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Error rates (wrong codes, mis-sent keys, etc.)
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Manual workflow error rate (% of handoffs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={inputs.errorRateManual}
                    onChange={(e) =>
                      onChange('errorRateManual', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Automated workflow error rate (% of handoffs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={inputs.errorRateAutomated}
                    onChange={(e) =>
                      onChange('errorRateAutomated', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Booking stack & cleaner access
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Primary booking source
                  </label>
                  <select
                    value={inputs.bookingPlatform}
                    onChange={(e) =>
                      onChange(
                        'bookingPlatform',
                        e.target.value as StrAutomationInputs['bookingPlatform'],
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="airbnb">Airbnb (and similar)</option>
                    <option value="booking">Booking.com</option>
                    <option value="vrbo">VRBO / Holidays</option>
                    <option value="direct">Direct bookings / own site</option>
                    <option value="mixed">Mixed channels</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Cleaner access today
                  </label>
                  <select
                    value={inputs.cleanerAccessMode}
                    onChange={(e) =>
                      onChange(
                        'cleanerAccessMode',
                        e.target.value as StrAutomationInputs['cleanerAccessMode'],
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="keys">Physical keys</option>
                    <option value="codes">Door codes / keypads</option>
                    <option value="app">Lock app access</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Calculate Time Savings
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Automation time savings
          </h2>

          {result ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Annual time savings
                </div>
                <div className="mt-1 text-4xl font-bold text-primary-900">
                  {result.hoursSavedPerYear.toFixed(0)} hours / yr
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Valued at approximately ${
                    result.valueOfTimeSavedPerYear.toFixed(0)
                  } per year at your stated hourly rate.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Manual workflow
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time spent</span>
                      <span className="font-medium text-gray-900">
                        {result.manualHoursPerYear.toFixed(0)} h / yr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Errors per year</span>
                      <span className="font-medium text-gray-900">
                        {result.manualErrorsPerYear.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Automated workflow
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time spent</span>
                      <span className="font-medium text-gray-900">
                        {result.automatedHoursPerYear.toFixed(0)} h / yr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Errors per year</span>
                      <span className="font-medium text-gray-900">
                        {result.automatedErrorsPerYear.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Workflow comparison & integration hint
                </div>
                <p className="text-gray-700">{workflowSummary}</p>
                <p className="mt-2 text-gray-700">{integrationSuggestion}</p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Automation reduces workflow errors by approximately{' '}
                {result.errorReductionPercent.toFixed(0)}%. Actual impact
                depends on how well your PMS and lock integrations are
                configured.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Enter your current manual process details and click Calculate Time Savings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
