import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms, createRoom } from '../../firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import '../../css/room.css'


export default function RoomList() {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.uid) return;
    
    const initialize = async () => {
      try {
        
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists() && userDoc.data().householdId) {
          const unsubscribe = getRooms(userDoc.data().householdId, (rooms) => {
            setRooms(rooms);
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error initializing rooms:', error);
      }
    };

    initialize();
  }, [currentUser]);

  async function handleAddRoom(e) {
    e.preventDefault();
    setLoading(true);
    
    if (!newRoomName.trim()) {
      alert('Please enter a room name');
      setLoading(false);
      return;
    }

    try {
       
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (!userDoc.exists() || !userDoc.data().householdId) {
        throw new Error('Please complete your profile setup first');
      }

      await createRoom(userDoc.data().householdId, newRoomName);
      setNewRoomName('');
    } catch (error) {
      console.error('Error adding room:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="room-list">
      <h2>Your Rooms</h2>
      <form onSubmit={handleAddRoom}>
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Room'}
        </button>
      </form>
      
      <div className="rooms-grid">
        {rooms.map(room => (
          <div 
            key={room.id} 
            className="room-card"
            onClick={() => navigate(`/room/${room.id}`)}
          >
            <h3>{room.name}</h3>
            <p>{room.devices?.length || 0} devices</p>
          </div>
        ))}
      </div>
    </div>
  );
}