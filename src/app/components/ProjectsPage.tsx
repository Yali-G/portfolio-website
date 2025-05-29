import React from "react";

const ProjectsPage = () => {
  return (
    <section className="section bg-[var(--projects-background)] transition-all duration-300 flex flex-start gap-5 pb-10">
      <div>
        <h1 className="header">Projects</h1>
      </div>

      <div className="component w-[60vw] h-[90vh] flex flex-grow justify-start ">
        <div>
          <p className="paragraph">
            Here is a recent project of mine that implements BFS to play the
            wikipedia game.
          </p>
        </div>

        <div>
          <img
            src={"/game_screen_recording.gif"}
            alt="Game screen recording"
            className="w-full max-w-2xl rounded-md shadow-md"
          />
        </div>

        <div>
          <a
            href="https://wikipedia-game.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p
              className="text-blue-600 hover:underline cursor-pointer font-normal text-[1.2rem]"
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
