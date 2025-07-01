"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormContols from "@/components/common-form/form-controls"
import { courseLandingPageFormControls } from '@/config';
import { useInstructorContext } from '@/context/instructor-context';

function CourseLanding() {

  const {courseLandingFormData, setCourseLandingFormData} = useInstructorContext()

  return (
    <Card className="">
    <CardHeader>
      <CardTitle>Course Landing Page</CardTitle>
    </CardHeader>
    <CardContent>
      <FormContols
        formControls={courseLandingPageFormControls}
        formData={courseLandingFormData}
        setFormData={setCourseLandingFormData}
      />
    </CardContent>
  </Card>
  )
}

export default CourseLanding