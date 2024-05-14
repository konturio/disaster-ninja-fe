import { useEffect, useState } from 'react';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';
import { REFERENCE_AREA_LOGICAL_LAYER_ID } from '~features/reference_area/constants';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { DownloadControl } from './DownloadControl/DownloadControl';
import { EditControl } from './EditControl/EditControl';
import { LayerContextMenu } from './LayerContextMenu/LayerContextMenu';
import { CleanControl } from './EraseControl/CleanControl';
import type {
  LogicalLayerActions,
  LogicalLayerState,
} from '~core/logical_layers/types/logicalLayer';

export function useControlElements({
  layerState,
  layerActions,
  tooltipLayerId,
  skipControls,
}: {
  layerState: LogicalLayerState;
  layerActions: LogicalLayerActions;
  tooltipLayerId: string;
  skipControls?: {
    skipVisibilityControl?: true;
    skipDownloadControl?: true;
    skipContextMenu?: true;
    skipLayerInfo?: true;
  };
}) {
  const [controlElements, setControlElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const elements: JSX.Element[] = [];
    if (layerState.isMounted && !skipControls?.skipVisibilityControl)
      elements.push(
        <LayerHideControl
          key={layerState.id + 'hide'}
          isVisible={layerState.isVisible}
          hideLayer={layerActions.hide}
          unhideLayer={layerActions.show}
        />,
      );
    if (layerState.isEditable) {
      elements.push(
        <EditControl
          layerState={layerState}
          layerActions={layerActions}
          key={layerState.id + 'edit'}
        />,
      );
    }
    if (
      layerState?.id === FOCUSED_GEOMETRY_LOGICAL_LAYER_ID ||
      layerState?.id === REFERENCE_AREA_LOGICAL_LAYER_ID
    ) {
      elements.push(
        <CleanControl
          layerState={layerState}
          layerActions={layerActions}
          key={layerState.id + 'clean'}
        />,
      );
    }
    if (
      layerState.isMounted &&
      layerState.isDownloadable &&
      !skipControls?.skipDownloadControl
    ) {
      elements.push(
        <DownloadControl
          key={layerState.id + 'download'}
          startDownload={layerActions.download}
        />,
      );
    }

    if (layerState?.contextMenu && !skipControls?.skipContextMenu)
      elements.push(
        <LayerContextMenu
          contextMenu={layerState.contextMenu}
          key={layerState.id + 'context'}
        />,
      );

    if (layerState.meta && !skipControls?.skipLayerInfo) {
      elements.push(
        <LayerInfo
          key={layerState.id}
          meta={layerState.meta}
          tooltipId={tooltipLayerId}
        />,
      );
    }

    setControlElements(elements);
  }, [layerState, layerActions, tooltipLayerId]);

  return controlElements;
}
