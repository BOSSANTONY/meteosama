import { NextRequest, NextResponse } from "next/server";
import { getWeather } from "@/lib/weather";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const latitude = Number(searchParams.get("latitude"));
  const longitude = Number(searchParams.get("longitude"));

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return NextResponse.json(
      {
        error: "Latitude et longitude invalides.",
      },
      {
        status: 400,
      }
    );
  }

  if (latitude < -90 || latitude > 90) {
    return NextResponse.json(
      {
        error: "Latitude invalide.",
      },
      {
        status: 400,
      }
    );
  }

  if (longitude < -180 || longitude > 180) {
    return NextResponse.json(
      {
        error: "Longitude invalide.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const weather = await getWeather(
      latitude,
      longitude
    );

    return NextResponse.json(weather);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Impossible de récupérer la météo.",
      },
      {
        status: 500,
      }
    );
  }
}