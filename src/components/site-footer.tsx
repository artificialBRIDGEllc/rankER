import { Link } from "@tanstack/react-router";
import { LogoMark } from "./logo-mark";
import { Wordmark } from "./wordmark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 font-medium text-fg">
          <LogoMark className="size-6" />
          <Wordmark />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/build" className="hover:text-fg">
            Build from scratch
          </Link>
          <Link to="/domains" className="hover:text-fg">
            Domains
          </Link>
          <Link to="/nonprofit" className="hover:text-fg">
            Nonprofit rates
          </Link>
          <Link to="/pricing" className="hover:text-fg">
            Pricing
          </Link>
          <Link to="/compliance/hipaa" className="hover:text-fg">
            HIPAA pack
          </Link>
          <Link to="/counsel" className="hover:text-fg">
            Counsel Desk
          </Link>
          <Link to="/insights" className="hover:text-fg">
            Insights
          </Link>
          <Link to="/roadmap" className="hover:text-fg">
            Roadmap
          </Link>
          <Link to="/audit" className="hover:text-fg">
            Free analysis
          </Link>
        </div>
        <p>
          <a className="hover:text-fg" href="https://ranker.theartificialbridge.com">
            ranker.theartificialbridge.com
          </a>
          <span className="mx-2">·</span>
          Templates. Not a signed letter.
        </p>
      </div>
    </footer>
  );
}
