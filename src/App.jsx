import reactLogo from './assets/react.svg'
import supabaseLogo from './assets/supabase.svg'
import ElektronikLogo from './assets/elektronik.jpg'
import viteLogo from '/vite.svg'
import Upvote from './components/Upvote'
import Swal from 'sweetalert2'
import supabase from './utils/supabase';

// Ikony
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { faLaptop } from '@fortawesome/free-solid-svg-icons'
import { faRobot } from '@fortawesome/free-solid-svg-icons'
import { faGears } from '@fortawesome/free-solid-svg-icons'
import { faMicrochip } from '@fortawesome/free-solid-svg-icons/faMicrochip'
import { faEarth } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'

import './App.css'
function App() {
  const [hax0r, setEasterEgg] = useState("Elektronik logo");
  const [count, setCounter] = useState(0);
  const easterEgg = async () => {
    if (count == 5) {
      const { data, error } = await supabase.from('polubienia')
        .select('likes')
        .eq('id', 1337)
        .single();
      
      if (error) {
        console.error('Error fetching data:', error.message);
      } else {
        const { error } = await supabase
          .from('polubienia')
          .update({ id: 1337, likes: data.likes + 1 })
          .eq('id', 1337);
        if (error) {
          console.error('Error updating data:', error.message);
        }
      }
      window.open("https://www.instagram.com/spotted_elektronik__radom/")
    }
    if (count == 10) {
      Swal.fire({
        title: "Nic tu nie ma, zabrakło pomysłów na easter egg :/",
        icon: "info",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false
      });
    }
    setCounter(count + 1)
    setEasterEgg("Elektronik logo animate__animated animate__tada")
    setTimeout(() => {
      setEasterEgg("Elektronik logo")
    }, 1000)
  }
  return (
    <>
      <div>
        <div className='titleContent'>
          <img src={ElektronikLogo} className={hax0r} alt="Elektronik logo" onClick={easterEgg} />
          <p className='mainTitle'>Zespół Szkół Elektronicznych im. Bohaterów Westerplatte w Radomiu <br/>zaprasza do rekrutacji na rok szkolny 24/25</p>
        </div>
        <div className='likeGrid'>
          <Upvote index={0} icon={faCode} text="Technik programista" subtext="specjalizacja AI" />
          <Upvote index={1} icon={faLaptop} text="Technik informatyk" subtext="specjalizacja Cyberbezpieczeństwo"/>
          <Upvote index={2} icon={faRobot} text="Technik robotyk"/>
          <Upvote index={3} icon={faGears} text="Technik mechatronik"/>
          <Upvote index={4} icon={faMicrochip} text="Technik elektronik"/>
          <a href="https://elektronik.edu.pl/index.php?option=com_content&view=article&id=909&Itemid=396" target='__blank'><Upvote icon={faEarth} noLikeUI text="Rekrutacja" subtext="Ucz się z najlepszymi"/></a>
        </div>
        <div className='devStack'>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://supabase.com" target="_blank">
            <img src={supabaseLogo} className="logo supabase" alt="React logo" />
          </a>
        </div>
      </div>
      <p>
        <a href="https://github.com/100Daisy/DniOtwarte2024" target="_blank">Kod źródłowy w serwisie Github</a>
      </p>
    </>
  )
}



export default App
