import { useState } from 'react';

type Platform = 'homekit' | 'google' | 'alexa' | 'smartthings' | 'none';

type Feature = 'remoteUnlock' | 'pinCodes' | 'eventHistory' | 'autoLock' | 'apiAccess';

interface IntegrationInputs {
  primaryPlatform: Platform;
  secondaryPlatform: Platform;
  requiredFeatures: Feature[];
  preferMatter: boolean;
}

type SupportLevel = 'native' | 'bridge' | 'none';

interface LockIntegrationSpec {
  id: string;
  brand: string;
  model: string;
  protocols: string[];
  matterReady: boolean;
  homekit: SupportLevel;
  google: SupportLevel;
  alexa: SupportLevel;
  smartthings: SupportLevel;
  features: Feature[];
  notes?: string;
}

interface IntegrationMatch {
  lock: LockIntegrationSpec;
  primarySupport: SupportLevel;
  secondarySupport: SupportLevel;
  score: number;
  missingFeatures: Feature[];
}

const LOCKS: LockIntegrationSpec[] = [
  {
    id: 'yale-assure-matter',
    brand: 'Yale',
    model: 'Assure Lock 2 (Matter)',
    protocols: ['matter', 'thread', 'ble'],
    matterReady: true,
    homekit: 'native',
    google: 'native',
    alexa: 'native',
    smartthings: 'bridge',
    features: ['remoteUnlock', 'pinCodes', 'eventHistory', 'autoLock', 'apiAccess'],
    notes: 'Strong all-round choice for multi-platform Matter deployments.',
  },
  {
    id: 'schlage-encode-wifi',
    brand: 'Schlage',
    model: 'Encode Wi-Fi',
    protocols: ['wifi', 'ble'],
    matterReady: false,
    homekit: 'none',
    google: 'native',
    alexa: 'native',
    smartthings: 'bridge',
    features: ['remoteUnlock', 'pinCodes', 'autoLock', 'eventHistory'],
    notes: 'Cloud-centric Wi-Fi lock with strong Google / Alexa support.',
  },
  {
    id: 'aqara-a100',
    brand: 'Aqara',
    model: 'A100 Zigbee',
    protocols: ['zigbee', 'ble'],
    matterReady: false,
    homekit: 'bridge',
    google: 'bridge',
    alexa: 'bridge',
    smartthings: 'bridge',
    features: ['remoteUnlock', 'pinCodes', 'autoLock'],
    notes: 'Requires vendor hub; strong keypad / local PIN support.',
  },
  {
    id: 'generic-zwave-pro',
    brand: 'Generic',
    model: 'Z-Wave Pro Deadbolt',
    protocols: ['zwave'],
    matterReady: false,
    homekit: 'none',
    google: 'bridge',
    alexa: 'bridge',
    smartthings: 'native',
    features: ['pinCodes', 'autoLock', 'eventHistory'],
    notes: 'Traditional Z-Wave lock ideal for SmartThings-style hubs.',
  },
];

const ALL_FEATURES: { id: Feature; label: string }[] = [
  { id: 'remoteUnlock', label: 'Remote unlock from phone' },
  { id: 'pinCodes', label: 'Individual PIN codes' },
  { id: 'eventHistory', label: 'Open/close event history' },
  { id: 'autoLock', label: 'Auto-lock after close' },
  { id: 'apiAccess', label: 'API / integration access' },
];

function supportForPlatform(lock: LockIntegrationSpec, platform: Platform): SupportLevel {
  if (platform === 'homekit') return lock.homekit;
  if (platform === 'google') return lock.google;
  if (platform === 'alexa') return lock.alexa;
  if (platform === 'smartthings') return lock.smartthings;
  return 'none';
}

function scoreLock(inputs: IntegrationInputs, lock: LockIntegrationSpec): IntegrationMatch {
  const primarySupport = supportForPlatform(lock, inputs.primaryPlatform);
  const secondarySupport = supportForPlatform(lock, inputs.secondaryPlatform);

  let score = 0;

  // Primary platform
  if (primarySupport === 'native') score += 40;
  else if (primarySupport === 'bridge') score += 20;
  else score -= 20;

  // Secondary platform
  if (inputs.secondaryPlatform !== 'none') {
    if (secondarySupport === 'native') score += 15;
    else if (secondarySupport === 'bridge') score += 8;
    else score -= 5;
  }

  // Features
  const missingFeatures = inputs.requiredFeatures.filter(
    (f) => !lock.features.includes(f),
  );
  score += (inputs.requiredFeatures.length - missingFeatures.length) * 5;
  if (missingFeatures.length > 0) score -= missingFeatures.length * 4;

  // Matter preference
  if (inputs.preferMatter) {
    if (lock.matterReady) score += 15;
    else score -= 5;
  }

  return { lock, primarySupport, secondarySupport, score, missingFeatures };
}

