/**
 * data.ts — RentalHub demo data (ported from the Claude Design handoff),
 * modelled on the real seed + schema. Used to populate the redesigned UI
 * until it's wired to the backend API.
 */

export const CAMPUS_AREAS: Record<string, string[]> = {
  bouesti:  ["Odo Oja", "Oke 'Kere", "Afao Road", "Olumilua Estate", "Ajebandele", "Ikoyi Estate", "Amoye GS"],
  unilag:   ["Akoka", "Yaba", "Abule Ijesha", "Bariga", "Iwaya", "Onike", "Sabo", "Otto-Awori"],
  unilorin: ["Tanke", "Fate", "Oke-Odo", "Challenge", "Gaa-Akanbi", "Unity Road", "Ilofa Road", "Oke-Kura"],
};
export const AREAS = CAMPUS_AREAS.bouesti; // kept for any external references

export interface Campus { id: string; short: string; name: string; live: boolean }
export const CAMPUSES: Campus[] = [
  // Live — original
  { id: "bouesti",  short: "BOUESTI",  name: "BOUESTI, Ikere-Ekiti",                         live: true  },
  { id: "unilag",   short: "UNILAG",   name: "University of Lagos",                           live: true  },
  { id: "unilorin", short: "UNILORIN", name: "University of Ilorin",                          live: true  },

  // South West — Ekiti
  { id: "fuoye",    short: "FUOYE",    name: "Federal University Oye-Ekiti",                  live: true  },
  { id: "eksu",     short: "EKSU",     name: "Ekiti State University, Ado-Ekiti",             live: true  },
  { id: "abuad",    short: "ABUAD",    name: "Afe Babalola University, Ado-Ekiti",            live: true  },

  // South West — Lagos
  { id: "lasu",     short: "LASU",     name: "Lagos State University",                        live: true  },

  // South West — Ogun
  { id: "funaab",   short: "FUNAAB",   name: "Federal University of Agriculture, Abeokuta",  live: true  },
  { id: "oou",      short: "OOU",      name: "Olabisi Onabanjo University",                   live: true  },
  { id: "covenant", short: "Covenant", name: "Covenant University, Ota",                      live: true  },
  { id: "babcock",  short: "Babcock",  name: "Babcock University, Ilishan-Remo",              live: true  },

  // South West — Oyo
  { id: "ui",       short: "UI",       name: "University of Ibadan",                          live: true  },
  { id: "lautech",  short: "LAUTECH",  name: "Ladoke Akintola University of Technology",      live: true  },

  // South West — Osun
  { id: "oau",      short: "OAU",      name: "Obafemi Awolowo University",                    live: true  },
  { id: "uniosun",  short: "UNIOSUN",  name: "Osun State University",                         live: true  },

  // South West — Ondo
  { id: "futa",     short: "FUTA",     name: "Federal University of Technology, Akure",       live: true  },
  { id: "aaua",     short: "AAUA",     name: "Adekunle Ajasin University, Akungba-Akoko",     live: true  },

  // Other regions — not yet live
  { id: "unn",      short: "UNN",      name: "University of Nigeria, Nsukka",                 live: false },
  { id: "abu",      short: "ABU",      name: "Ahmadu Bello University, Zaria",                live: false },
  { id: "uniben",   short: "UNIBEN",   name: "University of Benin",                           live: false },
];

export const PROPERTY_TYPES = ["Self-contain", "Single room", "Room & parlour", "Studio apartment", "1-bedroom flat", "2-bedroom flat", "3-bedroom flat", "Shared apartment"];
export const DISTANCES = ["Under 500m", "500m – 1km", "1 – 2km", "2 – 5km", "Over 5km"];
export const AMENITY_GROUPS: Record<string, string[]> = {
  Water: ["Borehole", "Running water", "Water tank"],
  Power: ["Prepaid meter", "Standby generator", "Solar backup"],
  Security: ["Gated compound", "Burglary proof", "Security guard", "Fenced"],
  Comfort: ["Tiled floors", "POP ceiling", "Wardrobe", "En-suite", "Parking space", "WiFi ready"],
};


export interface Listing {
  id: string; title: string; type: string; area: string; price: number; dist: number; beds: number; baths: number; sqm: number;
  gender: string; vacant: number; landlord: string; rating: number; from: string; to: string; featured: boolean;
  amenities: string[]; landmark: string; desc: string;
}
