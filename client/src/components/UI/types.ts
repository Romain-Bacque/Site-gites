// interfaces
export interface ModalProps {
  onHide?: () => void;
  className?: string;
  children: JSX.Element | JSX.Element[];
  show: boolean;
}
export interface OverlayProps {
  onHide?: () => void;
  className: string;
  children: JSX.Element | JSX.Element[];
}
