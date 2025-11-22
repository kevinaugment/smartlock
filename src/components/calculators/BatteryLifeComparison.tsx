import { useState } from 'react';

const PROTOCOLS = [
  { id: 'wifi' as const, label: 'Wi-Fi', baseLifeDays: 90 },
  { id: 'zigbee' as const, label: 'Zigbee', baseLifeDays: 365 },
  { id: 'zwave' as const, label: 'Z-Wave', baseLifeDays: 365 },
  { id: 'thread' as const, label: 'Thread', baseLifeDays: 300 },
  { id: 'bluetooth' as const, label: 'Bluetooth', baseLifeDays: 365 },
];

type ProtocolId = (typeof PROTOCOLS)[number]['id'];

type Temperature = 'normal' | 'cold' | 'freezing';

type BatteryTypeId = 'aa_alkaline' | 'aa_lithium' | 'cr123a';

const BATTERY_TYPES: { id: BatteryTypeId; label: string; lifeFactor: number }[] = [
  { id: 'aa_alkaline', label: 'AA alkaline', lifeFactor: 1 },
  { id: 'aa_lithium', label: 'AA lithium', lifeFactor: 1.4 },
  { id: 'cr123a', label: 'CR123A lithium', lifeFactor: 1.6 },
];

interface BatteryInputs {
  selectedProtocols: ProtocolId[];
  dailyOpenings: number;
  batteryPricePerSet: number;
  years: number;
  temperature: Temperature;
   batteryType: BatteryTypeId;
  autoLock: boolean;
  remoteQuery: boolean;
  alwaysOnWifi: boolean;
}

interface ProtocolResult {
  protocol: ProtocolId;
  label: string;
  lifeMonths: number;
  replacementsPerYear: number;
  annualCost: number;
  totalCost: number;
}

function getTemperatureFactor(temp: Temperature): number {
  switch (temp) {
    case 'cold':
      return 0.8;
    case 'freezing':
      return 0.6;
    default:
      return 1;
  }
}

function getFeatureFactor(protocol: ProtocolId, inputs: BatteryInputs): number {
  let factor = 1;

  if (inputs.autoLock) {
    factor *= 0.9;
  }

  if (inputs.remoteQuery) {
    factor *= 0.8;
  }

  if (protocol === 'wifi' && inputs.alwaysOnWifi) {
    factor *= 0.7;
  }

  return factor;
}

function getBatteryTypeFactor(batteryType: BatteryTypeId): number {
  const found = BATTERY_TYPES.find((b) => b.id === batteryType);
  return found?.lifeFactor ?? 1;
}

function calculateResults(inputs: BatteryInputs): ProtocolResult[] {
  const {
    selectedProtocols,
    dailyOpenings,
    batteryPricePerSet,
    years,
    temperature,
    batteryType,
  } = inputs;

  const usageFactor = dailyOpenings > 0 ? 20 / dailyOpenings : 1;
  const tempFactor = getTemperatureFactor(temperature);
  const batteryTypeFactor = getBatteryTypeFactor(batteryType);

  const results: ProtocolResult[] = [];

  for (const proto of PROTOCOLS) {
    if (!selectedProtocols.includes(proto.id)) continue;

    const featureFactor = getFeatureFactor(proto.id, inputs);
    const effectiveLifeDays =
      proto.baseLifeDays * tempFactor * featureFactor * usageFactor * batteryTypeFactor;

    const lifeMonths = effectiveLifeDays / 30;
    const replacementsPerYear = effectiveLifeDays > 0 ? 365 / effectiveLifeDays : 0;
    const annualCost = replacementsPerYear * batteryPricePerSet;
    const totalCost = annualCost * years;

    results.push({
      protocol: proto.id,
      label: proto.label,
      lifeMonths,
      replacementsPerYear,
      annualCost,
      totalCost,
    });
  }

  return results.sort((a, b) => a.annualCost - b.annualCost);
}

