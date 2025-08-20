import { fetchNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreviewClient";


type Props = {
    params:Promise<{id:string}>
}

const NotePreview = async ({ params }: Props) => {
    const { id } = await params;
    const note = await fetchNoteById(id);

    return <NotePreviewClient note={note} />;
}

export default NotePreview