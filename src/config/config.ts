export default {
    SECRET    : process.env.JWT_SECRET || 'somesecrettoken',
    PORT         : process.env.PORT || 3500,
    DB: {
        URI      : process.env.MONGODB_URI || `mongodb://localhost/motos-api`,
        USER     : process.env.MONGODB_USER,
        PASSWORD : process.env.MONGODB_PASSWORD
    } 
        


}