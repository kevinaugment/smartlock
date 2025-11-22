import { useState } from 'react';

interface MeshInputs {
  floors: number;
  areaSqm: number;
  lockCount: number;
  wallType: 'light' | 'medium' | 'heavy';
}

interface MeshResult {
  recommendedRepeaters: number;
  repeatersPerFloor: number[];
}

function calculateMesh(inputs: MeshInputs): MeshResult {
  const { floors, areaSqm, lockCount, wallType } = inputs;

  const densityFactor = lockCount / Math.max(1, areaSqm / 50); // locks per 50m²

  let baseRepeaters = Math.ceil((areaSqm / 200) * (floors <= 2 ? 1 : 1.2));

  if (wallType === 'medium') baseRepeaters *= 1.2;
  if (wallType === 'heavy') baseRepeaters *= 1.5;

  if (densityFactor > 3) baseRepeaters *= 1.2;

  const recommendedRepeaters = Math.max(1, Math.round(baseRepeaters));

  const repeatersPerFloor: number[] = [];
  const perFloorBase = recommendedRepeaters / floors;

  for (let i = 0; i < floors; i++) {
    repeatersPerFloor.push(Math.max(0, Math.round(perFloorBase)));
  }

  const totalPerFloor = repeatersPerFloor.reduce((a, b) => a + b, 0);
  if (totalPerFloor !== recommendedRepeaters && repeatersPerFloor.length > 0) {
    const diff = recommendedRepeaters - totalPerFloor;
    repeatersPerFloor[0] = repeatersPerFloor[0] + diff;
  }

  return {
    recommendedRepeaters,
    repeatersPerFloor,
  };
}

export default function MeshNodePlanner() {
  const [inputs, setInputs] = useState<MeshInputs>({
    floors: 5,
    areaSqm: 2500,
    lockCount: 50,
    wallType: 'medium',
  });

  const [result, setResult] = useState<MeshResult | null>(null);

  const onChange = <K extends keyof MeshInputs>(key: K, value: MeshInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const onCalculate = () => {
    const computed = calculateMesh(inputs);
    setResult(computed);
  };

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
                  Floors
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={inputs.floors}
                  onChange={(e) => onChange('floors', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Total area (m²)
                </label>
                <input
                  type="number"
                  min={100}
                  max={20000}
                  value={inputs.areaSqm}
                  onChange={(e) => onChange('areaSqm', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Smart locks in building
                </label>
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={inputs.lockCount}
                  onChange={(e) => onChange('lockCount', Number(e.target.value))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Wall / floor construction
                </label>
                <select
                  value={inputs.wallType}
                  onChange={(e) =>
                    onChange('wallType', e.target.value as MeshInputs['wallType'])
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="light">Light (drywall / timber)</option>
                  <option value="medium">Medium (brick / mixed)</option>
                  <option value="heavy">Heavy (concrete / reinforced)</option>
                </select>
              </div>
            </div>

            <button
              onClick={onCalculate}
              className="btn btn-primary w-full py-3 text-base"
            >
              Plan Mesh Repeaters
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Mesh node plan
          </h2>

          {result ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-primary-50 p-6">
                <div className="text-sm font-medium text-primary-700">
                  Recommended repeater count
                </div>
                <div className="mt-1 text-3xl font-bold text-primary-900">
                  {result.recommendedRepeaters} nodes
                </div>
                <p className="mt-2 text-sm text-primary-800">
                  Place repeaters in hallways or common areas roughly midway
                  between the coordinator gateway and the furthest locks on each
                  floor.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm">
                <div className="mb-2 text-sm font-semibold text-gray-900">
                  Per-floor allocation
                </div>
                {result.repeatersPerFloor.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1 text-gray-700">
                    {result.repeatersPerFloor.map((count, idx) => (
                      <li key={idx}>
                        Floor {idx + 1}: {count} repeater{count === 1 ? '' : 's'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No repeaters needed on any floor.</p>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                This is a coarse planning tool. Always refine placement using
                actual site surveys, signal measurements, and vendor-specific
                recommendations.
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Describe your building, then click Plan Mesh Repeaters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
