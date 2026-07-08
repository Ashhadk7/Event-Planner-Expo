import { useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'
import type { Speaker } from '../../data/speakers'
import { SPEAKER_TYPES } from '../../data/speakerTypes'
import { FieldRow, TextInput, TextArea, SelectInput } from '../ui/Field'

interface EditSpeakerModalProps {
  speaker: Speaker
  onClose: () => void
  onDelete?: () => void
}

export function EditSpeakerModal({ speaker, onClose, onDelete }: EditSpeakerModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${speaker.firstName} ${speaker.lastName}`}
    >
      <div
        className="animate-fade-up relative w-full max-w-2xl overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-red-500" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5 sm:px-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Edit speaker</p>
            <h2 className="mt-1 font-display text-xl font-bold tracking-tight text-heading">
              {speaker.firstName} {speaker.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-line text-muted transition-colors hover:bg-paper-2 hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[64vh] overflow-y-auto px-6 py-6 sm:px-8">
          <form className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
            <FieldRow label="First name" htmlFor="ef">
              <TextInput id="ef" defaultValue={speaker.firstName} />
            </FieldRow>
            <FieldRow label="Last name" htmlFor="el">
              <TextInput id="el" defaultValue={speaker.lastName} />
            </FieldRow>

            <FieldRow label="Title" htmlFor="et">
              <TextInput id="et" defaultValue={speaker.title} />
            </FieldRow>
            <FieldRow label="Company" htmlFor="ec">
              <TextInput id="ec" defaultValue={speaker.company} />
            </FieldRow>

            <FieldRow label="Speaker type" htmlFor="ety">
              <SelectInput id="ety" defaultValue={speaker.type}>
                {SPEAKER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </SelectInput>
            </FieldRow>
            <FieldRow label="Status" htmlFor="es">
              <SelectInput id="es" defaultValue="Live">
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
                <option value="Hidden">Hidden</option>
              </SelectInput>
            </FieldRow>

            <FieldRow label="LinkedIn URL" htmlFor="eli" className="sm:col-span-2">
              <TextInput id="eli" type="url" defaultValue={speaker.linkedin} />
            </FieldRow>

            <FieldRow label="Bio" htmlFor="eb" className="sm:col-span-2">
              <TextArea id="eb" defaultValue={speaker.bio} />
            </FieldRow>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line bg-paper-2 px-6 py-4 sm:px-8">
          {onDelete ? (
            <button
              onClick={onDelete}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove speaker
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-heading transition-colors hover:bg-paper-2"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="inline-flex cursor-pointer items-center rounded-full bg-ink-700 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_-14px_rgba(0,4,72,0.7)] transition-colors hover:bg-ink-800"
          >
            Save Changes
          </button>
          </div>
        </div>
      </div>
    </div>
  )
}
