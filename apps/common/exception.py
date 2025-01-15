from fastapi import HTTPException, status


class UserNotFoundException(Exception):
    """Exception class to handle user not found exception

    Args:
        Exception (class): Base class for exceptions in this module
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class InvalidCredentialsException(Exception):
    """Exception class to handle invalid credentials exception

    Args:
        Exception (class): Base class for exceptions in this module
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class CredentialsException(Exception):
    """Exception class to handle credentials exception

    Args:
        Exception (class): Base class for exceptions in this module
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)


class RequestValidationError(HTTPException):
    """Exception class to handle request validation error

    Args:
        HTTPException (class): Base class for exceptions in this module
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=self.message)


class ValidationErrorException(HTTPException):
    """Exception class to handle validation error exception for pydantic models

    Args:
        HTTPException (class): Base class for exceptions in this module
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=self.message)
