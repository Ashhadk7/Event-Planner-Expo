import type { Speaker } from '../data/speakers'
import { Avatar } from './ui/Avatar'

interface SpeakerCardProps {
  speaker: Speaker
  onOpen: (speaker: Speaker) => void
}

export function SpeakerCard({ speaker, onOpen }: SpeakerCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(speaker)}
      className="group relative flex h-full w-full cursor-pointer flex-col rounded-2xl p-[2px] text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 hover:bg-gradient-to-br hover:from-pink-500 hover:via-purple-500 hover:to-teal-400"
    >
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[14px] bg-white ring-1 ring-line/50 transition-shadow duration-300 group-hover:ring-0 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        
        {/* Photo Section */}
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-ink-50">
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Avatar speaker={speaker} initialsClassName="text-6xl" />
          </div>
        </div>

        {/* Text Details Section */}
        <div className="flex flex-1 flex-col p-4 pb-5">
          <h3 className="font-display text-[15px] font-bold leading-tight tracking-tight text-heading">
            {speaker.firstName} {speaker.lastName}
          </h3>
          <p className="mt-1 text-[13px] text-body">{speaker.title}</p>
          <p className="text-[13px] text-body">{speaker.company}</p>
          {speaker.country && <p className="text-[13px] text-body">{speaker.country}</p>}
        </div>

      </div>
    </button>
  )
}
