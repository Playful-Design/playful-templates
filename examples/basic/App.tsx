import { GridGradientPattern } from "@playfuldesign/templates/patterns/grid-gradient";
import { MarkerAlphabetTypeface } from "@playfuldesign/templates/fonts/marker-alphabet";
import { StickPenTypeface } from "@playfuldesign/templates/fonts/stick-pen";

export function App() {
  return (
    <main style={{ width: 1200, height: 675, position: "relative", overflow: "hidden", borderRadius: 24 }}>
      <GridGradientPattern color="#FFE949" />
      <div style={{ position: "absolute", left: "28%", top: "20%", width: "44%" }}>
        <StickPenTypeface text="an afternoon of" />
      </div>
      <div style={{ position: "absolute", left: "30%", top: "38%", width: "42%" }}>
        <MarkerAlphabetTypeface text="cookies and craft" />
      </div>
    </main>
  );
}
