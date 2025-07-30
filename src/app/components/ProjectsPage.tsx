import React from "react";

const ProjectsPage = () => {
  return (
<section className="min-h-screen w-full bg-[var(--projects-background)] transition-all duration-300 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
  <div className="bg-[var(--components-background)] rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl flex flex-col items-center gap-6 p-6 sm:p-8 md:p-10">
<div className="text-center">
      <p className="paragraph text-lg sm:text-xl md:text-2xl">
            Here is a recent project of mine that implements BFS to play the
            wikipedia game.
          </p>
        </div>

    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <img
            src={"/game_screen_recording.gif"}
            alt="Game screen recording"
            className="w-full rounded-md shadow-md"
          />
        </div>

<div className="text-center">
          <a
            href="https://wikipedia-game.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p
          className="text-blue-500 dark:text-blue-400 hover:underline cursor-pointer font-semibold text-lg sm:text-xl md:text-2xl"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              Play It Here!
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
