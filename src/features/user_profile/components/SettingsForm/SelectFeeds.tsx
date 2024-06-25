import { Select } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { eventFeedsAtom } from '~core/shared_state/eventFeeds';
export function SelectFeeds({ value, title, onChange }) {
  const [eventFeeds] = useAtom(eventFeedsAtom);

  const OPTIONS_FEED = eventFeeds.data.map((o) => ({
    title: o.name,
    value: o.feed,
  }));

  return (
    <Select
      alwaysShowPlaceholder
      value={value}
      items={OPTIONS_FEED}
      withResetButton={false}
      onSelect={onChange}
    >
      {title}
    </Select>
  );
}
