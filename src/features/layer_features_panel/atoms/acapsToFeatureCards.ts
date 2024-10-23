import type {
  AcapsFeatureProperties,
  AcapsRiskListProperties,
  InfoLandscapeProperties,
  SeasonalEventsProperties,
} from '../types/acaps';
import type {
  CardElementId,
  FeatureCardCfg,
  FeatureCardItemCfg,
} from '../components/CardElements';

const ACAPS_SOURCE_DATASETS = {
  RISK_LIST: 'Risk list',
  SEASONAL_EVENTS_CALENDAR: 'Seasonal events calendar',
  INFORMATION_LANDSCAPE_DATASET: 'Information landscape dataset',
  PROTECTION_RISKS_MONITOR: 'Protection risks monitor',
};

export function getAcapsFeatureCards(featuresListAcaps: object): FeatureCardCfg[] {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListAcaps)
    .filter(
      (feat) =>
        feat.properties?.acaps_source_dataset ===
        ACAPS_SOURCE_DATASETS.SEASONAL_EVENTS_CALENDAR,
    )
    .map((feature) => {
      const p = feature.properties as AcapsFeatureProperties;
      const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
      cardItems.push({
        type: 'label',
        items: [{ value: p.acaps_source_dataset }],
      });
      if (p.country) {
        cardItems.push({ type: 'text', text: p.country.join(', ') });
      }
      if (p.adm1_eng_name) {
        cardItems.push({ type: 'text', text: p.adm1_eng_name.join(', ') });
      }
      switch (p.acaps_source_dataset) {
        case ACAPS_SOURCE_DATASETS.RISK_LIST:
          cardItems.push(...getRiskListCardItems(p as AcapsRiskListProperties));
          break;
        case ACAPS_SOURCE_DATASETS.INFORMATION_LANDSCAPE_DATASET:
          cardItems.push(...getInfoLandscapeCardItems(p as InfoLandscapeProperties));
          break;
        case ACAPS_SOURCE_DATASETS.SEASONAL_EVENTS_CALENDAR:
          cardItems.push(...getSeasonalEventsCardItems(p as SeasonalEventsProperties));
          break;
      }

      return {
        id: feature.id,
        focus: [0, 0, 0, 0],
        properties: p,
        items: cardItems,
      };
    });
  return featuresList;
}

function getRiskListCardItems(
  p: AcapsRiskListProperties,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.comment) {
    cardItems.push({ type: 'title', title: p.comment });
  }
  if (p.risk_type) {
    cardItems.push({ type: 'text', text: p.risk_type });
  }
  const rows = [
    ['geographic_level', p.geographic_level],
    ['impact', p.impact],
    ['date_entered', p.source_date ?? ''],
    ['last_risk_update', p.last_risk_update],
    ['status', p.status],
    ['exposure', p.exposure],
    ['intensity', p.intensity],
    ['probability', p.probability],
    ['risk_level', p.risk_level],
  ].filter((row) => row[1]);
  cardItems.push({ type: 'table', rows });
  if (p.source_link) {
    cardItems.push({
      type: 'actions',
      items: [
        {
          type: 'external_link',
          title: p.source_link,
          data: p.source_link,
        },
      ],
    });
  }
  if (p.rationale) {
    cardItems.push({ type: 'text', title: 'rationale', text: p.rationale });
  }
  if (p.trigger) {
    cardItems.push({ type: 'text', title: 'trigger', text: p.trigger });
  }
  if (p.vulnerability) {
    cardItems.push({ type: 'text', title: 'vulnerability', text: p.vulnerability });
  }
  const footerRows = [
    ['published', p.published ?? ''],
    ['_internal_filter_date', p._internal_filter_date],
  ].filter((row) => row[1]);
  cardItems.push({ type: 'table', rows: footerRows });
  return cardItems;
}

function getInfoLandscapeCardItems(
  p: InfoLandscapeProperties,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.indicator) {
    cardItems.push({ type: 'title', title: p.indicator.join(', ') });
  }
  if (p.subindicator) {
    cardItems.push({ type: 'text', text: p.subindicator.join(', ') });
  }
  const rows = [
    ['entry_type', p.entry_type ?? ''],
    ['created', p.created],
    ['source_name', p.source_name],
    ['source_date', p.source_date],
  ].filter((row) => row[1]);
  cardItems.push({ type: 'table', rows });
  if (p.source_link) {
    cardItems.push({
      type: 'actions',
      items: [
        {
          type: 'external_link',
          title: p.source_link,
          data: p.source_link,
        },
      ],
    });
  }
  if (p.comment) {
    cardItems.push({ type: 'text', text: p.comment });
  }
  cardItems.push({
    type: 'table',
    rows: [['_internal_filter_date', p._internal_filter_date]],
  });
  return cardItems;
}

function getSeasonalEventsCardItems(
  p: SeasonalEventsProperties,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.indicator) {
    cardItems.push({ type: 'title', title: p.indicator.join(', ') });
  }
  if (p.months) {
    cardItems.push({ type: 'text', text: p.months.join(', ') });
  }
  const rows = [
    ['event_type', p.event_type.join(', ')],
    ['source_name', p.source_name],
    ['label', p.label.join(', ')],
  ].filter((row) => row[1]);
  cardItems.push({ type: 'table', rows });
  if (p.comment) {
    cardItems.push({ type: 'text', text: p.comment });
  }
  if (p.source_link) {
    cardItems.push({
      type: 'actions',
      items: [
        {
          type: 'external_link',
          title: p.source_link,
          data: p.source_link,
        },
      ],
    });
  }
  return cardItems;
}
