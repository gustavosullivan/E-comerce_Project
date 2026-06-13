import { create } from 'zustand';

export type SnackbarType = 'success' | 'error' | 'info';

export const INSUFFICIENT_BALANCE_MESSAGE =
  'Sem saldo suficiente para realizar compra';

export const PURCHASE_SUCCESS_MESSAGE = 'Compra realizada com sucesso!';

type SnackbarState = {
  visible: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
  show: (message: string, type?: SnackbarType, duration?: number) => void;
  hide: () => void;
};

let hideTimer: ReturnType<typeof setTimeout> | null = null;

export const useSnackbarStore = create<SnackbarState>((set, get) => ({
  visible: false,
  message: '',
  type: 'info',
  duration: 3200,
  show: (message, type = 'info', duration = 3200) => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: true, message, type, duration });
    hideTimer = setTimeout(() => {
      if (get().message === message) {
        set({ visible: false });
      }
    }, duration);
  },
  hide: () => {
    if (hideTimer) clearTimeout(hideTimer);
    set({ visible: false });
  },
}));

export const snackbar = {
  success: (message: string, duration?: number) =>
    useSnackbarStore.getState().show(message, 'success', duration),
  error: (message: string, duration?: number) =>
    useSnackbarStore.getState().show(message, 'error', duration),
  insufficientBalance: (duration = 4000) =>
    useSnackbarStore.getState().show(INSUFFICIENT_BALANCE_MESSAGE, 'error', duration),
  purchaseSuccess: (duration = 4000) =>
    useSnackbarStore.getState().show(PURCHASE_SUCCESS_MESSAGE, 'success', duration),
  info: (message: string, duration?: number) =>
    useSnackbarStore.getState().show(message, 'info', duration),
  hide: () => useSnackbarStore.getState().hide(),
};
