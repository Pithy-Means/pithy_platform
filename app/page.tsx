import Navbar from "@/components/Navbar";
import Whoweare from '@/components/Whoweare'
import Whatwegive from '@/components/Whatwegive'
import Howdoesitwork from '@/components/Howdoesitwork'



export default function Home() {
  return (
    <div>
      <Navbar />
      <Whoweare />
      <Whatwegive />
      <Howdoesitwork />
    </div>
  );
}
