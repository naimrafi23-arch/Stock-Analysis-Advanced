// ═══════════════════════════════════════════════
//  CONFIGURATION & CONSTANTS
// ═══════════════════════════════════════════════

const CONFIG = {
  PROXIES: [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ],
  DSE_URL: 'https://www.dsebd.org/latest_share_price_scroll_l.php',
  DSE_HOME: 'https://www.dsebd.org/',
  PAGE_SIZE: 50,
  CACHE_TTL: 120000, // 2 minutes
  CACHE_KEY: 'dse_cache_v2',
  AUTO_REFRESH_MS: 90000, // 90 seconds
  TOP30_COUNT: 30,
  MAX_SECTOR: 5, // max stocks per sector in top 30
  HEATMAP_COUNT: 120
};

const SECTORS = {
  GP: 'Telecom', BRACBANK: 'Banking', SQURPHARMA: 'Pharma',
  BATBC: 'FMCG', BERGERPBL: 'Paints', RENATA: 'Pharma',
  ISLAMIBANK: 'Banking', CITYBANK: 'Banking', DUTCHBANGL: 'Banking',
  PRIMEBANK: 'Banking', WALTONHIL: 'Electronics', OLYMPIC: 'Food',
  LHBL: 'Cement', HEIDELBCEM: 'Cement', BSRMSTEEL: 'Steel',
  EBL: 'Banking', DESCO: 'Utilities', TITASGAS: 'Energy',
  PADMAOIL: 'Energy', JAMUNAOIL: 'Energy', MJLBD: 'Energy',
  IDLC: 'Finance', UPGDCL: 'Power', IBNSINA: 'Pharma',
  ROBI: 'Telecom', UNILEVERCL: 'FMCG', MARICO: 'FMCG',
  LINDEBD: 'Industrial', BXPHARMA: 'Pharma', BEXIMCO: 'Conglomerate',
  PUBALIBANK: 'Banking', ACI: 'Pharma', SUMITPOWER: 'Power',
  UCB: 'Banking', BANKASIA: 'Banking', ALARABANK: 'Banking',
  TRUSTBANK: 'Banking', LANKABAFIN: 'Finance', NAVANAPHAR: 'Pharma',
  BEACONPHAR: 'Pharma'
};

const SECTOR_NEWS = {
  Telecom: '5G discussions; ARPU recovery confirmed.',
  Banking: 'BB provisioning norms tightened; quality banks favored.',
  Pharma: 'Pharma exports $210M+; API localisation growth.',
  FMCG: 'Rural consumption recovering +8% YoY.',
  Cement: 'FY25 infra spend +12%; megaprojects active.',
  Energy: 'Power tariff revision underway.',
  Paints: 'Urban real estate pickup lifting demand.',
  Finance: 'Digital credit penetration growing.',
  Steel: 'Infra-linked demand stabilising.',
  Utilities: 'Tariff reform pending — catalyst.',
  Food: 'Post-inflation spending normalising.',
  Electronics: 'EMI-driven white goods demand.',
  Power: 'IPP earnings visibility improving.',
  Industrial: 'Stable demand; pricing power.',
  Conglomerate: 'Diversified holdings stability.'
};
