import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="masthead">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="masthead__mark" src="/mark.png" alt="" width={22} height={22} />
        <h1>Normcore Partners</h1>
      </header>

      <p className="lede">Normcore Partners is a political startup.</p>

      <nav className="nav">
        <Link href="/tools">Tools</Link>
      </nav>
    </main>
  );
}
