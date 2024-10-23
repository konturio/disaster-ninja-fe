export interface AcapsFeatureProperties {
  acaps_source_dataset: string;
  country: string[];
  iso3: string[];
  source_link?: string;
  source_date: string; //date
  source_name: string;
  indicator: string[];
  source_id: string;
  countrywide: boolean;
  comment?: string;
  _internal_filter_date: string; //date
  adm1_eng_name?: string[];
}

export interface AcapsRiskListProperties extends AcapsFeatureProperties {
  impact: string;
  status: string;
  trigger: string;
  exposure: string;
  crisis_id?: string[];
  intensity: string;
  rationale: string;
  risk_type: string;
  risk_level: string;
  probability: string;
  vulnerability: string;
  geographic_level: string;
  last_risk_update: string; //date
  publication_link?: string;
  published?: string; //date
  date_entered?: string; // date
}

export interface InfoLandscapeProperties extends AcapsFeatureProperties {
  subindicator: string[];
  entry_type?: string;
  created: string; //date
}

export interface SeasonalEventsProperties extends AcapsFeatureProperties {
  months: string[];
  event_type: string[];
  label: string[];
}
