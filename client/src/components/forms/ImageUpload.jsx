import React from 'react'
import { imageFileResizer } from 'react-image-file-resizer';
import axios from 'axios';
import { Avatar} from 'antd';

const ImageUpload = ({ad, setAd}) => {

    const handleUpload = (e) => {
        try {
            let files = e.target.files;
            files = [...files]
            if(files?.length) {
                console.log(files);
                setAd({ ...ad, uploading: true });

                files.map(file => {
                    new Promise(() => {
                        imageFileResizer(
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
                                setAd((prev) => ({
                                    ...prev,
                                    photos: [data, ...prev.photos],
                                    uploading: false,
                                }))
                              } catch (error) {
                                console.log(error);
                                setAd({ ...ad, uploading: false });
                              }
                            },
                            "base64"
                          );
                    })
                })
            }
        } catch (error) {
            console.log(error);
            setAd({ ...ad, uploading: false });
        }
    }

    const handleDelete = async (file) => {
        const answer = window.confirm("Delete Image?");
        if(!answer) return;
        setAd({ ...ad, uploading: true });
        try {
            const { data } = await axios.post("/remove-image", file);
            if(data?.ok) {
                setAd((prev) => ({
                    ...prev,
                    photos: prev.photos.filter((p) => p.Key !== file.Key),
                    uploading: false,
                }));
            }
        } catch (error) {
            console.log(error);
            setAd({ ...ad, uploading: false });
        }
    };

  return (
    <div className='flex justify-start items-center'>
        <label className='bg-[#2B3467] hover:bg-[#BAD7E9] text-[#FCFFE7] p-2 my-2 rounded-md flex items-center w-40'>
            <ion-icon name="cloud-upload-outline"></ion-icon> <h1 className='ml-2'>{ad.uploading ? "Processing..." : "Upload photos"}</h1>
            <input onChange={handleUpload} type="file" accept='image/*' multiple hidden />
        </label>
        {ad.photos?.map((file, index) => (
            <Avatar
                key={index}
                src={file.Location}
                shape="square"
                size="46"
                className='ml-2'
                onClick={() => handleDelete(file)}
             />
        ))}
    </div>
  )
}

export default ImageUpload