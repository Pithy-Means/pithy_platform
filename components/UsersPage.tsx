import { NextPage } from 'next';
import UserManagement from '@/components/UserManagement';
import { UserInfo } from '@/types/schema';
import { getAllUsers } from '@/lib/actions/user.actions';

// Your API function to fetch users (modify as needed based on your backend)
const fetchUsers = async (page: number, limit: number, search?: string): Promise<{users: UserInfo[], total: number}> => {
  try {
    const offset = (page - 1) * limit;
    
    // Create filters array if search is provided
    const filters = search ? [
      { field: 'firstname', operator: 'contains', value: search },
      { field: 'lastname', operator: 'contains', value: search },
      { field: 'email', operator: 'contains', value: search },
      { operator: 'or' }
    ] : [];
    
    // Call your getAllUsers function
    const response = await getAllUsers(limit, offset, filters);
    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 };
  }
};

// Type definition (if not already defined in your @/types/userTypes.ts file)
// interface UserInfo {
//   user_id: string;
//   email: string;
//   firstname?: string;
//   lastname?: string;
//   categories?: string[];
//   referral_code: string;
//   referred_users?: string[];
// }

const UsersPage: NextPage = () => {
  const handleEditUser = (user: UserInfo) => {
    // Implement your edit logic
    console.log('Edit user:', user);
  };

  const handleDeleteUser = (userId: string) => {
    // Implement your delete logic
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Delete user:', userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">User Administration</h1>
        
        <UserManagement 
          fetchUsers={fetchUsers}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default UsersPage;