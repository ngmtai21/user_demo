exports.loginModel = (username, fieldErr, errorMsg) => {
    return {
        model: {
            data: {
                username: username || '',
                password: ''
            },
            error: {
                fieldError: fieldErr || '',
                message: errorMsg || ''
            }
        }
    }
};

exports.signupModel = () => {
    return {
        model: {

        },
        error: {

        }
    }
}