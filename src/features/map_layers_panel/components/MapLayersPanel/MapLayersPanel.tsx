import { TranslationService as i18n } from '~core/localization';
import { Panel, Text } from '@k2-packages/ui-kit';
import { LayersTree } from '../LayersTree/LayersTree';
import type { LogicalLayerAtom } from '../../types';
import s from './MapLayersPanel.module.css';

export function MapLayerPanel({
  layersAtoms,
}: {
  layersAtoms: LogicalLayerAtom[];
}) {
  return (
    <Panel
      className={s.panel}
      header={<Text type="heading-l">{i18n.t('Layers')}</Text>}
    >
      <div className={s.scrollable}>
        <LayersTree layers={layersAtoms} />
      </div>
    </Panel>
  );

  // return (
  //   <Panel header={<Text type="heading-l">{i18n.t('Layers')}</Text>}>
  //     <div className={s.scrollable}>
  //       {[
  //         {
  //           id: 'foo',
  //           name: 'Selected Area',
  //           type: 'not-interactive' as const,
  //           icon: (
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <rect
  //                 width="9"
  //                 height="9"
  //                 x="7.5"
  //                 y="7.5"
  //                 stroke="#0C9BED"
  //                 strokeWidth="3"
  //                 rx="4.5"
  //               />
  //             </svg>
  //           ),
  //         },
  //         {
  //           id: 'bar',
  //           name: 'Event Shape',
  //           type: 'radio' as const,
  //           icon: (
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //             >
  //               <rect
  //                 width="9"
  //                 height="9"
  //                 x="7.5"
  //                 y="7.5"
  //                 stroke="#0C9BED"
  //                 strokeWidth="3"
  //                 rx="4.5"
  //               />
  //             </svg>
  //           ),
  //         },
  //         {
  //           id: 'baz',
  //           name: 'baz',
  //           type: 'checkbox' as const,
  //           controls: [
  //             <div
  //               key="foo"
  //               style={{ width: '24px', height: '24px', background: 'black' }}
  //             ></div>,
  //             <div
  //               key="bar"
  //               style={{ width: '24px', height: '24px', background: 'black' }}
  //             ></div>,
  //             <div
  //               key="baz"
  //               style={{ width: '24px', height: '24px', background: 'black' }}
  //             ></div>,
  //           ],
  //         },
  //       ].map((l) => (
  //         <LayerControl
  //           key={l.id}
  //           enabled={enabledLayersSet.has(l.id)}
  //           hidden={hiddenLayersSet.has(l.id)}
  //           name={l.name}
  //           inputType={l.type}
  //           icon={l.icon}
  //           controls={l.controls}
  //         />
  //       ))}
  //     </div>
  //   </Panel>
  // );

  // return (
  //   <Panel header={<Text type="heading-l">{i18n.t('Layers')}</Text>}>
  //     <div className={s.scrollable}>
  //       {statesToComponents({
  //         loading: <LoadingSpinner />,
  //         error: (errorMessage) => <ErrorMessage message={errorMessage} />,
  //         ready: (layers) =>
  //           layers.map((l) => (
  //             <LayerControl
  //               key={l.id}
  //               enabled={enabledLayersSet.has(l.id)}
  //               hidden={hiddenLayersSet.has(l.id)}
  //               name={l.name}
  //               inputType={'button'}
  //             />
  //           )),
  //       })}
  //     </div>
  //   </Panel>
  // );
}
