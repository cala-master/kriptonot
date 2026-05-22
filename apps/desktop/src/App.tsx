import { useEffect, useState } from "react";
import type { BootstrapStatus } from "./bootstrap";
import { createNoteEditorModel } from "./note-editor-model";
import { createSampleNoteWorkflow } from "./sample-note-workflow";

interface AppProps {
  status?: BootstrapStatus;
}

const workflow = createSampleNoteWorkflow();

export function App(_props: AppProps) {
  const [body, setBody] = useState("");
  const [noteState, setNoteState] = useState<Awaited<ReturnType<typeof workflow.createNote>> | null>(null);

  useEffect(() => {
    let isMounted = true;

    void workflow.createNote().then((created) => {
      if (!isMounted) {
        return;
      }

      const model = createNoteEditorModel(workflow, created);
      const seededState = model.updateBody("Keep my pin safe");

      setNoteState(seededState);
      setBody(seededState.note.body);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleBodyChange(nextBody: string): void {
    if (!noteState) {
      setBody(nextBody);
      return;
    }

    const model = createNoteEditorModel(workflow, noteState);
    const updatedState = model.updateBody(nextBody);

    setNoteState(updatedState);
    setBody(updatedState.note.body);
  }

  function handleMaskSelection(): void {
    if (!noteState) {
      return;
    }

    const pinStart = noteState.note.body.indexOf("pin");

    if (pinStart < 0) {
      return;
    }

    const model = createNoteEditorModel(workflow, noteState);
    const maskedState = model.applyMaskToSelection({
      selectionStart: pinStart,
      selectionEnd: pinStart + "pin".length
    });

    setNoteState(maskedState);
    setBody(maskedState.note.body);
  }

  return (
    <main className="app-shell">
      <h1>kriptonot</h1>
      <textarea
        aria-label="Plain-text note body"
        value={body}
        onChange={(event) => handleBodyChange(event.target.value)}
      />
      <button type="button" onClick={handleMaskSelection}>
        Mask selection
      </button>
      <p>Hidden masked fragments remain locked in this slice.</p>
      {noteState && noteState.fragments.length > 0 ? (
        <ul aria-label="Hidden masked fragments">
          {noteState.fragments.map((fragment) => (
            <li key={fragment.id}>{fragment.maskedValue}</li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
