import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";
import { getHealth } from "@/lib/admin/health";
import { GrowthLeverage } from "../GrowthLeverage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AlavancagemPage() {
  const user = await getAdminUser();
  if (!user) redirect("/adminlkgat");

  const health = await getHealth();
  return <GrowthLeverage visits7d={health.stats.visits7d} sales7d={health.stats.sales7d} />;
}
