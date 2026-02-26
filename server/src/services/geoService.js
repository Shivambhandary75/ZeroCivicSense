const axios = require("axios");
const logger = require("../utils/logger");

/**
 * Reverse geocode lat/lng to a human-readable address.
 * Uses OpenStreetMap Nominatim (free, no API key needed).
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string>} address string
 */
const reverseGeocode = async (lat, lng) => {
  try {
    const { data } = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: { lat, lon: lng, format: "json" },
        headers: { "User-Agent": "ZeroCivicSense/1.0" },
        timeout: 5000,
      },
    );
    return data.display_name || `${lat}, ${lng}`;
  } catch (err) {
    logger.warn(`Reverse geocode failed: ${err.message}`);
    return `${lat}, ${lng}`;
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula).
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in km
 */
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

module.exports = { reverseGeocode, haversineDistance };
