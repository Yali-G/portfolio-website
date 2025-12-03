import TerminalLayout from "./components/TerminalLayout";

export default function Home() {
  return (
    <TerminalLayout>
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="header text-3xl md:text-5xl mb-4">Welcome to My Portfolio</h1>
          <p className="paragraph text-lg md:text-2xl">
            Use the terminal above to navigate. Type &apos;help&apos; to see available commands.
          </p>
        </div>
      </div>
    </TerminalLayout>
  );
}
