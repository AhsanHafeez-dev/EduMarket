"use client"

import CommonForm from "@/components/common-form/Common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { useAuthContext } from "@/context/auth-context";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {validateSignUpForm} from "@/lib/validation"
import { toast } from "react-hot-toast";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useAuthContext();

  function handleTabChange(value) {
    setActiveTab(value);
    setFormErrors({});
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  async function handleSignIn(event) {
    setIsSubmitting(true);
    try {
      await handleLoginUser(event);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignUp(event) {
    event.preventDefault();
    setIsSubmitting(true);
    
    const validationResult = validateSignUpForm(signUpFormData);
    
    if (!validationResult.success) {
      setFormErrors(validationResult.errors);
      
      const firstErrorField = Object.keys(validationResult.errors)[0];
      if (firstErrorField) {
        toast.error("Error signing up please check your email or password");
      }
      
      setIsSubmitting(false);
      return;
    }
    
    setFormErrors({});
    
    try {
      await handleRegisterUser(event);
      setActiveTab("signin");
    } finally {
      setIsSubmitting(false);
    }
  }

  const enhancedSignUpControls = signUpFormControls.map(control => ({
    ...control,
    error: formErrors[control.name]
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <div className="flex items-center justify-center min-h-screen bg-[#060f1d]">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2 -mt-10 mb-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-8 space-y-4 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Sign in to your account</CardTitle>
                <CardDescription className="text-gray-700">
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={isSubmitting ? "Signing In..." : "Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid() || isSubmitting}
                  handleSubmit={handleSignIn}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Create a new account</CardTitle>
                <CardDescription className="text-gray-700">
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={enhancedSignUpControls}
                  buttonText={isSubmitting ? "Signing Up..." : "Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid() || isSubmitting}
                  handleSubmit={handleSignUp}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;