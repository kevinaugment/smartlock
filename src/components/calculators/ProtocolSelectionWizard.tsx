import { useState } from 'react';

type ProtocolId = 'wifi' | 'zigbee' | 'zwave' | 'thread';

type BuildingType = 'house' | 'townhouse' | 'apartment' | 'office';
type DoorCountBucket = '1-3' | '4-10' | '11-30' | '30+';
type WifiCoverage = 'good' | 'partial' | 'none';
type HubWillingness = 'yes' | 'no' | 'unsure';
type Platform = 'homekit' | 'google' | 'alexa' | 'smartthings' | 'none';
type TechLevel = 'beginner' | 'enthusiast' | 'pro';
type BudgetSensitivity = 'low' | 'medium' | 'high';
type Priority = 'battery' | 'latency' | 'offline' | 'ecosystem' | 'open' | 'lowCost';

interface WizardInputs {
  buildingType: BuildingType;
  doorCountBucket: DoorCountBucket;
  wifiCoverage: WifiCoverage;
  hubWillingness: HubWillingness;
  platform: Platform;
  techLevel: TechLevel;
  budgetSensitivity: BudgetSensitivity;
  priority: Priority;
}

interface ProtocolScore {
  id: ProtocolId;
  name: string;
  score: number;
  reasons: string[];
  warnings: string[];
}

const PROTOCOLS: { id: ProtocolId; name: string }[] = [
  { id: 'wifi', name: 'Wi-Fi' },
  { id: 'zigbee', name: 'Zigbee' },
  { id: 'zwave', name: 'Z-Wave' },
  { id: 'thread', name: 'Thread' },
];

const PROTOCOL_SUMMARY: Record<
  ProtocolId,
  {
    subtitle: string;
    exampleLocks: string;
    tcoHint: string;
  }
> = {
  wifi: {
    subtitle: 'Direct cloud connectivity, simplest setup, no extra hub.',
    exampleLocks:
      'Typical examples: Schlage Encode / Encode Plus, August Wi-Fi, SwitchBot Wi-Fi bridge setups.',
    tcoHint:
      'Great when you have only a few doors and value simplicity over battery life and hub cost savings.',
  },
  zigbee: {
    subtitle: 'Mature low-power mesh; ideal for many doors on one site.',
    exampleLocks:
      'Typical examples: Yale Assure Zigbee variants, Aqara Zigbee locks bridged into hubs (Home Assistant, Hubitat, SmartThings).',
    tcoHint:
      'Requires a hub but usually wins on battery life and scalability in multi-door deployments.',
  },
  zwave: {
    subtitle: 'Established mesh standard in traditional smart home hubs.',
    exampleLocks:
      'Typical examples: Legacy Z-Wave deadbolts paired with SmartThings, Hubitat, or similar hubs.',
    tcoHint:
      'Good where Z-Wave infrastructure already exists; hardware choice can be more limited in some regions.',
  },
  thread: {
    subtitle: 'Modern IP mesh built for Matter and new ecosystems.',
    exampleLocks:
      'Typical examples: Yale Assure Lock 2 (Matter), newer Thread/Matter-capable lock models with Apple/Google border routers.',
    tcoHint:
      'Best fit when you are leaning into Matter/HomeKit/Google ecosystems and want long-term openness.',
  },
};

const BASE_SCORES: Record<ProtocolId, {
  battery: number;
  latency: number;
  coverage: number;
  offline: number;
  ecosystem: number;
  openness: number;
  complexity: number;
  cost: number;
}> = {
  wifi: {
    battery: 1,
    latency: 4,
    coverage: 2,
    offline: 2,
    ecosystem: 4,
    openness: 3,
    complexity: 2,
    cost: 3,
  },
  zigbee: {
    battery: 5,
    latency: 4,
    coverage: 5,
    offline: 4,
    ecosystem: 4,
    openness: 3,
    complexity: 3,
    cost: 4,
  },
  zwave: {
    battery: 5,
    latency: 3,
    coverage: 4,
    offline: 4,
    ecosystem: 3,
    openness: 2,
    complexity: 3,
    cost: 3,
  },
  thread: {
    battery: 4,
    latency: 4,
    coverage: 4,
    offline: 3,
    ecosystem: 4,
    openness: 5,
    complexity: 3,
    cost: 3,
  },
};

