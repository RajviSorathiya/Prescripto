import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../Context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, backendUrl, token, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      await loadUserProfileData();
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
      setLoading(false);
    }
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/users/update-profile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
         await fetchUserProfile();
        //await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(null);
    fetchUserProfile(); // Reset to original data
  };

  if (loading || !userData) {
    return <div className="min-h-[80vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full flex flex-col gap-2 text-sm border rounded-xl p-8 shadow-lg">
        {
          isEdit
          ? <label htmlFor="image">
              <div className='inline-block relative cursor-pointer'>
                <img 
                  className='w-36 h-36 rounded object-cover opacity-75' 
                  src={image ? URL.createObjectURL(image) : userData.image || '/default-avatar.png'} 
                  alt={userData.name}
                /> 
                <img  
                  className='w-10 absolute bottom-12 right-12'
                  src={image ? '' : assets.upload_icon} 
                  alt="Upload icon"
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </label>
          : <img 
              className="w-36 h-36 object-cover rounded" 
              src={userData.image || '/default-avatar.png'} 
              alt={userData.name} 
            />
        }
        {isEdit ? (
          <input 
            className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 p-2 rounded" 
            type="text" 
            value={userData.name} 
            onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
        )}
        <hr className='bg-zinc-400 h-[1px] border-none'/>
        <div>
          <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Email Id:</p>
            <p className='text-blue-500'>{userData.email}</p>
            <p className='font-medium'>Phone:</p>
            {
              isEdit 
              ? <input 
                  className='bg-gray-100 max-w-52 p-1 rounded'
                  type="tel"
                  pattern="[0-9]*"
                  value={userData.phone} 
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    setUserData(prev => ({...prev, phone: value}));
                  }}
                />
              : <p className='text-blue-400'>{userData.phone}</p>
            }
            <p className='font-medium'>Address:</p>
            {
              isEdit 
              ? <div>
                  <input 
                    className='bg-gray-50 w-full p-1 rounded mb-1'
                    onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} 
                    value={userData.address?.line1 || ''} 
                    type="text" 
                    placeholder="Address Line 1"
                  />
                  <input 
                    className='bg-gray-50 w-full p-1 rounded'
                    onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} 
                    value={userData.address?.line2 || ''} 
                    type="text"
                    placeholder="Address Line 2"
                  />
                </div>
              : <p className='text-gray-500'>
                  {userData.address?.line1}
                  {userData.address?.line2 && <><br/>{userData.address.line2}</>}
                </p>
            }
          </div>
        </div>
        <div>
          <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {
              isEdit 
              ? <select 
                  className='max-w-20 bg-gray-100 p-1 rounded'
                  onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} 
                  value={userData.gender || ''}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              : <p className='text-gray-400'>{userData.gender || 'Not specified'}</p>
            }
            <p className='font-medium'>Birthday:</p>
            {
              isEdit
              ? <input 
                  className='max-w-28 bg-gray-100 p-1 rounded' 
                  type="date" 
                  onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))}
                  value={userData.dob || ''}
                />
              : <p>{userData.dob || 'Not specified'}</p>
            }
          </div>
        </div>
        <div className='mt-10'>
          {isEdit ? (
            <div className="flex gap-4">
              <button 
                className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                onClick={updateUserProfileData}
              >
                Save
              </button>
              <button
                className="border border-gray-500 px-8 py-2 rounded-full hover:bg-gray-500 hover:text-white transition-all"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              className="border border-blue-500 px-8 py-2 rounded-full hover:bg-blue-500 hover:text-white transition-all"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;