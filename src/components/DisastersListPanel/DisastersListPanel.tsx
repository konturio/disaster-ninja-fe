import { connect, ConnectedProps } from 'react-redux';
import i18n from 'i18next';
import { Panel, Text } from '@k2-packages/ui-kit';
import { StateWithAppModule } from '~appModule/types';
import { createStagesForAtom } from '~utils/atoms/createStagesForAtom';
import * as selectors from '~appModule/selectors';
import { DisasterCard } from './DisasterCard/DisasterCard';
import { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from './ErrorMessage/ErrorMessage';
import s from './DisastersListPanel.module.css';

const mapStateToProps = (state: StateWithAppModule) => ({
  disastersListAtom: {
    loading: selectors.disastersList(state).length === 0,
    error: null,
    data: selectors.disastersList(state),
  },
});

const connector = connect(mapStateToProps);

function DisastersListPanelLayout({
  disastersListAtom,
}: ConnectedProps<typeof connector>) {
  const disastersListStages = createStagesForAtom(disastersListAtom);
  return (
    <Panel header={<Text type="heading-l">{i18n.t('Ongoing disasters')}</Text>}>
      <div className={s.scrollable}>
        {disastersListStages({
          loading: <LoadingSpinner />,
          error: <ErrorMessage />,
          ready: (disastersList) =>
            disastersList.map((disaster) => (
              <DisasterCard
                key={disaster.eventName}
                disaster={disaster}
                isActive={false}
              />
            )),
        })}
      </div>
    </Panel>
  );
}

export const DisastersListPanel = connector(DisastersListPanelLayout);
