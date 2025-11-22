import { useState } from 'react';

interface InstallationInputs {
  doorType: 'interior' | 'exterior' | 'steel' | 'glass';
  doorCount: number;
  retrofit: boolean;
  needsWiring: boolean;
  complexity: 'simple' | 'standard' | 'complex';
  techsPerCrew: number;
  hourlyRate: number;
}

interface InstallationResult {
  hoursPerDoor: number;
  totalHours: number;
  crewDays: number;
  laborCost: number;
}

function baseHoursPerDoor(inputs: InstallationInputs): number {
  let hours = 1.0; // simple interior retrofit baseline

  if (inputs.doorType === 'exterior') hours += 0.5;
  if (inputs.doorType === 'steel') hours += 0.8;
  if (inputs.doorType === 'glass') hours += 0.7;

  if (!inputs.retrofit) hours += 0.5; // new door or heavy modification
  if (inputs.needsWiring) hours += 0.75; // cabling, drilling, conduits

  if (inputs.complexity === 'standard') hours *= 1.2;
  if (inputs.complexity === 'complex') hours *= 1.6;

  return Math.max(0.5, hours);
}

function calculateInstallation(inputs: InstallationInputs): InstallationResult {
  const hoursPerDoor = baseHoursPerDoor(inputs);
  const totalHours = hoursPerDoor * inputs.doorCount;
  const crewDays = inputs.techsPerCrew > 0
    ? totalHours / (inputs.techsPerCrew * 8)
    : totalHours / 8;

  const laborCost = totalHours * inputs.hourlyRate;

  return {
    hoursPerDoor,
    totalHours,
    crewDays,
    laborCost,
  };
}

export default function InstallationTimeEstimator() {
  const [inputs, setInputs] = useState<InstallationInputs>({
    doorType: 'exterior',
    doorCount: 10,
    retrofit: true,
    needsWiring: false,
    complexity: 'standard',
    techsPerCrew: 2,
    hourlyRate: 70,
  });

  const [result, setResult] = useState<InstallationResult | null>(null);

  const onChange = <K extends keyof InstallationInputs>(
    key: K,
    value: InstallationInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateInstallation(inputs);
    setResult(computed);
  };

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Deployment scope
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Door type
                </label>
                <select
                  value={inputs.doorType}
                  onChange={(e) =>
                    onChange('doorType', e.target.value as InstallationInputs['doorType'])
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="interior">Interior wooden doors</option>
                  <option value="exterior">Exterior residential doors</option>
                  <option value="steel">Steel security doors</option>
                  <option value="glass">Frameless glass doors</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of doors
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={inputs.doorCount}
                  onChange={(e) =>
                    onChange('doorCount', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project type
                </label>
                <select
                  value={inputs.retrofit ? 'retrofit' : 'new'}
                  onChange={(e) =>
                    onChange('retrofit', e.target.value === 'retrofit')
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="retrofit">Retrofit existing doors</option>
                  <option value="new">New doors / heavy modification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Electrical work
                </label>
                <select
                  value={inputs.needsWiring ? 'yes' : 'no'}
                  onChange={(e) =>
                    onChange('needsWiring', e.target.value === 'yes')
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="no">No additional wiring</option>
                  <option value="yes">Requires cabling / conduit</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Overall complexity
              </label>
              <select
                value={inputs.complexity}
                onChange={(e) =>
                  onChange(
                    'complexity',
                    e.target.value as InstallationInputs['complexity'],
                  )
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="simple">Simple (few variants, easy access)</option>
                <option value="standard">Standard mixed doors</option>
                <option value="complex">Complex (many variants, restricted access)</option>
              </select>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Crew configuration
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Techs per crew
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={inputs.techsPerCrew}
                    onChange={(e) =>
                      onChange('techsPerCrew', Number(e.target.value))
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

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Estimate Installation Time
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Estimated effort
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Per-door estimate
                </div>
                <div className="mt-1 text-3xl font-bold text-primary-900">
                  {result.hoursPerDoor.toFixed(1)} h / door
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  For {inputs.doorCount} doors this results in approximately
                  {" "}
                  {result.totalHours.toFixed(1)} technician hours.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Crew schedule
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total technician hours</span>
                      <span className="font-medium text-gray-900">
                        {result.totalHours.toFixed(1)} h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crew-days (8h/day)</span>
                      <span className="font-medium text-gray-900">
                        {result.crewDays.toFixed(1)} days
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Labor cost envelope
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated labor</span>
                      <span className="font-medium text-gray-900">
                        ${result.laborCost.toFixed(0)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                      Actual quotes may differ based on union rates, travel
                      time, and site-specific constraints.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Use this estimate as a starting point for RFPs and scheduling.
                For large deployments, add contingency for site surveys,
                after-hours work, and coordination with other trades.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Enter your door mix and crew details, then click Estimate Installation Time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
