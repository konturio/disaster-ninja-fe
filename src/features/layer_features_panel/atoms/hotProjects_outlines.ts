import type { FeatureCardCfg } from '../components/CardElements';

const formatTimeFn = new Intl.DateTimeFormat('default', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZoneName: 'short',
}).format;

const formatTime = (d: string | number | Date) => formatTimeFn(new Date(d));

function toTitleCase(word: string) {
  return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
}

const RED = { color: 'var(--error-strong)', backgroundColor: '#F8DDE0' }; // 'var(--error-weak)'
const GREEN = { color: 'var(--success-strong)', backgroundColor: '#EAF6E6' }; // 'var(--success-weak)'
const ORANGE = { color: 'var(--warning-strong)', backgroundColor: '#FFE8D4' }; // 'var(--warning-weak)'
const DARKGREY = {
  color: 'var(--base-strong-down)',
  backgroundColor: 'var(--faint-weak)',
};

function buildPriorityLabel(s: string) {
  const colorMap = {
    LOW: DARKGREY,
    MEDIUM: DARKGREY,
    HIGH: ORANGE,
    URGENT: RED,
  };
  return { value: toTitleCase(s) + ' priority', ...(colorMap[s] || {}) };
}

/*
Features should be sorted by their status (PUBLISHED → archived),
then by priority (high → medium → low) and then by mapped % (low → high).
HOT projects with high priority and low mapped % should be higher
*/
function hotProjectsSort(a, b) {
  const weight_status = {
    // ACTIVE: 30000,
    PUBLISHED: 20000,
    ARCHIVED: 10000,
  };

  const weight_projectPriority = {
    LOW: 1000,
    MEDIUM: 2000,
    HIGH: 3000,
    URGENT: 4000,
  };

  const res =
    weight_status[a.properties.status] - weight_status[b.properties.status] ||
    weight_projectPriority[a.properties.projectPriority] -
      weight_projectPriority[b.properties.projectPriority] ||
    -a.properties.percentMapped + b.properties.percentMapped;

  return -res;
}

export function getPanelData(featuresListHOT: object) {
  const featuresList: FeatureCardCfg[] = Object.values(featuresListHOT).map((f) => {
    const { properties: p } = f;
    return {
      id: f.id,
      focus: p.aoiBBOX, //f.geometry.coordinates
      properties: p,
      items: [
        {
          type: 'label',
          items: [
            { value: '#' + p.projectId },
            ...(p.status == 'ARCHIVED'
              ? [
                  {
                    value: 'Archived',
                    color: 'var(--faint-strong)',
                    backgroundColor: 'var(--faint-weak)',
                  },
                ]
              : []),
            buildPriorityLabel(p.projectPriority),
          ],
        },
        {
          type: 'title',
          // icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAw0lEQVR4nO2WWwrCMBBFz0ezhoouxYK4IyNdkdbuR5qFiAtQKUyhP0rz0IyQA/nrzTxymwwUCn9ABTjg6bmcaKM5BgSflo0NXgM34AHsPHRb0dyBdUwCnVRyCtCeRTvuEUQTWcXUvTGJva+4Aq4iPhCOnRnShBjP+Qo/FGJ/0roUR9lJ8Avp6Jcaspllu0mYwGpJVw0wyEct6Wll7+Gdr0zuBLIfgQoTqvgNs19EKq7i7I+RiudYxUCSfSRTMZQWCnyTF73qivMHBsP9AAAAAElFTkSuQmCC',
          title: `${p.projectInfo.name}`,
          // subtitle: 'Sub',
        },
        {
          type: 'progress',
          // caption: 'Caption',
          items: [
            {
              title: '% Validated',
              value: p.percentValidated,
              color: 'var(--success-strong)',
            },
            { title: '% Mapped', value: p.percentMapped, color: 'var(--faint-strong)' },
          ],
        },
        {
          type: 'table',
          rows: [
            ['Creation date', formatTime(p.created)],
            ['Types of mapping', (p.mappingTypes || []).map(toTitleCase).join(', ')],
            ['Last contribution', formatTime(p.lastUpdated)],
          ],
        },
        {
          type: 'actions',
          items: [
            {
              title: 'Open in Tasking Manager',
              type: 'external_link',
              data: p.projectLink || `https://tasks.hotosm.org/projects/${p.projectId}`,
            },
          ],
        },
      ],
    };
  });

  featuresList.sort(hotProjectsSort);

  return featuresList;
}
