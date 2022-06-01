// material
import { Stack, Button } from "@mui/material";

//iconify
import { Icon } from "@iconify/react";

export default function ModifyButton({ selectionModel, onClicked, type }) {
  return selectionModel.length < 1 ? (
    <Button
      variant="contained"
      onClick={() => onClicked("add")}
      startIcon={<Icon icon={"akar-icons:plus"} />}
    >
      New {type}
    </Button>
  ) : (
    <Button
      variant="contained"
      color="error"
      onClick={() => onClicked("delete")}
      startIcon={<Icon icon={"fluent:delete-20-filled"} />}
    >
      Delete {selectionModel.length} {type}s
    </Button>
  );
}
