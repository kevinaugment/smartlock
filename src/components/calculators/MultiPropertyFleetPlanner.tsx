import { useState } from 'react';

interface FleetInputs {
  propertyCount: number;
  locksPerProperty: number;
  brandCount: number;
  protocolCount: number;
  primaryProtocol: 'wifi' | 'zigbee' | 'zwave' | 'thread';
  primaryPlatform: 'homekit' | 'google' | 'alexa' | 'smartthings' | 'none';
  maintenanceVisitsPerDoorPerYear: number;
  hoursPerVisit: number;
  hourlyRate: number;
  migrationHardwareCostPerLock: number;
  planningHorizonYears: number;
}

interface FleetResult {
  fragmentationScore: number;
  consolidationScore: number;
  totalLocks: number;
  annualMaintenanceHoursCurrent: number;
  annualMaintenanceHoursStandardized: number;
  annualHoursSaved: number;
  annualTimeSavingsValue: number;
  oneTimeMigrationCost: number;
  gradualMigrationCostPerYear: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateFleet(inputs: FleetInputs): FleetResult {
  const totalLocks = inputs.propertyCount * inputs.locksPerProperty;

  let fragmentationScore = 40;
  fragmentationScore += (inputs.brandCount - 1) * 15;
  fragmentationScore += (inputs.protocolCount - 1) * 10;

  if (inputs.primaryPlatform === 'none') {
    fragmentationScore += 5;
  }

  fragmentationScore = clamp(fragmentationScore, 0, 100);
  const consolidationScore = 100 - fragmentationScore;

  const complexityMultiplier =
    1 + (inputs.brandCount - 1) * 0.15 + (inputs.protocolCount - 1) * 0.1;

  const annualMaintenanceHoursCurrent =
    totalLocks *
    inputs.maintenanceVisitsPerDoorPerYear *
    inputs.hoursPerVisit *
    complexityMultiplier;

  const annualMaintenanceHoursStandardized =
    totalLocks *
    inputs.maintenanceVisitsPerDoorPerYear *
    inputs.hoursPerVisit *
    0.7;

  const annualHoursSaved =
    annualMaintenanceHoursCurrent - annualMaintenanceHoursStandardized;

  const annualTimeSavingsValue = annualHoursSaved * inputs.hourlyRate;

  const oneTimeMigrationCost =
    totalLocks * inputs.migrationHardwareCostPerLock;

  const gradualMigrationCostPerYear =
    inputs.planningHorizonYears > 0
      ? oneTimeMigrationCost / inputs.planningHorizonYears
      : oneTimeMigrationCost;

  return {
    fragmentationScore,
    consolidationScore,
    totalLocks,
    annualMaintenanceHoursCurrent,
    annualMaintenanceHoursStandardized,
    annualHoursSaved,
    annualTimeSavingsValue,
    oneTimeMigrationCost,
    gradualMigrationCostPerYear,
  };
}

export default function MultiPropertyFleetPlanner() {
  const [inputs, setInputs] = useState<FleetInputs>({
    propertyCount: 10,
    locksPerProperty: 2,
    brandCount: 3,
    protocolCount: 2,
    primaryProtocol: 'zigbee',
    primaryPlatform: 'smartthings',
    maintenanceVisitsPerDoorPerYear: 1.5,
    hoursPerVisit: 1.5,
    hourlyRate: 60,
    migrationHardwareCostPerLock: 220,
    planningHorizonYears: 3,
  });

  const [result, setResult] = useState<FleetResult | null>(null);

  const onChange = <K extends keyof FleetInputs>(key: K, value: FleetInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateFleet(inputs);
    setResult(computed);
  };

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your fleet today
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Properties
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={inputs.propertyCount}
                  onChange={(e) =>
                    onChange('propertyCount', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Locks per property
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={inputs.locksPerProperty}
                  onChange={(e) =>
                    onChange('locksPerProperty', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lock brands in use
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={inputs.brandCount}
                  onChange={(e) =>
                    onChange('brandCount', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Protocols in use
                </label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={inputs.protocolCount}
                  onChange={(e) =>
                    onChange('protocolCount', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary protocol to standardize on
                </label>
                <select
                  value={inputs.primaryProtocol}
                  onChange={(e) =>
                    onChange(
                      'primaryProtocol',
                      e.target.value as FleetInputs['primaryProtocol'],
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="wifi">Wi-Fi</option>
                  <option value="zigbee">Zigbee</option>
                  <option value="zwave">Z-Wave</option>
                  <option value="thread">Thread</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary platform
                </label>
                <select
                  value={inputs.primaryPlatform}
                  onChange={(e) =>
                    onChange(
                      'primaryPlatform',
                      e.target.value as FleetInputs['primaryPlatform'],
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="homekit">Apple Home / HomeKit</option>
                  <option value="google">Google Home</option>
                  <option value="alexa">Amazon Alexa</option>
                  <option value="smartthings">SmartThings / Hub-based</option>
                  <option value="none">None / custom</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Maintenance workload
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Visits / door / year
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={6}
                    step={0.5}
                    value={inputs.maintenanceVisitsPerDoorPerYear}
                    onChange={(e) =>
                      onChange(
                        'maintenanceVisitsPerDoorPerYear',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Hours / visit
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    max={8}
                    step={0.5}
                    value={inputs.hoursPerVisit}
                    onChange={(e) =>
                      onChange('hoursPerVisit', Number(e.target.value))
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
                    min={20}
                    max={200}
                    value={inputs.hourlyRate}
                    onChange={(e) =>
                      onChange('hourlyRate', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Migration plan
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    New lock + install per door ($)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={800}
                    value={inputs.migrationHardwareCostPerLock}
                    onChange={(e) =>
                      onChange(
                        'migrationHardwareCostPerLock',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Planning horizon (years)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={inputs.planningHorizonYears}
                    onChange={(e) =>
                      onChange('planningHorizonYears', Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Plan Fleet Standardization
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Fleet standardization impact
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Fragmentation vs standardized fleet
                </div>
                <div className="mt-1 flex items-baseline space-x-4">
                  <div className="text-4xl font-bold text-primary-900">
                    {result.fragmentationScore.toFixed(0)} / 100
                  </div>
                  <div className="text-sm text-primary-800">
                    Current fragmentation score
                  </div>
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  A higher fragmentation score means more brands, more
                  protocols, and more edge cases for staff to remember. Moving
                  towards a single protocol ({inputs.primaryProtocol.toUpperCase()})
                  and platform reduces this overhead.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Annual maintenance workload
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current</span>
                      <span className="font-medium text-gray-900">
                        {result.annualMaintenanceHoursCurrent.toFixed(0)} h / yr
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standardized fleet</span>
                      <span className="font-medium text-gray-900">
                        {result.annualMaintenanceHoursStandardized.toFixed(0)} h / yr
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold text-gray-900">
                        Hours saved per year
                      </span>
                      <span className="font-semibold text-gray-900">
                        {result.annualHoursSaved.toFixed(0)} h / yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Migration cost scenarios
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">One-time migration</span>
                      <span className="font-medium text-gray-900">
                        ${result.oneTimeMigrationCost.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Gradual over {inputs.planningHorizonYears} years
                      </span>
                      <span className="font-medium text-gray-900">
                        ${result.gradualMigrationCostPerYear.toFixed(0)} / yr
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
                      <span className="font-semibold text-gray-900">
                        Value of time saved
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${result.annualTimeSavingsValue.toFixed(0)} / yr
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Use this as a directional planning tool. For a true business
                case, plug these numbers into your portfolio model alongside
                hardware quotes and vacancy/turnover assumptions.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Enter your fleet details and click Plan Fleet Standardization.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
