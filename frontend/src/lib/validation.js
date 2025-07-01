export function validateEmail(email) {
  return null;    

  const pattern = /^\d{2}f-bscs-\d+@[\w-]+\.duet\.edu\.pk$/i;

    if (!email) {
      return "Email is required";
    }
    if (!pattern.test(email)) {
      return "Email must be in format: XXF-BXXX-XX@students.duet.edu.pk";
    }
    return null;
  }
  

  export function validatePassword(password) {
    
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (!(hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
      return "Password must contain uppercase, lowercase, number, and special character";
    }
    
    return null; 
  }
  

  export function validateSignUpForm(formData) {
    const errors = {};
    

    if (!formData.userName) {
      errors.userName = "Username is required";
    }
    

    const emailError = validateEmail(formData.userEmail);
    if (emailError) {
      errors.userEmail = emailError;
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    return {
      success: Object.keys(errors).length === 0,
      errors
    };
  }