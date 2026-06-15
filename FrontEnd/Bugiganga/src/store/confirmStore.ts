import { create } from 'zustand';

type ConfirmOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

type ConfirmState = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  onConfirm: (() => void | Promise<void>) | null;
  show: (options: ConfirmOptions) => void;
  hide: () => void;
  confirm: () => Promise<void>;
};

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  visible: false,
  title: '',
  message: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  destructive: false,
  onConfirm: null,
  show: ({
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    destructive = false,
    onConfirm,
  }) => {
    set({
      visible: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      destructive,
      onConfirm,
    });
  },
  hide: () => {
    set({
      visible: false,
      onConfirm: null,
    });
  },
  confirm: async () => {
    const { onConfirm, hide } = get();
    hide();
    if (onConfirm) {
      await onConfirm();
    }
  },
}));
