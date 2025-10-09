import { downloadURL, ydsdk } from "./const";
import { toPath } from "./toPath";

export async function fetchText(
  url: string | undefined,
  path?: string | undefined,
) {
  if (!url) return;

  try {
    let { ok, body } = await ydsdk.public.download({
      public_key: url,
      path: toPath(path),
    });

    if (!ok || !body) return;

    let res = await fetch(`${downloadURL}?u=${encodeURIComponent(body.href)}`);

    return res.text();
  } catch {}
}
