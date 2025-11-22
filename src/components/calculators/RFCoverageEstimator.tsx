import { useState } from 'react';

interface RFInputs {
  buildingType: 'house' | 'apartment' | 'office' | 'warehouse';
  areaSqm: number;
  floors: number;
  avgDistanceMeters: number;
  wallType: 'light' | 'medium' | 'heavy';
  obstacles: number;
  protocol: 'zigbee' | 'zwave' | 'thread';
}

interface RFResult {
  linkBudget: number;
  signalQuality: 'good' | 'fair' | 'poor';
  signalDbm: number;
  recommendedRepeaters: number;
}

function getBaseRange(protocol: RFInputs['protocol']): number {
  if (protocol === 'zigbee') return 18; // meters indoor
  if (protocol === 'zwave') return 20;
  return 16; // thread
}

function getWallFactor(wallType: RFInputs['wallType']): number {
  switch (wallType) {
    case 'light':
      return 1;
    case 'medium':
      return 0.75;
    case 'heavy':
      return 0.5;
    default:
      return 1;
  }
}

function calculateRf(inputs: RFInputs): RFResult {
  const baseRange = getBaseRange(inputs.protocol);
  const wallFactor = getWallFactor(inputs.wallType);
  const floorFactor = 1 / (1 + (inputs.floors - 1) * 0.25);
  const obstacleFactor = 1 / (1 + inputs.obstacles * 0.15);

  const effectiveRange = baseRange * wallFactor * floorFactor * obstacleFactor;

  const distance = Math.max(1, inputs.avgDistanceMeters);
  const qualityRatio = effectiveRange / distance;

  let signalQuality: RFResult['signalQuality'];
  if (qualityRatio >= 1.2) signalQuality = 'good';
  else if (qualityRatio >= 0.6) signalQuality = 'fair';
  else signalQuality = 'poor';

  // Crude mapping of quality ratio to dBm
  const signalDbm = -40 - (1 / qualityRatio) * 15;
  const linkBudget = 120 + signalDbm; // arbitrary reference

  const repeaters = qualityRatio >= 1
    ? 0
    : Math.max(
        1,
        Math.ceil((distance / effectiveRange) * (inputs.floors + inputs.obstacles / 3)),
      );

  return {
    linkBudget,
    signalQuality,
    signalDbm,
    recommendedRepeaters: repeaters,
  };
}

export default function RFCoverageEstimator() {
  const [inputs, setInputs] = useState<RFInputs>({
    buildingType: 'apartment',
    areaSqm: 120,
    floors: 1,
    avgDistanceMeters: 12,
    wallType: 'medium',
    obstacles: 4,
    protocol: 'zigbee',
  });

  const [result, setResult] = useState<RFResult | null>(null);

  const onChange = <K extends keyof RFInputs>(key: K, value: RFInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onEstimate = () => {
    const computed = calculateRf(inputs);
    setResult(computed);
  };

  const qualityLabel =
    result?.signalQuality === 'good'
      ? 'Strong mesh coverage'
      : result?.signalQuality === 'fair'
        ? 'Borderline, consider a few repeaters'
        : 'Weak, repeaters or gateway repositioning required';

  const qualityColor =
    result?.signalQuality === 'good'
      ? 'text-emerald-700'
      : result?.signalQuality === 'fair'
        ? 'text-amber-700'
        : 'text-red-700';

  const marginText =
    result && result.linkBudget >= 80
      ? 'Large RF margin – deployment should tolerate modest layout changes and additional doors.'
      : result && result.linkBudget >= 60
        ? 'Moderate RF margin – acceptable today, but be cautious adding more concrete or metal obstacles.'
        : result
          ? 'Tight RF margin – small changes in wall layout or furniture can push some locks into unreliable territory.'
          : '';

  const repeaterHint =
    result && inputs.floors > 1
      ? `Aim for about ${Math.max(
          1,
          Math.round(result.recommendedRepeaters / inputs.floors),
        )} repeater(s) per floor near elevator lobbies, stair cores, or corridor junctions.`
      : result
        ? 'Start by placing one repeater between the coordinator and the furthest locks, then add more only where signal tests show weak links.'
        : '';

  return (
    <div className="calculator-wrapper">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Building layout
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Building type
                </label>
                <select
                  value={inputs.buildingType}
                  onChange={(e) =>
                    onChange('buildingType', e.target.value as RFInputs['buildingType'])
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="house">Detached house</option>
                  <option value="apartment">Apartment / condo</option>
                  <option value="office">Office / commercial</option>
                  <option value="warehouse">Large warehouse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Floors with locks
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={inputs.floors}
                  onChange={(e) => onChange('floors', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total area (m²)
                </label>
                <input
                  type="number"
                  min={20}
                  max={5000}
                  value={inputs.areaSqm}
                  onChange={(e) => onChange('areaSqm', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Avg distance gateway → doors (m)
                </label>
                <input
                  type="number"
                  min={3}
                  max={50}
                  value={inputs.avgDistanceMeters}
                  onChange={(e) =>
                    onChange('avgDistanceMeters', Number(e.target.value))
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wall / floor construction
                </label>
                <select
                  value={inputs.wallType}
                  onChange={(e) =>
                    onChange('wallType', e.target.value as RFInputs['wallType'])
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="light">Drywall / timber</option>
                  <option value="medium">Brick / mixed</option>
                  <option value="heavy">Concrete / reinforced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Major obstacles
                </label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={inputs.obstacles}
                  onChange={(e) => onChange('obstacles', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Count thick walls, elevator shafts, stair cores, etc.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Protocol
              </label>
              <select
                value={inputs.protocol}
                onChange={(e) =>
                  onChange('protocol', e.target.value as RFInputs['protocol'])
                }
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="zigbee">Zigbee</option>
                <option value="zwave">Z-Wave</option>
                <option value="thread">Thread</option>
              </select>
            </div>

            <button
              onClick={onEstimate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Estimate RF Coverage
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            RF coverage estimate
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Overall link quality
                </div>
                <div className={`mt-1 text-2xl font-bold ${qualityColor}`}>
                  {qualityLabel}
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Estimated signal level around{' '}
                  {result.signalDbm.toFixed(0)} dBm at the average door
                  locations, with an approximate link budget of{' '}
                  {result.linkBudget.toFixed(0)} dB.
                </p>
                <p className="mt-1 text-xs text-primary-800">
                  {marginText}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Repeater planning
                </div>
                <p className="text-gray-700">
                  Recommended repeaters for this layout:{' '}
                  <span className="font-semibold">
                    {result.recommendedRepeaters}
                  </span>
                </p>
                <p className="mt-1 text-xs text-gray-700">
                  {repeaterHint}
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
                  <li>
                    Place repeaters roughly midway between the gateway and the
                    furthest doors.
                  </li>
                  <li>
                    Avoid placing repeaters inside metal cabinets or behind
                    dense concrete walls.
                  </li>
                  <li>
                    For multi-floor buildings, target at least one repeater per
                    floor near the stair core.
                  </li>
                </ul>
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                This is a high-level planning tool. Always validate RF
                performance with on-site tests and your actual lock and gateway
                hardware.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Describe your building and click Estimate RF Coverage.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
