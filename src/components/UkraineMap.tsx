import { useMemo } from "react";

interface UkraineMapProps {
  cities: { name: string; x: number; y: number; stores: unknown[] }[];
  selectedCity: string | null;
  onCityClick: (name: string) => void;
}

const UkraineMap = ({ cities, selectedCity, onCityClick }: UkraineMapProps) => {
  // Sort so selected city renders last (on top)
  const sortedCities = useMemo(() => {
    return [...cities].sort((a, b) => {
      if (a.name === selectedCity) return 1;
      if (b.name === selectedCity) return -1;
      return 0;
    });
  }, [cities, selectedCity]);

  return (
    <svg viewBox="0 0 100 85" className="w-full h-full select-none" style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.1))" }}>
      <defs>
        <linearGradient id="map-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="map-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
        </linearGradient>
        <filter id="city-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="soft-glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* Simplified Ukraine outline — more recognizable shape */}
      <path
        d="M 10 32 L 12 28 L 14 24 L 17 21 L 20 19 L 22 22 L 20 26 L 18 30 L 16 34 L 14 38 L 13 42 L 14 46 L 16 43 L 18 40 L 20 37 L 22 34 L 24 31 L 26 28 L 28 25 L 30 22 L 33 19 L 36 17 L 39 15 L 42 13 L 45 12 L 48 11 L 52 10 L 56 11 L 60 12 L 64 14 L 68 16 L 72 18 L 76 21 L 79 24 L 82 28 L 84 32 L 86 36 L 88 40 L 89 44 L 88 48 L 86 52 L 83 56 L 80 60 L 76 63 L 72 66 L 68 68 L 64 70 L 60 71 L 56 72 L 52 73 L 48 73 L 44 72 L 40 71 L 36 69 L 32 66 L 28 62 L 25 58 L 22 54 L 19 50 L 16 46 L 14 42 L 12 38 L 10 35 Z"
        fill="url(#map-fill)"
        stroke="url(#map-stroke)"
        strokeWidth="0.35"
        strokeLinejoin="round"
      />

      {/* Subtle internal region lines */}
      <path
        d="M 30 22 Q 45 40, 60 35 M 48 11 Q 50 45, 52 73 M 25 45 Q 55 50, 85 45"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeOpacity="0.04"
        strokeWidth="0.2"
        strokeDasharray="1,2"
      />

      {/* City markers */}
      {sortedCities.map((city) => {
        const isSelected = selectedCity === city.name;
        const storeCount = city.stores.length;
        // Size based on store count, with limits
        const dotR = Math.min(Math.max(storeCount / 20, 0.8), 2.2);

        return (
          <g
            key={city.name}
            onClick={() => onCityClick(city.name)}
            className="cursor-pointer"
            role="button"
            aria-label={`${city.name}: ${storeCount} магазинів`}
          >
            {/* Selected: animated pulse rings */}
            {isSelected && (
              <>
                <circle cx={city.x} cy={city.y} r="6" fill="hsl(var(--primary))" opacity="0.06">
                  <animate attributeName="r" values="4;8;4" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.08;0;0.08" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={city.x} cy={city.y} r="4" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.2" opacity="0.3">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              </>
            )}

            {/* Ambient glow */}
            <circle
              cx={city.x}
              cy={city.y}
              r={isSelected ? dotR * 3 : dotR * 1.8}
              fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--primary))"}
              opacity={isSelected ? 0.15 : 0.05}
              filter="url(#soft-glow)"
            />

            {/* Main dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r={isSelected ? dotR * 1.3 : dotR}
              fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
              opacity={isSelected ? 1 : 0.5}
              filter={isSelected ? "url(#city-glow)" : undefined}
              className="transition-all duration-500"
            />

            {/* Inner highlight */}
            <circle
              cx={city.x}
              cy={city.y}
              r={isSelected ? dotR * 0.5 : dotR * 0.35}
              fill="hsl(var(--foreground))"
              opacity={isSelected ? 0.9 : 0.3}
            />

            {/* City label */}
            <text
              x={city.x}
              y={city.y + (isSelected ? dotR * 2.8 : dotR * 2.5)}
              textAnchor="middle"
              fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
              opacity={isSelected ? 1 : 0.4}
              fontSize={isSelected ? "3" : "2.2"}
              fontWeight={isSelected ? "800" : "600"}
              fontFamily="'Onest', sans-serif"
              className="transition-all duration-500 pointer-events-none"
            >
              {city.name}
            </text>

            {/* Store count badge for larger cities */}
            {(storeCount > 8 || isSelected) && (
              <g className="pointer-events-none">
                <rect
                  x={city.x + dotR * 1.2}
                  y={city.y - dotR * 2.2}
                  width={storeCount > 99 ? 8 : 6}
                  height={3.5}
                  rx={1.5}
                  fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  opacity={isSelected ? 1 : 0.7}
                />
                <text
                  x={city.x + dotR * 1.2 + (storeCount > 99 ? 4 : 3)}
                  y={city.y - dotR * 2.2 + 2.6}
                  textAnchor="middle"
                  fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                  fontSize="2.2"
                  fontWeight="800"
                  fontFamily="'Onest', sans-serif"
                >
                  {storeCount}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* "УКРАЇНА" watermark */}
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        opacity="0.06"
        fontSize="5"
        fontWeight="900"
        fontFamily="'Onest', sans-serif"
        letterSpacing="8"
      >
        УКРАЇНА
      </text>
    </svg>
  );
};

export default UkraineMap;
