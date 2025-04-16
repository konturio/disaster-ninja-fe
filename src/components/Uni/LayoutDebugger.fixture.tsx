import { useFixtureInput } from 'react-cosmos/client';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { eventCardLayoutTemplate } from '~features/events_list/components/EventsPanel/eventLayouts';
import { LayoutProvider } from './Layout/LayoutProvider';
import { eventSampleData } from '../../core/api/__mocks__/_eventsSampleData';
import { hotData } from '../../core/api/__mocks__/_hotSampleData';
import { hotProjectLayoutTemplate } from './__mocks__/_hotLayout.js';
import { complexDataLayout, complexDataSamples } from './__mocks__/_complexLayout';
import style from './__mocks__/fixture.module.css';

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

    return (
      <div>
        <div className={style.grid}>
          {limitedData.map((item, index) => (
            <div key={index} className={style.card}>
              <LayoutProvider layout={layout} data={item} actionHandler={handleAction} />
            </div>
          ))}
        </div>
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
};
