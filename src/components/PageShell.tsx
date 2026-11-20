import Header from "./Header";
import Footer from "./Footer";
export default function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-4 text-3xl">{title}</h1>
        {children}
      </main>
      <Footer />
    </>
  );
}
