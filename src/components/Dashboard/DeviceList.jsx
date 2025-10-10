import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDevices, addDevice } from '../../firebase/firestore';
import DeviceControl from './DeviceControl';
import '../../css/device.css'

export default function DeviceList() {
  const { roomId } = useParams();
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'light'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = getDevices(roomId, (devices) => {
      setDevices(devices);
    });
    
    return () => unsubscribe();
  }, [roomId]);

  async function handleAddDevice(e) {
    e.preventDefault();
    try {
      await addDevice(roomId, newDevice);
      setNewDevice({
        name: '',
        type: 'light'
      });
    } catch (error) {
      console.error('Error adding device:', error);
    }
  }

  return (
    <div className="device-list">
      <button className='back-button' onClick={() => navigate('/dashboard')}>Back to Rooms</button>
      <h2>Devices in this Room</h2>
      
      <form onSubmit={handleAddDevice} className="add-device-form">
        <input
          type="text"
          placeholder="Device name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
          required
        />
        <select
          value={newDevice.type}
          onChange={(e) => setNewDevice({...newDevice, type: e.target.value})}
        >
          <option value="light">Light</option>
          <option value="thermostat">Thermostat</option>
          <option value="fan">Fan</option>
          <option value="switch">Switch</option>
        </select>
        <button type="submit">Add Device</button>
      </form>
      
      <div className="devices-grid">
        {devices.map(device => (
          <DeviceControl key={device.id} device={device} roomId={roomId} />
        ))}
      </div>
    </div>
  );
}