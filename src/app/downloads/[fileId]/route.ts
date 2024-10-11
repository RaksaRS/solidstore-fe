import { fetchWithAuthFromServer } from "@/helpers/backend-helpers";
import { getSession } from "@auth0/nextjs-auth0";

export async function GET(
  req: Request,
  { params }: { params: { fileId: string } }
) {
  const { fileId } = params;

  const ownerId = (await getSession())?.user.sub.slice(6);
  const res = await fetchWithAuthFromServer(
    `${process.env.BACKEND_PB_DOMAIN_NAME}/files/${ownerId}/${fileId}`,
    {
      method: "GET",
    }
  );

  const heads = new Headers(res.headers);

  return new Response(await res.blob(), {
    headers: heads,
  });
}
