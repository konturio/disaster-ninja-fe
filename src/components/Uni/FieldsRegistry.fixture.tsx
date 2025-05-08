import { useFixtureInput } from 'react-cosmos/client';
import { Icon } from '~components/Icon';
import { fieldsRegistry } from './fieldsRegistry';
import { Field } from './Components/Field';
import { UniLayout } from './Layout/UniLayout';
import styles from './__mocks__/fixture.module.css';

// Helper context component to allow FieldText to work outside full layout
function FieldWrapper({ children }) {
  return (
    <UniLayout layout={{ type: 'Row' }} data={{}}>
      {children}
    </UniLayout>
  );
}

export default function FieldsRegistry() {
  const [sampleText] = useFixtureInput('Sample Text', 'Foo Bar ...');
  const [sampleNumber] = useFixtureInput('Sample Number', -32465.27542);
  const [sampleDate] = useFixtureInput('Sample Date', '2023-05-28T14:30:00Z');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      {Object.entries(fieldsRegistry).map(([fieldName, fieldMeta]) => {
        // Choose appropriate sample value based on field type
        let sampleValue: string | number = sampleText;
        if (fieldMeta.type === 'number') {
          sampleValue = sampleNumber;
        } else if (fieldMeta.type === 'date') {
          sampleValue = sampleDate;
        }

        return (
          <div key={fieldName} className={styles.card}>
            <label>{fieldName}</label>
            <dl key={`${fieldName}-meta`}>
              <dt>Type</dt>
              <dd>{fieldMeta.type}</dd>

              {fieldMeta.format && (
                <>
                  <dt>Format</dt>
                  <dd>{fieldMeta.format}</dd>
                </>
              )}

              {fieldMeta.label && (
                <>
                  <dt>Label</dt>
                  <dd>{fieldMeta.label}</dd>
                </>
              )}

              {fieldMeta.tooltip && (
                <>
                  <dt>Tooltip</dt>
                  <dd>{fieldMeta.tooltip}</dd>
                </>
              )}

              {fieldMeta.icon && (
                <>
                  <dt>Icon</dt>
                  <dd>
                    <Icon icon={fieldMeta.icon as any} /> ( {fieldMeta.icon} )
                  </dd>
                </>
              )}

              <dt>Display</dt>
              <dd>
                <FieldWrapper>
                  <Field
                    value={sampleValue}
                    $meta={{ value: fieldMeta }}
                    showLabel={true}
                  />
                </FieldWrapper>
              </dd>
            </dl>
          </div>
        );
      })}
    </div>
  );
}
