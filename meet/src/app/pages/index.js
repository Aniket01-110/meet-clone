import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  const handleCreateMeeting = () => {
    router.push('/meet?mode=create');
  };

  const handleJoinMeeting = () => {
    const meetingID = prompt('Enter Meeting ID:');
    if (meetingID) {
      router.push(`/meet?mode=join&meetingID=${meetingID}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900">Meet Clone</h1>
      <div className="mt-8">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mr-4"
          onClick={handleCreateMeeting}
        >
          Create Meeting
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full"
          onClick={handleJoinMeeting}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
}
