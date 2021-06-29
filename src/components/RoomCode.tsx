import copyImg from '../assets/images/copy.svg';

import toast, { Toaster } from 'react-hot-toast';

import '../styles/room-code.scss';
import React from 'react';

type RoomCodeProps = {
  code: string;
};

export function RoomCode(props: RoomCodeProps) {
  const notify = () =>
    toast.success('Copiado', { style: { background: '#835afd' } });
  // função que cópia o code do botão
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
    notify();
  }

  return (
    <div>
      <button className="room-code" onClick={copyRoomCodeToClipboard}>
        <div>
          <img src={copyImg} alt="Copy room code" />
        </div>
        <span>Sala #{props.code}</span>
      </button>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
