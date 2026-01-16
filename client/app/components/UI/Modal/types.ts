// interfaces
export interface ModalProps {
  onHide?: () => void;
  className?: string;
  children: React.ReactNode;
  show: boolean;
}
export interface OverlayProps {
  onHide?: () => void;
  className: string;
  children: React.ReactNode;
}
