import { collection, getDocs, where, query, getFirestore, doc, updateDoc } from 'firebase/firestore'; 
import React, { useEffect, useState,useCallback } from 'react'; 
import { app } from '../../../firebase'; 
import { IoIosClose } from "react-icons/io"; 
 
const db = getFirestore(app); 
 
function Videos() { 
    const [allVideos, setAllVideos] = useState([]);  
    const [selectedVideo, setSelectedVideo] = useState(null); 
    const [searchQuery, setSearchQuery] = useState('');  
    const [filteredVideos, setFilteredVideos] = useState([]); 
    const [userList, setUserList] = useState([]);  
    const localuser = localStorage.getItem('userData'); 
    const userData = JSON.parse(localuser); 
 
    useEffect(() => { 
        const fetchVideos = async () => { 
            const q = query(collection(db, 'videos')); 
            const p = query(collection(db, 'users'), where('Role', '==', 'Teacher')); 
 
            const querySnapshot1 = await getDocs(p); 
            const querySnapshot = await getDocs(q); 
 
            const teacherList = querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
            const videosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
 
            setAllVideos(videosList); 
            setFilteredVideos(videosList);  
            setUserList(teacherList); 
        }; 
 
        fetchVideos(); 
    }, []); 
 
    useEffect(() => { 
        const filtered = allVideos.filter(video => 
            video.Title.toLowerCase().includes(searchQuery.toLowerCase()) 
        ); 
        setFilteredVideos(filtered); 
    }, [searchQuery, allVideos]); 
 
    const handleVideoClick = async(video) => { 
        setSelectedVideo(video); 
 
        const videoRef = doc(db, "videos", video.id); 
     
        await updateDoc(videoRef, { 
            views: video.views + 1 
        }); 
    };
 
    const handleCloseVideo = useCallback(() => { 
        setSelectedVideo(null); 
    }, []);
 
    const getTeacherById = (userId) => { 
        return userList.find(teacher => teacher.uid === userId); 
    }; 
 
    return ( <>
            <h2 style={{ textAlign: 'center', margin: '2rem', fontSize: '2rem', color: '#333' }}>Educational Videos on Agriculture</h2> 
        <div style={{ padding: '2rem', margin: 'auto'  ,display:'flex',justifyContent:'center'}}> 
           
            {selectedVideo ? ( 
                <div style={{ position: 'relative',width:'60vw', backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '1rem' }}> 
                    <div 
    style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '10px', 
        cursor: 'pointer', 
        color: '#666', 
        fontSize: '1.5rem', 
        backgroundColor:'red',
        color:'white',
        height:'3vw',
        width:'3vw',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:'50%',
        zIndex:'10000000000000000'
    }} 
    onClick={handleCloseVideo}  // This should trigger the close
> 
    <IoIosClose /> 
</div> 
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}> 
                        <video 
                            controls 
                            style={{ 
                                width: '100%', 
                                borderRadius: '8px' 
                            }}
                        > 
                            <source src={selectedVideo.videoUpload} type="video/mp4" /> 
                            Your browser does not support the video tag. 
                        </video> 
                    </div> 
                    <div style={{ textAlign: 'center', color: '#555', fontSize: '1rem' }}> 
                        <p>Views: {selectedVideo.views}</p> 
                    </div> 
                </div> 
            ) : ( 
                <div style={{ textAlign: 'center',padding:'2vw' }}>
                    <input 
                        type="text" 
                        placeholder="Search videos" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        style={{ 
                            padding: '0.5rem 1rem', 
                            borderRadius: '20px', 
                            border: '1px solid #ccc', 
                            marginBottom: '2rem', 
                            width: '80%', 
                            maxWidth: '400px', 
                            outline: 'none' 
                        }} 
                    /> 
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}> 
                        {filteredVideos.map((video) => { 
                            const teacherInfo = getTeacherById(video.userid); 
 
                            return ( 
                                <li 
                                    key={video.id} 
                                    onClick={() => handleVideoClick(video)} 
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        marginBottom: '1rem', 
                                        cursor: 'pointer', 
                                        padding: '1rem', 
                                        borderRadius: '8px', 
                                        backgroundColor: '#fff', 
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
                                    }} 
                                > 
                                    <img 
                                        src={video.thumbnailUpload} 
                                        alt={video.Title} 
                                        style={{ 
                                            width: '120px', 
                                            height: '80px', 
                                            objectFit: 'cover', 
                                            borderRadius: '4px', 
                                            marginRight: '1rem' 
                                        }} 
                                    /> 
                                    <div style={{ textAlign: 'left', flex: '1',marginLeft:'3vw' }}> 
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
                                            
                                            <h3 style={{ fontSize: '1.2rem', margin: '0', color: '#333' }}>{video.Title}</h3> 
                                        </div> 
                                        <p style={{ margin: '0.5rem 0', color: '#777' }}>{teacherInfo?.Username}</p> 
                                        <p style={{ margin: '0', color: '#999', fontSize: '0.9rem' }}>{video.views} views • {video.uploadDate}</p> 
                                    </div> 
                                </li> 
                            ); 
                        })} 
                    </ul> 
                </div>
            )} 
        </div> 
            </>
    ); 
} 
 
export default Videos;
