"use client";
import { DragEvent, ReactElement, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import FilesPreview from "./FilePreview";
import { uploadFile } from "@/helpers/file-server-actions";
import { useCurrFolderID } from "@/helpers/hooks";

export default function FileDropZone({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const popoverTrigger = useRef<HTMLButtonElement>(null);
  const currFolderID = useCurrFolderID();
  const [files, setFiles] = useState<Array<File>>([]);

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.stopPropagation();
    event.preventDefault();
    const uploadedFiles: Array<File> = [];
    for (let i = 0; i < event.dataTransfer.files.length; i++) {
      const f = event.dataTransfer.files.item(i);
      if (f !== null) uploadedFiles.push(f);
    }
    setFiles(uploadedFiles);
    popoverTrigger.current?.click();
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>): void {
    event.stopPropagation();
    event.preventDefault();
    popoverTrigger.current?.click();
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>): void {
    event.stopPropagation();
    event.preventDefault();
    popoverTrigger.current?.click();
  }

  function handleDragover(event: DragEvent<HTMLDivElement>): void {
    event.stopPropagation();
    event.preventDefault();
  }

  function handleSubmitFiles() {
    const formData = new FormData();
    for (let f of files) formData.append("files", f, f.name);
    formData.set("parentFolderID", currFolderID);
    uploadFile(formData);
    setFiles([]);
  }

  function handleFileItemDelete(idx: number) {
    setFiles(files.toSpliced(idx, 1));
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragover}
      className="h-svh"
    >
      {children}
      <Popover>
        <PopoverTrigger asChild>
          <button className="hidden" ref={popoverTrigger}>
            a
          </button>
        </PopoverTrigger>
        <PopoverContent className="top-0 left-0 w-dvw h-dvh transform-none​ p-0">
          <div className="bg-black opacity-75 w-full h-full fixed"></div>
          <div className="absolute top-[20vh] h-[60vh] left-[20vw] w-[60vw] bg-white  rounded-3xl">
            <div className="w-full h-full flex justify-center items-center">
              <span className="text-xl">Drop your files</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <FilesPreview
        isOpen={files.length !== 0}
        files={files}
        handleCancel={() => setFiles([])}
        handleSubmitFiles={handleSubmitFiles}
        handleFileItemDelete={handleFileItemDelete}
      />
    </div>
  );
}
