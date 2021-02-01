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
            <WindowButton type="close" onClick={handleClose} />
            <WindowButton type="minimize" onClick={handleMinimize} />
            <WindowButton type="maximize" onClick={handleMaximize} />
          </div>
        </div>
      </header>
    </div>
  );
}

function WindowButton({ type, onClick }) {
  return (
    <button className="Window__button" onClick={onClick}>
      <div className={`Window__button--${type}`} />
    </button>
  );
}

export default Window;