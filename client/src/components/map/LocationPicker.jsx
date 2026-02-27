import React, { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPinIcon } from "../common/Icons";

// Fix Leaflet default icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Listens to map click events and calls onPick(lat, lng)
const MapClickHandler = ({ onPick }) => {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) });
  return null;
};

// Re-centers map when coordinates change externally (search / locate me)
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
};

const INPUT_STYLE = {
  backgroundColor: "var(--cream)",
  border: "1.5px solid var(--sand-dark)",
  color: "var(--brand)",
};

/**
 * Replaces raw lat/lng inputs with:
 * - Nominatim autocomplete search box (free, no API key, India-biased)
 * - "Use My Current Location" button with reverse geocode
 * - Mini Leaflet map — click anywhere to drop a pin
 *
 * Props:
 *   value   : { lat: string, lng: string, address: string }
 *   onChange: (newValue) => void
 */
const LocationPicker = ({ value, onChange }) => {
  const [query, setQuery]           = useState(value?.address || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg]     = useState(false);
  const [searching, setSearching]   = useState(false);
  const [reversing, setReversing]   = useState(false);
  const debounceRef = useRef(null);

  // Forward geocode — Nominatim search
  const searchPlaces = useCallback(async (q) => {
    if (!q || q.length < 3) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`,
        { headers: { "Accept-Language": "en" } },
      );
      setSuggestions(await res.json());
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    setShowSugg(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPlaces(val), 380);
  };

  const pickSuggestion = (s) => {
    const address = s.display_name;
    setQuery(address);
    setSuggestions([]);
    setShowSugg(false);
    onChange({
      lat: parseFloat(s.lat).toFixed(6),
      lng: parseFloat(s.lon).toFixed(6),
      address,
    });
  };

  // Reverse geocode helper
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } },
      );
      const data = await res.json();
      return data.display_name || `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
    } catch {
      return `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`;
    }
  };

  // GPS locate + reverse geocode
  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setReversing(true);
        const address = await reverseGeocode(lat, lng);
        setReversing(false);
        setQuery(address);
        onChange({ lat: lat.toFixed(6), lng: lng.toFixed(6), address });
      },
      () => alert("Could not get your location. Please allow location access."),
    );
  };

  // Map click → reverse geocode and pin
  const handleMapClick = async (lat, lng) => {
    setReversing(true);
    const address = await reverseGeocode(lat, lng);
    setReversing(false);
    setQuery(address);
    onChange({ lat: lat.toFixed(6), lng: lng.toFixed(6), address });
  };

  const lat = parseFloat(value?.lat);
  const lng = parseFloat(value?.lng);
  const hasCoords = !isNaN(lat) && !isNaN(lng);

  return (
    <div className="space-y-2">
      {/* Search box */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--brand)";
            if (suggestions.length) setShowSugg(true);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--sand-dark)";
            setTimeout(() => setShowSugg(false), 180);
          }}
          placeholder="Search place… e.g. MG Road, Pune"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-150 pr-9"
          style={INPUT_STYLE}
          autoComplete="off"
        />

        {/* Spinner */}
        {(searching || reversing) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div
              className="w-3.5 h-3.5 rounded-full border-2 animate-spin"
              style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
            />
          </div>
        )}

        {/* Dropdown */}
        {showSugg && suggestions.length > 0 && (
          <div
            className="absolute z-50 w-full mt-1 rounded-xl border shadow-2xl overflow-hidden"
            style={{ backgroundColor: "var(--cream)", borderColor: "var(--sand-dark)" }}
          >
            {suggestions.map((s) => (
              <button
                key={s.place_id}
                type="button"
                onMouseDown={() => pickSuggestion(s)}
                className="w-full text-left px-4 py-2.5 text-xs border-b last:border-b-0 transition-colors duration-100"
                style={{ borderColor: "var(--sand-dark)", color: "var(--brand)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--sand-light)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <span className="font-semibold block">
                  {s.address?.road || s.address?.suburb || s.name || s.display_name.split(",")[0]}
                  {s.address?.city || s.address?.town
                    ? `, ${s.address.city || s.address.town}`
                    : ""}
                </span>
                <span className="opacity-55 text-xs mt-0.5 block truncate">
                  {s.display_name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* My Location button */}
      <button
        type="button"
        onClick={locateMe}
        disabled={reversing}
        className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold border-2 transition-all duration-150 select-none"
        style={{
          borderColor: "var(--brand)",
          color: "var(--brand)",
          backgroundColor: "var(--sand-light)",
          cursor: reversing ? "not-allowed" : "pointer",
          opacity: reversing ? 0.55 : 1,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={(e) => {
          if (!reversing) {
            e.currentTarget.style.backgroundColor = "var(--brand)";
            e.currentTarget.style.color = "var(--cream)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--sand-light)";
          e.currentTarget.style.color = "var(--brand)";
        }}
        onMouseDown={(e) => { if (!reversing) e.currentTarget.style.transform = "scale(0.98)"; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      >
        {reversing
          ? <>
              <div className="w-3.5 h-3.5 rounded-full border-2 animate-spin flex-shrink-0"
                style={{ borderColor: "currentColor", borderTopColor: "transparent" }} />
              Locating…
            </>
          : <>
              <MapPinIcon size={13} />
              Use My Current Location
            </>
        }
      </button>

      {/* Mini map — position+isolation+zIndex traps Leaflet pane z-indices (200-600) inside */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{
          height: 210,
          borderColor: "var(--sand-dark)",
          position: "relative",
          zIndex: 0,
          isolation: "isolate",
        }}
      >
        <MapContainer
          center={hasCoords ? [lat, lng] : [18.5204, 73.8567]}
          zoom={hasCoords ? 15 : 12}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onPick={handleMapClick} />
          {hasCoords && <RecenterMap lat={lat} lng={lng} />}
          {hasCoords && <Marker position={[lat, lng]} />}
        </MapContainer>
      </div>

      {/* Hint */}
      <p className="text-xs" style={{ color: "var(--steel-dark)" }}>
        Tip: Click anywhere on the map to drop a pin at the exact spot.
      </p>

      {/* Coords display */}
      {hasCoords && (
        <p className="text-xs font-mono" style={{ color: "var(--steel-dark)" }}>
          {lat.toFixed(5)}, {lng.toFixed(5)}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
