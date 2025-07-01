"use client"

import MediaProgressBar from "@/components/shared/MediaProgessBar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { IoMdCloudUpload } from "react-icons/io";


function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructorContext();

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Card className="bg-[#101d38]">
      <CardHeader>
        <CardTitle className="text-text text-lg font-semibold">Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div class="rounded-md border border-indigo-500 bg-gray-50 p-0.75 shadow-md w-44">
                    <label htmlFor="upload" className="flex flex-row items-center gap-2 cursor-pointer">
                     <IoMdCloudUpload size={32} className="text-blue-500"/>
                      <span class="text-gray-600 font-medium">Upload file</span>
                    </label>
                     <input
                      className="hidden"
                      onChange={handleImageUploadChange}
                      type="file"
                      accept="image/*"
                      id="upload"
                    ></input>
                </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