function scoreProtocols(inputs: WizardInputs): ProtocolScore[] {
  const {
    buildingType,
    doorCountBucket,
    wifiCoverage,
    hubWillingness,
    platform,
    techLevel,
    budgetSensitivity,
    priority,
  } = inputs;

  const scores: ProtocolScore[] = PROTOCOLS.map((p) => ({
    id: p.id,
    name: p.name,
    score: 0,
    reasons: [],
    warnings: [],
  }));

  const get = (id: ProtocolId) => scores.find((s) => s.id === id)!;

  // Base scores
  for (const p of scores) {
    const base = BASE_SCORES[p.id];
    p.score += base.battery + base.latency + base.coverage + base.offline + base.ecosystem + base.openness + base.cost;
  }

  // Door count & building type
  const manyDoors = doorCountBucket === '11-30' || doorCountBucket === '30+';
  if (manyDoors || buildingType === 'office') {
    get('zigbee').score += 6;
    get('zwave').score += 4;
    get('thread').score += 3;
    get('wifi').score -= 4;
    get('zigbee').reasons.push('Good fit for multi-door mesh deployments');
    get('zwave').reasons.push('Designed for multi-node smart home meshes');
    get('wifi').warnings.push('May struggle with many locks on Wi-Fi only');
  }

  // Wi-Fi coverage
  if (wifiCoverage === 'partial') {
    get('wifi').score -= 5;
    get('zigbee').score += 3;
    get('zwave').score += 3;
    get('thread').score += 3;
    get('wifi').warnings.push('Unreliable Wi-Fi coverage at some doors');
  } else if (wifiCoverage === 'none') {
    get('wifi').score -= 999; // effectively disqualify
    get('wifi').warnings.push('No Wi-Fi coverage, avoid Wi-Fi locks');
  }

  // Hub willingness
  if (hubWillingness === 'no') {
    get('zigbee').score -= 6;
    get('zwave').score -= 6;
    get('wifi').score += 3;
    get('thread').score += 4;
    get('zigbee').warnings.push('Requires a hub/gateway, but you prefer no hub');
    get('zwave').warnings.push('Requires a hub/gateway, but you prefer no hub');
  } else if (hubWillingness === 'yes') {
    get('zigbee').score += 4;
    get('zwave').score += 4;
    get('thread').score += 2;
    get('zigbee').reasons.push('You are willing to deploy a hub');
    get('zwave').reasons.push('You are willing to deploy a hub');
  }

  // Existing platform
  if (platform === 'homekit') {
    get('thread').score += 6;
    get('wifi').score += 2;
    get('thread').reasons.push('Excellent fit for HomeKit / Matter ecosystem');
  } else if (platform === 'google' || platform === 'alexa' || platform === 'smartthings') {
    get('zigbee').score += 4;
    get('zwave').score += 3;
    get('wifi').score += 2;
    get('zigbee').reasons.push('Strong support in major smart home hubs');
    get('zwave').reasons.push('Well supported by traditional smart home hubs');
  }

  // Tech level
  if (techLevel === 'beginner') {
    get('wifi').score += 4;
    get('thread').score += 3;
    get('zigbee').score -= 2;
    get('zwave').score -= 2;
    get('wifi').reasons.push('Simplest to deploy for beginners');
    get('zigbee').warnings.push('Hub and mesh tuning can be complex for beginners');
  } else if (techLevel === 'pro') {
    get('zigbee').score += 3;
    get('zwave').score += 3;
    get('thread').score += 2;
    get('zigbee').reasons.push('You can take advantage of advanced mesh setups');
  }

  // Budget sensitivity
  if (budgetSensitivity === 'high') {
    get('wifi').score += 2; // no hub cost
    get('zigbee').score -= 1;
    get('zwave').score -= 2;
    get('thread').score -= 1;
    get('zigbee').warnings.push('Requires hub investment which impacts tight budgets');
  } else if (budgetSensitivity === 'low') {
    get('thread').score += 3;
    get('zigbee').score += 2;
    get('thread').reasons.push('Low budget sensitivity lets you prioritize long-term benefits');
  }

  // Priority weighting
  const boost = (id: ProtocolId, amount: number, reason: string) => {
    const p = get(id);
    p.score += amount;
    p.reasons.push(reason);
  };

  if (priority === 'battery') {
    boost('zigbee', 5, 'Optimized for long battery life in meshes');
    boost('zwave', 4, 'Designed for low-power operation');
    get('wifi').score -= 4;
    get('wifi').warnings.push('Wi-Fi locks typically consume more battery');
  } else if (priority === 'latency') {
    boost('wifi', 3, 'Fast direct IP connectivity');
    boost('thread', 3, 'Fast low-power IP mesh');
  } else if (priority === 'offline') {
    boost('zigbee', 3, 'Works well with local hubs and automations');
    boost('zwave', 3, 'Strong history of local-first setups');
  } else if (priority === 'ecosystem') {
    boost('thread', 4, 'Aligned with Matter and modern ecosystems');
    boost('zigbee', 3, 'Wide smart home support across vendors');
  } else if (priority === 'open') {
    boost('thread', 5, 'Open standard designed for multi-vendor interoperability');
    boost('zigbee', 2, 'Mature, widely adopted open-ish ecosystem');
  } else if (priority === 'lowCost') {
    boost('wifi', 4, 'No dedicated hub required for most setups');
  }

  // Final normalization & sorting
  for (const p of scores) {
    if (p.score < 0) p.score = Math.max(p.score, -20);
  }

  scores.sort((a, b) => b.score - a.score);
  return scores;
}

