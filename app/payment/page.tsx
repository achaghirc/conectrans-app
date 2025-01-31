import { redirect } from "next/navigation";

async function page() {
  redirect('/auth/login');
}
export default page;