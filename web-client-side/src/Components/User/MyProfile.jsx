import React, { useContext } from 'react';
import { AuthContext } from '../Providers/AuthProvider';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../AxiosPublic/useAxiosPublic';

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_API;
const image_hosting_url = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const MyProfile = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        try {
            const imageFile = new FormData();
            imageFile.append('image', data.image[0]);

            const res = await axiosPublic.post(image_hosting_url, imageFile, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.success) {
                const imageUrl = res.data.data.display_url;
                await updateUserProfile(data.name, imageUrl);
                
                Swal.fire({
                    title: "Success!",
                    text: "Your profile has been updated",
                    icon: "success",
                });
                reset();
            } else {
                Swal.fire({
                    title: "Error!",
                    text: "Failed to upload the image",
                    icon: "error",
                });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            Swal.fire({
                title: "Error!",
                text: "There was an error updating your profile",
                icon: "error",
            });
        }
    };

    return (
        <div>
            <div><h1>Update your profile information</h1></div>
            <div>
                <img src={user?.photoURL} alt="User Photo" />
                <h2>{user?.displayName}</h2>
                <h3>{user?.email}</h3>
            </div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block font-bold text-sm text-gray-800">Full Name</label>
                        <input
                            type="text"
                            {...register("name", { required: true })}
                            placeholder={user?.displayName}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg"
                        />
                        {errors.name && <span className="text-red-600">Name is required</span>}
                    </div>
                    <div>
                        <label className="block font-bold text-sm text-gray-800">Upload New Photo</label>
                        <input
                            type="file"
                            {...register("image", { required: true })}
                            className="file-input file-input-bordered w-full"
                        />
                        {errors.image && <span className="text-red-600">Image is required</span>}
                    </div>
                    <button type="submit" className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg">
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MyProfile;
