'use client';

import { useState,  useEffect } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, type FetchNotesResp } from "@/lib/api";
import { useDebounce } from "use-debounce";
import { NoteTag } from "@/types/note";

import css from "./NotesPage.module.css";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";


interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  initialData: FetchNotesResp;
  initialTag?: NoteTag;
}

export default function NotesClient({initialPage,initialSearch,initialData, initialTag}:NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [tag, setTag] = useState<NoteTag | undefined>(initialTag);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTag(initialTag);
    setPage(1);
  }, [initialTag]);

  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();

  const { data } = useQuery<FetchNotesResp>({
    queryKey: ["notes", page, debouncedSearch, tag ?? 'all'],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch, tag }),
    placeholderData: keepPreviousData,
    initialData:page===initialPage && debouncedSearch===initialSearch && tag===initialTag ? initialData : undefined,
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

 const handleNoteCreate = () => {
    setPage(1);
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && (
        <p className={css.noResults}>No matching notes found.</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={handleNoteCreate} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}