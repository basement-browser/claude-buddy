import { generateBuddy } from "@/lib/generate-buddy";
import { generateInstallScript } from "@/lib/generate-install-script";

export const runtime = "edge";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hash: string }> }
) {
  const { hash } = await params;

  if (!hash) {
    return new Response("Missing buddy name/hash", { status: 400 });
  }

  const name = decodeURIComponent(hash);
  const buddy = generateBuddy(name);

  const { protocol, host } = new URL(request.url);
  const baseUrl = `${protocol}//${host}`;

  const script = generateInstallScript(buddy, baseUrl);

  return new Response(script, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
