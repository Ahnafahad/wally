export const BRAND_DOMAINS = {
  // ─── Global Tech & Services ───
  'Netflix': 'netflix.com',
  'Spotify': 'spotify.com',
  'Uber': 'uber.com',
  'Amazon': 'amazon.com',
  'Apple': 'apple.com',
  'Google': 'google.com',
  'Facebook': 'facebook.com',
  'Microsoft': 'microsoft.com',
  'Adobe': 'adobe.com',
  'Udemy': 'udemy.com',
  'Coursera': 'coursera.org',

  // ─── Food & Dining (Bangladesh) ───
  'Foodpanda': 'foodpanda.com',
  'KFC': 'kfcbd.com', // Local domain might have better icon than global bucket
  'Pizza Hut': 'pizzahutbd.com',
  'Burger King': 'burgerking.com',
  'Dominos': 'dominos.com.bd',
  'Nandos': 'nandos.com',
  'North End': 'northendcoffeeroasters.com',
  'Gloria Jeans': 'gloriajeanscoffees.com',
  'Crimson Cup': 'crimsoncup.com.bd',
  'Coffee World': 'coffeeworld.com',
  'Madchef': 'madchef.com.bd',
  'Secret Recipe': 'secretrecipe.com.bd',
  'Star Kabab': 'facebook.com', // Fallback to generic if needed, but facebook usually has icon
  'Chillox': 'facebook.com',
  'Takeout': 'facebook.com',

  // ─── Transportation ───
  'Pathao': 'pathao.com',
  'Shohoz': 'shohoz.com',

  // ─── Shopping & E-commerce ───
  'Daraz': 'daraz.com.bd',
  'Pickaboo': 'pickaboo.com.bd', // .bd is more accurate for Pickaboo
  'Chaldal': 'chaldal.com',
  'Bikroy': 'bikroy.com',
  'Rokomari': 'rokomari.com',
  'Aarong': 'aarong.com',
  'Unimart': 'unimart.online',
  'Shwapno': 'shwapno.com',
  'Meena Bazar': 'meenabazar.com.bd',
  'Agora': '/brands/agora.png', // Local override
  'Yellow': 'yellowclothing.net',
  'Jamuna Future Park': 'jamunafuturepark.com',
  'Ryans': 'ryanscomputers.com',
  'Star Tech': 'startech.com.bd',
  'Techland': 'techlandbd.com',

  // ─── Telecom & Utilities ───
  'Grameenphone': 'telenor.com', // GP uses Telenor logo, and Telenor's favicon is reliable
  'Robi': '/brands/robi.png', // Local override
  'Banglalink': 'banglalink.net',
  'Airtel': 'bd.airtel.com',
  'Teletalk': 'teletalk.com.bd',
  'Skitto': 'skitto.com',
  'BTCL': 'btcl.gov.bd',
  'DESCO': 'desco.org.bd',
  'DPDC': 'dpdc.org.bd',
  'Titas': 'titasgas.org.bd',
  'WASA': 'dwasa.org.bd',
  'Carnival': 'carnival.com.bd',
  'Meghna Petroleum': 'mpl.gov.bd',

  // ─── Health & Personal Care ───
  'Ibn Sina': 'ibnsinatrust.com',
  'Square Hospital': 'squarehospital.com',
  'Labaid': 'labaid.com.bd',
  'Evercare': 'evercarebd.com',
  'Popular': 'popular-pharma.com',
  'Persona': 'persona.com.bd',
  'La Belle': 'labellebeauty.org', // Guessed or need specific
  'Fitness Station': 'facebook.com', // Likely local
  'Matrix Gym': 'matrixgymbd.com',
  // ─── Financial Institutions ───
  'BRAC': 'bracbank.com',
  'Dutch-Bangla': '/brands/dbbl.png', // Local override - official logo
  'City Bank': 'citybankplc.com',
  'Eastern Bank': 'ebl.com.bd',
  'Mutual Trust': 'mutualtrustbank.com',
  'Islami Bank': '/brands/islami.png', // Local override - official logo
  'Sonali Bank': 'sonalibank.com.bd',
  'Prime Bank': '/brands/prime.png', // Local override
  'Trust Bank': 'tblbd.com',
  'Pubali': 'pubalibangla.com',
  'UCB': 'ucb.com.bd',
  'Standard Chartered': 'sc.com',
  'HSBC': 'hsbc.com.bd',
  'bKash': '/brands/bkash.png', // Local override
  'Nagad': 'nagad.com.bd',
  'Upay': 'upaybd.com',
  'Rocket': '/brands/rocket.png', // Local override
  'Tap': 'tap.com.bd',
  'Bank Asia': 'bankasia-bd.com',
  // ─── Card Networks ───
  'Visa': 'visa.com',
  'Mastercard': 'mastercard.us',
  'Amex': 'americanexpress.com',
  'Citymax': 'citybankplc.com', // Use City Bank logo for Citymax
  'EBL Aqua': 'ebl.com.bd',     // Use EBL logo for Aqua

  // ─── Specific Credit Cards (use custom card designs) ───
  'City Bank Visa': '/brands/citybank-card.jpg',
  'City Bank Visa Gold': '/brands/citybank-card.jpg',
  'BRAC Bank Mastercard': '/brands/brac-card.jpg',
  'BRAC Bank Platinum': '/brands/brac-card.jpg',
};

/**
 * Helper to match transaction description to a brand domain.
 * @param {string} text - The transaction description (e.g. "KFC Banani")
 * @returns {string|null} - The domain if found, or null.
 */
export function getBrandDomain(text) {
  if (!text) return null;
  const lowerText = text.toLowerCase();

  // Direct keys check (case-insensitive)
  const brands = Object.keys(BRAND_DOMAINS);

  // Sort by length desc to match "Star Tech" before "Star"
  brands.sort((a, b) => b.length - a.length);

  for (const brand of brands) {
    if (lowerText.includes(brand.toLowerCase())) {
      return BRAND_DOMAINS[brand];
    }
  }
  return null;
}

/**
 * Helper to get the full logo URL for a merchant.
 * @param {string} merchant - The transaction merchant name
 * @returns {string|null} - The valid Clearbit URL or null
 */
export function getLogoUrl(merchant) {
  const domain = getBrandDomain(merchant);
  if (!domain) return null;

  // If it's a local path (starts with /), return as is
  if (domain.startsWith('/')) {
    return domain;
  }

  // Using Google's S2 Service as it is more reliable for favicons/logos than Clearbit in some regions
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}
