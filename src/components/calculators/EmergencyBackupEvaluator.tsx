import { useState } from 'react';

type BackupOption =
  | 'physicalKey'
  | 'keypad'
  | 'cardTag'
  | 'nearbySpare'
  | 'lockbox'
  | 'buildingSecurity'
  | 'concierge'
  | 'remoteSupport';

interface BackupInputs {
  hasLowBatteryAlerts: boolean;
  hasAutoLock: boolean;
  backupOptions: BackupOption[];
  typicalResponseMinutes: number;
  guestPhonesOftenDead: boolean;
}

interface Scenario {
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
}

interface BackupResult {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  scenarios: Scenario[];
  missingBasics: string[];
  recommendations: string[];
}

const BACKUP_OPTIONS: { id: BackupOption; label: string }[] = [
  { id: 'physicalKey', label: 'Physical backup key available nearby' },
  { id: 'keypad', label: 'Local keypad / PIN entry' },
  { id: 'cardTag', label: 'RF card / NFC tag access' },
  { id: 'nearbySpare', label: 'Neighbor or staff holds spare key' },
  { id: 'lockbox', label: 'Mechanical lockbox with backup key' },
  { id: 'buildingSecurity', label: 'Building security can assist 24/7' },
  { id: 'concierge', label: 'On-site concierge / front desk' },
  { id: 'remoteSupport', label: 'Remote support can trigger unlock' },
];

