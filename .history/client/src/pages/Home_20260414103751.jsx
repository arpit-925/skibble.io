import React, { useState } from 'react';

const Home = ({ onCreate, onJoin }) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-6xl font-bold text-blue-600 mb-8">Skribbl Clone</h1>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">
        <input 
          type="text" 
          placeholder="Enter Name"
          className="w-full p-2 border mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button 
          onClick={() => onCreate(name)}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
        >
          Create Private Room
        </button>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Room Code"
            className="flex-1 p-2 border rounded"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button 
            onClick={() => onJoin(name, roomCode)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};