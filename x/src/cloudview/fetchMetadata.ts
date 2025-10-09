import type { ConfigContext, Context } from "./Context";
import { fetchText } from "./fetchText";
import { parseConfig } from "./parseConfig";

const configProps: (keyof ConfigContext)[] = [
  "index",
  "title",
  "aspectRatio",
  "cropPreview",
  "hideDate",
  "sort",
];

export async function fetchMetadata(ctx: Context): Promise<void> {
  let { url, path } = ctx;

  try {
    let configContent = await fetchText(url, `${path ?? ""}/_config.yml`);
    let config = parseConfig(configContent);

    if (config) {
      for (let k of configProps) {
        // @ts-expect-error
        if (config[k] !== undefined) ctx[k] = config[k];
      }
    }
  } catch {}
}
