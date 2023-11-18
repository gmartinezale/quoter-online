import { ReactNode } from "react";
import { ModalSizes } from "flowbite-react";

export type ModalData = {
  size?: keyof ModalSizes;
  title?: string;
  link?: string;
  content?: ReactNode | string;
};
