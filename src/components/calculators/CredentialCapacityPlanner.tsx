import { useState } from 'react';

interface CapacityInputs {
  lockCapacity: number;
  longTermUsers: number;
  staffUsers: number;
  tempUsersPerWeek: number;
  tempRetentionDays: number;
  safetyMarginPercent: number;
}

interface CapacityResult {
  effectiveCapacity: number;
  concurrentTempSlots: number;
  totalRequiredSlots: number;
  utilizationPercent: number;
  overCapacity: boolean;
  recommendedLongTermPerLock: number;
  recommendedTempPerLock: number;
}

function calculateCapacity(inputs: CapacityInputs): CapacityResult {
  const safetyFactor = 1 - inputs.safetyMarginPercent / 100;
  const effectiveCapacity = inputs.lockCapacity * safetyFactor;

  const concurrentTempSlots =
    inputs.tempUsersPerWeek * (inputs.tempRetentionDays / 7);

  const totalRequiredSlots =
    inputs.longTermUsers + inputs.staffUsers + concurrentTempSlots;

  const utilizationPercent =
    effectiveCapacity > 0 ? (totalRequiredSlots / effectiveCapacity) * 100 : 0;

  const overCapacity = totalRequiredSlots > effectiveCapacity;

  const recommendedLongTermPerLock =
    inputs.longTermUsers + inputs.staffUsers;
  const recommendedTempPerLock = Math.ceil(concurrentTempSlots);

  return {
    effectiveCapacity,
    concurrentTempSlots,
    totalRequiredSlots,
    utilizationPercent,
    overCapacity,
    recommendedLongTermPerLock,
    recommendedTempPerLock,
  };
}

export default function CredentialCapacityPlanner() {
  const [inputs, setInputs] = useState<CapacityInputs>({
    lockCapacity: 250,
    longTermUsers: 50,
    staffUsers: 20,
    tempUsersPerWeek: 40,
    tempRetentionDays: 7,
    safetyMarginPercent: 20,
  });

  const [result, setResult] = useState<CapacityResult | null>(null);

  const onChange = <K extends keyof CapacityInputs>(
    key: K,
    value: CapacityInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateCapacity(inputs);
    setResult(computed);
  };

  const riskColor =
    result && result.utilizationPercent >= 100
      ? 'text-red-700'
      : result && result.utilizationPercent >= 80
        ? 'text-amber-700'
        : 'text-emerald-700';

  const riskLabel =
    result && result.utilizationPercent >= 100
      ? 'Over capacity — high risk'
      : result && result.utilizationPercent >= 80
        ? 'Near capacity — watch closely'
        : 'Within safe capacity';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Lock credential capacity
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credential slots per lock
              </label>
              <input
                type="number"
                min={20}
                max={1000}
                value={inputs.lockCapacity}
                onChange={(e) =>
                  onChange('lockCapacity', Number(e.target.value))
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Check your lock spec sheet for maximum PIN / credential count.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Long-term users
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={inputs.longTermUsers}
                  onChange={(e) =>
                    onChange('longTermUsers', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Staff / service users
                </label>
                <input
                  type="number"
                  min={0}
                  max={1000}
                  value={inputs.staffUsers}
                  onChange={(e) =>
                    onChange('staffUsers', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temp users / week
                </label>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  value={inputs.tempUsersPerWeek}
                  onChange={(e) =>
                    onChange('tempUsersPerWeek', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temp credential retention (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={inputs.tempRetentionDays}
                  onChange={(e) =>
                    onChange('tempRetentionDays', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Safety margin (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={inputs.safetyMarginPercent}
                  onChange={(e) =>
                    onChange('safetyMarginPercent', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Reserve some capacity for emergencies and future growth.
                </p>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Check Capacity Risk
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Capacity risk assessment
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Utilization at peak
                </div>
                <div className="mt-1 flex items-baseline space-x-3">
                  <div className="text-4xl font-bold text-primary-900">
                    {result.utilizationPercent.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-semibold ${riskColor}`}>
                    {riskLabel}
                  </div>
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Effective capacity after safety margin:{' '}
                  {result.effectiveCapacity.toFixed(0)} slots. Estimated peak
                  requirement:{' '}
                  {result.totalRequiredSlots.toFixed(0)} active credentials.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Composition at peak
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Long-term + staff</span>
                      <span className="font-medium text-gray-900">
                        {(inputs.longTermUsers + inputs.staffUsers).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Concurrent temp users</span>
                      <span className="font-medium text-gray-900">
                        {result.concurrentTempSlots.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Suggested allocation per lock
                  </div>
                  <p className="text-gray-700">
                    Aim to keep around{' '}
                    <span className="font-semibold">
                      {result.recommendedLongTermPerLock.toFixed(0)}
                    </span>{' '}
                    long-term/staff users and{' '}
                    <span className="font-semibold">
                      {result.recommendedTempPerLock.toFixed(0)}
                    </span>{' '}
                    temp users active per lock at any time. Use zoning (staff
                    vs visitors) when you approach limits.
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                If utilization is consistently above 80%, consider splitting
                user groups across multiple locks or choosing a model with
                higher credential capacity.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Enter your user mix, then click Check Capacity Risk.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
