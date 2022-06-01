import { Box } from "@mui/material";
import CustomBreadcrumbs from "components/CustomBreadcrumbs";
import FeedItemMed from "components/community/FeedItemMed";

const TEMP_DATA = {
  username: "Waleed Ibrahim",
  title: "الدراسة للعام الجديد 2023 بداية الشهر القادم",
  subtitle:
    "سوف يتم بدء الدراسة للدفعه الجديده 23 بداية الشهر القادم ان شاء الله.",
  content:
    " كلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام ككتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام تكتير كلام كتيركلام كتير كلام كتير كلام كتيركلام كتير كلام ير كلام كتير كلام كتير",
  date: "منذ 10 دقائق",
};

const breadcrumbs = [{name:"Posts",href:"/community/posts"},{name:"Post 1"}]

export default function FullPost({}) {
  const props = TEMP_DATA;
  return (
    <Box marginX={2}>
      <CustomBreadcrumbs list={breadcrumbs}/>
      <FeedItemMed props={props} />
    </Box>
  );
}
