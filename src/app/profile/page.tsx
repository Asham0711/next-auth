/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {toast} from "react-hot-toast";

const ProfilePage = () => {
  const router = useRouter();
  const [data, setData] = useState("");
  
  const getUserDetails = async () =>{
      try {
          const response = await axios.post('/api/users/me');
          console.log(response.data);
          setData(response.data.data._id)
      } catch (error:any) {
        console.log("Error while fetching data");
        toast.error(error.message);
      }
  }

  const logout = async () => {
      try {
        await axios.get('/api/users/logout');
        toast.success("User logged out successfully");
        router.push('/login');
      } catch (error:any) {
        console.log("Error while logging out");
        toast.error(error.message);
      }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === '' ? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        GetUser Details
      </button>
    </div>
  )
}

export default ProfilePage