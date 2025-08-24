import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Dialog } from "@radix-ui/react-dialog";
import { updateTable } from "../action";
import { Menu, MenuForm, menuFormSchema } from "@/validations/menu-validation";
import { INITIAL_STATE_MENU } from "@/constans/menu-constan";
import {
  Table,
  TableForm,
  tableFormSchema,
} from "@/validations/table-validation";
import { INITIAL_STATE_TABLE } from "@/constans/table-constan";
import FormTable from "./form-table";

export default function DialogUpdateTable({
  refetch,
  currentData,
  open,
  heandleChangeAction,
}: {
  refetch: () => void;
  currentData?: Table;
  open?: boolean;
  heandleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<TableForm>({
    resolver: zodResolver(tableFormSchema),
  });

  const [updateTableState, updateTableAction, isPendingUpdateTable] =
    useActionState(updateTable, INITIAL_STATE_TABLE);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      Object.entries(data).forEach(([Key, value]) => {
        formData.append(Key, value);
      });
    });
    formData.append("id", currentData?.id ?? "");

    startTransition(() => {
      updateTableAction(formData);
    });
  });

  useEffect(() => {
    if (updateTableState?.status === "error") {
      toast.error("Update Table Failed", {
        description: updateTableState.errors?._form?.[0],
      });
    }

    if (updateTableState?.status === "success") {
      toast.success("Update Table Success");
      form.reset();
      heandleChangeAction?.(false);
      refetch();
    }
  }, [updateTableState]);

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name as string);
      form.setValue("description", currentData.description as string);
      form.setValue("status", currentData.status as string);
      form.setValue("capacity", currentData.capacity.toString());
    }
  }, [currentData]);

  return (
    <Dialog open={open} onOpenChange={heandleChangeAction}>
      <FormTable
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateTable}
        type="Update"
      />
    </Dialog>
  );
}
