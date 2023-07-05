import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'


 const Posts = ({userId}) => {
  

    const { isLoading, error, data } = useQuery(["posts"], () =>
      makeRequest.get("/posts?userId="+userId).then((res) => {
        return res.data;
      })
    );


  return <div className="posts">
    { error ? "Something went wrong!" : (isLoading ? "Loading" : data.map(post => (
      <Post post={post} key={post.id} />
      
    )))  
    }
  </div>;
};

export default Posts;



