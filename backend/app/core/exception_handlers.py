from fastapi import FastAPI
from fastapi import Request

from fastapi.responses import JSONResponse

from app.core.exceptions import BuildMateException


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(BuildMateException)
    async def buildmate_exception_handler(
        request: Request,
        exc: BuildMateException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.message,
                "error_code": exc.error_code,
            },
        )


    # @app.exception_handler(HTTPException)
    # async def http_exception_handler(
    #     request: Request,
    #     exc: HTTPException,
    # ):
    #     return JSONResponse(
    #         status_code=exc.status_code,
    #         content={
    #             "success": False,
    #             "message": exc.detail,
    #             "error_code": "HTTP_ERROR",
    #         },
    #     )


    # @app.exception_handler(RequestValidationError)
    # async def validation_exception_handler(
    #     request: Request,
    #     exc: RequestValidationError,
    # ):
    #     return JSONResponse(
    #         status_code=422,
    #         content={
    #             "success": False,
    #             "message": "Validation failed",
    #             "error_code": "VALIDATION_ERROR",
    #             "errors": exc.errors(),
    #         },
    #     )


    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exc: Exception,
    ):
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_SERVER_ERROR",
            },
        )