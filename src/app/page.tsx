import IntroPage from './components/IntroPage'
import EducationPage from "./components/EducationPage"; 
import ContactPage from "./components/ContactPage";
import ProjectsPage from './components/ProjectsPage';
// import GoalsPage from "./components/GoalsPage";
// import ExperiencePage from "./components/ExperiencePage";
// import ProjectsPage from "./components/ProjectsPage";
// import SkillsPage from "./components/SkillsPage";
export default function Home() {
  return (
    <main>
    <IntroPage />
    <ProjectsPage/>
    {/* <EducationPage /> */}
    {/* <GoalsPage /> */}
    <ContactPage />

     </main>
  );
}
