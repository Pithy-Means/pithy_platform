import Whoweare from "@/components/Whoweare";
import Whatwegive from "@/components/Whatwegive";
import Howdoesitwork from "@/components/Howdoesitwork";
import BodySection from "@/components/BodySection";
import Pricing from "@/components/Pricing";
import FreqAskeQuestion from "@/components/FreqAskeQuestion";
import Footer from "@/components/Footer";
import WhoWeAreMobile from "@/components/WhoWeAreMobile";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <BodySection />
      <div className="lg:block hidden">
        <Whoweare />
      </div>
      <div className="lg:hidden block">
        <WhoWeAreMobile />
      </div>
      <Whatwegive />
      <Howdoesitwork />
      <Pricing />
      <FreqAskeQuestion />
      <Footer />
    </div>
  );
}
