export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (typeof body.url !== "string") {
      return Response.json(
        { error: "Please provide an Instagram Reel URL." },
        { status: 400 },
      );
    }

    const backendUrl = process.env.PYTHON_BACKEND_URL?.replace(/\/+$/, "");

    if (!backendUrl) {
      console.error("PYTHON_BACKEND_URL is not configured.");

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
          error: error?.detail || error?.error || "Unable to extract audio.",
        },
        { status: upstream.status },
      );
    }

    if (!upstream.body) {
      return Response.json(
        { error: "The backend returned an empty response." },
        { status: 502 },
      );
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("Content-Type") || "audio/mpeg",
        "Content-Disposition": 'attachment; filename="instagram-audio.mp3"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Audio extraction request failed:", error);

    const isTimeout = error instanceof Error && error.name === "TimeoutError";

    return Response.json(
      {
        error: isTimeout
          ? "The request timed out. Please try again."
          : "The extraction service is unavailable. Please try again shortly.",
      },
      { status: isTimeout ? 504 : 502 },
    );
  }
}
