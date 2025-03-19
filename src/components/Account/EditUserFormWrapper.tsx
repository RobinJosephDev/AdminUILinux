import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EditUserForm from './EditUserForm';
import { User } from './UserTypes';

const EditUserFormWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`https://api.example.com/users/${id}`)
      .then((response) => response.json())
      .then((data) =>
        setSelectedUser({
          ...data,
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        })
      )
      .catch((error) => console.error('Error fetching user:', error));
  }, [id]);
  

  const handleUpdate = (updatedUser: User) => {
    console.log('Updated User:', updatedUser);
  };

  const handleClose = () => {
    console.log('Close form');
  };

  if (!selectedUser) return <p>Loading...</p>;

  return <EditUserForm onClose={handleClose} onUpdate={handleUpdate} selectedUser={selectedUser} />;
};

export default EditUserFormWrapper;
