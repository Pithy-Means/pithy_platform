import Whoweare from '@/components/Whoweare'
import Whatwegive from '@/components/Whatwegive'
import Howdoesitwork from '@/components/Howdoesitwork'
import BodySection from '@/components/BodySection';



export default function Home() {
  return (
    <div>
      <BodySection />
      <Whoweare />
      <Whatwegive />
      <Howdoesitwork />
    </div>
  );
}
