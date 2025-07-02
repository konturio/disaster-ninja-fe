import { useFixtureInput } from 'react-cosmos/client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { eventCardLayoutTemplate } from '~features/events_list/components/EventsPanel/eventLayouts';
import { UniLayoutContext, useUniLayoutContextValue } from './Layout/UniLayoutContext';
import { UniLayoutRenderer } from './Layout/UniLayoutRenderer';
import { eventSampleData } from '~core/api/__mocks__/_eventsSampleData';
import { hotData } from '~core/api/__mocks__/_hotSampleData';
import { acapsSampleData } from '~core/api/__mocks__/_acapsSampleData';
import { hotProjectLayoutTemplate } from './__mocks__/_hotLayout.js';
import { complexDataLayout, complexDataSamples } from './__mocks__/_complexLayout';
import {
  conditionalDataSamples,
  conditionalLayout,
} from './__mocks__/_conditionalLayout';
import style from './__mocks__/fixture.module.css';
import { acapsLayout } from '~features/layer_features_panel/layouts/acaps';

const useJsonState = (initialValue: any): [string, (value: string) => void] => {
  const [json, setJson] = useState(JSON.stringify(initialValue, null, 4));
  return [json, setJson];
};

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  title?: string;
  visible?: boolean;
}

const JsonEditor = ({
  value,
  onChange,
  placeholder,
  className = '',
  title,
  visible = true,
}: JsonEditorProps) => {
  const [localValue, setLocalValue] = useState(value);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    try {
      JSON.parse(newValue);
      onChange(newValue);
      setHasError(false);
    } catch (error) {
      setHasError(true);
    }
  };

  return (
    <div
      className={clsx(style.tcard, { [style.error]: hasError }, className)}
      style={{ display: visible ? 'flex' : 'none' }}
    >
      {title && <legend>{title}</legend>}
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

const createLayoutDebugger = (initialLayout, initialData) => {
  return function LayoutDebuggerInstance() {
    const [maxCards] = useFixtureInput('Limit Data Samples', 4);
    const [showLayoutEditor] = useFixtureInput('Show Layout Editor', true);
    const [showDataEditor] = useFixtureInput('Show Data Editor', true);
    const [layoutJson, setLayoutJson] = useJsonState(initialLayout);
    const [dataJson, setDataJson] = useJsonState(initialData);

    const layout = JSON.parse(layoutJson);
    const limitedData = Array.isArray(initialData)
      ? JSON.parse(dataJson).slice(0, maxCards)
      : [JSON.parse(dataJson)];

    const handleAction = (action, payload) => {
      console.info('Action triggered:', action, payload);
      alert(`Action triggered: ${action}\nPayload: ${JSON.stringify(payload)}`);
    };

    const contextValue = useUniLayoutContextValue({
      layout,
      actionHandler: handleAction,
    });

    return (
      <div>
        <UniLayoutContext.Provider value={contextValue}>
          <div className={style.grid}>
            {limitedData.map((item, index) => (
              <div key={index} className={style.card}>
                <UniLayoutRenderer node={layout} data={item} />
              </div>
            ))}
          </div>
        </UniLayoutContext.Provider>
        <hr />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <JsonEditor
            value={layoutJson}
            onChange={setLayoutJson}
            placeholder="Edit Layout JSON"
            title="Layout Editor"
            visible={showLayoutEditor}
          />
          <JsonEditor
            value={dataJson}
            onChange={setDataJson}
            placeholder="Edit Data JSON"
            title="Data Editor"
            visible={showDataEditor}
          />
        </div>
      </div>
    );
  };
};

export default {
  'Event Card': createLayoutDebugger(eventCardLayoutTemplate, eventSampleData),
  'HOT Project Card': createLayoutDebugger(hotProjectLayoutTemplate, hotData),
  'Complex Demo': createLayoutDebugger(complexDataLayout, complexDataSamples),
  'Conditional Demo': createLayoutDebugger(conditionalLayout, conditionalDataSamples),
  'ACAPS Demo': createLayoutDebugger(acapsLayout, acapsSampleData),
};
