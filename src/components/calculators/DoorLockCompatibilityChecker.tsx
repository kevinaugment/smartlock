import { useState } from 'react';

interface CompatibilityInputs {
  doorType: 'wood' | 'steel' | 'glass' | 'iron';
  lockHoleType: 'deadbolt' | 'mortise' | 'none';
  thicknessMm: number;
  backsetMm: number;
  region: 'ansi' | 'din' | 'gb';
}

interface LockSpec {
  id: string;
  brand: string;
  model: string;
  protocols: string[];
  doorTypes: CompatibilityInputs['doorType'][];
  lockHoleType: CompatibilityInputs['lockHoleType'][];
  minThickness: number;
  maxThickness: number;
  backsetOptions: number[];
  regionStandards: CompatibilityInputs['region'][];
  notes?: string;
}

interface MatchResult {
  lock: LockSpec;
  score: number;
  issues: string[];
}

const LOCK_DB: LockSpec[] = [
  {
    id: 'yale-assure-1',
    brand: 'Yale',
    model: 'Assure Lock 2',
    protocols: ['zigbee', 'zwave', 'matter'],
    doorTypes: ['wood', 'steel'],
    lockHoleType: ['mortise'],
    minThickness: 35,
    maxThickness: 57,
    backsetOptions: [60, 70],
    regionStandards: ['ansi'],
    notes: 'Popular North American mortise-style retrofit',
  },
  {
    id: 'schlage-encode',
    brand: 'Schlage',
    model: 'Encode',
    protocols: ['wifi'],
    doorTypes: ['wood', 'steel'],
    lockHoleType: ['deadbolt'],
    minThickness: 35,
    maxThickness: 51,
    backsetOptions: [60, 70],
    regionStandards: ['ansi'],
    notes: 'Standard deadbolt replacement for ANSI doors',
  },
  {
    id: 'aqara-din-eu',
    brand: 'Aqara',
    model: 'Smart Lock A100',
    protocols: ['zigbee', 'ble'],
    doorTypes: ['wood', 'steel'],
    lockHoleType: ['mortise'],
    minThickness: 40,
    maxThickness: 90,
    backsetOptions: [55],
    regionStandards: ['din'],
    notes: 'European DIN multipoint compatible',
  },
  {
    id: 'generic-glass',
    brand: 'Generic',
    model: 'Glass Door Smart Lock',
    protocols: ['ble'],
    doorTypes: ['glass'],
    lockHoleType: ['none'],
    minThickness: 8,
    maxThickness: 15,
    backsetOptions: [],
    regionStandards: ['ansi', 'din', 'gb'],
    notes: 'Clamp-on style for frameless glass doors',
  },
];

function scoreLock(inputs: CompatibilityInputs, lock: LockSpec): MatchResult {
  let score = 0;
  const issues: string[] = [];

  // Door type
  if (lock.doorTypes.includes(inputs.doorType)) {
    score += 30;
  } else {
    issues.push('Door material not ideal for this lock');
  }

  // Lock hole type
  if (lock.lockHoleType.includes(inputs.lockHoleType)) {
    score += 25;
  } else if (inputs.lockHoleType === 'none' && lock.lockHoleType.includes('deadbolt')) {
    issues.push('Requires drilling a new deadbolt hole');
  } else {
    issues.push('Existing lock hole type may not match this lock');
  }

  // Thickness
  if (inputs.thicknessMm >= lock.minThickness && inputs.thicknessMm <= lock.maxThickness) {
    score += 25;
  } else {
    issues.push(`Door thickness outside supported range ${lock.minThickness}-${lock.maxThickness}mm`);
  }

  // Backset
  if (lock.backsetOptions.length === 0) {
    // e.g. clamp-on glass lock
    score += 10;
  } else if (lock.backsetOptions.includes(inputs.backsetMm)) {
    score += 10;
  } else {
    issues.push(`Backset ${inputs.backsetMm}mm not in supported options: ${lock.backsetOptions.join(', ')}mm`);
  }

  // Region standard
  if (lock.regionStandards.includes(inputs.region)) {
    score += 10;
  } else {
    issues.push('Region standard may not match (different latch / box size)');
  }

  return { lock, score, issues };
}

function getCompatibilityLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Directly compatible', color: 'text-emerald-700' };
  if (score >= 55) return { label: 'Compatible with adapter', color: 'text-amber-700' };
  return { label: 'Not recommended', color: 'text-red-700' };
}

