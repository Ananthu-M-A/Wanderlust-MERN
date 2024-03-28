import { useFormContext } from "react-hook-form";
import React, { useState } from "react";
import { HotelFormData } from "../../../../types/types";

const ImagesSection = () => {
  const { register, formState: { errors }, watch, setValue } = useFormContext<HotelFormData>();
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const existingImageUrls = watch("imageUrls");

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, imageUrl: string) => {
    event.preventDefault();
    setValue("imageUrls", existingImageUrls.filter((url) => url !== imageUrl));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);
      const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
      if(imageFiles.length === 0){
        console.log("No valid image files selected");
        return;
      }
      setSelectedImages(imageFiles);
      const selectedImagePreviews = imageFiles.map(file => URL.createObjectURL(file));
      setPreviewImage(selectedImagePreviews);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="border rounded p-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4">
          {previewImage.map((preview, index) => (
            <div key={index} className="relative group">
              <img src={preview} className="min-h-full object-cover" />
              <button
                onClick={() => {
                  const updatedPreviews = [...previewImage];
                  updatedPreviews.splice(index, 1);
                  setPreviewImage(updatedPreviews);
                  const updatedFiles = [...selectedImages];
                  updatedFiles.splice(index, 1);
                  setSelectedImages(updatedFiles);
                }}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
              >
                Delete
              </button>
            </div>
          ))}
          {existingImageUrls && existingImageUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} className="min-h-full object-cover" />
              <button onClick={(event) => handleDelete(event, url)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white">
                Delete
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength = imageFiles.length + (existingImageUrls?.length || 0);
              if (totalLength === 0) {
                return "At least one image should be added";
              }
              if (totalLength > 3) {
                return "Max 3 images can be added";
              }
              return true;
            }
          })}
          onChange={handleImageChange}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">{errors.imageFiles.message}</span>
      )}
    </div>
  );
};

export default ImagesSection;
