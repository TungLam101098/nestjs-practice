export default {
  ERROR: {
    PATH_NOT_FOUND: {
      CODE: 404,
      MESSAGE: 'The request not found',
    },
    INTERNAL_SERVER: {
      CODE: 500,
      MESSAGE: 'Something went wrong',
    },
    BAD_REQUEST: {
      CODE: 400,
      MESSAGE: 'Bad request',
    },
    USERNAME_EXISTS: {
      CODE: 409,
      MESSAGE: 'Username is existed',
    },
    SERVICE_UNAVAILABLE: {
      CODE: 503,
      MESSAGE: 'Service unavailable',
    },
    USERNAME_NO_EXISTS: {
      CODE: 404,
      MESSAGE: 'Username does not exist',
    },
    INVALID_PASSWORD: {
      CODE: 401,
      MESSAGE: 'Invalid password',
    },
    PERMISSION_DENIED: {
      CODE: 403,
      MESSAGE: 'Permission denied',
    },
    COURSES_NAME_EXISTS: {
      CODE: 409,
      MESSAGE: 'Course name is existed',
    },
    NON_AUTHORIZATION: {
      CODE: 401,
      MESSAGE: 'Unauthorized',
    },
  },
};
