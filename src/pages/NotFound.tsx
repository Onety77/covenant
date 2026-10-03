import { Button } from '@/components/ui/Button'

/** A broken link, drawn as a broken term: the rail stops short of its gate. */
export function NotFound() {
  return (
    <div className="wrap flex flex-col items-start py-20 lg:py-28">
      <div aria-hidden className="flex w-full max-w-md items-center gap-1">
        <div className="h-2.5 flex-[3] rounded-l-full bg-ink" />
        <div className="h-2.5 flex-[2] rounded-[2px] bg-line-2" />
        <div className="hatch h-6 flex-[2] rounded-[5px] border border-dashed border-line-2" />
        <span className="grid size-[22px] place-items-center rounded-[6px] border-2 border-default text-[11px] font-bold text-default">?</span>
      </div>
      <p className="mt-10 label">404</p>
      <h1 className="mt-3 text-h1">
        This page <em className="italic">never shipped.</em>
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-2">The link is wrong, or what it pointed to doesn’t exist any more. Nothing is held against it.</p>
      <div className="mt-8 flex gap-3">
        <Button variant="primary" to="/" arrow>
          Home
        </Button>
        <Button to="/launches">Launches</Button>
      </div>
    </div>
  )
}
