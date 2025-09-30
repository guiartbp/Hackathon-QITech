import { ChartPie } from "lucide-react";
import AdminHeader from "../components/header/AdminHeader";

function DashboardPage() {
  return ( 
    <>
      <AdminHeader
        Icon={ChartPie}
        title="Visão Geral"
      />
    </>
   );
}

export default DashboardPage;