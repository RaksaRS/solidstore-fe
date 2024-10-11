import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import FileSearch from "@/components/SearchFile";
import UploadFileButton from "@/components/homepage/UploadFile";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from "@/components/ui/context-menu";
import { PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { MdFolderOpen } from "react-icons/md";

import {
  CancelCreateFolderButton,
  CreateNewFolderPopover,
  PageWithStateAsContext,
  CurrFolderAsHiddenTextInput,
  CreateNewFolderButton,
  CreateFolderForm,
} from "./fileitems/clientcomponents";
import { FolderList, FileList } from "./fileitems/servercomponents";
import { fetchWithAuthFromServer } from "@/helpers/backend-helpers";

async function fetchFiles(dir: string) {
  "use server";
  const userId = (await getSession())?.user.sub.slice(6);
  const response = await fetchWithAuthFromServer(
    `${process.env.BACKEND_PB_DOMAIN_NAME}/folders/content/${encodeURIComponent(userId)}/${encodeURIComponent(dir)}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((res) => JSON.parse(JSON.stringify(res)))
    .catch((reason) => console.log(reason));

  return (response as FilesResponse).files;
}

async function fetchFolderPath(folderId: string) {
  "use server";
  const ownerId = (await getSession())?.user.sub.slice(6);

  if (!folderId) return [];
  const path = await fetchWithAuthFromServer(
    `${process.env.BACKEND_PB_DOMAIN_NAME}/folders/path/${ownerId}/${folderId}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .catch((err) => {
      console.log("Error fetching breadcrumbs");
    });

  return path.path;
}

async function Breadcrumbs({ currDirId }: { currDirId: string }) {
  const path: Array<{ id: string; name: string }> =
    await fetchFolderPath(currDirId);
  path.unshift({ id: "home", name: "Home" });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((f, idx: number) => (
          <>
            {idx !== 0 && <BreadcrumbSeparator key={`breadcrumb-${f.id}`} />}
            <BreadcrumbItem key={`${f.id}`}>
              <BreadcrumbLink asChild>
                <Link href={`/app/${f.id === "home" ? "" : f.id}`}>
                  {f.name}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default async function Page({
  params,
}: {
  params: {
    currentDir: string[];
  };
}) {
  const session = await getSession();
  if (!session) redirect("/api/auth/login");

  let dir = params.currentDir ? params.currentDir[0] : "";
  let files = await fetchFiles(dir);
  let hasFolder = false;
  let hasFiles = false;
  for (let f of files) {
    if (f.isFolder) hasFolder = true;
    else hasFiles = true;
    if (hasFiles && hasFolder) break;
  }

  return (
    <PageWithStateAsContext initFiles={files}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="px-20 md:px-12 sm:px-4 min-h-[90dvh]">
            {/* Bread crumbs */}
            <Suspense>
              <Breadcrumbs currDirId={dir} />
            </Suspense>

            {/* Search bar and upload files button */}
            <div className="grid grid-cols-10 grid-rows-[auto_1fr]">
              <FileSearch formClassNames="col-span-10 md:col-span-8 row-start-2" />
              <UploadFileButton />
            </div>

            {hasFolder && (
              <>
                <p className="text-md mt-5 mb-3">Folders</p>
                <FolderList files={files} />
              </>
            )}

            {hasFiles && (
              <>
                <p className="text-md mt-5 mb-3">Files</p>
                <FileList files={files} />
              </>
            )}
          </div>

          <CreateNewFolderPopover>
            <PopoverTrigger asChild>
              <a className="hidden">a</a>
            </PopoverTrigger>
            <PopoverContent className="top-0 left-0 w-dvw h-dvh transform-none p-0 flex items-center justify-center">
              <div className="top-0 left-0 w-dvw h-dvh bg-black opacity-75 fixed"></div>
              <div className="bg-white relative w-96 h-36 px-8 py-4 box-border rounded-3xl dark:text-gray-100 dark:bg-gray-800">
                <p>Enter folder name</p>
                <CreateFolderForm>
                  <input
                    type="text"
                    placeholder="Folder name..."
                    name="name"
                    className="w-full mt-3"
                  />
                  <CurrFolderAsHiddenTextInput name="parentFolderID" />
                  <div className="flex justify-end mt-2">
                    <CancelCreateFolderButton />
                    <input
                      type="submit"
                      value="Create"
                      className="py-2 px-5 rounded-md bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                    />
                  </div>
                </CreateFolderForm>
              </div>
            </PopoverContent>
          </CreateNewFolderPopover>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-48">
          <CreateNewFolderButton>
            <span>New Folder</span>
            <MdFolderOpen />
          </CreateNewFolderButton>
        </ContextMenuContent>
      </ContextMenu>
    </PageWithStateAsContext>
  );
}

interface FilesResponse {
  files: Array<{
    name: string;
    id: string;
    isFolder: boolean;
  }>;
}
