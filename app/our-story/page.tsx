import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OurStory } from "@/components/OurStory";


/* 
 * This code is owned by Vipul Enterprise and Vipul Enterprise gives rights to 
 * DY Business Solution Pvt Ltd. They can use it as a one-time license for their 
 * client but they cannot use it for another client like that.
 */

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
