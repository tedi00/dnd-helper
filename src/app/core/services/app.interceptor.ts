import {HttpInterceptorFn} from "@angular/common/http";
import {Injectable} from "@angular/core";

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  let request = req.clone({
    setHeaders: {
      'No-Auth': 'True',
    }
  });
  return next(request);
};
