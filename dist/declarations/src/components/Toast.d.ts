import { State } from "../enums/State";
interface ToastProps {
    state: State;
    message: string;
    onDismiss: () => any;
}
export declare const Toast: (props: ToastProps) => any;
export {};
