const defaultEmbedUrl =
  'https://moovitapp.com/index/pt-pt/transporte_p%C3%BAblico-line-12E-Lisboa-1672-857973-605901-0';

export const moovit12EConfig = {
  enabled: import.meta.env.VITE_MOOVIT_12E_ENABLED !== 'false',
  embedUrl: import.meta.env.VITE_MOOVIT_12E_EMBED_URL || defaultEmbedUrl,
  title: import.meta.env.VITE_MOOVIT_12E_TITLE || 'Widget Moovit da Carreira 12E',
  iframeTitle:
    import.meta.env.VITE_MOOVIT_12E_IFRAME_TITLE ||
    'Iframe com o percurso e horários da carreira 12E no Moovit',
  language: import.meta.env.VITE_MOOVIT_12E_LANG || 'pt-PT',
};

export default moovit12EConfig;
