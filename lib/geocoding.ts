import type { Location } from "@/types/weather";

interface GeocodingResponse {
  results?: Location[];
}

export async function searchCities(
  query: string
): Promise<Location[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "fr",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`
  );

  if (!response.ok) {
    throw new Error(
      "Recherche de ville impossible."
    );
  }

  const data: GeocodingResponse =
    await response.json();

  return data.results ?? [];
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<Location | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`,
      {
        headers: {
          "User-Agent":
            "Bejart-Meteo/1.0",
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const address = data.address ?? {};

    return {
      id: Date.now(),
      name:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "Ma position",
      latitude,
      longitude,
      country:
        address.country ||
        "Position actuelle",
      country_code:
        address.country_code?.toUpperCase(),
      admin1:
        address.state ||
        address.region,
    };
  } catch {
    return null;
  }
}