import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { SITE_NAME } from "@/lib/flags";

export function TopBar({ back, title }: { back?: string; title?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        {back ? (
          <Link href={back} aria-label="뒤로" className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent-tint">
            <ArrowLeft size={22} weight="bold" />
          </Link>
        ) : null}
        <Link href="/" className="font-display text-xl text-accent">
          {SITE_NAME}
        </Link>
        {title ? <span className="ml-auto text-sm text-muted">{title}</span> : null}
      </div>
    </header>
  );
}
