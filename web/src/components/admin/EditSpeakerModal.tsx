import { X } from 'lucide-react'
import type { Speaker } from '../../data/speakers'

interface EditSpeakerModalProps {
  speaker: Speaker
  onClose: () => void
}

export function EditSpeakerModal({ speaker, onClose }: EditSpeakerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm">
      <div className="animate-fade-up w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-bold text-heading">
            Edit Speaker: {speaker.firstName} {speaker.lastName}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-paper-2 hover:text-heading"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          <form className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">First Name</label>
                <input
                  type="text"
                  defaultValue={speaker.firstName}
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">Last Name</label>
                <input
                  type="text"
                  defaultValue={speaker.lastName}
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">Title</label>
                <input
                  type="text"
                  defaultValue={speaker.title}
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">Company</label>
                <input
                  type="text"
                  defaultValue={speaker.company}
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-heading">LinkedIn URL</label>
              <input
                type="url"
                defaultValue={speaker.linkedin}
                className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-heading">Bio</label>
              <textarea
                rows={4}
                defaultValue={speaker.bio}
                className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">Speaker Type</label>
                <select
                  defaultValue={speaker.type}
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="Main Day">Main Day</option>
                  <option value="Fireside Chat">Fireside Chat</option>
                  <option value="Founder">Founder</option>
                  <option value="Influencer">Influencer</option>
                  <option value="Ambassador">Ambassador</option>
                  <option value="Sponsor">Sponsor</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-heading">Status</label>
                <select
                  defaultValue="Live"
                  className="w-full rounded-lg border border-line bg-paper-1 px-4 py-2.5 text-sm text-heading outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="Live">Live</option>
                  <option value="Draft">Draft</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-line bg-paper-1 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-bold text-heading shadow-sm hover:bg-paper-2"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-ink-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-ink-800"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
