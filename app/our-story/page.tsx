import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OurStory } from "@/components/OurStory";

export default function OurStoryPage() {
  return (
    <main className="min-h-screen flex flex-col bg-brand-light">
      <Header />
      <div className="pt-20 flex-grow bg-white">
        <OurStory />
      </div>
      <Footer />
    </main>
  );
}
