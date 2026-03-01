import { ArrowRightCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="flex flex-wrap items-center justify-between bg-gray-800 text-center text-gray-300 py-5 px-4 ">
      <p className="text-sm">&copy; 2024 MernEats. All rights reserved.</p>
      {/* <SubFooter/> */}
      <a href="https://bilal-dev.vercel.app" className="text-xl font-extrabold flex items-center gap-3">
        Visit Developer Portfolio
        <div className="text-3xl text-orange">
          <ArrowRightCircle />
        </div>
      </a>
    </footer>
  );
};

export default Footer;
