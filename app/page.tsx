import Image from "next/image";
import Navbar from "./ui/shared/navbar";
import Banner from "./ui/home/banner";
import SectionCards from "./ui/home/section";
import Footer from "./ui/home/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Banner />
      <SectionCards />
      <Footer />
    </main>
  );
}
