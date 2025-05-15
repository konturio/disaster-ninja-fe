import { i18n } from '~core/localization';
import { isNumber } from '~utils/common';
import type { FeatureCardCfg } from '../../components/CardElements';

const language = i18n.instance.language || 'default';

const formatDateFn = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}).format;

const formatTime = (d: string | number | Date) => formatDateFn(new Date(d));

const formatAcquisitionDates = (dateStart?: string, dateEnd?: string) => {
  const startFormatted = dateStart ? formatTime(dateStart) : null;
  const endFormatted = dateEnd ? formatTime(dateEnd) : null;
  if (startFormatted) {
    if (endFormatted && endFormatted !== startFormatted) {
      return `${startFormatted} - ${endFormatted}`;
    } else {
      return startFormatted;
    }
  } else if (endFormatted) {
    return endFormatted;
  }
  return null;
};

function formatResolutionForOutput(resolutionInMeters: string) {
  const resNumber = Number.parseFloat(resolutionInMeters);
  if (!isNumber(resNumber)) {
    return resolutionInMeters;
  }
  if (resNumber > 1000) {
    return `${parseFloat((resNumber / 1000).toFixed(3))} km`;
  }
  if (resNumber < 1) {
    return `${parseFloat((resNumber * 100).toFixed(3))} cm`;
  }
  return `${parseFloat(resNumber.toFixed(3))} m`;
}

function fileSizeToMB(fileSizeKB: string) {
  const mbNumber = Number.parseFloat(fileSizeKB) / 1000000;
  return parseFloat(mbNumber.toFixed(2));
}

export function getOAMPanelData(featuresListOAM: object) {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListOAM).map((f) => {
    const { properties: p } = f;
    const dataTable: any[][] = [
      [
        'Acquisition date',
        formatAcquisitionDates(p.acquisition_start, p.acquisition_end),
      ],
      ['Uploaded at', formatTime(p.uploaded_at)],
      [
        'Resolution',
        p.properties?.resolution_in_meters
          ? `${formatResolutionForOutput(p.properties?.resolution_in_meters)}`
          : null,
      ],
      ['Uploaded by', p.user?.name],
      ['Provider', p.provider],
      ['Platform', p.platform],
      ['Sensor', p.properties?.sensor],
      ['Image size', p.file_size ? `${fileSizeToMB(p.file_size)} MB` : 'unknown'],
      ['License', p.properties?.license],
    ].filter((v) => !!v[1]);
    return {
      id: f.id,
      focus: p.bbox,
      properties: p,
      items: [
        {
          type: 'image',
          src: `${p.properties?.thumbnail}`,
        },
        {
          type: 'title',
          title: `${p.title}`,
        },
        {
          type: 'table',
          rows: dataTable,
        },
      ],
    };
  });

  return featuresList;
}
