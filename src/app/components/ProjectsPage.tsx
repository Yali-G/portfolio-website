import React from "react";

const ProjectsPage = () => {
  return (
    <section className="section bg-[var(--projects-background)] transition-all duration-300 flex flex-start py-10">
      <div className="component w-[60vw] h-[90vh] flex flex-grow justify-start gap-5 ">
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
