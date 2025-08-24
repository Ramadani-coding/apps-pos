import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useActionState, useEffect } from "react";
import { deleteMenu } from "../action";
import { INITIAL_STATE_ACTION } from "@/constans/general-constan";
import { toast } from "sonner";
import { Menu } from "@/validations/menu-validation";

export default function DialogDeleteMenu({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Menu;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteMenuState, deleteMenuAction, isLoadingDeleteMenu] =
    useActionState(deleteMenu, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id as string);
    formData.append("image_url", currentData?.image_url as string);
    startTransition(() => {
      deleteMenuAction(formData);
    });
  };

  useEffect(() => {
    if (deleteMenuState?.status === "error") {
      toast.error("Update Menu Failed", {
        description: deleteMenuState.errors?._form?.[0],
      });
    }

    if (deleteMenuState?.status === "success") {
      toast.success("Delete Menu Success");
      handleChangeAction?.(false);
      refetch();
    }
  }, [deleteMenuState]);

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isLoadingDeleteMenu}
      onSubmit={onSubmit}
      title="Menu"
    />
  );
}