export default function SmartHomeIntegrationChecker() {
  const [inputs, setInputs] = useState<IntegrationInputs>({
    primaryPlatform: 'homekit',
    secondaryPlatform: 'google',
    requiredFeatures: ['remoteUnlock', 'pinCodes'],
    preferMatter: true,
  });

  const [results, setResults] = useState<IntegrationMatch[] | null>(null);

  const onToggleFeature = (feature: Feature) => {
    setInputs((prev) => {
      const next = prev.requiredFeatures.includes(feature)
        ? prev.requiredFeatures.filter((f) => f !== feature)
        : [...prev.requiredFeatures, feature];
      return { ...prev, requiredFeatures: next };
    });
  };

  const onChange = <K extends keyof IntegrationInputs>(
    key: K,
    value: IntegrationInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCheck = () => {
    const matches = LOCKS.map((lock) => scoreLock(inputs, lock)).sort(
      (a, b) => b.score - a.score,
    );
    setResults(matches);
  };

  const nativeList =
    results?.filter((m) => m.primarySupport === 'native') ?? [];
  const bridgeList =
    results?.filter(
      (m) => m.primarySupport === 'bridge' && m.score > -10,
    ) ?? [];
  const unsupportedList =
    results?.filter((m) => m.primarySupport === 'none' || m.score <= -10) ?? [];

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your smart home stack
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary platform
                </label>
                <select
                  value={inputs.primaryPlatform}
                  onChange={(e) =>
                    onChange(
                      'primaryPlatform',
                      e.target.value as IntegrationInputs['primaryPlatform'],
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="homekit">Apple Home / HomeKit</option>
                  <option value="google">Google Home</option>
                  <option value="alexa">Amazon Alexa</option>
                  <option value="smartthings">SmartThings / Hub-based</option>
                  <option value="none">None / starting from scratch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary platform (optional)
                </label>
                <select
                  value={inputs.secondaryPlatform}
                  onChange={(e) =>
                    onChange(
                      'secondaryPlatform',
                      e.target.value as IntegrationInputs['secondaryPlatform'],
                    )
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="none">None</option>
                  <option value="homekit">Apple Home / HomeKit</option>
                  <option value="google">Google Home</option>
                  <option value="alexa">Amazon Alexa</option>
                  <option value="smartthings">SmartThings / Hub-based</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Must-have features
              </label>
              <div className="mt-2 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                {ALL_FEATURES.map((f) => (
                  <label
                    key={f.id}
                    className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 hover:border-primary-400"
                  >
                    <input
                      type="checkbox"
                      checked={inputs.requiredFeatures.includes(f.id)}
                      onChange={() => onToggleFeature(f.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-800">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
              <div>
                <div className="font-medium text-gray-900">
                  Prefer Matter / Thread ecosystem
                </div>
                <p className="text-xs text-gray-600">
                  Boost locks that are Matter-ready or built on modern IP
                  protocols.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={inputs.preferMatter}
                  onChange={(e) => onChange('preferMatter', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Prefer Matter</span>
              </label>
            </div>

            <button
              onClick={onCheck}
              className="btn btn-primary w-full py-3 text-base"
            >
              Check Integration Compatibility
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Integration results
          </h2>

          {results ? (
            <div className="space-y-6">
              {nativeList.length > 0 && (
                <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm">
                  <div className="text-sm font-semibold text-emerald-800">
                    ✅ Native integration (no extra hub required)
                  </div>
                  {nativeList.map((m) => (
                    <div
                      key={m.lock.id}
                      className="rounded-md border border-emerald-200 bg-white p-3"
                    >
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {m.lock.brand} {m.lock.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            Protocols: {m.lock.protocols.join(', ')}
                            {m.lock.matterReady ? ' · Matter-ready' : ''}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-emerald-700">
                          Score {m.score.toFixed(0)}
                        </div>
                      </div>
                      {m.missingFeatures.length > 0 && (
                        <div className="mt-1 text-xs text-amber-700">
                          Missing: {m.missingFeatures.map((f) => f).join(', ')}
                        </div>
                      )}
                      {m.lock.notes && (
                        <div className="mt-1 text-xs text-gray-600">
                          {m.lock.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {bridgeList.length > 0 && (
                <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm">
                  <div className="text-sm font-semibold text-amber-800">
                    ⚠️ Works via vendor hub or bridge
                  </div>
                  {bridgeList.map((m) => (
                    <div
                      key={m.lock.id}
                      className="rounded-md border border-amber-200 bg-white p-3"
                    >
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {m.lock.brand} {m.lock.model}
                          </div>
                          <div className="text-xs text-gray-500">
                            Bridge / hub required for full integration.
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-amber-700">
                          Score {m.score.toFixed(0)}
                        </div>
                      </div>
                      {m.missingFeatures.length > 0 && (
                        <div className="mt-1 text-xs text-amber-700">
                          Missing: {m.missingFeatures.map((f) => f).join(', ')}
                        </div>
                      )}
                      {m.lock.notes && (
                        <div className="mt-1 text-xs text-gray-600">
                          {m.lock.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {unsupportedList.length > 0 && (
                <div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="text-sm font-semibold">
                    ❌ Not recommended for your current platforms
                  </div>
                  <ul className="mt-1 list-inside list-disc space-y-1">
                    {unsupportedList.map((m) => (
                      <li key={m.lock.id}>
                        {m.lock.brand} {m.lock.model}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Select your platforms and required features, then click Check Integration Compatibility.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
