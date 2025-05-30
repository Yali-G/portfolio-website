import React from "react";

const ProjectsPage = () => {
  return (
    <section className="section bg-[var(--projects-background)] transition-all duration-300 flex justify-center">
      <div className="component w-[90vw] h-[60vh] md:w-[60vw] md:h-[90vh] flex flex-col justify-between p-[0.5rem] md:p-[2rem]">
        <div>
          <p className="paragraph md:text-2xl">
            Here is a recent project of mine that implements BFS to play the
            wikipedia game.
          </p>
        </div>

        <div className=" h-auto w-[250px] md:w-[400px] lg:w-[600px]">
          <img
            src={"/game_screen_recording.gif"}
            alt="Game screen recording"
            className="w-full rounded-md shadow-md"
          />
        </div>

        <div>
          <a
            href="https://wikipedia-game.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p
              className="text-blue-600 hover:underline cursor-pointer font-normal text-[1.2rem] md:text-[2rem]"
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