function calculateBackup(inputs: BackupInputs): BackupResult {
  let score = 60; // baseline
  const missingBasics: string[] = [];
  const recommendations: string[] = [];

  const hasPhysicalKey = inputs.backupOptions.includes('physicalKey');
  const hasKeypad = inputs.backupOptions.includes('keypad');
  const hasNearbySpare = inputs.backupOptions.includes('nearbySpare');
  const hasLockbox = inputs.backupOptions.includes('lockbox');
  const hasStaff =
    inputs.backupOptions.includes('buildingSecurity') ||
    inputs.backupOptions.includes('concierge');

  if (hasPhysicalKey) score += 15;
  if (hasKeypad) score += 15;
  if (hasNearbySpare) score += 10;
  if (hasLockbox) score += 10;
  if (hasStaff) score += 10;
  if (inputs.backupOptions.includes('remoteSupport')) score += 5;

  if (!hasPhysicalKey && !hasLockbox) {
    missingBasics.push('No physical key available as a last resort.');
    recommendations.push(
      'Ensure at least one physical key is stored in a secure but reachable place.',
    );
  }

  if (!hasKeypad && !hasCardOrTag(inputs.backupOptions)) {
    missingBasics.push('No local credential method independent of phones.');
    recommendations.push(
      'Add a keypad or card/tag reader so guests can enter without phones.',
    );
  }

  if (!hasNearbySpare && !hasStaff) {
    missingBasics.push('No nearby human who can help unlock in emergencies.');
    recommendations.push(
      'Arrange a neighbor, staff member, or security team who can assist with lockouts.',
    );
  }

  if (!inputs.hasLowBatteryAlerts) {
    score -= 10;
    recommendations.push(
      'Enable and monitor low-battery alerts to avoid complete power loss.',
    );
  }

  if (inputs.hasAutoLock) {
    score -= 5;
    recommendations.push(
      'With auto-lock enabled, make sure at least one non-phone backup method exists.',
    );
  }

  if (inputs.guestPhonesOftenDead) {
    score -= 10;
    recommendations.push(
      'If guest phones are often dead, prioritize keypad or card/tag entry.',
    );
  }

  if (inputs.typicalResponseMinutes > 60) {
    score -= 15;
    recommendations.push(
      'Reduce typical emergency response time below 60 minutes if possible.',
    );
  } else if (inputs.typicalResponseMinutes > 30) {
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  let riskLevel: BackupResult['riskLevel'];
  if (score >= 75) riskLevel = 'low';
  else if (score >= 50) riskLevel = 'medium';
  else riskLevel = 'high';

  const scenarios: Scenario[] = [
    {
      name: 'Battery fully drained',
      impact: hasPhysicalKey || hasLockbox ? 'medium' : 'high',
      description:
        hasPhysicalKey || hasLockbox
          ? 'Physical backup key or lockbox allows entry even if the lock battery is fully drained.'
          : 'Without a physical backup, a dead battery could require drilling or a locksmith.',
    },
    {
      name: 'Guest phone lost / no battery',
      impact: hasKeypad || hasCardOrTag(inputs.backupOptions) ? 'low' : 'high',
      description:
        hasKeypad || hasCardOrTag(inputs.backupOptions)
          ? 'Guests can still enter using keypad codes or cards/tags.'
          : 'If access depends on phones and apps, a dead phone can cause a lockout.',
    },
    {
      name: 'Host unreachable',
      impact: hasNearbySpare || hasStaff ? 'medium' : 'high',
      description:
        hasNearbySpare || hasStaff
          ? 'A neighbor, concierge, or security team can help unlock in an emergency.'
          : 'If only the host can resolve issues and they are unreachable, guests may be locked out for a long time.',
    },
  ];

  return {
    riskScore: score,
    riskLevel,
    scenarios,
    missingBasics,
    recommendations,
  };
}

function hasCardOrTag(options: BackupOption[]): boolean {
  return options.includes('cardTag');
}

export default function EmergencyBackupEvaluator() {
  const [inputs, setInputs] = useState<BackupInputs>({
    hasLowBatteryAlerts: true,
    hasAutoLock: true,
    backupOptions: ['physicalKey', 'keypad', 'nearbySpare'],
    typicalResponseMinutes: 45,
    guestPhonesOftenDead: false,
  });

  const [result, setResult] = useState<BackupResult | null>(null);

  const onToggleOption = (opt: BackupOption) => {
    setInputs((prev) => {
      const active = prev.backupOptions.includes(opt);
      return {
        ...prev,
        backupOptions: active
          ? prev.backupOptions.filter((o) => o !== opt)
          : [...prev.backupOptions, opt],
      };
    });
  };

  const onChange = <K extends keyof BackupInputs>(key: K, value: BackupInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onEvaluate = () => {
    const computed = calculateBackup(inputs);
    setResult(computed);
  };

  const riskColor =
    result?.riskLevel === 'low'
      ? 'text-emerald-700'
      : result?.riskLevel === 'medium'
        ? 'text-amber-700'
        : 'text-red-700';

  const riskLabel =
    result?.riskLevel === 'low'
      ? 'Well-prepared for emergencies'
      : result?.riskLevel === 'medium'
        ? 'Some gaps in emergency preparedness'
        : 'High lockout risk in emergencies';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Your backup setup
          </h2>

          <div className="space-y-6">
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                Backup access options
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                {BACKUP_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex cursor-pointer items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 hover:border-primary-400"
                  >
                    <input
                      type="checkbox"
                      checked={inputs.backupOptions.includes(opt.id)}
                      onChange={() => onToggleOption(opt.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="text-sm font-medium text-gray-900">
                System behavior
              </div>
              <label className="mt-1 flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasLowBatteryAlerts}
                  onChange={(e) => onChange('hasLowBatteryAlerts', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Low-battery alerts are enabled and monitored</span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.hasAutoLock}
                  onChange={(e) => onChange('hasAutoLock', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Auto-lock is enabled</span>
              </label>
              <label className="flex cursor-pointer items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inputs.guestPhonesOftenDead}
                  onChange={(e) =>
                    onChange('guestPhonesOftenDead', e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-800">Guest phones are often low / out of battery</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Typical emergency response time (minutes)
              </label>
              <input
                type="number"
                min={5}
                max={240}
                value={inputs.typicalResponseMinutes}
                onChange={(e) =>
                  onChange('typicalResponseMinutes', Number(e.target.value))
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <button
              onClick={onEvaluate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Evaluate Emergency Backup
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Emergency risk score
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Overall emergency resilience
                </div>
                <div className="mt-1 flex items-baseline space-x-3">
                  <div className="text-4xl font-bold text-primary-900">
                    {result.riskScore.toFixed(0)} / 100
                  </div>
                  <div className={`text-lg font-semibold ${riskColor}`}>
                    {riskLabel}
                  </div>
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Higher scores mean you have multiple independent ways to
                  recover from lockouts when power, batteries, phones, or cloud
                  services fail.
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
                          {s.impact === 'low'
                            ? 'Low impact'
                            : s.impact === 'medium'
                              ? 'Medium impact'
                              : 'High impact'}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-gray-700">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.missingBasics.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <div className="mb-1 text-sm font-semibold">
                    Missing basic safeguards
                  </div>
                  <ul className="list-inside list-disc space-y-1">
                    {result.missingBasics.map((m, idx) => (
                      <li key={idx}>{m}</li>
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
                    {result.recommendations.slice(0, 5).map((r, idx) => (
                      <li key={idx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Select your backup options and click Evaluate Emergency Backup.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
