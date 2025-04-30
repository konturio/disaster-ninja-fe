import { i18n } from '~core/localization';
import type { FeatureCardCfg } from '../../components/CardElements';

const language = i18n.instance.language || 'default';

const formatTimeFn = new Intl.DateTimeFormat(language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

const formatTime = (d: string | number | Date) => formatTimeFn(new Date(d));

function resolutionToFixedPoint(resolutionInMeters: string) {
  const resNumber = Number.parseFloat(resolutionInMeters);
  return parseFloat(resNumber.toFixed(3));
}

function fileSizeToMB(fileSizeKB: string) {
  const mbNumber = Number.parseFloat(fileSizeKB) / 1000000;
  return parseFloat(mbNumber.toFixed(2));
}

export function getOAMPanelData(featuresListOAM: object) {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListOAM).map((f) => {
    const { properties: p } = f;
    return {
      id: f.id,
      focus: p.bbox,
      properties: p,
      items: [
        {
          type: 'title',
          title: `${p.title}`,
        },
        {
          type: 'image',
          src: `${p.properties?.thumbnail}`,
        },
        {
          type: 'table',
          rows: [
            ['Uploaded at', formatTime(p.uploaded_at)],
            [
              'Resolution',
              p.properties?.resolution_in_meters
                ? `${resolutionToFixedPoint(p.properties?.resolution_in_meters)}m`
                : 'unknown',
            ],
            ['Uploader', p.user?.name || ''],
            ['Provider', p.provider || ''],
            ['Platform', p.platform || ''],
            ['Sensor', p.properties?.sensor || ''],
            ['License', p.properties?.license || ''],
            ['File size', p.file_size ? `${fileSizeToMB(p.file_size)} MB` : 'unknown'],
          ],
        },
      ],
    };
  });

  return featuresList;
}
