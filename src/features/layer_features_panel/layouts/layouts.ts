import {
  HOT_PROJECTS_LAYER_ID,
  ACAPS_LAYER_ID,
  ACAPS_SIMPLE_LAYER_ID,
  OAM_LAYER_ID,
} from '../constants';
import { hotProjectsLayout } from './hotProjectsLayout';
import { acapsLayout } from './acapsLayout';
import { oamLayout } from './oamLayout';
import type { UniLayoutComponentNode } from '~components/Uni/Layout/types';

export const layerFeatureLayouts: Record<string, UniLayoutComponentNode> = {
  [HOT_PROJECTS_LAYER_ID]: hotProjectsLayout,
  [ACAPS_LAYER_ID]: acapsLayout,
  [ACAPS_SIMPLE_LAYER_ID]: acapsLayout,
  [OAM_LAYER_ID]: oamLayout,
};
