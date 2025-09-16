import { Dialog, Slide, SxProps } from "@mui/material";
import { forwardRef, ReactElement, Ref } from "react";
import { TransitionProps } from "@mui/material/transitions";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>,
) {
  return (
    <Slide direction="up" ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

export interface AppModalProps {
  open: boolean;
  handleClose: () => void;
  children: ReactElement;
  label: string;
  sx?: SxProps;
  minHeight?: string;
}

export const AppModal = ({
  open,
  handleClose,
  label,
  children,
  sx,
  minHeight = "auto",
}: AppModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby={label}
      // TransitionComponent={Transition}
      slots={{
        transition: Transition,
      }}
      maxWidth={false}
      slotProps={{
        paper: {
          style: {
            borderRadius: "20px",
            margin: "20px",
            overflowX: "hidden",
            overflowY: "hidden",
            maxWidth: "calc(100vw - 40px)",
            minHeight,
          },
        },
      }}
      sx={{
        "& .MuiDialog-paper": {
          width: "auto",
          minWidth: "fit-content",
        },
        ...sx,
      }}
      scroll={"body"}
    >
      {children}
    </Dialog>
  );
};
