import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
Config.overrideWebpackConfig((config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    // Allow importing lib/brand.ts from the Next app - one source of truth for colours.
    symlinks: false,
  },
}));
