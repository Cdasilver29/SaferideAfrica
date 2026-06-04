const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure .webp is recognised as a bundleable asset on all platforms
if (!config.resolver.assetExts.includes('webp')) {
  config.resolver.assetExts.push('webp');
}

// Silence the URIError spam from react-native-css-interop's Metro middleware.
// Root cause: the browser sends hot-reload requests whose URLs contain
// percent-encoded characters that decodeURI() rejects. The middleware passes
// them through to Metro's server without catching the error.
// Fix: intercept at the top of the middleware stack and reject malformed
// URIs with 400 before they reach Metro's request processor.
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      try {
        // If the URL can't be decoded it will always crash later — discard it now.
        if (req.url) decodeURI(req.url);
      } catch {
        res.statusCode = 400;
        res.end();
        return;
      }
      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });
