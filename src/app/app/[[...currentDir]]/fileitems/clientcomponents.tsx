"use client";

import { ReactElement, useContext, useRef, useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { ContextMenuItem } from "@radix-ui/react-context-menu";
import { Popover } from "@/components/ui/Popover";
import { useCurrFolderID } from "@/helpers/hooks";

import {
  FileItemListStateContext,
  FilesContext,
  PageStateContext,
} from "./contexts";
import { deleteFileItem, createFolder } from "@/helpers/file-server-actions";
import { useUser } from "@auth0/nextjs-auth0/client";

function FolderItemButton({
  children,
  id,
}: {
  children: ReactElement[] | ReactElement;
  id: string;
}) {
  const redirect = useRouter().push;

  return (
    <button
      className="w-full h-full flex items-center"
      onDoubleClick={(e) => redirect(`/app/${id}`)}
    >
      {children}
    </button>
  );
}

function FileItemButton({
  children,
  id,
}: {
  children: ReactElement[] | ReactElement;
  id: string;
}) {
  return (
    <button className="w-full h-full flex items-center">{children}</button>
  );
}

function DeleteFolderContextMenuBtn({
  children,
  className,
  folderId,
  folderName,
}: {
  children: ReactElement[] | ReactElement;
  className: string;
  folderId: string;
  folderName: string;
}) {
  const { setIsPopoverOpen, setFileItemToDelete: setFolderToDelete } =
    useContext(FileItemListStateContext) || {
      setPopoverOpen: null,
      setFileItemToDelete: null,
    };

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    if (setFolderToDelete) {
      setFolderToDelete({ id: folderId, name: folderName });
    }
    if (setIsPopoverOpen) setIsPopoverOpen(true);
  }

  return (
    <ContextMenuItem onClick={handleClick} className={className}>
      {children}
    </ContextMenuItem>
  );
}

function DeleteFileContextMenuBtn({
  children,
  className,
  folderId,
  folderName,
}: {
  children: ReactElement[] | ReactElement;
  className: string;
  folderId: string;
  folderName: string;
}) {
  const { setIsPopoverOpen, setFileItemToDelete } = useContext(
    FileItemListStateContext
  ) || {
    setPopoverOpen: null,
    setFileItemToDelete: null,
  };

  function handleClick(event: MouseEvent<HTMLDivElement>): void {
    if (setFileItemToDelete) {
      setFileItemToDelete({ id: folderId, name: folderName });
    }
    if (setIsPopoverOpen) setIsPopoverOpen(true);
  }

  return (
    <ContextMenuItem onClick={handleClick} className={className}>
      {children}
    </ContextMenuItem>
  );
}

function FileItemContextMenuBtn({
  children,
  btnFn,
}: {
  children: ReactElement[] | ReactElement;
  btnFn?: number;
}) {
  return <ContextMenuItem onClick={(e) => {}}>{children}</ContextMenuItem>;
}

function FileItemDownloadContextMenuBtn({
  children,
  fileId,
}: {
  children: ReactElement[] | ReactElement;
  fileId: string;
}) {
  const downloadAnchor = useRef<HTMLAnchorElement>(null);
  const ownerId = (useUser().user?.sub || "").slice(6);
  return (
    <>
      <ContextMenuItem onClick={(e) => downloadAnchor.current?.click()}>
        {children}
        <a
          ref={downloadAnchor}
          className="hidden"
          href={`/downloads/${fileId}`}
          download
        />
      </ContextMenuItem>
    </>
  );
}

function DeleteFileItemPopoverBtn() {
  const { files, setFiles } = useContext(FilesContext) || {
    files: null,
    setFiles: null,
  };
  const { setFileItemToDelete, setIsPopoverOpen, fileItemToDelete } =
    useContext(FileItemListStateContext) || {
      setFileItemToDelete: null,
      setIsPopoverOpen: null,
      fileToDelete: null,
    };
  const fileId = fileItemToDelete?.id || "";

  return (
    <button
      className="
                py-2
                px-5
                rounded-md
                hover:bg-red-500
                hover:text-white"
      onClick={async (e) => {
        try {
          await deleteFileItem({ fileId: fileId });
          if (setIsPopoverOpen) setIsPopoverOpen(false);
          if (setFileItemToDelete) setFileItemToDelete({ id: "", name: "" });
          if (setFiles) setFiles(files?.filter((f) => f.id !== fileId) || []);
        } catch (e) {
          console.error(e);
        }
      }}
    >
      Delete
    </button>
  );
}

