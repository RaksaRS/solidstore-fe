import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import {
  FolderItemButton,
  DeleteFolderContextMenuBtn,
  FolderListWithState,
  FileListWithState,
  FileItemButton,
  FileItemContextMenuBtn,
  DeleteFileContextMenuBtn,
  FileItemToDeleteSpan,
  CancelDeleteFileItemPopoverBtn,
  DeleteFileItemPopoverBtn,
  FileItemDownloadContextMenuBtn,
} from "./clientcomponents";
import {
  MdArrowForward,
  MdAttachFile,
  MdDelete,
  MdDownload,
  MdFolder,
  MdInfo,
} from "react-icons/md";

import { redirect } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

// Individual UIs representing each folder
function FolderItem({
  name,
  id,
  className,
}: {
  name: string;
  id: string;
  className?: string;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn("h-11 block rounded-xl bg-green-300", className)}
      >
        <FolderItemButton id={id}>
          <MdFolder className="text-xl inline mx-4" />
          <span className="text-sm">{name}</span>
        </FolderItemButton>
      </ContextMenuTrigger>
      <ContextMenuContent className="rounded-xl w-48 [&>*]:flex [&>*]:justify-center [&>*]:items-center [&>*]:py-2 [&>*]:px-2 [&>*]:rounded-md [&>*:hover]:bg-gray-200 [&_svg]:text-lg [&>*]:cursor-pointer">
        <FileItemContextMenuBtn>
          <span>Download</span>
          <ContextMenuShortcut>
            <MdDownload />
          </ContextMenuShortcut>
        </FileItemContextMenuBtn>
        <FileItemContextMenuBtn>
          <span>Move</span>
          <ContextMenuShortcut>
            <MdArrowForward />
          </ContextMenuShortcut>
        </FileItemContextMenuBtn>
        <FileItemContextMenuBtn>
          <span>Info</span>
          <ContextMenuShortcut>
            <MdInfo />
          </ContextMenuShortcut>
        </FileItemContextMenuBtn>
        <DeleteFolderContextMenuBtn
          className="text-red-500"
          folderId={id}
          folderName={name}
        >
          <span>Delete</span>
          <ContextMenuShortcut>
            <MdDelete className="text-red-500" />
          </ContextMenuShortcut>
        </DeleteFolderContextMenuBtn>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function FileItem({
  name,
  id,
  className,
}: {
  name: string;
  id: string;
  className?: string;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn("h-9 block rounded-xl bg-gray-200", className)}
      >
        <FileItemButton id={id}>
          <MdAttachFile className="text-xl inline mx-4" />
          <span className="text-sm">{name}</span>
        </FileItemButton>
      </ContextMenuTrigger>
      <ContextMenuContent className="rounded-xl w-48 [&>*]:flex [&>*]:justify-center [&>*]:items-center [&>*]:py-2 [&>*]:px-2 [&>*]:rounded-md [&>*:hover]:bg-gray-200 [&_svg]:text-lg [&>*]:cursor-pointer">
        <FileItemDownloadContextMenuBtn fileId={id}>
          <span>Download</span>
          <ContextMenuShortcut>
            <MdDownload />
          </ContextMenuShortcut>
        </FileItemDownloadContextMenuBtn>
        <FileItemContextMenuBtn>
          <span>Move</span>
          <ContextMenuShortcut>
            <MdArrowForward />
          </ContextMenuShortcut>
        </FileItemContextMenuBtn>
        <FileItemContextMenuBtn>
          <span>Info</span>
          <ContextMenuShortcut>
            <MdInfo />
          </ContextMenuShortcut>
        </FileItemContextMenuBtn>
        <DeleteFileContextMenuBtn
          className="text-red-500"
          folderId={id}
          folderName={name}
        >
          <span>Delete</span>
          <ContextMenuShortcut>
            <MdDelete className="text-red-500" />
          </ContextMenuShortcut>
        </DeleteFileContextMenuBtn>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function DeleteFileItemPopoverContent() {
  return (
    <>
      <div className="top-0 left-0 w-dvw h-dvh bg-black opacity-75 fixed"></div>
      <div className="bg-white relative w-96 h-32 px-8 py-4 box-border rounded-3xl dark:text-gray-100 dark:bg-gray-800">
        <p>
          Are you sure want to delete the file &quot;{<FileItemToDeleteSpan />}
          &quot;
        </p>
        <div className="flex gap-5 items-center justify-end mt-4">
          <CancelDeleteFileItemPopoverBtn />
          <DeleteFileItemPopoverBtn />
        </div>
      </div>
    </>
  );
}

function FolderList({
  files,
}: {
  files: Array<{
    name: string;
    id: string;
    isFolder: boolean;
  }>;
}) {
  return (
    <FolderListWithState
      popoverChildren={
        <>
          <PopoverTrigger asChild>
            <a className="hidden">a</a>
          </PopoverTrigger>
          <PopoverContent className="top-0 left-0 w-dvw h-dvh transform-none p-0 flex items-center justify-center">
            <DeleteFileItemPopoverContent />
          </PopoverContent>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 pb-5">
        {files.map((f) => {
          return (
            f.isFolder && <FolderItem name={f.name} id={f.id} key={f.id} />
          );
        })}
      </div>
    </FolderListWithState>
  );
}

function FileList({
  files,
}: {
  files: Array<{
    name: string;
    id: string;
    isFolder: boolean;
  }>;
}) {
  return (
    <FileListWithState
      popoverChildren={
        <>
          <PopoverTrigger asChild>
            <a className="hidden">a</a>
          </PopoverTrigger>
          <PopoverContent className="top-0 left-0 w-dvw h-dvh transform-none p-0 flex items-center justify-center">
            <DeleteFileItemPopoverContent />
          </PopoverContent>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {files.map((f) => {
          return !f.isFolder && <FileItem name={f.name} id={f.id} key={f.id} />;
        })}
      </div>
    </FileListWithState>
  );
}

export { FolderList, FileList };
