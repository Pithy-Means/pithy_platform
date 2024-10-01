import Whoweare from '@/components/Whoweare'
import Whatwegive from '@/components/Whatwegive'
import Howdoesitwork from '@/components/Howdoesitwork'
import BodySection from '@/components/BodySection';
import Pricing from '@/components/Pricing';
import FreqAskeQuestion from '@/components/FreqAskeQuestion'
import SpecialOffer from '@/components/SpecialOffer';
import Footer from '@/components/Footer';


export default function Home() {
  return (
    <div>
      <BodySection />
      <Whoweare />
      <Whatwegive />
      <Howdoesitwork />
      <Pricing />
      <FreqAskeQuestion />
      <SpecialOffer />
      <Footer />
    </div>
  );
}
