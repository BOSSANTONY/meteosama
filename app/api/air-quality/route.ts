import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
) {
  const { searchParams } =
    new URL(request.url);

  const latitude = Number(
    searchParams.get("latitude")
  );

  const longitude = Number(
    searchParams.get("longitude")
  );

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return NextResponse.json(
      {
        error:
          "Coordonnées invalides.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const params =
      new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: [
          "pm10",
          "pm2_5",
          "carbon_monoxide",
          "nitrogen_dioxide",
          "sulphur_dioxide",
          "ozone",
          "aerosol_optical_depth",
        ].join(","),
        timezone: "auto",
      });

    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${params}`,
      {
        next: {
          revalidate: 1800,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Erreur qualité de l'air."
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error:
          "Impossible de récupérer la qualité de l'air.",
      },
      {
        status: 500,
      }
    );
  }
}