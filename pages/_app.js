import "tailwindcss/tailwind.css";
import { Navbar } from "../components/Navbar";

const navbarHeight = "4rem";

function MyApp({ Component, pageProps }) {
  return (
    <div
      id="app"
      className="h-full bg-white text-black dark:bg-black dark:text-white"
    >
      <div className="app-container h-full overflow-auto">
        <div className="container mx-auto h-full px-4">
          <Navbar height={navbarHeight} />
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}

export default MyApp;
