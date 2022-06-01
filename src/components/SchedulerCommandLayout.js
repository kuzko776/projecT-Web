//scheudlar
import {
  AppointmentForm,
} from "@devexpress/dx-react-scheduler-material-ui";

export default function CommandLayout({ disableSaveButton,disableSave, ...restProps }) {

  return (
    <AppointmentForm.CommandLayout
    disableSaveButton ={disableSave}
      {...restProps}
    ></AppointmentForm.CommandLayout>
  );
}
