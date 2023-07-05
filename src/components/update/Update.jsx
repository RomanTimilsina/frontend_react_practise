import React, { useContext, useState } from 'react'
import './update.scss'
import { makeRequest } from '../../axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../context/authContext';

const Update = ({setOpenUpdate, user}) => {

  const { updateUser} = useContext(AuthContext)

  const { isLoading, error, data } = useQuery(["users"], () =>
    makeRequest.get("/users/find/"+user.id).then((res) => {
      return res.data;
    })
  );



  const [cover, setCover] = useState(null)
  const [profile, setProfile] = useState(null)

  const [texts, setTexts] = useState({
    name:'',
    city:'',
    website:''
  })

  const queryClient = useQueryClient()

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };


  const handleChange = (e) => {
    setTexts(prev => ({...prev, [e.target.name]:e.target.value}))
  }

  

  const mutation = useMutation({
    mutationFn: (user => {
      makeRequest.put('/users', user)
    }),
    onSuccess: () => {
      // Invalidate and refetch 
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleClick = async (e) => {
    e.preventDefault()
    let coverUrl = user.coverPic
    let profileUrl = user.profilePic
    coverUrl  = cover && await upload(cover)
    profileUrl  = profile && await upload(profile)
    mutation.mutate({
      ...texts, coverPic : coverUrl, profilePic: profileUrl
    })
    updateUser(data)
    setOpenUpdate(false)
    
  }

  
  
  return (
    <div className='update'>
      Update
      <form >
        <input type="file" onChange={e => setCover(e.target.files[0])} />
        <input type="file" onChange={e => setProfile(e.target.files[0])} />
        <input type="text" name='name' onChange={handleChange} />
        <input type="text" name='city' onChange={handleChange}  />
        <input type="text" name='website' onChange={handleChange}  />
        <button onClick={handleClick}>Update</button>
      </form>
      <button 
      onClick={() => setOpenUpdate(false)}>
        X
      </button>
    </div>
  )
}

export default Update
