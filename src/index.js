// work in progress notes https://aworkinprogress.dev/joy-con-clicker/

import React from 'react';
import ReactDOM from 'react-dom';
import { gamepadConnect, gamepadDisconnect } from './gamepad';
// import NintendoUI from "./NintendoUI";
import PasswordUI from './PasswordUI';
import './posenet';
import './styles.css';

const JoyConController = () => {
  React.useEffect(() => {
    window.addEventListener('gamepadconnected', gamepadConnect);
    window.addEventListener('gamepaddisconnected', gamepadDisconnect);
    return () => {
      window.removeEventListener('gamepadconnected', gamepadConnect);
      window.removeEventListener('gamepaddisconnected', gamepadDisconnect);
    };
  }, []);
  return (
    <div>
      {/* <NintendoUI /> */}
      <div className='display' id='gamepad-display' />
      <div className='display' id='button-x-display' />
      <PasswordUI />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((idx) => (
        <div className='button-display' data-button={idx} />
      ))}
      <div style={{ position: 'relative' }}>
        <video
          id='video'
          playsInline
          style={{
            transform: 'scaleX(-1)'
          }}
        ></video>
        <canvas
          id='output'
          style={{
            position: 'absolute',
            left: 400,
            zIndex: 1
          }}
        ></canvas>
      </div>
    </div>
  );
};

function App() {
  return <JoyConController />;
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
