"use client";

import { ChangeEvent, MouseEvent, useContext, useRef, useState } from "react";
import { uploadFile } from "@/helpers/file-server-actions";
import FilesPreview from "./FilePreview";
import { FilesContext } from "@/app/app/[[...currentDir]]/fileitems/contexts";
import { usePathname } from "next/navigation";
import { useCurrFolderID } from "@/helpers/hooks";

export default function UploadFileButton() {
  // Ref to the <input type="file"> element
  const filesInputElement = useRef<HTMLInputElement>(null);

  // Ref to form submit button
  const submitBtn = useRef<HTMLInputElement>(null);

  // Ref to <form>
  const formElement = useRef<HTMLFormElement>(null);

  const currFolderID = useCurrFolderID();

  const [filesSelected, setFilesSelected] = useState(new Array<File>());

  const { files, setFiles } = useContext(FilesContext) || {
    files: null,
    setFiles: null,
  };

  function handleSelectFiles(event: any): void {
    filesInputElement.current?.click();
  }

  function handleFilesUploaded(event: ChangeEvent<HTMLInputElement>): void {
    setFilesSelected(Array.from(event.target.files ? event.target.files : []));
  }

  function handleCancel() {
    setFilesSelected([]);
  }

  function handleSubmitFiles(evt: MouseEvent<HTMLButtonElement>): void {
    submitBtn.current?.click();
    formElement.current?.reset();
    setFilesSelected([]);
  }

  function handleFilePreviewFileItemDelete(fileIdx: number) {
    setFilesSelected(filesSelected.toSpliced(fileIdx, 1));
  }

  function handleUpload(fd: FormData) {
    fd.append("parentFolderID", currFolderID);
    uploadFile(fd)
      .then((res) => {
        if (res.status >= 400) {
          console.error("An error occured with file uploads");
          return null;
        }

        return res.json();
      })
      .then((res: { files: Array<{ name: string; id: string }> }) => {
        if (!setFiles) return;
        if (!res || !res.files) return;
        setFiles(
          Array.from(files).concat(
            res.files.map((f) => {
              return {
                isFolder: false,
                name: f.name,
                id: f.id,
              };
            })
          )
        );
      })
      .catch((e) => {
        console.error("Error occured with file uploads");
      });
  }

  return (
    <>
      <form ref={formElement} className="hidden" action={handleUpload}>
        <input
          name="files"
          className="hidden"
          type="file"
          multiple
          ref={filesInputElement}
          onChange={handleFilesUploaded}
        />

        <input ref={submitBtn} type="submit" className="hidden" />
      </form>

      <button
        className="hidden  row-start-2 col-start-10  md:inline py-2 px-3 rounded-md bg-green-600 text-white"
        onClick={handleSelectFiles}
      >
        Upload
      </button>
      <FilesPreview
        files={filesSelected}
        isOpen={filesSelected.length !== 0}
        handleCancel={handleCancel}
        handleSubmitFiles={handleSubmitFiles}
        handleFileItemDelete={handleFilePreviewFileItemDelete}
      />
    </>
  );
}
