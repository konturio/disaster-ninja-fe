import { createAtom } from '~utils/atoms';

export const cookieSettingsAtom = createAtom({
  applyAll: () => null,
  rejectAll: () => null,
  cookieSettings: cookieSettingsAtom
}, ({ onAction, get, schedule }) => {
  onAction('applyAll', () => {
    schedule((dispatch) => {

    })
  })

  onAction('rejectAll', () => {
    schedule((dispatch) => {

    })
  })

  return get('cookieSettings');
}, 'cookieSettingsAtom');
