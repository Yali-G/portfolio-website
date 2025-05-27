import Image from "next/image";
import Link from "next/link";

import IntroPage from './components/IntroPage'
import EducationPage from "./components/EducationPage"; 
import ContactPage from "./components/ContactPage";
import GoalsPage from "./components/GoalsPage";
// import ExperiencePage from "./components/ExperiencePage";
// import ProjectsPage from "./components/ProjectsPage";
// import SkillsPage from "./components/SkillsPage";
export default function Home() {
  return (
    <main> <h1> Hello World </h1>
    <Link href="/users">Users</Link>
    <IntroPage />
    <EducationPage />
    <GoalsPage />
    <ContactPage />

     </main>
  );
}
