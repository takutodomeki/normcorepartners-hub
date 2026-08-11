import type { Metadata } from "next";
import Link from "next/link";

import {
  AUDIT_THRESHOLD_DAYS,
  daysSince,
  formatDate,
  getTools,
  groupByStatus,
  isPastRetireBy,
  STATUS_HEADINGS,
  type Tool,
  type ToolStatus,
} from "@/lib/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Civic tools published by Normcore Partners.",
};

const SUBORDINATE: ToolStatus[] = ["archived", "broken"];

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const audit = params.audit !== undefined;

  const tools = getTools();
  const groups = groupByStatus(tools);

  return (
    <main>
      <header className="masthead">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="masthead__mark" src="/mark.svg" alt="" width={22} height={22} />
        <h1>Tools</h1>
      </header>

      <p className="lede">
        Tools that make American politics legible, published by{" "}
        <Link href="/">Normcore Partners</Link>. Each one opens in its own place. Anything
        retired or broken stays listed here and says so.
      </p>

      {audit ? (
        <p className="audit-banner">
          Maintenance view. Flagging anything unchecked for more than{" "}
          {AUDIT_THRESHOLD_DAYS} days.
        </p>
      ) : null}

      {groups.length === 0 ? (
        <p className="empty">No tools published yet.</p>
      ) : (
        groups.map(([status, group]) => (
          <section
            key={status}
            className={
              SUBORDINATE.includes(status) ? "group group--subordinate" : "group"
            }
          >
            <h2 className="group__heading">{STATUS_HEADINGS[status]}</h2>
            <ul className="tools">
              {group.map((tool) => (
                <ToolEntry key={tool.id} tool={tool} audit={audit} />
              ))}
            </ul>
          </section>
        ))
      )}

      <footer className="colophon">
        <p>
          Published by <Link href="/">Normcore Partners</Link>.
        </p>
      </footer>
    </main>
  );
}

function ToolEntry({ tool, audit }: { tool: Tool; audit: boolean }) {
  const stale = isPastRetireBy(tool);

  return (
    <li className="tool" id={tool.id}>
      <h3 className="tool__name">
        <a href={tool.url}>{tool.name}</a>
      </h3>

      <p className="tool__sentence">{tool.sentence}</p>

      <p className="tool__meta">
        <span>{STATUS_HEADINGS[tool.status]}</span>
        {tool.notes ? (
          <span>
            <a href={tool.notes}>Notes</a>
          </span>
        ) : null}
      </p>

      {stale ? (
        <p className="tool__flag">
          Expected to stop being accurate after {formatDate(tool.retireBy)}. It may be out
          of date.
        </p>
      ) : null}

      {audit ? <AuditDetail tool={tool} /> : null}
    </li>
  );
}

function AuditDetail({ tool }: { tool: Tool }) {
  const days = daysSince(tool.lastChecked);
  const overdue = days !== null && days > AUDIT_THRESHOLD_DAYS;

  return (
    <div className={overdue ? "audit audit--overdue" : "audit"}>
      <dl>
        <dt>Last checked</dt>
        <dd>
          {formatDate(tool.lastChecked)}
          {days === null ? " (unreadable date)" : ` — ${days} days ago`}
          {overdue ? " — overdue" : ""}
        </dd>

        <dt>Launched</dt>
        <dd>{formatDate(tool.launched)}</dd>

        {tool.retireBy ? (
          <>
            <dt>Retire by</dt>
            <dd>{formatDate(tool.retireBy)}</dd>
          </>
        ) : null}

        <dt>URL</dt>
        <dd>{tool.url}</dd>
      </dl>
    </div>
  );
}
