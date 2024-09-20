import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

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
    <div className={styles.container}>
      <h1>Welcome to the Meet Clone</h1>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleCreateMeeting}>Create Meeting</button>
        <button className={styles.button} onClick={handleJoinMeeting}>Join Meeting</button>
      </div>
    </div>
  );
}
