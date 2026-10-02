import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/geocoding";

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
    const location = await reverseGeocode(
      latitude,
      longitude
    );

    return NextResponse.json({
      location,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Impossible de déterminer la ville.",
      },
      {
        status: 500,
      }
    );
  }
}