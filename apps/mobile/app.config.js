module.exports = () => {
  const KAKAO_NATIVE_APP_KEY = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || ''
  return {
    name: '말모',
    slug: 'malmo-app',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'malmo',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
      bundleIdentifier: 'com.malmo.app',
      buildNumber: '3',
      usesAppleSignIn: true,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ['malmo', 'com.malmo.app'],
          },
          {
            CFBundleURLSchemes: [`kakao${KAKAO_NATIVE_APP_KEY}`],
            CFBundleURLName: 'Kakao',
          },
        ],
        LSApplicationQueriesSchemes: ['kakaokompassauth', 'kakaolink', 'kakaoplus'],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSAllowsArbitraryLoadsInWebContent: true,
          NSExceptionDomains: {
            'dev.malmo.io.kr': {
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSExceptionMinimumTLSVersion: '1.0',
              NSIncludesSubdomains: true,
              NSExceptionRequiresForwardSecrecy: false,
              NSExceptionAllowsLocalNetworking: true,
              NSThirdPartyExceptionAllowsInsecureHTTPLoads: true,
              NSThirdPartyExceptionMinimumTLSVersion: '1.0',
              NSThirdPartyExceptionRequiresForwardSecrecy: false,
            },
          },
        },
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.malmo.app',
      versionCode: 3,
      intentFilters: [
        {
          action: 'VIEW',
          category: ['DEFAULT', 'BROWSABLE'],
          data: { scheme: 'malmo' },
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
          },
        },
      ],
      [
        '@react-native-kakao/core',
        {
          nativeAppKey: KAKAO_NATIVE_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
      'expo-apple-authentication',
      'expo-font',
      'expo-router',
      'expo-splash-screen',
    ],
    experiments: {
      typedRoutes: true,
    },
  }
}
