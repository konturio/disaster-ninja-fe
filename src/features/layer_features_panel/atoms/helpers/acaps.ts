import { getBboxForGeometry } from '~utils/map/camera';
import type {
  AcapsFeatureProperties,
  AcapsRiskList,
  AcapsInfoLandscape,
  AcapsProtectionRisks,
  AcapsSeasonalEvents,
} from '../../types/acaps';
import type {
  CardElementId,
  FeatureCardCfg,
  FeatureCardItemCfg,
} from '../../components/CardElements';

const ACAPS_SOURCE_DATASETS = {
  RISK_LIST: 'Risk list',
  SEASONAL_EVENTS_CALENDAR: 'Seasonal events calendar',
  INFORMATION_LANDSCAPE_DATASET: 'Information landscape dataset',
  PROTECTION_RISKS_MONITOR: 'Protection risks monitor',
};

function joinArray(arr?: string[]): string {
  return arr?.join(', ') ?? '';
}

function removeEmptyRows(rows: string[][]): string[][] {
  return rows.filter((row) => row.length > 1 && row[1]);
}

export function getAcapsPanelData(featuresListAcaps: object): FeatureCardCfg[] {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListAcaps).map(
    (feature) => {
      const p = feature.properties as AcapsFeatureProperties;
      const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
      cardItems.push({
        type: 'label',
        items: [{ value: p.acaps_source_dataset }],
      });
      if (p.country) {
        cardItems.push({ type: 'text', text: joinArray(p.country) });
      }
      if (p.adm1_eng_name) {
        cardItems.push({ type: 'text', text: joinArray(p.adm1_eng_name) });
      }
      switch (p.acaps_source_dataset) {
        case ACAPS_SOURCE_DATASETS.RISK_LIST:
          cardItems.push(...getRiskListCardItems(p as AcapsRiskList));
          break;
        case ACAPS_SOURCE_DATASETS.INFORMATION_LANDSCAPE_DATASET:
          cardItems.push(...getInfoLandscapeCardItems(p as AcapsInfoLandscape));
          break;
        case ACAPS_SOURCE_DATASETS.SEASONAL_EVENTS_CALENDAR:
          cardItems.push(...getSeasonalEventsCardItems(p as AcapsSeasonalEvents));
          break;
        case ACAPS_SOURCE_DATASETS.PROTECTION_RISKS_MONITOR:
          cardItems.push(...getProtectionsRisksCardItems(p as AcapsProtectionRisks));
          break;
      }

      return {
        id: feature.id,
        focus: getBboxForGeometry(feature.geometry),
        properties: p,
        items: cardItems,
      };
    },
  );
  return featuresList;
}

function getRiskListCardItems(p: AcapsRiskList): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.comment) {
    cardItems.push({ type: 'title', title: p.comment });
  }
  if (p.risk_type) {
    cardItems.push({ type: 'text', text: p.risk_type });
  }
  const rows = removeEmptyRows([
    ['geographic_level', p.geographic_level],
    ['impact', p.impact],
    ['date_entered', p.source_date ?? ''],
    ['last_risk_update', p.last_risk_update],
    ['status', p.status],
    ['exposure', p.exposure],
    ['intensity', p.intensity],
    ['probability', p.probability],
    ['risk_level', p.risk_level],
  ]);
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
  const footerRows = removeEmptyRows([
    ['published', p.published ?? ''],
    ['_internal_filter_date', p._internal_filter_date],
  ]);
  cardItems.push({ type: 'table', rows: footerRows });
  return cardItems;
}

function getInfoLandscapeCardItems(
  p: AcapsInfoLandscape,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.indicator) {
    cardItems.push({ type: 'title', title: joinArray(p.indicator) });
  }
  if (p.subindicator) {
    cardItems.push({ type: 'text', text: joinArray(p.subindicator) });
  }
  const rows = removeEmptyRows([
    ['entry_type', p.entry_type ?? ''],
    ['created', p.created],
    ['source_name', p.source_name],
    ['source_date', p.source_date],
  ]);
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
  p: AcapsSeasonalEvents,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.indicator) {
    cardItems.push({ type: 'title', title: joinArray(p.indicator) });
  }
  if (p.months) {
    cardItems.push({ type: 'text', text: joinArray(p.months) });
  }
  const rows = removeEmptyRows([
    ['event_type', joinArray(p.event_type)],
    ['source_name', p.source_name],
    ['source_date', p.source_date],
    ['label', joinArray(p.label)],
  ]);
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

function getProtectionsRisksCardItems(
  p: AcapsProtectionRisks,
): FeatureCardItemCfg<CardElementId>[] {
  const cardItems: FeatureCardItemCfg<CardElementId>[] = [];
  if (p.indicator) {
    cardItems.push({ type: 'title', title: joinArray(p.indicator) });
  }
  const rows = removeEmptyRows([
    [
      'targeting_specific_population_groups',
      joinArray(p.targeting_specific_population_groups),
    ],
    ['source_name', p.source_name],
    ['source_date', p.source_date],
  ]);
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
  if (p.additional_sources) {
    cardItems.push({
      type: 'actions',
      items: [
        {
          type: 'external_link',
          title: p.additional_sources,
          data: p.additional_sources,
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
