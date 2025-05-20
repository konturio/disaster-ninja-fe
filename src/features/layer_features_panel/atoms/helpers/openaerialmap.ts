import { isNumber } from '~utils/common';
import { formatsRegistry } from '~components/Uni/formatsRegistry';
import type { FeatureCardCfg } from '../../components/CardElements';

const formatAcquisitionDates = (dateStart?: string, dateEnd?: string) => {
  const startFormatted = dateStart ? formatsRegistry.date_month_year(dateStart) : null;
  const endFormatted = dateEnd ? formatsRegistry.date_month_year(dateEnd) : null;
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
    return `${parseFloat((resNumber / 1000).toFixed(3))} km/px`;
  }
  if (resNumber < 1) {
    return `${parseFloat((resNumber * 100).toFixed(3))} cm/px`;
  }
  return `${parseFloat(resNumber.toFixed(3))} m/px`;
}

function formatFileSize(sizeBytesString: string) {
  const sizeBytes = Number.parseFloat(sizeBytesString);
  if (!isNumber(sizeBytes)) {
    return 'unknown';
  }
  if (sizeBytes > 1000000000) {
    return `${parseFloat((sizeBytes / 1000000000).toFixed(2))} GB`;
  }
  if (sizeBytes > 1000000) {
    return `${parseFloat((sizeBytes / 1000000).toFixed(2))} MB`;
  }
  if (sizeBytes > 1000) {
    return `${parseFloat((sizeBytes / 1000).toFixed(2))} KB`;
  }
  return `${parseFloat((sizeBytes / 1000).toFixed(2))} B`;
}

export function getOAMPanelData(featuresListOAM: object) {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListOAM).map((f) => {
    const { properties: p } = f;
    const dataTable: any[][] = [
      [
        'Acquisition date',
        formatAcquisitionDates(p.acquisition_start, p.acquisition_end),
      ],
      ['Uploaded at', formatsRegistry.date_month_year(p.uploaded_at)],
      [
        'Resolution',
        p.properties?.resolution_in_meters
          ? formatResolutionForOutput(p.properties?.resolution_in_meters)
          : null,
      ],
      ['Uploaded by', p.user?.name],
      ['Provider', p.provider],
      ['Platform', p.platform],
      ['Sensor', p.properties?.sensor],
      ['Image size', p.file_size ? formatFileSize(p.file_size) : 'unknown'],
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
        {
          type: 'actions',
          items: [
            {
              title: 'Download',
              icon: 'Download16',
              type: 'external_link',
              // TODO: Is there a different way to get a working file link? It's weird that that the full picture link is only inside uuid field.
              data: p.uuid,
            },
          ],
        },
      ],
    };
  });

  return featuresList;
}
