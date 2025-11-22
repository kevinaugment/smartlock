import { useState } from 'react';

interface StrInputs {
  propertyCount: number;
  monthlyBookingsPerProperty: number;
  avgNightsPerStay: number;
  timePerHandoffMinutes: number;
  hourlyRate: number;
  travelCostPerHandoff: number;
  lockoutRate: number;
  lockoutCost: number;
  lostKeyRate: number;
  rekeyCost: number;
  lockPricePerDoor: number;
  installCostPerDoor: number;
  subscriptionPerDoorPerMonth: number;
  batteryCostPerYearPerDoor: number;
  automationLevel: 'none' | 'partial' | 'full';
  years: number;
}

interface StrResult {
  annualCostCurrent: number;
  annualLaborCurrent: number;
  annualLockoutCurrent: number;
  annualLostKeyCurrent: number;
  annualCostSmart: number;
  annualLaborSmart: number;
  annualLockoutSmart: number;
  annualLostKeySmart: number;
  annualHardwareAmortized: number;
  annualSubscription: number;
  annualBattery: number;
  annualSavings: number;
  totalSavings: number;
  roi: number | null;
  paybackMonths: number | null;
  hoursSavedPerYear: number;
}

function getReductionFactors(level: StrInputs['automationLevel']) {
  if (level === 'full') {
    return {
      laborReduction: 0.8,
      lockoutReduction: 0.9,
      lostKeyReduction: 0.95,
    };
  }
  if (level === 'partial') {
    return {
      laborReduction: 0.5,
      lockoutReduction: 0.6,
      lostKeyReduction: 0.8,
    };
  }
  return {
    laborReduction: 0,
    lockoutReduction: 0,
    lostKeyReduction: 0,
  };
}

function calculateStrRoi(inputs: StrInputs): StrResult {
  const staysPerMonthTotal =
    inputs.monthlyBookingsPerProperty * inputs.propertyCount;
  const staysPerYearTotal = staysPerMonthTotal * 12;

  const laborCostPerHandoff =
    (inputs.timePerHandoffMinutes / 60) * inputs.hourlyRate +
    inputs.travelCostPerHandoff;
  const annualLaborCurrent = staysPerYearTotal * laborCostPerHandoff;

  const annualLockoutCurrent =
    staysPerYearTotal * inputs.lockoutRate * inputs.lockoutCost;
  const annualLostKeyCurrent =
    staysPerYearTotal * inputs.lostKeyRate * inputs.rekeyCost;

  const annualCostCurrent =
    annualLaborCurrent + annualLockoutCurrent + annualLostKeyCurrent;

  const initialInvestment =
    (inputs.lockPricePerDoor + inputs.installCostPerDoor) *
    inputs.propertyCount;

  const { laborReduction, lockoutReduction, lostKeyReduction } =
    getReductionFactors(inputs.automationLevel);

  const annualLaborSmart =
    annualLaborCurrent * (1 - laborReduction);
  const annualLockoutSmart =
    annualLockoutCurrent * (1 - lockoutReduction);
  const annualLostKeySmart =
    annualLostKeyCurrent * (1 - lostKeyReduction);

  const annualHardwareAmortized = initialInvestment / inputs.years;
  const annualSubscription =
    inputs.subscriptionPerDoorPerMonth * 12 * inputs.propertyCount;
  const annualBattery =
    inputs.batteryCostPerYearPerDoor * inputs.propertyCount;

  const annualCostSmart =
    annualHardwareAmortized +
    annualSubscription +
    annualBattery +
    annualLaborSmart +
    annualLockoutSmart +
    annualLostKeySmart;

  const annualSavings = annualCostCurrent - annualCostSmart;
  const totalSavings = annualSavings * inputs.years;

  let roi: number | null = null;
  let paybackMonths: number | null = null;

  if (initialInvestment > 0 && annualSavings > 0) {
    roi = totalSavings / initialInvestment;
    paybackMonths = initialInvestment / (annualSavings / 12);
  }

  const hoursSavedPerYear =
    (annualLaborCurrent - annualLaborSmart) / inputs.hourlyRate;

  return {
    annualCostCurrent,
    annualLaborCurrent,
    annualLockoutCurrent,
    annualLostKeyCurrent,
    annualCostSmart,
    annualLaborSmart,
    annualLockoutSmart,
    annualLostKeySmart,
    annualHardwareAmortized,
    annualSubscription,
    annualBattery,
    annualSavings,
    totalSavings,
    roi,
    paybackMonths,
    hoursSavedPerYear,
  };
}

