import { redirect } from "next/navigation";

export default async function Page() {
  redirect(`${process.env.PB_DOMAIN_NAME}/app`);
}
