import { useState } from 'react';

type Protocol = 'wifi' | 'zigbee' | 'zwave' | 'thread';

interface OfflineInputs {
  protocol: Protocol;
  hasKeypad: boolean;
  hasPhysicalKey: boolean;
  hasLocalHub: boolean;
  hasUps: boolean;
  hasCellularBackup: boolean;
  appOnly: boolean;
}

interface Scenario {
  name: string;
  impact: 'low' | 'medium' | 'high';
  description: string;
}

interface OfflineResult {
  score: number;
  level: 'excellent' | 'good' | 'fair' | 'poor';
  scenarios: Scenario[];
  weakPoints: string[];
  recommendations: string[];
}

function baseProtocolScore(protocol: Protocol): number {
  switch (protocol) {
    case 'wifi':
      return 40;
    case 'zigbee':
      return 65;
    case 'zwave':
      return 65;
    case 'thread':
      return 60;
    default:
      return 50;
  }
}

function impactLabel(impact: Scenario['impact']): string {
  if (impact === 'low') return 'Low impact';
  if (impact === 'medium') return 'Medium impact';
  return 'High impact';
}

function levelFromScore(score: number): OfflineResult['level'] {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

function calculateOffline(inputs: OfflineInputs): OfflineResult {
  let score = baseProtocolScore(inputs.protocol);
  const weakPoints: string[] = [];
  const recommendations: string[] = [];

  if (inputs.hasKeypad) {
    score += 10;
  } else {
    weakPoints.push('No local keypad for PIN entry when phones are unavailable');
    recommendations.push('Add a keypad so guests can enter without phones or apps.');
  }

  if (inputs.hasPhysicalKey) {
    score += 8;
  } else {
    weakPoints.push('No physical key override for extreme failure cases');
    recommendations.push('Keep at least one lock with a physical key cylinder.');
  }

  if (inputs.hasLocalHub) {
    score += 8;
  } else if (inputs.protocol !== 'wifi') {
    weakPoints.push('No local hub for offline automations and control');
    recommendations.push('Use a local hub so locks keep working when the cloud is down.');
  }

  if (inputs.hasUps) {
    score += 8;
  } else {
    weakPoints.push('No UPS for gateway/hub during power cuts');
    recommendations.push('Add a small UPS to keep the hub and router alive in outages.');
  }

  if (inputs.hasCellularBackup) {
    score += 6;
  } else {
    weakPoints.push('No cellular backup for broadband outages');
    recommendations.push('Consider LTE backup if remote management during outages is critical.');
  }

  if (inputs.appOnly) {
    score -= 15;
    weakPoints.push('Access depends entirely on smartphones and cloud apps');
    recommendations.push('Introduce at least one non-app access method (keypad, card, or key).');
  }

  if (inputs.protocol === 'wifi' && !inputs.hasLocalHub) {
    weakPoints.push('Wi-Fi locks often rely heavily on cloud; offline behavior varies by vendor');
  }

  score = Math.max(0, Math.min(100, score));
  const level = levelFromScore(score);

  const scenarios: Scenario[] = [
    {
      name: 'Internet outage',
      impact: inputs.hasLocalHub || inputs.protocol !== 'wifi' ? 'medium' : 'high',
      description:
        inputs.hasLocalHub || inputs.protocol !== 'wifi'
          ? 'Local hub and keypad keep basic lock/unlock working, but remote access may be limited.'
          : 'Cloud-only Wi-Fi locks may lose remote access and some automations until internet returns.',
    },
    {
      name: 'Power cut at property',
      impact: inputs.hasUps ? 'medium' : 'high',
      description:
        inputs.hasUps
          ? 'UPS keeps the hub and router alive for a short period; locks continue to work on battery.'
          : 'Locks still have battery, but hubs/routers go offline immediately, breaking remote control.',
    },
    {
      name: 'Guest phone lost / no battery',
      impact: inputs.hasKeypad || inputs.hasPhysicalKey ? 'low' : 'high',
      description:
        inputs.hasKeypad || inputs.hasPhysicalKey
          ? 'Guests can still enter using a keypad code or backup key.'
          : 'Without keypad or key, guests may be locked out until host intervenes.',
    },
  ];

  return {
    score,
    level,
    scenarios,
    weakPoints,
    recommendations,
  };
}

export default function OfflineResilienceScorecard() {
  const [inputs, setInputs] = useState<OfflineInputs>({
    protocol: 'zigbee',
    hasKeypad: true,
    hasPhysicalKey: true,
    hasLocalHub: true,
    hasUps: false,
    hasCellularBackup: false,
    appOnly: false,
  });

  const [result, setResult] = useState<OfflineResult | null>(null);

  const onChange = <K extends keyof OfflineInputs>(key: K, value: OfflineInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onToggle = (key: keyof OfflineInputs) => {
    setInputs((prev) => ({ ...prev, [key]: !prev[key] as any }));
  };

  const onCalculate = () => {
    const computed = calculateOffline(inputs);
    setResult(computed);
  };

  const levelColor =
    result?.level === 'excellent'
      ? 'text-emerald-700'
      : result?.level === 'good'
        ? 'text-emerald-600'
        : result?.level === 'fair'
          ? 'text-amber-700'
          : 'text-red-700';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your smart lock setup
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Primary protocol
              </label>
              <select
                value={inputs.protocol}
                onChange={(e) =>
                  onChange('protocol', e.target.value as OfflineInputs['protocol'])
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="wifi">Wi-Fi</option>
                <option value="zigbee">Zigbee</option>
                <option value="zwave">Z-Wave</option>
                <option value="thread">Thread</option>
              </select>
            </div>

            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Local access methods
              </div>
              <label className="mt-1 flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasKeypad}
                  onChange={() => onToggle('hasKeypad')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Keypad (PIN codes)</span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasPhysicalKey}
                  onChange={() => onToggle('hasPhysicalKey')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Physical key override</span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.appOnly}
                  onChange={() => onToggle('appOnly')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">App-only access (no local override)</span>
              </label>
            </div>

            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Infrastructure resilience
              </div>
              <label className="mt-1 flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasLocalHub}
                  onChange={() => onToggle('hasLocalHub')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">
                  Local hub / gateway (rules run even if cloud is down)
                </span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasUps}
                  onChange={() => onToggle('hasUps')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">UPS for router / hub</span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasCellularBackup}
                  onChange={() => onToggle('hasCellularBackup')}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Cellular backup for internet</span>
              </label>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Score Offline Resilience
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Offline resilience score
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Overall offline resilience
                </div>
                <div className="mt-1 flex items-baseline space-x-3">
                  <div className="text-4xl font-bold text-primary-900">
                    {result.score.toFixed(0)} / 100
                  </div>
                  <div className={`text-lg font-semibold ${levelColor}`}>
                    {result.level === 'excellent'
                      ? 'Excellent'
                      : result.level === 'good'
                        ? 'Good'
                        : result.level === 'fair'
                          ? 'Fair'
                          : 'Poor'}
                  </div>
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Higher scores mean your locks keep working more gracefully
                  during internet outages, power cuts, and phone problems.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Failure scenarios
                </div>
                <div className="space-y-3">
                  {result.scenarios.map((s) => (
                    <div key={s.name} className="rounded-md bg-gray-50 p-3">
                      <div className="flex items-baseline justify-between">
                        <div className="font-semibold text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-600">
                          {impactLabel(s.impact)}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-700">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.weakPoints.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <div className="mb-1 text-sm font-semibold">
                    Weak points detected
                  </div>
                  <ul className="list-inside list-disc space-y-1">
                    {result.weakPoints.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendations.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                  <div className="mb-1 text-sm font-semibold">
                    Suggested improvements
                  </div>
                  <ul className="list-inside list-disc space-y-1">
                    {result.recommendations.slice(0, 4).map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Describe your setup and click Score Offline Resilience.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
