export const signUpFormControls= [
    {
      name: "userName",
      label: "User Name",
      placeholder: "Enter your user name",
      type: "text",
      componentType: "input",
    },
    {
      name: "userEmail",
      label: "User Email",
      placeholder: "Enter your user email",
      type: "email",
      componentType: "input",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      componentType: "input",
    },
  ];


  export const signInFormControls = [
    {
      name: "userEmail",
      label: "User Email",
      placeholder: "Enter your user email",
      type: "email",
      componentType: "input",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      type: "password",
      componentType: "input",
    },
  ];
  
  export const initialSignInFormData = {
    userEmail: "",
    password: "",
  };
  
  export const initialSignUpFormData = {
    userName: "",
    userEmail: "",
    password: "",
  };



  export const languageOptions = [
    { id: "english", label: "English" },
    { id: "spanish", label: "Spanish" },
    { id: "french", label: "French" },
    { id: "german", label: "German" },
    { id: "chinese", label: "Chinese" },
    { id: "japanese", label: "Japanese" },
    { id: "korean", label: "Korean" },
    { id: "portuguese", label: "Portuguese" },
    { id: "arabic", label: "Arabic" },
    { id: "russian", label: "Russian" },
  ];
  
  export const courseLevelOptions = [
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
  ];
  
  export const courseCategories = [
    { id: "web development", label: "Web Development" },
    { id: "backend development", label: "Backend Development" },
    { id: "data science", label: "Data Science" },
    { id: "machine learning", label: "Machine Learning" },
    { id: "artificial intelligence", label: "Artificial Intelligence" },
    { id: "cloud computing", label: "Cloud Computing" },
    { id: "cyber security", label: "Cyber Security" },
    { id: "mobile development", label: "Mobile Development" },
    { id: "game development", label: "Game Development" },
    { id: "software engineering", label: "Software Engineering" },
  ];
  
  export const courseLandingPageFormControls = [
    {
      name: "title",
      label: "Title",
      componentType: "input",
      type: "text",
      placeholder: "Enter course title",
    },
    {
      name: "category",
      label: "Category",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: courseCategories,
    },
    {
      name: "level",
      label: "Level",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: courseLevelOptions,
    },
    {
      name: "primaryLanguage",
      label: "Primary Language",
      componentType: "select",
      type: "text",
      placeholder: "",
      options: languageOptions,
    },
    {
      name: "subtitle",
      label: "Subtitle",
      componentType: "input",
      type: "text",
      placeholder: "Enter course subtitle",
    },
    {
      name: "description",
      label: "Description",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter course description",
    },
    {
      name: "pricing",
      label: "Pricing",
      componentType: "input",
      type: "number",
      placeholder: "Enter course pricing",
    },
    {
      name: "objectives",
      label: "Objectives",
      componentType: "textarea",
      type: "text",
      placeholder: "Enter course objectives",
    },
    {
      name: "welcomeMessage",
      label: "Welcome Message",
      componentType: "textarea",
      placeholder: "Welcome message for students",
    },
  ];

  export const courseLandingInitialFormData = {
    title: "",
    category: "",
    level: "",
    primaryLanguage: "",
    subtitle: "",
    description: "",
    pricing:"",
    objectives: "",
    welcomeMessage: "",
    image:""
  }



  export const courseCurriculumInitialFormData= [
    {
      title: "",
      videoUrl: "",
      freePreview: false,
      public_id: "",
    },
  ];
  
export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];
  
  export const filterOptions = {
    category: courseCategories,
    level: courseLevelOptions,
    primaryLanguage: languageOptions,
  };

  export const courses = [
    {
      _id: "course1",
      image: "https://cdn.prod.website-files.com/6344c9cef89d6f2270a38908/673f2a3b44c1ed4901bb43bb_6386328bea96dffacc89946b_d1.webp",
      pricing: 99,
      title: "Full Stack Web Development",
      instructorName: "Sarah Johnson",
    },
    {
      _id: "course2",
      image: "https://media.assettype.com/analyticsinsight%2Fimport%2Fwp-content%2Fuploads%2F2021%2F08%2FData-Analytics-vs-Data-Science-vs-Machine-Learning.jpg",
      pricing: 120,
      title: "Data Science & Machine Learning",
      instructorName: "Michael Smith",
    },
    {
      _id: "course3",
      image: "https://images.squarespace-cdn.com/content/v1/5f45756b1ed6f34a69dd9c81/8bd6d7b4-f837-44e3-b27e-93538b6fd6aa/branding+and+graphic+design.jpg",
      pricing: 79,
      title: "Graphic Design Masterclass",
      instructorName: "Emily Davis",
    },
    {
      _id: "course4",
      image: "https://admin.wac.co/uploads/Features_Of_Python_1_f4ccd6d9f7.jpg",
      pricing: 89,
      title: "Python Programming Bootcamp",
      instructorName: "James Williams",
    },
  ];
  

export const studentViewCourseDetail = {
    title: "Introduction to React Programming",
    subtitle: "Learn React from scratch and build modern web applications",
    instructorName: "John Doe",
    date: "2023-05-15T00:00:00Z",
    primaryLanguage: "English",
    students: Array(125).fill({}),
    objectives: "Build modern React applications,Understand React hooks and components,State management with Context API,Routing with React Router",
    description: "This comprehensive React course will take you from beginner to advanced level. You'll learn all the fundamental concepts of React including JSX, components, state management, hooks, and more. By the end of the course, you'll be able to build professional-grade React applications.",
    curriculum: [
      { title: "Introduction to React", freePreview: true, videoUrl: "https://example.com/video1.mp4" },
      { title: "Setting Up Your Development Environment", freePreview: false },
      { title: "JSX Fundamentals", freePreview: true, videoUrl: "https://example.com/video2.mp4" },
      { title: "Components and Props", freePreview: false },
      { title: "State and Lifecycle Methods", freePreview: false }
    ],
    pricing: "49.99"
  };