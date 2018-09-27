# -*- coding: utf8 -*-
import json
import copy
import hashlib
try:
    from frame import logger
except:
    import logging as logger
from decimal import Decimal
from datetime import datetime, date
from django.http import HttpResponse
from django.utils.six.moves.urllib import parse as urlparse

from pyutil.program.fmtutil import fmt_exception
from pyutil.program.python import map_dict


class MyJsonEncoder(json.JSONEncoder):
    def encode(self, obj):
        obj = map_dict(obj, func=lambda k, v, pkeys: (k, v), atom_op=bigint2str)
        return json.JSONEncoder.encode(self, obj)


INTEGER_TYPES = (int, long)


def bigint2str(obj, pkeys=None):
    if not isinstance(obj, bool) and isinstance(obj, INTEGER_TYPES):
        if type(obj) not in INTEGER_TYPES:
            # from simplejson, do not trust custom str/repr, see https://github.com/simplejson/simplejson/issues/118
            obj = int(obj)
        if (-1 << 53) < obj < (1 << 53):
            return obj
        return str(obj)
    return obj


def json_default(obj):
    if isinstance(obj, datetime):
        return obj.strftime('%Y-%m-%d %H:%M:%S')
    elif isinstance(obj, date):
        return obj.strftime('%Y-%m-%d')
    elif isinstance(obj, Decimal):
        return float(obj)
    else:
        obj_dict = copy.copy(obj.__dict__)
        if '_sa_instance_state' in obj_dict:
            del obj_dict['_sa_instance_state']
        return obj_dict


def replace_query_param(url, key, val):
    """
    Given a URL and a key/val pair, set or replace an item in the query
    parameters of the URL, and return the new URL.
    """
    (scheme, netloc, path, query, fragment) = urlparse.urlsplit(url)
    query_dict = urlparse.parse_qs(query, keep_blank_values=True)
    query_dict[key] = [val]
    query = urlparse.urlencode(sorted(list(query_dict.items())), doseq=True)
    return urlparse.urlunsplit((scheme, netloc, path, query, fragment))


def normalized_pageinated(request):
    req = request.GET
    page = int(req.get('page', 1) or 1)
    per_page = int(req.get('per_page', 100) or 100)
    per_page = min([per_page, 2000])
    page = max([page, 1])
    return page, per_page


def get_paginated_response(request, content, total_cnt):
    page, per_page = normalized_pageinated(request)

    def get_prev_url():
        url = request.build_absolute_uri()
        if page > 1:
            return replace_query_param(url, 'page', page - 1)
        return None

    def get_next_url():
        url = request.build_absolute_uri()
        if page * per_page < total_cnt:
            return replace_query_param(url, 'page', page + 1)
        return None

    prev_url = get_prev_url()
    next_url = get_next_url()

    if next_url is not None and prev_url is not None:
        link = '<{next_url}>; rel="next", <{prev_url}>; rel="prev"'
    elif next_url is not None:
        link = '<{next_url}>; rel="next"'
    elif prev_url is not None:
        link = '<{prev_url}>; rel="prev"'
    else:
        link = ''

    link = link.format(next_url=next_url, prev_url=prev_url)
    response = get_json_response(request, content)
    response['Link'] = link
    response['X-Total-Count'] = total_cnt
    return response


def get_json_response(request, content, *args, **kwargs):
    jsonp_callback = request.GET.get('callback')
    if jsonp_callback:
        json_ = "%s(%s)" % (jsonp_callback, json.dumps(content, default=json_default, cls=MyJsonEncoder))
    else:
        json_ = json.dumps(content, default=json_default, cls=MyJsonEncoder)
    response = HttpResponse(json_, 'application/json', *args, **kwargs)
    return response


def catch_exception(fn):
    def wrapped(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            logger.exception(fmt_exception(e))

    wrapped.__name__ = fn.__name__
    return wrapped


def get_signature(access_secret, timestamp, nonce):
    _list = [access_secret, timestamp, nonce]
    _list.sort()
    return hashlib.sha1(''.join(_list)).hexdigest()


def get_header_value(key, request=None):
    key = key.replace('-', '_')
    return request.META.get('HTTP_%s' % key.upper())


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
