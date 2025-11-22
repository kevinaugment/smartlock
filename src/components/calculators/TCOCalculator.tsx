import { useState } from 'react';

interface TCOInputs {
  lockPrice: number;
  doorCount: number;
  protocol: 'wifi' | 'zigbee' | 'zwave' | 'thread';
  years: number;
  installType: 'diy' | 'pro';
  installCostPerDoor: number;
  dailyUsage: number;
  subscriptionPerDoorPerMonth: number;
  batteryPricePerSet: number;
  hubCostOverride: number | null;
}

interface TCOResult {
  hardware: number;
  batteries: number;
  hub: number;
  install: number;
  subscriptions: number;
  total: number;
  annualCost: number;
  perDoorCost: number;
  perDoorPerDay: number;
  hardwareShare: number;
  hubShare: number;
  installShare: number;
  batteriesShare: number;
  subscriptionsShare: number;
  mechanicalTotal: number;
  mechanicalAnnual: number;
  deltaVsMechanical: number;
  sensitivityBatteryTotal: number;
  sensitivitySubTotal: number;
}

function getDefaultHubCost(protocol: TCOInputs['protocol']): number {
  if (protocol === 'wifi') return 0;
  if (protocol === 'zigbee') return 80;
  if (protocol === 'zwave') return 120;
  return 150;
}

function adjustForUsage(dailyUsage: number): number {
  if (!dailyUsage || dailyUsage <= 0) return 1;
  const factor = 20 / dailyUsage;
  return Math.max(0.3, Math.min(2, factor));
}