function CancelDeleteFileItemPopoverBtn() {
  const { setIsPopoverOpen, setFileItemToDelete } = useContext(
    FileItemListStateContext
  ) || { setIsPopoverOpen: undefined, setFileItemToDelete: undefined };
  function handleClick(e: any) {
    if (setFileItemToDelete) setFileItemToDelete({ id: "", name: "" });
    if (setIsPopoverOpen) setIsPopoverOpen(false);
  }

  return (
    <button
      className="
                py-2
                px-5
                rounded-md
                hover:bg-gray-400"
      onClick={handleClick}
    >
      Cancel
    </button>
  );
}

function FolderListWithState({
  children,
  popoverChildren,
}: {
  children: ReactElement | ReactElement[];
  popoverChildren: ReactElement | ReactElement[];
}) {
  const [folderToDelete, setFolderToDelete] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <FileItemListStateContext.Provider
      value={{
        setIsPopoverOpen: setIsPopoverOpen,
        fileItemToDelete: folderToDelete,
        setFileItemToDelete: setFolderToDelete,
      }}
    >
      {children}
      <Popover open={isPopoverOpen}>{popoverChildren}</Popover>
    </FileItemListStateContext.Provider>
  );
}

function FileListWithState({
  children,
  popoverChildren,
}: {
  children: ReactElement | ReactElement[];
  popoverChildren: ReactElement | ReactElement[];
}) {
  const [fileToDelete, setFileToDelete] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <FileItemListStateContext.Provider
      value={{
        setIsPopoverOpen: setIsPopoverOpen,
        fileItemToDelete: fileToDelete,
        setFileItemToDelete: setFileToDelete,
      }}
    >
      {children}
      <Popover open={isPopoverOpen}>{popoverChildren}</Popover>
    </FileItemListStateContext.Provider>
  );
}

function FileItemToDeleteSpan() {
  const fileToDelete = useContext(FileItemListStateContext)?.fileItemToDelete;

  return <span>{fileToDelete?.name}</span>;
}

function PageWithStateAsContext({
  initFiles,
  children,
}: {
  initFiles: Array<{
    name: string;
    id: string;
    isFolder: boolean;
  }>;
  children: ReactElement | ReactElement[];
}) {
  const [files, setFiles] = useState(initFiles);
  const [createFolderPopoverOpen, setCreateFolderPopoverOpen] = useState(false);

  return (
    <FilesContext.Provider
      value={{
        files: files,
        setFiles: setFiles,
      }}
    >
      <PageStateContext.Provider
        value={{
          setIsCreateFolderPopoverOpen: setCreateFolderPopoverOpen,
          isCreateFolderPopoverOpen: createFolderPopoverOpen,
        }}
      >
        {children}
      </PageStateContext.Provider>
    </FilesContext.Provider>
  );
}

function CreateNewFolderPopover({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const isOpen = useContext(PageStateContext)?.isCreateFolderPopoverOpen;
  return <Popover open={isOpen}>{children}</Popover>;
}

function CancelCreateFolderButton() {
  const setIsPopoverOpen =
    useContext(PageStateContext)?.setIsCreateFolderPopoverOpen;

  return (
    <button
      className="
                py-2
                px-5
                rounded-md
                hover:bg-red-500
                hover:text-white"
      onClick={(e) => {
        if (setIsPopoverOpen) setIsPopoverOpen(false);
      }}
    >
      Cancel
    </button>
  );
}

function CreateNewFolderButton({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const setIsPopoverOpen =
    useContext(PageStateContext)?.setIsCreateFolderPopoverOpen;
  return (
    <>
      <ContextMenuItem
        onClick={() => {
          if (setIsPopoverOpen) setIsPopoverOpen(true);
        }}
        className="flex justify-between items-center cursor-pointer px-3 py-2"
      >
        {children}
      </ContextMenuItem>
    </>
  );
}

function CurrFolderAsHiddenTextInput({ name }: { name: string }) {
  const currFolderID = useCurrFolderID();
  return <input name={name} readOnly className="hidden" value={currFolderID} />;
}

function CreateFolderForm({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const setIsPopoverOpen =
    useContext(PageStateContext)?.setIsCreateFolderPopoverOpen;
  return (
    <form
      action={async (d) => {
        if (setIsPopoverOpen) setIsPopoverOpen(false);
        await createFolder(d);
      }}
    >
      {children}
    </form>
  );
}

export {
  FolderItemButton,
  FileItemButton,
  FolderListWithState,
  FileListWithState,
  PageWithStateAsContext,
  DeleteFileContextMenuBtn,
  DeleteFolderContextMenuBtn,
  DeleteFileItemPopoverBtn,
  CancelDeleteFileItemPopoverBtn,
  FileItemToDeleteSpan,
  FileItemContextMenuBtn,
  FileItemDownloadContextMenuBtn,
  // Components related to create new folder popover
  CreateNewFolderPopover,
  CancelCreateFolderButton,
  CurrFolderAsHiddenTextInput,
  CreateNewFolderButton,
  CreateFolderForm,
};
