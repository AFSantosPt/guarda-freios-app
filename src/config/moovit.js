const defaultEmbedUrl =
  'https://widgets.moovit.com/?metroId=1672&lineId=857973&lang=pt-PT';

const defaultFallbackUrl =
  'https://moovitapp.com/index/pt-pt/transporte_p%C3%BAblico-line-12E-Lisboa-1672-857973-605901-0';

const defaultSandbox =
  'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';

const defaultAllow = 'clipboard-write *; geolocation *; fullscreen *; payment *';

export const moovit12EConfig = {
  enabled: import.meta.env.VITE_MOOVIT_12E_ENABLED !== 'false',
  embedUrl: import.meta.env.VITE_MOOVIT_12E_EMBED_URL || defaultEmbedUrl,
  title: import.meta.env.VITE_MOOVIT_12E_TITLE || 'Widget Moovit da Carreira 12E',
  iframeTitle:
    import.meta.env.VITE_MOOVIT_12E_IFRAME_TITLE ||
    'Iframe com o percurso e horários da carreira 12E no Moovit',
  language: import.meta.env.VITE_MOOVIT_12E_LANG || 'pt-PT',
  fallbackUrl:
    import.meta.env.VITE_MOOVIT_12E_FALLBACK_URL || defaultFallbackUrl,
  sandbox: import.meta.env.VITE_MOOVIT_12E_SANDBOX || defaultSandbox,
  allow: import.meta.env.VITE_MOOVIT_12E_ALLOW || defaultAllow,
};

export default moovit12EConfig;