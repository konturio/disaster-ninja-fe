export interface LayerEditor {
  type: 'mcda';
  component: React.FunctionComponent<LayerEditorProps>;
}

export interface LayerEditorProps {
  layerId: string;
}
