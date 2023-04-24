import React from 'react'
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { Avatar} from 'antd';
import { useAuth } from '../../context/auth';

const ProfileUpload = ({ photo, setPhoto, uploading, setUploading }) => {

    // context
    const [auth, setAuth] = useAuth();

    const handleUpload = (e) => {
        try {
            let file = e.target.files[0];
            if(file) {
                console.log(file);
                setUploading(true);
                new Promise(() => {
                    Resizer.imageFileResizer(
                        file,
                        300,
                        300,
                        "JPEG",
                        100,
                        0,
                        async (uri) => {
                          try {
                            console.log("Upload Uri =>", uri);
                            const { data } = await axios.post("/upload-image", {
                                image: uri,
                            });
                            setPhoto(data);
                            setUploading(false);
                          } catch (error) {
                            console.log(error);
                            setUploading(false);
                          }
                        },
                        "base64"
                      );
                })
            }
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    }

    const handleDelete = async (file) => {
        const answer = window.confirm("Delete Image?");
        if(!answer) return;
        setUploading(true);
        try {
            const { data } = await axios.post("/remove-image", photo);
            if(data?.ok) {
                setPhoto(null);
                setUploading(false);
            }
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    };

  return (
    <div className='flex justify-start items-center'>
        <label className='bg-[#2B3467] hover:bg-[#BAD7E9] text-[#FCFFE7] p-2 my-2 rounded-md flex items-center w-40'>
            <ion-icon name="cloud-upload-outline"></ion-icon> <h1 className='ml-2'>{uploading ? "Processing..." : "Upload photos"}</h1>
            <input onChange={handleUpload} type="file" accept='image/*' hidden />
        </label>
        {photo?.Location ? (
            <Avatar
                src={photo.Location}
                shape="square"
                size="46"
                className='ml-2'
                onClick={() => handleDelete()}
             />
        ) : (
            ""
        )}
    </div>
  )
}

export default ProfileUpload