from http import HTTPStatus


class NotFound(Exception):
    pass


class BadRequest(Exception):
    pass


class Conflict(Exception):
    pass


class UnAuthorized(Exception):
    pass


def getStatus(e):
    if isinstance(e, BadRequest) or isinstance(e, AttributeError) or isinstance(e, ValueError):
        status = HTTPStatus.BAD_REQUEST.real
    elif isinstance(e, NotFound):
        status = HTTPStatus.NOT_FOUND.real
    elif isinstance(e, Conflict):
        status = HTTPStatus.CONFLICT.real
    elif isinstance(e, UnAuthorized):
        status = HTTPStatus.UNAUTHORIZED.real
    else:
        status = HTTPStatus.INTERNAL_SERVER_ERROR.real
    return status