export default function ShortTermRentalROICalculator() {
  const [inputs, setInputs] = useState<StrInputs>({
    propertyCount: 3,
    monthlyBookingsPerProperty: 15,
    avgNightsPerStay: 3,
    timePerHandoffMinutes: 45,
    hourlyRate: 25,
    travelCostPerHandoff: 8,
    lockoutRate: 0.03,
    lockoutCost: 150,
    lostKeyRate: 0.01,
    rekeyCost: 120,
    lockPricePerDoor: 250,
    installCostPerDoor: 100,
    subscriptionPerDoorPerMonth: 3,
    batteryCostPerYearPerDoor: 12,
    automationLevel: 'full',
    years: 3,
  });

  const [result, setResult] = useState<StrResult | null>(null);

  const scenarioBookings = [10, 20, 30];
  const scenarioRows = scenarioBookings.map((bookings) => {
    const scenarioInputs: StrInputs = {
      ...inputs,
      monthlyBookingsPerProperty: bookings,
    };
    const scenarioResult = calculateStrRoi(scenarioInputs);
    return {
      bookings,
      paybackMonths: scenarioResult.paybackMonths,
      roi: scenarioResult.roi,
    };
  });

  const onChange = <K extends keyof StrInputs>(key: K, value: StrInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateStrRoi(inputs);
    setResult(computed);
  };

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your STR business
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
                  Avg nights / stay
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={inputs.avgNightsPerStay}
                  onChange={(e) =>
                    onChange('avgNightsPerStay', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-700">
                Current key handoff costs
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Time per handoff (min)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={inputs.timePerHandoffMinutes}
                    onChange={(e) =>
                      onChange('timePerHandoffMinutes', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
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
                <div>
                  <label className="block text-xs text-gray-600">
                    Travel cost / handoff ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputs.travelCostPerHandoff}
                    onChange={(e) =>
                      onChange('travelCostPerHandoff', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-700">
                Risk costs (current setup)
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-600">
                    Lockout rate (% of stays)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputs.lockoutRate * 100}
                    onChange={(e) =>
                      onChange('lockoutRate', Number(e.target.value) / 100)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Cost per lockout ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={inputs.lockoutCost}
                    onChange={(e) =>
                      onChange('lockoutCost', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Lost key rate (% of stays)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={inputs.lostKeyRate * 100}
                    onChange={(e) =>
                      onChange('lostKeyRate', Number(e.target.value) / 100)
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Rekey / lock change cost ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={inputs.rekeyCost}
                    onChange={(e) =>
                      onChange('rekeyCost', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <div className="text-sm font-medium text-gray-700">
                Smart lock investment
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-600">
                    Lock price per door ($)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={600}
                    value={inputs.lockPricePerDoor}
                    onChange={(e) =>
                      onChange('lockPricePerDoor', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Install cost per door ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={400}
                    value={inputs.installCostPerDoor}
                    onChange={(e) =>
                      onChange('installCostPerDoor', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Subscription ($/month/door)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={inputs.subscriptionPerDoorPerMonth}
                    onChange={(e) =>
                      onChange(
                        'subscriptionPerDoorPerMonth',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Battery cost per door / year ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={inputs.batteryCostPerYearPerDoor}
                    onChange={(e) =>
                      onChange(
                        'batteryCostPerYearPerDoor',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-xs text-gray-600">
                    Automation level
                  </label>
                  <select
                    value={inputs.automationLevel}
                    onChange={(e) =>
                      onChange(
                        'automationLevel',
                        e.target.value as StrInputs['automationLevel'],
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="none">No automation</option>
                    <option value="partial">Partial automation</option>
                    <option value="full">Full automation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Evaluation period (years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={inputs.years}
                    onChange={(e) => onChange('years', Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Calculate ROI
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Short-term rental ROI
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Annual net savings
                </div>
                <div className="mt-1 text-4xl font-bold text-primary-900">
                  ${result.annualSavings.toFixed(0)} / yr
                </div>
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-primary-800">
                  <div>
                    <div className="text-xs uppercase tracking-wide">
                      Payback period
                    </div>
                    <div className="mt-1 font-semibold">
                      {result.paybackMonths
                        ? `${result.paybackMonths.toFixed(1)} months`
                        : 'No clear payback (savings ≤ 0)'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide">
                      ROI over {inputs.years} years
                    </div>
                    <div className="mt-1 font-semibold">
                      {result.roi != null
                        ? `${(result.roi * 100).toFixed(0)}%`
                        : '—'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-primary-800">
                  Approx.{' '}
                  {result.hoursSavedPerYear.toFixed(0)} hours saved per year on
                  handoffs at your stated hourly rate.
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Current setup (per year)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor / handoffs</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLaborCurrent.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lockout incidents</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLockoutCurrent.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lost keys / rekeys</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLostKeyCurrent.toFixed(0)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        ${result.annualCostCurrent.toFixed(0)} / yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Smart lock setup (per year)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hardware amortized</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualHardwareAmortized.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscriptions</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualSubscription.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify_between">
                      <span className="text-gray-600">Batteries</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualBattery.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Labor / handoffs</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLaborSmart.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lockout incidents</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLockoutSmart.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lost keys / rekeys</span>
                      <span className="font-medium text-gray-900">
                        ${result.annualLostKeySmart.toFixed(0)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-semibold text-gray-900">
                        ${result.annualCostSmart.toFixed(0)} / yr
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Scenario analysis by booking volume
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Bookings / month / property
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Payback period
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          ROI over {inputs.years} years
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {scenarioRows.map((row) => (
                        <tr key={row.bookings}>
                          <td className="px-3 py-2 text-gray-900">
                            {row.bookings}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {row.paybackMonths
                              ? `${row.paybackMonths.toFixed(1)} months`
                              : 'No clear payback'}
                          </td>
                          <td className="px-3 py-2 text-gray-700">
                            {row.roi != null
                              ? `${(row.roi * 100).toFixed(0)}%`
                              : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                This model focuses on measurable time, travel, and risk
                reduction. Additional upside from better reviews and last-minute
                bookings is not included and would further improve ROI.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Fill in your STR business metrics and click Calculate ROI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
