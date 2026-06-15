import { useConfirmStore } from '@/src/store/confirmStore';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function confirmAction(options: ConfirmOptions): void {
  useConfirmStore.getState().show({
    ...options,
    destructive: options.destructive ?? options.confirmLabel === 'Excluir',
  });
}
