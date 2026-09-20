import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    // Dozvoli import lib/brand.ts iz Next aplikacije - jedan izvor istine za boje.
    symlinks: false,
  },
}));
