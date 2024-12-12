export interface LayerEditor {
  type: 'mcda' | 'multivariate';
  component: React.FunctionComponent<LayerEditorProps>;
}

export interface LayerEditorProps {
  layerId: string;
}
