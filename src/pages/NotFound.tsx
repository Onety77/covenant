import { Button } from '@/components/ui/Button'

/** A broken link, drawn as a broken term: the roadmap stops short of its gate. */
export function NotFound() {
  return (
    <div className="wrap flex flex-col items-start pt-16 pb-28 lg:pt-24">
      <div aria-hidden className="flex w-full max-w-sm items-center gap-1">
        <div className="h-1.5 flex-[3] rounded-l-full bg-accent" />
        <div className="h-1.5 flex-[2] bg-line-2" />
        <div className="held h-6 flex-[2] rounded-[4px] bg-raised" />
        <span className="grid size-5 place-items-center rounded-[5px] bg-default font-mono text-[11px] font-bold text-on-default">?</span>
      </div>
      <p className="mt-10 font-mono text-[12px] text-ink-3">404</p>
      <h1 className="mt-2 text-h1">This page never shipped.</h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">The link is wrong, or what it pointed to is gone. Nothing was held against it.</p>
      <div className="mt-8 flex gap-2">
        <Button variant="primary" to="/" arrow>
          The board
        </Button>
        <Button to="/launch">Launch a token</Button>
      </div>
    </div>
  )
}