export default function BatteryLifeComparison() {
  const [inputs, setInputs] = useState<BatteryInputs>({
    selectedProtocols: ['wifi', 'zigbee', 'zwave', 'thread'],
    dailyOpenings: 20,
    batteryPricePerSet: 8,
    years: 3,
    temperature: 'normal',
    batteryType: 'aa_alkaline',
    autoLock: true,
    remoteQuery: false,
    alwaysOnWifi: true,
  });

  const [results, setResults] = useState<ProtocolResult[] | null>(null);

  const onToggleProtocol = (id: ProtocolId) => {
    setInputs((prev) => {
      const selected = prev.selectedProtocols.includes(id)
        ? prev.selectedProtocols.filter((p) => p !== id)
        : [...prev.selectedProtocols, id];

      return { ...prev, selectedProtocols: selected };
    });
  };

  const onCalculate = () => {
    const computed = calculateResults(inputs);
    setResults(computed);
  };

  const recommended = results && results[0];
  const batteryTypeLabel =
    BATTERY_TYPES.find((b) => b.id === inputs.batteryType)?.label ?? 'AA alkaline';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Usage Scenario
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Protocols to compare
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {PROTOCOLS.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:border-primary-400"
                  >
                    <input
                      type="checkbox"
                      checked={inputs.selectedProtocols.includes(p.id)}
                      onChange={() => onToggleProtocol(p.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-800">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily door operations
              </label>
              <div className="mt-1 flex items-center space-x-3">
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={inputs.dailyOpenings}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      dailyOpenings: Number(e.target.value),
                    })
                  }
                  className="flex-1"
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={inputs.dailyOpenings}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      dailyOpenings: Number(e.target.value),
                    })
                  }
                  className="w-20 rounded-md border border-gray-300 px-2 py-1 text-right focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-500">ops/day</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Environment
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { id: 'normal', label: 'Room temperature' },
                  { id: 'cold', label: 'Cold climate' },
                  { id: 'freezing', label: 'Freezing' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setInputs({
                        ...inputs,
                        temperature: opt.id as Temperature,
                      })
                    }
                    className={`rounded-full px-3 py-1 text-xs font-medium border ${
                      inputs.temperature === opt.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Features
              </label>
              <div className="mt-2 space-y-2 text-sm text-gray-700">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inputs.autoLock}
                    onChange={(e) =>
                      setInputs({ ...inputs, autoLock: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Auto-lock after each door close</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inputs.remoteQuery}
                    onChange={(e) =>
                      setInputs({ ...inputs, remoteQuery: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Frequent remote status checks</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inputs.alwaysOnWifi}
                    onChange={(e) =>
                      setInputs({ ...inputs, alwaysOnWifi: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Wi-Fi radio always on (for Wi-Fi locks)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Battery price per set
                </label>
                <div className="mt-1 flex items-center">
                  <span className="mr-2 text-gray-500">$</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={inputs.batteryPricePerSet}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        batteryPricePerSet: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Battery type
              </label>
              <select
                value={inputs.batteryType}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    batteryType: e.target.value as BatteryTypeId,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {BATTERY_TYPES.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Lithium chemistries typically last longer per set than alkaline
                in the same usage pattern.
              </p>
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Evaluation period (years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={inputs.years}
                  onChange={(e) =>
                    setInputs({ ...inputs, years: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Compare Battery Life
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Battery Life Comparison
          </h2>

          {results && results.length > 0 ? (
            <div className="space-y-6">
              {recommended && (
                <div className="rounded-lg bg-primary-50 p-6">
                  <div className="text-sm font-medium text-primary-600">
                    Recommended protocol
                  </div>
                  <div className="mt-1 text-2xl font-bold text-primary-900">
                    {recommended.label}
                  </div>
                  <p className="mt-2 text-sm text-primary-800">
                    Estimated battery life of approximately{' '}
                    {recommended.lifeMonths.toFixed(1)} months per set using{' '}
                    {BATTERY_TYPES.find((b) => b.id === inputs.batteryType)?.label} cells in this scenario, with about{' '}
                    {recommended.replacementsPerYear.toFixed(1)} replacements per
                    year and an annual battery cost of approximately $
                    {recommended.annualCost.toFixed(0)}.
                  </p>
                </div>
              )}

              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-700">
                        Protocol
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">
                        Est. life (months)
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">
                        Replacements / year
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">
                        Annual cost
                      </th>
                      <th className="px-4 py-2 text-right font-medium text-gray-700">
                        {inputs.years}-year cost
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {results.map((r) => (
                      <tr key={r.protocol}>
                        <td className="px-4 py-2 font-medium text-gray-900">
                          {r.label}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {r.lifeMonths.toFixed(1)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          {r.replacementsPerYear.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          ${r.annualCost.toFixed(0)}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">
                          ${r.totalCost.toFixed(0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Battery life estimates are based on relative protocol
                consumption and your usage parameters. Real-world performance may
                vary depending on lock model and environment.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Select protocols and parameters, then click Compare.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
