import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function Meet() {
  const router = useRouter();
  const { mode, meetingID } = router.query;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const startConnection = async () => {
      socket = io('http://localhost:5000'); // Flask backend URL
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      localVideoRef.current.srcObject = localStream;

      const pc = new RTCPeerConnection();
      setPeerConnection(pc);

      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      if (mode === 'create') {
        socket.emit('create-meeting');
        socket.on('created', async (roomID) => {
          console.log('Meeting created with ID:', roomID);
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('offer', { roomID, offer });
        });
      } else if (mode === 'join') {
        socket.emit('join-meeting', meetingID);
        socket.on('offer', async (offer) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', { meetingID, answer });
        });
      }

      socket.on('answer', async (answer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', { roomID: meetingID, candidate: event.candidate });
        }
      };

      socket.on('candidate', async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      });
    };

    startConnection();

    return () => {
      socket.disconnect();
    };
  }, [mode, meetingID]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-900">Meeting Room</h1>
      <div className="flex mt-8 space-x-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="w-64 h-48 bg-black rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg" />
      </div>
    </div>
  );
}
