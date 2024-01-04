import { useAtom } from '@reatom/react-v2';
import { userStateAtom } from '../../atoms/userState';
import type { UserStateType } from '~core/auth/types';

export function UserStateToComponents(
  props: Partial<Record<UserStateType | 'other', string | JSX.Element>>,
) {
  const [userState] = useAtom(userStateAtom);
  const fallback = props.other ?? null;
  const selection = props[userState];
  const component = selection === undefined ? fallback : selection;
  return typeof component === 'string' ? <>{component}</> : component;
}
