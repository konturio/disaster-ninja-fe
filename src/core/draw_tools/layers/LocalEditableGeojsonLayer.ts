import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers';
import { FeatureCollection } from '@nebula.gl/edit-modes';

function guideAccessor(accessor) {
  if (!accessor || typeof accessor !== 'function') {
    return accessor;
  }
  return (guideMaybeWrapped) => accessor(unwrapGuide(guideMaybeWrapped));
}
function unwrapGuide(guideMaybeWrapped) {
  if (guideMaybeWrapped.__source) {
    return guideMaybeWrapped.__source.object;
  } else if (guideMaybeWrapped.sourceFeature) {
    return guideMaybeWrapped.sourceFeature.feature;
  }
  // It is not wrapped, return as is
  return guideMaybeWrapped;
}

export class LocalEditableGeojsonLayer extends EditableGeoJsonLayer {
  // i did this because ts throws errors and EditableGeoJsonLayer in source code has ts errors itself, so it doesn't extends as it should
  [key: string]: any;
  renderLayers() {
    const subLayerProps = this.getSubLayerProps({
      id: 'geojson',

      // Proxy most GeoJsonLayer props as-is
      data: this.props.data,
      fp64: this.props.fp64,
      filled: this.props.filled,
      stroked: this.props.stroked,
      lineWidthScale: this.props.lineWidthScale,
      lineWidthMinPixels: this.props.lineWidthMinPixels,
      lineWidthMaxPixels: this.props.lineWidthMaxPixels,
      lineWidthUnits: this.props.lineWidthUnits,
      lineJointRounded: this.props.lineJointRounded,
      lineCapRounded: this.props.lineCapRounded,
      lineMiterLimit: this.props.lineMiterLimit,
      pointRadiusScale: this.props.pointRadiusScale,
      pointRadiusMinPixels: this.props.pointRadiusMinPixels,
      pointRadiusMaxPixels: this.props.pointRadiusMaxPixels,
      getLineColor: this.selectionAwareAccessor(this.props.getLineColor),
      getFillColor: this.selectionAwareAccessor(this.props.getFillColor),
      getPointRadius: this.selectionAwareAccessor(this.props.getRadius),
      getLineWidth: this.selectionAwareAccessor(this.props.getLineWidth),

      _subLayerProps: {
        linestrings: {
          billboard: this.props.billboard,
          updateTriggers: {
            // required to update dashed array attribute
            all: [this.props.selectedFeatureIndexes, this.props.mode],
          },
        },
        'polygons-stroke': {
          billboard: this.props.billboard,
          updateTriggers: {
            // required to update dashed array attribute
            all: [this.props.selectedFeatureIndexes, this.props.mode],
          },
        },
      },

      updateTriggers: {
        getLineColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getFillColor: [this.props.selectedFeatureIndexes, this.props.mode],
        getPointRadius: [this.props.selectedFeatureIndexes, this.props.mode],
        getLineWidth: [this.props.selectedFeatureIndexes, this.props.mode],
      },
    });

    let layers: any[] = [new GeoJsonLayer(subLayerProps)];

    layers = layers.concat(
      this.createGuidesLayers(),
      this.createTooltipsLayers(),
      this.createGeoJsoniconLayer(),
    );

    return layers;
  }

  createGeoJsoniconLayer() {
    const data: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    data.features = this.props.data?.features?.map((feature, index) => {
      if (feature.geometry.type !== 'Point')
        return {
          ...feature,
          properties: { isHidden: true },
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        };
      return { ...feature };
    });

    if (!data || !data.features.length || !this.props.geojsonIcons) {
      return [];
    }

    const subLayerProps = {};

    subLayerProps['points-icon'] = {
      type: IconLayer,
      iconAtlas: this.props.geojsonIcons.iconAtlas,
      iconMapping: this.props.geojsonIcons.iconMapping,
      sizeUnits: this.props.editHandleIconSizeUnits,
      sizeScale: this.props.geojsonIcons.sizeScale,
      getIcon: guideAccessor(this.props.geojsonIcons.getIcon),
      getSize: guideAccessor(this.props.geojsonIcons.getSize),
    };

    const layer = new GeoJsonLayer(
      this.getSubLayerProps({
        id: `point-icons`,
        data,
        fp64: this.props.fp64,
        _subLayerProps: subLayerProps,
        pointType: 'icon',
        iconAtlas: this.props.geojsonIcons.iconAtlas,
      }),
    );

    return [layer];
  }
}
