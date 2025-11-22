import { useState } from 'react';

interface SubInputs {
  doorCount: number;
  subscriptionPerDoorPerMonth: number;
  localSolutionUpfrontPerDoor: number;
  localSolutionAnnualMaintenancePerDoor: number;
  years: number;
  discountRatePercent: number;
}

interface SubResult {
  subscriptionTotal: number;
  purchaseTotal: number;
  breakevenYear: number | null;
  subscriptionNPV: number;
  purchaseNPV: number;
}

function npv(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((sum, cf, idx) => {
    const t = idx; // t=0 is now
    return sum + cf / Math.pow(1 + discountRate, t);
  }, 0);
}

function calculateSubComparison(inputs: SubInputs): SubResult {
  const {
    doorCount,
    subscriptionPerDoorPerMonth,
    localSolutionUpfrontPerDoor,
    localSolutionAnnualMaintenancePerDoor,
    years,
    discountRatePercent,
  } = inputs;

  const subAnnual = subscriptionPerDoorPerMonth * 12 * doorCount;
  const purchaseUpfront = localSolutionUpfrontPerDoor * doorCount;
  const purchaseAnnual = localSolutionAnnualMaintenancePerDoor * doorCount;

  const subscriptionTotal = subAnnual * years;
  const purchaseTotal = purchaseUpfront + purchaseAnnual * years;

  let breakevenYear: number | null = null;
  let subCum = 0;
  let purchaseCum = purchaseUpfront;

  for (let year = 1; year <= years; year++) {
    subCum += subAnnual;
    purchaseCum += purchaseAnnual;
    if (subCum >= purchaseCum && breakevenYear === null) {
      breakevenYear = year;
      break;
    }
  }

  const r = discountRatePercent / 100;

  const subCashFlows: number[] = [0];
  const purchaseCashFlows: number[] = [-purchaseUpfront];

  for (let y = 1; y <= years; y++) {
    subCashFlows.push(-subAnnual);
    purchaseCashFlows.push(-purchaseAnnual);
  }

  const subscriptionNPV = npv(subCashFlows, r);
  const purchaseNPV = npv(purchaseCashFlows, r);

  return {
    subscriptionTotal,
    purchaseTotal,
    breakevenYear,
    subscriptionNPV,
    purchaseNPV,
  };
}

export default function SubscriptionVsPurchaseComparison() {
  const [inputs, setInputs] = useState<SubInputs>({
    doorCount: 10,
    subscriptionPerDoorPerMonth: 3,
    localSolutionUpfrontPerDoor: 220,
    localSolutionAnnualMaintenancePerDoor: 10,
    years: 5,
    discountRatePercent: 8,
  });

  const [result, setResult] = useState<SubResult | null>(null);

  const onChange = <K extends keyof SubInputs>(key: K, value: SubInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateSubComparison(inputs);
    setResult(computed);
  };

  const npvBetterLabel =
    result && result.subscriptionNPV < result.purchaseNPV
      ? 'Subscription has lower NPV cost over this horizon.'
      : result && result.subscriptionNPV > result.purchaseNPV
        ? 'Local purchase has lower NPV cost over this horizon.'
        : 'Both options are roughly equal in NPV terms.';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Subscription vs local purchase
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Evaluation period (years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={inputs.years}
                  onChange={(e) =>
                    onChange('years', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Cloud subscription model
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Subscription ($/month/door)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={inputs.subscriptionPerDoorPerMonth}
                    onChange={(e) =>
                      onChange(
                        'subscriptionPerDoorPerMonth',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Local / buy-out model
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600">
                    Upfront software / hardware per door ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={inputs.localSolutionUpfrontPerDoor}
                    onChange={(e) =>
                      onChange(
                        'localSolutionUpfrontPerDoor',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600">
                    Annual maintenance per door ($)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={inputs.localSolutionAnnualMaintenancePerDoor}
                    onChange={(e) =>
                      onChange(
                        'localSolutionAnnualMaintenancePerDoor',
                        Number(e.target.value),
                      )
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-gray-200 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Financial assumptions
              </div>
              <div>
                <label className="block text-xs text-gray-600">
                  Discount rate (% per year)
                </label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={inputs.discountRatePercent}
                  onChange={(e) =>
                    onChange('discountRatePercent', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Compare Subscription vs Purchase
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Cost comparison
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Subscription model ({inputs.years} years)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total spend</span>
                      <span className="font-semibold text-gray-900">
                        ${result.subscriptionTotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NPV of payments</span>
                      <span className="font-semibold text-gray-900">
                        ${result.subscriptionNPV.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-2 text-sm font-semibold text-gray-900">
                    Local / buy-out model ({inputs.years} years)
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total spend</span>
                      <span className="font-semibold text-gray-900">
                        ${result.purchaseTotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NPV of costs</span>
                      <span className="font-semibold text-gray-900">
                        ${result.purchaseNPV.toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-primary-50 p-6 text-sm text-primary-800">
                <div className="text-sm font-semibold text-primary-900">
                  Interpretation
                </div>
                <p className="mt-1">
                  {npvBetterLabel}
                </p>
                <p className="mt-2">
                  {result.breakevenYear
                    ? `Cumulative subscription spend overtakes local purchase after about ${result.breakevenYear.toFixed(1)} year(s).`
                    : 'Within the selected horizon, subscription spend does not exceed local purchase.'}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                This is a high-level financial comparison and does not include
                taxes, financing costs, or differences in feature sets. Use it
                to frame vendor quotes, not as a final investment decision.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Fill in door count, subscription, and buy-out pricing, then click Compare.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