function getInstallInfo(label: string): { difficulty: string; accessories: string } {
  if (label === 'Directly compatible') {
    return {
      difficulty: 'Simple DIY with basic tools (screwdriver, drill for screws only).',
      accessories: 'Usually none beyond what ships in the box.',
    };
  }
  if (label === 'Compatible with adapter') {
    return {
      difficulty: 'Intermediate install; may require chiseling, adapter plates, or latch adjustments.',
      accessories:
        'Backset adapter or latch kit, strike plate shim, or region-specific mounting plate.',
    };
  }
  return {
    difficulty: 'Professional install recommended; door prep likely needs modification.',
    accessories:
      'Consider alternative lock or door hardware; installers may supply custom plates or mortise boxes.',
  };
}

export default function DoorLockCompatibilityChecker() {
  const [inputs, setInputs] = useState<CompatibilityInputs>({
    doorType: 'wood',
    lockHoleType: 'deadbolt',
    thicknessMm: 45,
    backsetMm: 60,
    region: 'ansi',
  });

  const [results, setResults] = useState<MatchResult[] | null>(null);

  const onChange = <K extends keyof CompatibilityInputs>(
    key: K,
    value: CompatibilityInputs[K],
  ) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCheck = () => {
    const matches = LOCK_DB.map((lock) => scoreLock(inputs, lock))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setResults(matches);
  };

  const bestScore = results && results.length > 0 ? results[0].score : null;
  const rating =
    bestScore != null ? getCompatibilityLabel(bestScore) : { label: '', color: '' };

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Your Door</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Door material
              </label>
              <select
                value={inputs.doorType}
                onChange={(e) => onChange('doorType', e.target.value as CompatibilityInputs['doorType'])}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="wood">Standard wooden door</option>
                <option value="steel">Steel security door</option>
                <option value="glass">Frameless glass door</option>
                <option value="iron">Iron gate / metal grill</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Existing lock type
              </label>
              <select
                value={inputs.lockHoleType}
                onChange={(e) =>
                  onChange('lockHoleType', e.target.value as CompatibilityInputs['lockHoleType'])
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="deadbolt">Round deadbolt hole</option>
                <option value="mortise">Rectangular mortise box</option>
                <option value="none">No existing hole</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Door thickness (mm)
                </label>
                <input
                  type="number"
                  value={inputs.thicknessMm}
                  onChange={(e) => onChange('thicknessMm', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min={20}
                  max={120}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Backset (mm)
                </label>
                <input
                  type="number"
                  value={inputs.backsetMm}
                  onChange={(e) => onChange('backsetMm', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  min={40}
                  max={80}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Region standard
              </label>
              <select
                value={inputs.region}
                onChange={(e) => onChange('region', e.target.value as CompatibilityInputs['region'])}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ansi">North America (ANSI)</option>
                <option value="din">Europe (DIN)</option>
                <option value="gb">China (GB)</option>
              </select>
            </div>

            <button
              onClick={onCheck}
              className="btn btn-primary w-full py-3 text-base"
            >
              Check Compatibility
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Compatibility Result</h2>

          {results && results.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="text-sm font-medium text-gray-600">
                  Overall rating
                </div>
                <div className={`mt-1 text-2xl font-bold ${rating.color}`}>
                  {rating.label}
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  Based on door material, thickness, backset, and regional
                  standards. Review the lock list below for detailed notes and
                  potential adapter requirements.
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Recommended locks
                </h3>
                <div className="space-y-4">
                  {results.map((m) => {
                    const label = getCompatibilityLabel(m.score);
                    const installInfo = getInstallInfo(label.label);
                    return (
                      <div
                        key={m.lock.id}
                        className="rounded-md border border-gray-200 p-4 text-sm"
                      >
                        <div className="flex items-baseline justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {m.lock.brand} {m.lock.model}
                            </div>
                            <div className="text-xs text-gray-500">
                              Protocols: {m.lock.protocols.join(', ')}
                            </div>
                          </div>
                          <div className={`text-xs font-semibold ${label.color}`}>
                            {label.label} · Score {m.score.toFixed(0)}
                          </div>
                        </div>
                        {m.lock.notes && (
                          <p className="mt-2 text-xs text-gray-600">{m.lock.notes}</p>
                        )}
                        {m.issues.length > 0 && (
                          <ul className="mt-2 list-inside list-disc text-xs text-amber-700">
                            {m.issues.slice(0, 3).map((issue, idx) => (
                              <li key={idx}>{issue}</li>
                            ))}
                          </ul>
                        )}
                        <div className="mt-3 grid gap-2 text-xs text-gray-700 md:grid-cols-2">
                          <div>
                            <div className="font-semibold text-gray-900">
                              Installation difficulty
                            </div>
                            <p className="mt-1">{installInfo.difficulty}</p>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              Suggested accessories
                            </div>
                            <p className="mt-1">{installInfo.accessories}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                Always verify measurements with the lock vendor's official
                installation guide. This tool provides a high-level screening,
                not a guarantee for every specific door construction detail.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Enter your door measurements and click Check Compatibility.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
