import { Icon } from "@iconify/react";
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: "Control Panel",
    path: "/control_panel",
    icon: getIcon("ls:pc"),
    children: [
      {
        title: "Departments",
        path: "/control_panel/departments",
        icon: getIcon("fluent:building-20-regular"),
      },
      {
        title: "Batchs",
        path: "/control_panel/batchs",
        icon: getIcon("entypo:flow-tree"),
      },
      {
        title: "Students",
        path: "/control_panel/students",
        icon: getIcon("mdi:account-group"),
      },
      {
        title: "Teaching Staff",
        path: "/control_panel/staff",
        icon: getIcon("la:chalkboard-teacher"),
      },
      {
        title: "Subjects",
        path: "/control_panel/subjects",
        icon: getIcon("mdi:timetable"),
      },
      {
        title: "Time Table",
        path: "/control_panel/time_table",
        icon: getIcon("mdi:timetable"),
      },
    ],
  },

  {
    title: "Community",
    path: "/community",
    icon: getIcon("bi:chat-left-text"),
    children: [
      {
        title: "Dashboard",
        path: "/community/dashboard",
      },
      {
        title: "Posts",
        path: "/community/posts",
      },
      {
        title: "Requests",
        path: "/community/requests",
      },
    ],
  },
];

export default sidebarConfig;
