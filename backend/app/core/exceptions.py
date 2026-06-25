class BuildMateException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int,
        error_code: str,
    ): 
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code


class NotFoundException(BuildMateException):
    def __init__(self, message="Resource not found"):
        super().__init__(
            message=message,
            status_code=404,
            error_code="NOT_FOUND",
        )


class ConflictException(BuildMateException):
    def __init__(self, message):
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
        )


class UnauthorizedException(BuildMateException):
    def __init__(self, message="Unauthorized"):
        super().__init__(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED",
        )


class ValidationException(BuildMateException):
    def __init__(self, message):
        super().__init__(
            message=message,
            status_code=400,
            error_code="VALIDATION_ERROR",
        )

class BadRequestException(BuildMateException):
    def __init__(self, message="Bad request"):
        super().__init__(
            message=message,
            status_code=400,
            error_code="BAD_REQUEST",
        )


class ForbiddenException(BuildMateException):
    def __init__(self, message="Forbidden"):
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN",
        )


class RateLimitException(BuildMateException):
    def __init__(self, message="Too many requests"):
        super().__init__(
            message=message,
            status_code=429,
            error_code="RATE_LIMIT_EXCEEDED",
        )


class DatabaseException(BuildMateException):
    def __init__(self, message="Database operation failed"):
        super().__init__(
            message=message,
            status_code=500,
            error_code="DATABASE_ERROR",
        )