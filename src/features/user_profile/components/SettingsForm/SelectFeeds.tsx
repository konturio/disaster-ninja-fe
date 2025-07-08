import { Select } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { eventFeedsAtom } from '~core/shared_state/eventFeeds';
export function SelectFeeds({ value, title, onChange }) {
  const [eventFeeds] = useAtom(eventFeedsAtom);

  const optionsFeed = eventFeeds.data.map((o) => ({
    title: o.name,
    value: o.feed,
  }));

  return (
    <Select
      alwaysShowPlaceholder
      value={value}
      items={optionsFeed}
      withResetButton={false}
      onSelect={onChange}
      disabled={optionsFeed.length <= 1}
    >
      {title}
    </Select>
  );
}
