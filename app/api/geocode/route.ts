import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/lib/geocoding";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("name")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      {
        error:
          "Veuillez saisir au moins 2 caractères.",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const results = await searchCities(query);

    return NextResponse.json({
      results,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Impossible de rechercher cette ville.",
      },
      {
        status: 500,
      }
    );
  }
}