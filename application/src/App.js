import './App.css';

function App() {
  return (
    <main className="App">
      <div className="Window">
        <header className="Window__header">
          <div className="Window__title">
            <div className="Window__controls">
              <button className="Window__button">
                <div className="Window__button--close" />
              </button>
              <button className="Window__button">
                <div className="Window__button--minimize" />
              </button>
              <button className="Window__button">
                <div className="Window__button--maximize" />
              </button>
            </div>
          </div>
        </header>
      </div>
    </main>
  );
}

export default App;
