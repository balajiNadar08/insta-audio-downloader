export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.url !== "string") {
      return Response.json(
        { error: "Please provide an Instagram Reel URL." },
        { status: 400 },
      );
    }

    const backendUrl = process.env.PYTHON_BACKEND_URL;

    if (!backendUrl) {
      return Response.json(
        { error: "Python backend URL is not configured." },
        { status: 500 },
      );
    }

    const upstream = await fetch(`${backendUrl}/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: body.url }),
      cache: "no-store",
      signal: AbortSignal.timeout(150_000),
    });

    if (!upstream.ok) {
      const error = await upstream.json().catch(() => null);

      return Response.json(
        {
          error: error?.detail || "Unable to extract audio.",
        },
        { status: upstream.status },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="instagram-audio.mp3"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Audio extraction request failed:", error);

    return Response.json(
      { error: "The extraction service is unavailable." },
      { status: 502 },
    );
  }
}