export default function ProtocolSelectionWizard() {
  const [inputs, setInputs] = useState<WizardInputs>({
    buildingType: 'house',
    doorCountBucket: '1-3',
    wifiCoverage: 'good',
    hubWillingness: 'unsure',
    platform: 'none',
    techLevel: 'beginner',
    budgetSensitivity: 'medium',
    priority: 'battery',
  });

  const [results, setResults] = useState<ProtocolScore[] | null>(null);

  const onChange = <K extends keyof WizardInputs>(key: K, value: WizardInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const scored = scoreProtocols(inputs);
    setResults(scored);
  };

  const top3 = results ? results.slice(0, 3) : null;
  const notRecommended =
    results?.filter((p) => p.score < 0 || p.warnings.some((w) => w.includes('avoid'))) ?? [];

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Scenario</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Building type
                </label>
                <select
                  value={inputs.buildingType}
                  onChange={(e) => onChange('buildingType', e.target.value as BuildingType)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="house">Detached house</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="apartment">Apartment</option>
                  <option value="office">Office / commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of doors
                </label>
                <select
                  value={inputs.doorCountBucket}
                  onChange={(e) =>
                    onChange('doorCountBucket', e.target.value as DoorCountBucket)
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="1-3">1–3</option>
                  <option value="4-10">4–10</option>
                  <option value="11-30">11–30</option>
                  <option value="30+">30+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wi-Fi coverage
                </label>
                <select
                  value={inputs.wifiCoverage}
                  onChange={(e) =>
                    onChange('wifiCoverage', e.target.value as WifiCoverage)
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="good">Strong at every door</option>
                  <option value="partial">Weak at some doors</option>
                  <option value="none">No Wi-Fi at doors</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Willing to deploy a hub?
                </label>
                <select
                  value={inputs.hubWillingness}
                  onChange={(e) =>
                    onChange('hubWillingness', e.target.value as HubWillingness)
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="unsure">Not sure yet</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Existing smart home platform
                </label>
                <select
                  value={inputs.platform}
                  onChange={(e) => onChange('platform', e.target.value as Platform)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="none">None</option>
                  <option value="homekit">Apple Home / HomeKit</option>
                  <option value="google">Google Home</option>
                  <option value="alexa">Amazon Alexa</option>
                  <option value="smartthings">SmartThings / similar hub</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Technical comfort level
                </label>
                <select
                  value={inputs.techLevel}
                  onChange={(e) => onChange('techLevel', e.target.value as TechLevel)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="enthusiast">Enthusiast</option>
                  <option value="pro">Professional / integrator</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Budget sensitivity
                </label>
                <select
                  value={inputs.budgetSensitivity}
                  onChange={(e) =>
                    onChange('budgetSensitivity', e.target.value as BudgetSensitivity)
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Top priority
                </label>
                <select
                  value={inputs.priority}
                  onChange={(e) => onChange('priority', e.target.value as Priority)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="battery">Battery life</option>
                  <option value="latency">Response speed</option>
                  <option value="offline">Offline resilience</option>
                  <option value="ecosystem">Ecosystem / integrations</option>
                  <option value="open">Open standard / future-proof</option>
                  <option value="lowCost">Lowest upfront cost</option>
                </select>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Get Protocol Recommendations
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Recommended Protocols
          </h2>

          {top3 && top3.length > 0 ? (
            <div className="space-y-4">
              {top3.map((p, index) => (
                <div
                  key={p.id}
                  className="space-y-2 rounded-lg border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Option {index + 1}
                      </div>
                      <div className="text-xl font-bold text-gray-900">{p.name}</div>
                      <div className="mt-1 text-xs text-gray-500">
                        {PROTOCOL_SUMMARY[p.id].subtitle}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-primary-700">
                      Score {p.score.toFixed(0)}
                    </div>
                  </div>

                  {p.reasons.length > 0 && (
                    <div className="mt-2 text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">Why it fits:</div>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {p.reasons.slice(0, 4).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {p.warnings.length > 0 && (
                    <div className="mt-2 text-sm text-yellow-800">
                      <div className="font-semibold">Trade-offs:</div>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {p.warnings.slice(0, 3).map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-3 grid gap-2 text-xs text-gray-700 md:grid-cols-2">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Example locks / ecosystems
                      </div>
                      <p className="mt-1">
                        {PROTOCOL_SUMMARY[p.id].exampleLocks}
                      </p>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        TCO perspective
                      </div>
                      <p className="mt-1">
                        {PROTOCOL_SUMMARY[p.id].tcoHint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {notRecommended.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="font-semibold">Not recommended in this scenario</div>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {notRecommended.map((p) => (
                      <li key={p.id}>
                        {p.name} – {p.warnings[0] ?? 'Less aligned with your answers'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Fill in your scenario on the left and click Get Protocol Recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
