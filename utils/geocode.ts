import fetch from 'node-fetch';
import cache from './cache';

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const cacheKey = `geocode:${address.toLowerCase().trim()}`;

  // Check cache first
  const cached = await cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DevsTinder/1.0' // Required by Nominatim
      }
    });

    const data = await response.json() as any[];

    if (data && data.length > 0) {
      const { lon, lat } = data[0];
      const coordinates: [number, number] = [parseFloat(lon), parseFloat(lat)];

      // Cache for 24 hours
      await cache.set(cacheKey, coordinates, 86400);
      return coordinates;
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Geocoding error:', (error as Error).message);
    return null;
  }
}

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;

  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export { geocodeAddress, calculateDistance };