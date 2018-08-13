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

exports.signupModel = (username, email, fieldErr, errorMsg) => {
    return {
        model: {
            data: {
                username: username || '',
                email: email || '',
            },
            error: {
                fieldError: fieldErr || '',
                message: errorMsg || ''
            }
        }
    }
}