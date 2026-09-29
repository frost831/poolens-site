export const sources = {
  robots: { name: 'Maytronics: manuals by model or part number', url: 'https://manuals.maytronics.com/', scope: 'Official Dolphin manual lookup. For another cleaner brand, use its own official manual route.', checked: '2026-09-29' },
  jandy: { name: 'Jandy: official customer support', url: 'https://www.jandy.com/en/support', scope: 'Manufacturer support for identifying applicable Jandy documentation and equipment questions.', checked: '2026-09-29' },
  california: { name: 'California Energy Commission: replacement pool-pump motor questions', url: 'https://www.energy.ca.gov/programs-and-topics/programs/appliance-efficiency-program-outreach-and-education/replacement', scope: 'Official California reference route. Confirm current applicability to the specific proposed work.', checked: '2026-09-29' },
  texas: { name: 'Texas DSHS: public swimming pool and spa laws and rules', url: 'https://www.dshs.texas.gov/public-swimming-pools-spas/laws-rules-public-swimming-pools-spas', scope: 'Official Texas source route; use the applicable current text and responsible authority.', checked: '2026-09-29' },
  florida: { name: 'Florida Department of Health: public swimming pools', url: 'https://www.floridahealth.gov/community-environmental-public-health/environmental-public-health/water-quality/public-swimming-pools/', scope: 'Official Florida program and requirements route. This note does not interpret the requirements.', checked: '2026-09-29' },
  oregon: { name: 'Oregon Health Authority: public pools and tourist facilities', url: 'https://www.oregon.gov/oha/ph/HealthyEnvironments/Recreation/PoolsLodging/Pages/index.aspx', scope: 'Official Oregon program route. Check adoption, effective dates, and venue applicability with the authority.', checked: '2026-09-29' },
  barriers: { name: 'CPSC: Pool Safely resources', url: 'https://www.cpsc.gov/safety-education/safety-education-centers/pool-safely', scope: 'Federal pool-safety reference route, not an inspection or approval of a specific installation.', checked: '2026-09-29' },
  flood: { name: 'National Weather Service: flood safety resources', url: 'https://www.weather.gov/safety/flood', scope: 'Official flood-safety resource route. Current local warnings and qualified access assessment remain essential.', checked: '2026-09-29' },
  weather: { name: 'National Weather Service: cold-weather alerts', url: 'https://www.weather.gov/safety/cold-ww', scope: 'Weather terminology and links to current local forecasts. Not an equipment protection plan.', checked: '2026-09-29' },
  operations: { name: 'CDC: operating public pools, hot tubs and splash pads', url: 'https://www.cdc.gov/healthy-swimming/toolkit/operating-public-pools-hot-tubs-and-splash-pads.html', scope: 'Public aquatic operations reference. Confirm applicable requirements with the local authority.', checked: '2026-09-29' },
  chemicals: { name: 'CDC: pool chemical safety', url: 'https://www.cdc.gov/healthy-swimming/toolkit/pool-chemical-safety.html', scope: 'Chemical safety reference. Use the exact product label and site emergency plan for decisions.', checked: '2026-09-29' },
  manuals: { name: 'Pentair: pool education and support', url: 'https://www.pentair.com/en-us/pool-spa/education-support.html', scope: 'A manufacturer source route, not evidence that an unidentified part fits. For other brands use their official support.', checked: '2026-09-29' }
};

export const clusters = {
  'pool-opening-closing': ['Opening and closing', 'Records that connect the closing visit, winter observations, and opening plan.', ['weather', 'manuals']],
  'spa-hot-tubs': ['Spas and hot tubs', 'Evidence and handoffs for spa service and guest turnover.', ['operations', 'manuals']],
  'robots-cleaners': ['Robots and cleaners', 'Cleaner identity, storage records, and source verification.', ['robots', 'manuals']],
  'automation-controls': ['Automation and controls', 'Record controller context before a qualified settings review.', ['jandy', 'manuals']],
  'pumps-motors': ['Pumps and motors', 'Model evidence and source questions before pump or motor work.', ['manuals']],
  'heaters-heat-pumps': ['Heaters and heat pumps', 'Operating context and documentation for qualified heater support.', ['manuals']],
  'salt-chemistry-controllers': ['Salt and chemistry controllers', 'Separate observed readings from assumptions about equipment.', ['manuals', 'chemicals']],
  'filters-valves-plumbing': ['Filters, valves and plumbing', 'Label, measurement, and history records for parts discussions.', ['manuals']],
  'covers-safety-equipment': ['Covers and safety equipment', 'Accessible visual observations and records for qualified assessment.', ['barriers', 'manuals']],
  'facility-cpo': ['Facility operations', 'Organize logs, authority references, and operator handoffs.', ['operations']],
  'field-documentation': ['Field documentation', 'Clear visit records, timestamps, and follow-up ownership.', ['operations', 'manuals']],
  'troubleshooting-reference': ['Troubleshooting reference', 'Capture symptoms without turning a photograph into a diagnosis.', ['manuals']],
  'manuals-sources': ['Manuals and sources', 'Find the right document and preserve its applicability.', ['manuals', 'operations']],
  'buyer-proof': ['Before ordering', 'Keep requests, supplier answers, and approvals connected.', ['manuals']],
  partsnap: ['PartSnap and identification', 'Photo-first equipment identification and verification questions.', ['manuals']]
};

const specific = {
  3: ['flood', 'manuals'], 9: ['california', 'manuals'], 13: ['flood'],
  20: ['chemicals'], 21: ['flood', 'manuals'], 48: ['flood'],
  57: ['chemicals', 'operations'], 63: ['flood'], 69: ['barriers', 'operations'],
  71: ['texas', 'operations'], 77: ['california', 'manuals'],
  81: ['oregon', 'operations'], 105: ['chemicals', 'operations'],
  108: ['florida', 'operations'], 109: ['texas', 'barriers']
};
export const sourceIds = article => specific[Number(article.id.slice(-3))] || clusters[article.cluster][2];
