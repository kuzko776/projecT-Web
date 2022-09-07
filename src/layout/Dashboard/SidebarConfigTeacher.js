import { Icon } from "@iconify/react";
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: "Board Marks",
    path: "/board_marks",
    icon: getIcon("icon-park-outline:degree-hat"),
  },
  {
    title: "Community",
    path: "/community",
    icon: getIcon("fluent:people-community-20-regular"),
    children: [
      {
        title: "Posts",
        path: "/community/posts",
      },
    ],
  },
];

export default sidebarConfig;
