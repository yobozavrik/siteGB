import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import type { Shop } from "@/data/shops";

declare global {
  interface Window {
    // Google Maps JS API is loaded on demand; typed loosely on purpose.
    google?: any;
  }
}

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "").trim();
const CHERNIVTSI = { lat: 48.2917, lng: 25.9352 };

/* Warm-craft map style so Google's default blue doesn't fight the palette. */
const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f3ecdf" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b5e4e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f3ec" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe0d8" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e7dcc7" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ddcdb0" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d3b78a" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dfe6c8" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

let loaderPromise: Promise<any> | null = null;

function loadGoogleMaps(): Promise<any> {
  if (typeof window !== "undefined" && window.google?.maps) return Promise.resolve(window.google);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(API_KEY)}&language=uk&region=UA`;
    script.async = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("google-maps-load-failed"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

const mapsSearchUrl = (s: Shop) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery || `${s.address}, ${s.city}`)}`;

const pinSvg = (color: string) =>
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">` +
      `<path d="M17 0C7.6 0 0 7.5 0 16.8 0 29 17 44 17 44s17-15 17-27.2C34 7.5 26.4 0 17 0z" fill="${color}"/>` +
      `<circle cx="17" cy="17" r="6.5" fill="#F7F3EC"/></svg>`,
  );

interface Props {
  shops: Shop[];
  activeId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

/** Interactive Google map when VITE_GOOGLE_MAPS_API_KEY is set; a styled
 *  stylised fallback otherwise so the page is complete without a key. */
const ShopsMap = ({ shops, activeId, onSelect, className = "" }: Props) => {
  const hasKey = API_KEY.length > 0;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const infoRef = useRef<any>(null);
  const [status, setStatus] = useState<"idle" | "ready" | "error">("idle");

  const clay = "#C2703D";
  const brick = "#9E2B25";

  useEffect(() => {
    if (!hasKey || !containerRef.current) return;
    let cancelled = false;
    const markers = markersRef.current;

    loadGoogleMaps()
      .then((g) => {
        if (cancelled || !containerRef.current) return;
        const map = new g.maps.Map(containerRef.current, {
          center: CHERNIVTSI,
          zoom: 12,
          styles: MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
        });
        mapRef.current = map;
        infoRef.current = new g.maps.InfoWindow();

        shops.forEach((s) => {
          const marker = new g.maps.Marker({
            position: { lat: s.lat, lng: s.lng },
            map,
            title: s.address,
            icon: {
              url: pinSvg(s.isProduction ? brick : clay),
              scaledSize: new g.maps.Size(34, 44),
              anchor: new g.maps.Point(17, 44),
            },
          });
          marker.addListener("click", () => onSelect(s.id));
          markers.set(s.id, marker);
        });

        const bounds = new g.maps.LatLngBounds();
        shops.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
        if (!bounds.isEmpty()) map.fitBounds(bounds, 48);

        setStatus("ready");
      })
      .catch(() => !cancelled && setStatus("error"));

    return () => {
      cancelled = true;
      markers.forEach((m) => m.setMap(null));
      markers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey, shops]);

  // Pan + open info window when the selected shop changes.
  useEffect(() => {
    if (status !== "ready" || !activeId || !mapRef.current) return;
    const shop = shops.find((s) => s.id === activeId);
    const marker = markersRef.current.get(activeId);
    if (!shop || !marker || !infoRef.current) return;

    mapRef.current.panTo({ lat: shop.lat, lng: shop.lng });
    if ((mapRef.current.getZoom() ?? 12) < 14) mapRef.current.setZoom(14);
    infoRef.current.setContent(
      `<div style="font:600 13px/1.4 Onest,sans-serif;color:#211A15;max-width:200px">` +
        `<strong>${shop.address}</strong><br/>` +
        `<span style="color:#6b5e4e;font-weight:500">${shop.hours}</span></div>`,
    );
    infoRef.current.open(mapRef.current, marker);
  }, [activeId, status, shops]);

  // ---- Stylised fallback (no key or load failure) --------------------------

  const fallbackDots = useMemo(
    () => shops.map((s) => ({ ...s, left: `${s.x}%`, top: `${s.y}%` })),
    [shops],
  );

  if (!hasKey || status === "error") {
    const active = activeId ? shops.find((s) => s.id === activeId) : null;
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-border bg-card ${className}`}
        role="img"
        aria-label="Схема розташування магазинів у Чернівцях"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)/0.6) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative h-full min-h-[360px] w-full">
          {fallbackDots.map((s) => {
            const isActive = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                style={{ left: s.left, top: s.top }}
                aria-label={s.address}
                aria-pressed={isActive}
                className="group absolute -translate-x-1/2 -translate-y-full outline-none"
              >
                <MapPin
                  className={`h-7 w-7 drop-shadow-sm transition-transform group-hover:scale-110 focus-visible:scale-110 ${
                    isActive
                      ? "scale-125 text-primary"
                      : s.isProduction
                        ? "text-primary/80"
                        : "text-secondary"
                  }`}
                  fill="currentColor"
                  strokeWidth={1.25}
                />
                <span
                  className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {s.address}
                </span>
              </button>
            );
          })}
        </div>
        <p className="absolute inset-x-0 bottom-0 bg-card/90 px-4 py-2 text-center text-[11px] text-muted-foreground">
          Схематична мапа. Додайте ключ <code className="font-mono">VITE_GOOGLE_MAPS_API_KEY</code>, щоб увімкнути
          інтерактивну мапу Google.
          {active && (
            <>
              {" · "}
              <a
                href={mapsSearchUrl(active)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-primary"
              >
                <ExternalLink size={11} /> Відкрити в Google Maps
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-muted ${className}`}>
      <div ref={containerRef} className="h-full min-h-[360px] w-full" />
      {status === "idle" && (
        <div className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
          Завантаження мапи…
        </div>
      )}
    </div>
  );
};

export default ShopsMap;
