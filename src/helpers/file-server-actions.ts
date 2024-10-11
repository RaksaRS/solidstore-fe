"use server";
import { fetchWithAuthFromServer } from "@/helpers/backend-helpers";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";

async function createFolder(data: FormData) {
  const userId = await getUserId();

  const name = data.get("name");
  const parentFolderID = data.get("parentFolderID");

  const res = JSON.parse(
    JSON.stringify({
      res: await fetchWithAuthFromServer(
        `${process.env.BACKEND_PB_DOMAIN_NAME}/folders/${userId}${parentFolderID ? `/${parentFolderID}` : ""}/${name}`,
        {
          method: "POST",
        }
      ),
    })
  );

  revalidatePath(`/app/${parentFolderID}`, "page");
  return res;
}

async function deleteFileItem({ fileId }: { fileId: string }) {
  const userId = await getUserId();

  const parentFolderID = await fetchWithAuthFromServer(
    `${process.env.BACKEND_PB_DOMAIN_NAME}/fileitems/path/${userId}/${fileId}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => (res.path.length > 0 ? res.path[res.path.legth - 1] : ""));

  const res = await fetchWithAuthFromServer(
    `${process.env.BACKEND_PB_DOMAIN_NAME}/fileitems/${userId}/${fileId}`,
    {
      method: "DELETE",
    }
  )
    .then((res) => res.text())
    .catch((e) => console.log(e));

  revalidatePath(`/app/${parentFolderID}`, "page");

  return res;
}

async function getUserId() {
  return (await getSession())?.user.sub.slice(6);
}

async function uploadFile(data: FormData) {
  let parentFolderID = "";
  if (data.get("parentFolderID")) {
    parentFolderID = data.get("parentFolderID")?.toString() || "";
    data.delete("parentFolderID");
  }
  const userId = await getUserId();

  const res = JSON.parse(
    JSON.stringify({
      res: await fetchWithAuthFromServer(
        `${process.env.BACKEND_PB_DOMAIN_NAME}/files/${encodeURI(userId)}/${parentFolderID}`,
        {
          method: "POST",
          body: data,
        }
      ),
    })
  );

  revalidatePath(`/app/${parentFolderID}`, "page");

  return res;
}

export { createFolder, deleteFileItem, uploadFile };
