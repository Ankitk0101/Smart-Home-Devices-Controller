import { useState } from 'react';
import { updateDevice, deleteDevice } from '../../firebase/firestore';
import '../../css/deviceControl.css'


export default function DeviceControl({ device, roomId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deviceName, setDeviceName] = useState(device.name);

  async function handleStatusChange() {
    await updateDevice(device.id, { status: !device.status });
  }

  async function handleTemperatureChange(e) {
    await updateDevice(device.id, { temperature: parseInt(e.target.value) });
  }

  async function handleBrightnessChange(e) {
    await updateDevice(device.id, { brightness: parseInt(e.target.value) });
  }

  async function handleSaveEdit() {
    await updateDevice(device.id, { name: deviceName });
    setIsEditing(false);
  }

  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this device?')) {
      await deleteDevice(device.id, roomId);
    }
  }

  return (
    <div className={`device-card ${device.status ? 'active' : ''}`}>
      {isEditing ? (
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
        />
      ) : (
        <h3>{device.name}</h3>
      )}
      
      <p>Type: {device.type}</p>
      <p>Status: {device.status ? 'ON' : 'OFF'}</p>
      
      {device.type === 'thermostat' && (
        <div className="device-control">
          <p>Temperature: {device.temperature}°C</p>
          <input
            type="range"
            min="10"
            max="30"
            value={device.temperature || 20}
            onChange={handleTemperatureChange}
          />
        </div>
      )}
      
      {device.type === 'light' && (
        <div className="device-control">
          <p>Brightness: {device.brightness}%</p>
          <input
            type="range"
            min="0"
            max="100"
            value={device.brightness || 50}
            onChange={handleBrightnessChange}
          />
        </div>
      )}
      
      <div className="device-actions">
        <button onClick={handleStatusChange}>
          Turn {device.status ? 'OFF' : 'ON'}
        </button>
        
        {isEditing ? (
          <>
            <button onClick={handleSaveEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
        
        <button onClick={handleDelete} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}