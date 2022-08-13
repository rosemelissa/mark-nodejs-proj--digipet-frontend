import { useEffect, useState } from "react";
import DigipetActions from "./components/DigipetActions";
import DigipetData from "./components/DigipetData";

export interface Digipet {
  happiness: number;
  nutrition: number;
  discipline: number;
}

function App() {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [description, setDescription] = useState<string>();
  const [digipetStats, setDigipetStats] = useState<Digipet>();

  const baseUrl = process.env.NODE_ENV === "production"
	? "https://rosemelissa-digipet.herokuapp.com"
	: "http://localhost:4000"

  const loadDataFromEndpoint = async (endpoint: `/${string}`) => {
    // try... catch documentation:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
    try {
      const res = await fetch(`${baseUrl}${endpoint}`);
      const body = await res.json();
      setDescription(body.description);
      setDigipetStats(body.digipet);
    } catch (err) {
      console.log(err);
      setDescription(`${err.name}: ${err.description}`);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // safe to ignore exhaustive deps warning as we're _not_ triggering infinite updates, since our setState is conditional and not executed on all rerenders after the first one
    if (isFirstLoad) {
      // populate data on first load
      loadDataFromEndpoint("/digipet");
      setIsFirstLoad(false);
    }
  });

  return (
    <main>
      <h1>Digipet</h1>
      {isFirstLoad && <p>Loading...</p>}
      {description && <p>{description}</p>}
      <hr />
      <DigipetData digipet={digipetStats} />
      <hr />
      <DigipetActions
        actions={[
          {
            name: "Hatch",
            handler: () => loadDataFromEndpoint("/digipet/hatch"),
          },
          {
            name: "Walk",
            handler: () => loadDataFromEndpoint("/digipet/walk"),
          },
          { name: "Feed",
            handler: () => loadDataFromEndpoint("/digipet/feed"),
          },
          {
            name: "Train",
            handler: () => loadDataFromEndpoint("/digipet/train"),
          },
          {
            name: "Ignore",
            handler: () => loadDataFromEndpoint("/digipet/ignore"),
          },
          {
            name: "Rehome",
            handler: () => loadDataFromEndpoint("/digipet/rehome"),
          },
        ]}
      />
    </main>
  );
}

export default App;
