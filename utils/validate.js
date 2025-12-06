const validateUserDetails = async (userName, userEmail, password, role) => {

    console.log( "validates "+(userEmail && userName && password && role) );
    return (userEmail && userName && password && role);
}
export { validateUserDetails };