import { checkIsUserAdmin } from "@/lib/checkIsUserAdmin";

export default async function Page() {
  const session = await checkIsUserAdmin(); 

  return <div>Admin Panel</div>;
}
