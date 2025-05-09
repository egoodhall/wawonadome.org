import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserLinks, getUserProfile, isUserAdmin, UserLink, UserProfile } from '../services/firestoreService';

export function Dashboard() {
  const [links, setLinks] = useState<UserLink[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      if (!currentUser || !currentUser.email) return;
      
      try {
        setLoading(true);
        
        // Check if user is an admin
        const adminStatus = await isUserAdmin(currentUser.email);
        setIsAdmin(adminStatus);
        
        // Get user profile
        const userProfile = await getUserProfile(currentUser.email);
        setProfile(userProfile);
        
        // Get user links (includes shared links)
        const userLinks = await getUserLinks(currentUser.email);
        setLinks(userLinks);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your information. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  }

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  // Grouping links into personal and shared categories
  const personalLinks = links.filter(link => !link.isShared);
  const sharedLinks = links.filter(link => link.isShared);

  return (
    <div className="max-w-6xl mx-auto p-8 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-amber-800 text-amber-50 p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold font-serif mb-4 md:mb-0">Wassociates</h1>
        <div className="flex items-center">
          <span className="mr-4">
            {profile?.displayName || currentUser.email}
            {isAdmin && <span className="ml-2 bg-amber-600 px-2 py-1 text-xs rounded-md">Admin</span>}
          </span>
          <button 
            onClick={handleLogout}
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200"
          >
            Log Out
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <div className="bg-amber-100 rounded-lg shadow-md p-6 border-2 border-amber-300 mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-amber-900 font-serif border-b-2 border-amber-300 pb-2">
          My Resources
        </h2>
        
        {loading ? (
          <div className="text-center py-8 text-amber-800">
            <p>Loading your resources...</p>
          </div>
        ) : personalLinks.length === 0 ? (
          <div className="text-center py-8 text-amber-700">
            <p>No personal resources found for your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {personalLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-amber-400 bg-amber-50 rounded-lg hover:bg-amber-200 transition-colors shadow-sm"
              >
                <div className="flex items-center mb-2">
                  {link.icon && (
                    <span className="mr-3 text-xl text-amber-700">
                      <i className={`fa-solid fa-${link.icon}`}></i>
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-amber-900">{link.title}</h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Shared Resources Section */}
      <div className="bg-amber-100 rounded-lg shadow-md p-6 border-2 border-amber-300">
        <h2 className="text-2xl font-semibold mb-6 text-amber-900 font-serif border-b-2 border-amber-300 pb-2">
          <span className="flex items-center">
            <i className="fa-solid fa-users mr-2"></i>
            Common Resources
          </span>
        </h2>
        
        {loading ? (
          <div className="text-center py-8 text-amber-800">
            <p>Loading shared resources...</p>
          </div>
        ) : sharedLinks.length === 0 ? (
          <div className="text-center py-8 text-amber-700">
            <p>No shared resources available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sharedLinks.map((link) => (
              <a 
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-amber-400 bg-amber-50 rounded-lg hover:bg-amber-200 transition-colors shadow-sm"
              >
                <div className="flex items-center mb-2">
                  {link.icon && (
                    <span className="mr-3 text-xl text-amber-700">
                      <i className={`fa-solid fa-${link.icon}`}></i>
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-amber-900">{link.title}</h3>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