export default function TCOCalculator() {
  const [inputs, setInputs] = useState<TCOInputs>({
    lockPrice: 200,
    doorCount: 3,
    protocol: 'zigbee',
    years: 5,
    installType: 'diy',
    installCostPerDoor: 100,
    dailyUsage: 10,
    subscriptionPerDoorPerMonth: 0,
    batteryPricePerSet: 8,
    hubCostOverride: null,
  });

  const [result, setResult] = useState<TCOResult | null>(null);

  const defaultHubCost = getDefaultHubCost(inputs.protocol);
  const hubCostValue = inputs.hubCostOverride ?? defaultHubCost;

  const calculateTCO = () => {
    const {
      lockPrice,
      doorCount,
      protocol,
      years,
      installType,
      installCostPerDoor,
      dailyUsage,
      subscriptionPerDoorPerMonth,
      batteryPricePerSet,
      hubCostOverride,
    } = inputs;

    const baseHubCost = getDefaultHubCost(protocol);
    const hub = hubCostOverride != null ? hubCostOverride : baseHubCost;

    const baseBatteryLifeMonths = protocol === 'wifi' ? 3 : protocol === 'thread' ? 10 : 12;
    const usageFactor = adjustForUsage(dailyUsage);
    const batteryLifeMonths = baseBatteryLifeMonths * usageFactor;

    const monthsTotal = years * 12;
    const replacementsPerLock =
      batteryLifeMonths > 0 ? monthsTotal / batteryLifeMonths : 0;
    const batteries = replacementsPerLock * batteryPricePerSet * doorCount;

    const hardware = lockPrice * doorCount;
    const install = installType === 'pro' ? installCostPerDoor * doorCount : 0;
    const subscriptions =
      subscriptionPerDoorPerMonth * 12 * years * doorCount;

    const initialCost = hardware + hub + install;
    const operatingCost = batteries + subscriptions;
    const total = initialCost + operatingCost;

    const hardwareShare = total > 0 ? (hardware / total) * 100 : 0;
    const hubShare = total > 0 ? (hub / total) * 100 : 0;
    const installShare = total > 0 ? (install / total) * 100 : 0;
    const batteriesShare = total > 0 ? (batteries / total) * 100 : 0;
    const subscriptionsShare =
      total > 0 ? (subscriptions / total) * 100 : 0;

    const annualCost = total / years;
    const perDoorCost = total / doorCount;
    const perDoorPerDay = total / (doorCount * years * 365);

    const mechanicalLockPrice = 50;
    const mechanicalTotal = mechanicalLockPrice * doorCount;
    const mechanicalAnnual = mechanicalTotal / years;
    const deltaVsMechanical = total - mechanicalTotal;

    const sensitivityBatteryTotal = total + batteries * 0.25;
    const subDeltaPerYear = 1 * 12 * doorCount;
    const sensitivitySubTotal = total + subDeltaPerYear * years;

    setResult({
      hardware,
      batteries,
      hub,
      install,
      subscriptions,
      total,
      annualCost,
      perDoorCost,
      perDoorPerDay,
      hardwareShare,
      hubShare,
      installShare,
      batteriesShare,
      subscriptionsShare,
      mechanicalTotal,
      mechanicalAnnual,
      deltaVsMechanical,
      sensitivityBatteryTotal,
      sensitivitySubTotal,
    });
  };

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Input Form */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your Deployment
          </h2>

          <div className="space-y-6">
            {/* Lock Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lock Price (per unit)
              </label>
              <div className="mt-1 flex items-center">
                <span className="mr-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={inputs.lockPrice}
                  onChange={(e) =>
                    setInputs({ ...inputs, lockPrice: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min="50"
                  max="500"
                />
              </div>
            </div>

            {/* Door Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Number of Doors
              </label>
              <input
                type="number"
                value={inputs.doorCount}
                onChange={(e) =>
                  setInputs({ ...inputs, doorCount: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="1"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Daily door operations
              </label>
              <input
                type="number"
                value={inputs.dailyUsage}
                onChange={(e) =>
                  setInputs({ ...inputs, dailyUsage: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="1"
                max="100"
              />
            </div>

            {/* Protocol */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Protocol
              </label>
              <select
                value={inputs.protocol}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    protocol: e.target.value as TCOInputs['protocol'],
                    hubCostOverride: null,
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="wifi">Wi-Fi (3 months battery)</option>
                <option value="zigbee">Zigbee (12 months battery)</option>
                <option value="zwave">Z-Wave (12 months battery)</option>
                <option value="thread">Thread (10 months battery)</option>
              </select>
            </div>

            {/* Years */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Period (years)
              </label>
              <input
                type="number"
                value={inputs.years}
                onChange={(e) =>
                  setInputs({ ...inputs, years: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="1"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Installation
              </label>
              <select
                value={inputs.installType}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    installType: e.target.value as TCOInputs['installType'],
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="diy">DIY (no labor cost)</option>
                <option value="pro">Professional install</option>
              </select>
              {inputs.installType === 'pro' && (
                <div className="mt-2 flex items-center">
                  <span className="mr-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={inputs.installCostPerDoor}
                    onChange={(e) =>
                      setInputs({
                        ...inputs,
                        installCostPerDoor: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    min="0"
                    max="500"
                  />
                  <span className="ml-2 text-sm text-gray-500">per door</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subscription ($/month/door)
              </label>
              <input
                type="number"
                value={inputs.subscriptionPerDoorPerMonth}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    subscriptionPerDoorPerMonth: Number(e.target.value),
                  })
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                min="0"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Battery price per set
              </label>
              <div className="mt-1 flex items-center">
                <span className="mr-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={inputs.batteryPricePerSet}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      batteryPricePerSet: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hub / Gateway cost
              </label>
              <div className="mt-1 flex items-center">
                <span className="mr-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={hubCostValue}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      hubCostOverride: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min="0"
                  max="1000"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Default for {inputs.protocol.toUpperCase()} is ${defaultHubCost.toFixed(0)}.
              </p>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateTCO}
              className="btn btn-primary w-full py-3 text-base"
            >
              Calculate TCO
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Total Cost of Ownership
          </h2>

          {result ? (
            <div className="space-y-4">
              {/* Total */}
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-600">
                  Total Cost ({inputs.years} years)
                </div>
                <div className="mt-1 text-4xl font-bold text-primary-900">
                  ${result.total.toFixed(0)}
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hardware</span>
                  <span className="font-semibold text-gray-900">
                    ${result.hardware.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hub/Gateway</span>
                  <span className="font-semibold text-gray-900">
                    ${result.hub.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Installation</span>
                  <span className="font-semibold text-gray-900">
                    ${result.install.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Batteries ({inputs.years} years)</span>
                  <span className="font-semibold text-gray-900">
                    ${result.batteries.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subscriptions ({inputs.years} years)</span>
                  <span className="font-semibold text-gray-900">
                    ${result.subscriptions.toFixed(0)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Initial investment</span>
                    <span className="font-semibold text-gray-900">
                      ${(result.hardware + result.hub + result.install).toFixed(0)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <span className="font-medium text-gray-900">Operating costs</span>
                    <span className="font-semibold text-gray-900">
                      ${(result.batteries + result.subscriptions).toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${result.total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Cost contribution by component
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hardware</span>
                    <span className="font-medium text-gray-900">
                      {result.hardwareShare.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hub / Gateway</span>
                    <span className="font-medium text-gray-900">
                      {result.hubShare.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Installation</span>
                    <span className="font-medium text-gray-900">
                      {result.installShare.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Batteries</span>
                    <span className="font-medium text-gray-900">
                      {result.batteriesShare.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscriptions</span>
                    <span className="font-medium text-gray-900">
                      {result.subscriptionsShare.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600">Annual Cost</div>
                  <div className="mt-1 text-xl font-bold text-gray-900">
                    ${result.annualCost.toFixed(0)}/yr
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600">Per Door Per Day</div>
                  <div className="mt-1 text-xl font-bold text-gray-900">
                    ${result.perDoorPerDay.toFixed(2)}/day
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Baseline vs mechanical locks
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Mechanical total ({inputs.years} years)
                    </span>
                    <span className="font-medium text-gray-900">
                      ${result.mechanicalTotal.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smart lock delta</span>
                    <span className="font-medium text-gray-900">
                      ${result.deltaVsMechanical.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Sensitivity (battery & subscription)
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery life -20%</span>
                    <span className="font-medium text-gray-900">
                      ${result.sensitivityBatteryTotal.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Subscription +$1/month/door
                    </span>
                    <span className="font-medium text-gray-900">
                      ${result.sensitivitySubTotal.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="rounded-lg bg-blue-50 p-4">
                <h3 className="font-semibold text-blue-900">💡 Key Insight</h3>
                <p className="mt-2 text-sm text-blue-800">
                  {inputs.protocol === 'wifi'
                    ? `Wi-Fi locks cost about $${(result.batteries / inputs.doorCount).toFixed(0)} more per door in batteries over ${inputs.years} years due to shorter battery life.`
                    : `${inputs.protocol.toUpperCase()} locks save on batteries with 12-month battery life, but require a $${result.hub} hub investment.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">Enter values and click Calculate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
