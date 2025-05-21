import { formatsRegistry } from '~components/Uni/formatsRegistry';
import type { FeatureCardCfg } from '../../components/CardElements';

export function getOAMPanelData(featuresListOAM: object) {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListOAM).map((f) => {
    const { properties: p } = f;
    const dataTable: any[][] = [
      [
        'Acquisition date',
        formatsRegistry.dates_interval({
          dateStart: p.acquisition_start,
          dateEnd: p.acquisition_end,
        }),
      ],
      ['Uploaded at', formatsRegistry.date_month_year(p.uploaded_at)],
      [
        'Resolution',
        formatsRegistry.distance_per_pixel(p.properties?.resolution_in_meters),
      ],
      ['Uploaded by', p.user?.name],
      ['Provider', p.provider],
      ['Platform', p.platform],
      ['Sensor', p.properties?.sensor],
      ['Image size', formatsRegistry.file_size(p.file_size)],
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
