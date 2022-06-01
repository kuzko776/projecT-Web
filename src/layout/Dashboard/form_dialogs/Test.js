//scheudlar
import {
  Scheduler,
  WeekView,
  Appointments,
  DragDropProvider,
  AppointmentForm,
  AppointmentTooltip,
  EditRecurrenceMenu,
} from "@devexpress/dx-react-scheduler-material-ui";

export default function Testt({ isRecurrence, ...restProps }) {
  isRecurrence = false;
  return (
    <AppointmentForm.Layout
      isRecurrence={false}
      {...restProps}
    ></AppointmentForm.Layout>
  );
}
