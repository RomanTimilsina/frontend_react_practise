import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";


const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false)

  const { currentUser } = useContext(AuthContext)

  const userId = useLocation().pathname.split('/')[2]

  const { isLoading, error, data } = useQuery(["users"], () =>
  makeRequest.get("/users/find/" + userId).then((res) => {
    return res.data;
  })
);

const { isLoading:rIsLoading, error:rIsError, data: relationshipData } = useQuery(["relationships"], () =>
  makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
    return res.data;
  })
);

const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (followed => {
      if (followed) return makeRequest.delete('/relationships?userId='+ userId)
      return makeRequest.post('/relationships',{userId})
    }),
    onSuccess: () => {
      // Invalidate and refetch 
      queryClient.invalidateQueries({ queryKey: ['relationships'] })
    },
  })

const handleFollow = (e) => {
  e.preventDefault()
  mutation.mutate(relationshipData.includes(currentUser.id)) 
}

console.log(relationshipData)

  return (
    
    <div className="profile">
      {isLoading ? 'loading' :<>
       <div className="images">
        <img
          src={'/upload/'+data.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={'/upload/'+data.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            { currentUser.id == userId ?
                        <button onClick={() => setOpenUpdate(true)}>Update</button> : 
                        <button onClick={handleFollow}>
                          {
                          rIsLoading ? '' : (relationshipData.includes(currentUser.id) ? 'following' : 'follow')
                          }</button>
            }         
           </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
      <Posts userId={userId} />
      </div>
      </>}
      { openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/> }
    </div>
  );
};

export default Profile;
