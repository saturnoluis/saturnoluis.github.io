import { useState } from 'react';

function Window() {
  const [ windowState, setWindowState ] = useState('default');

  const handleClose = (evnt) => {
    evnt.preventDefault();
    setWindowState('closed');
  }

  const handleMinimize = (evnt) => {
    evnt.preventDefault();
    setWindowState(windowState !== 'minimized' ? 'minimized' : 'default' );
  }

  const handleMaximize = (evnt) => {
    evnt.preventDefault();
    setWindowState(windowState !== 'maximized' ? 'maximized' : 'default' );
  }

  return (
    <div className={`Window Window--${windowState}`}>
      <header className="Window__header">
        <div className="Window__title">
          <div className="Window__controls">
            <WindowButton type="close" state={windowState} onClick={handleClose} />
            <WindowButton type="minimize" state={windowState} onClick={handleMinimize} />
            <WindowButton type="maximize" state={windowState} onClick={handleMaximize} />
          </div>
        </div>
      </header>
    </div>
  );
}

function WindowButton({ type, state, onClick }) {
  return (
    <button className="WindowButton" onClick={onClick}>
      <div className={`icon icon--${type} icon--${state}`} />
    </button>
  );
}

export default Window;