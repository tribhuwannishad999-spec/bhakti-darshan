import MantraGame from "@/components/game/MantraGame";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeSections from "@/components/sections/HomeSections";

export default function Home() {
  return (
    <>
      <MantraGame />
      <Header />
      <HomeSections />
      <Footer />
    </>
  );
}
