import { useCallback } from 'react';
import { Modal } from '@konturio/ui-kit';
import { action, atom } from '@reatom/framework';
import { useAction, useAtom } from '@reatom/npm-react';
import { store } from '~core/store/store';

interface RequiredModalBodyProps<V> {
  onConfirm: (value: V | null) => void;
}

interface ModalState<Value = any> {
  component: React.FunctionComponent<any>;
  onConfirm: (value: Value) => void;
  extraProps?: Record<string, unknown>;
}

const modalAtom = atom<ModalState | null>(null, 'modalAtom');
const closeModalAction = action((ctx) => modalAtom(ctx, null), 'closeModalAction');

export type ModalResultType<Component> = Parameters<
  // @ts-expect-error - idk how to type it
  React.ComponentProps<Component>['onConfirm']
>[0];

export function showModal<
  Value,
  Component extends React.FunctionComponent<Props & Extra>,
  Extra extends Record<string, unknown>,
  Props extends RequiredModalBodyProps<Value>,
>(component: Component, extraProps?: Extra): Promise<ModalResultType<Component>> {
  return new Promise((res, rej) => {
    try {
      modalAtom(store.v3ctx, {
        component,
        onConfirm: res,
        extraProps,
      });
    } catch (e) {
      rej(e);
    }
  });
}

export function GlobalModal() {
  const [state] = useAtom(modalAtom);
  const closeModal = useAction(closeModalAction);

  const onCancel = useCallback(() => {
    state?.onConfirm(null);
    closeModal();
  }, [closeModal, state]);

  const onConfirm = useCallback(
    (result) => {
      state?.onConfirm(result);
      closeModal();
    },
    [closeModal, state],
  );

  return state ? (
    <Modal onCancel={onCancel}>
      <state.component onConfirm={onConfirm} {...state.extraProps} />
    </Modal>
  ) : null;
}
