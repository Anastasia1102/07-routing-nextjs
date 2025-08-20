import NotesClient from "./Notes.client";
import type { Metadata } from "next";
import { fetchNotes,type FetchNotesResp } from "@/lib/api";
import { NoteTag } from "@/types/note";

export const metadata: Metadata = {
  title: "Notes Page",
};

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

const allowedTags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
type AllowedTag = (typeof allowedTags)[number];

export default async function NotesPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPage = 1;
  const initialSearch = "";

  const raw = slug?.[0];
  let selectedTag: NoteTag | undefined = undefined;

  if (raw && raw !== "all" && (allowedTags as readonly string[]).includes(raw)) {
    selectedTag = raw as AllowedTag;
  }

  const initialData: FetchNotesResp = await fetchNotes({
    page: initialPage,
    perPage: 12,
    search: initialSearch,
    tag: selectedTag,
  });


  return (
     <NotesClient
       initialPage={initialPage}
       initialSearch={initialSearch}
       initialData={initialData}
       initialTag={selectedTag}
    />
  );
}
