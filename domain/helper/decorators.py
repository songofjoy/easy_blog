# coding=utf8

import functools
from contentutil.djangoutil.utils.exceptions import APIException
from contentutil.djangoutil.utils.decorators import catch_exception

from domain.utils.common import get_json_response
import json

def rest_view(func):
    @catch_exception()
    @functools.wraps(func)
    def _wrapper(request, *args, **kwargs):
        try:
            result = dict(
                code=200,
                message='success',
                data=func(request, *args, **kwargs)
            )
        except Exception as e:
            result = dict(
                code=e.code if isinstance(e, APIException) else 500,
                message=e.message
            )
        return get_json_response(request, result)

    return _wrapper


def axios_post(func):
    """
    接收POST请求
    :param func:
    :return:
    """
    def wrapper(request, *args, **kw):
        post_data = json.loads(request.body)
        return func(request, post_data, *args, **kw)
    return wrapper
