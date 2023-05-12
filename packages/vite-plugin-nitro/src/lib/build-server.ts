import { loadEsmModule } from '@angular-devkit/build-angular/src/utils/load-esm';
import { NitroConfig } from 'nitropack';
import { Options } from './options';

export async function buildServer(
  options?: Options,
  nitroConfig?: NitroConfig
) {
  const { createNitro, build, prepare, copyPublicAssets, prerender } =
    await loadEsmModule<typeof import('nitropack')>('nitropack');

  const nitro = await createNitro({
    dev: false,
    ...nitroConfig,
  });
  await prepare(nitro);
  await copyPublicAssets(nitro);

  if (options?.static) {
    console.log(`Prerendering static pages...`);
  }

  await prerender(nitro);

  if (!options?.static) {
    await build(nitro);
  }

  await nitro.close();
}