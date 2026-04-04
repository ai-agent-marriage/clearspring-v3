package com.ruoyi.qingru.config;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import com.ruoyi.common.constant.HttpStatus;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.text.Convert;
import com.ruoyi.common.exception.DemoModeException;
import com.ruoyi.common.exception.ServiceException;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.html.EscapeUtil;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 全局异常处理器 - 青茹内容管理系统增强版
 * 提供统一的 RESTful 异常处理规范，包含详细的错误码说明和审计日志
 * 
 * @author qingru
 * @version 1.0
 */
@RestControllerAdvice
public class GlobalExceptionHandler
{
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * 构建统一的错误响应
     */
    private Map<String, Object> buildErrorResponse(Integer code, String message, String requestURI, String method)
    {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", LocalDateTime.now().format(FORMATTER));
        error.put("status", code != null ? code : HttpStatus.ERROR);
        error.put("error", getErrorReason(code));
        error.put("message", message);
        error.put("path", requestURI);
        error.put("method", method);
        return error;
    }

    /**
     * 根据错误码获取错误描述
     */
    private String getErrorReason(Integer code)
    {
        if (code == null) return "Internal Server Error";
        return switch (code) {
            case 400 -> "Bad Request";
            case 401 -> "Unauthorized";
            case 403 -> "Forbidden";
            case 404 -> "Not Found";
            case 405 -> "Method Not Allowed";
            case 408 -> "Request Timeout";
            case 429 -> "Too Many Requests";
            case 500 -> "Internal Server Error";
            case 502 -> "Bad Gateway";
            case 503 -> "Service Unavailable";
            default -> "Unknown Error";
        };
    }

    /**
     * 权限校验异常 - 403
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public AjaxResult handleAccessDeniedException(AccessDeniedException e, HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.error("[权限异常] 请求地址'{}', 方法'{}', 错误'{}'", requestURI, method, e.getMessage());
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.FORBIDDEN, 
            "没有权限，请联系管理员授权", requestURI, method);
        logAuditLog("ACCESS_DENIED", requestURI, method, error);
        
        return AjaxResult.error(HttpStatus.FORBIDDEN, "没有权限，请联系管理员授权");
    }

    /**
     * 业务异常 - 统一处理 ServiceException
     */
    @ExceptionHandler(ServiceException.class)
    public AjaxResult handleServiceException(ServiceException e, HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        Integer code = e.getCode();
        
        log.error("[业务异常] 请求地址'{}', 方法'{}', 错误码'{}', 错误'{}'", 
            requestURI, method, code, e.getMessage());
        
        Map<String, Object> error = buildErrorResponse(code, e.getMessage(), requestURI, method);
        logAuditLog("SERVICE_ERROR", requestURI, method, error);
        
        return StringUtils.isNotNull(code) ? AjaxResult.error(code, e.getMessage()) : AjaxResult.error(e.getMessage());
    }

    /**
     * 请求方式不支持 - 405
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public AjaxResult handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e,
            HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.error("[方法不支持] 请求地址'{}', 不支持'{}'请求", requestURI, method);
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.METHOD_NOT_ALLOWED, 
            String.format("不支持'%s'请求方法", e.getMethod()), requestURI, method);
        
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 请求路径中缺少必需的路径变量 - 400
     */
    @ExceptionHandler(MissingPathVariableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AjaxResult handleMissingPathVariableException(MissingPathVariableException e, HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.error("[路径变量缺失] 请求地址'{}', 缺少变量'{}'", requestURI, e.getVariableName());
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.BAD_REQUEST, 
            String.format("请求路径中缺少必需的路径变量 [%s]", e.getVariableName()), requestURI, method);
        
        return AjaxResult.error(String.format("请求路径中缺少必需的路径变量 [%s]", e.getVariableName()));
    }

    /**
     * 请求参数类型不匹配 - 400
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AjaxResult handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, 
            HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        String value = Convert.toStr(e.getValue());
        if (StringUtils.isNotEmpty(value))
        {
            value = EscapeUtil.clean(value);
        }
        log.error("[参数类型不匹配] 请求地址'{}', 参数'{}', 期望类型'{}', 实际值'{}'", 
            requestURI, e.getName(), e.getRequiredType().getName(), value);
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.BAD_REQUEST, 
            String.format("请求参数类型不匹配，参数 [%s] 要求类型为：'%s'，但输入值为：'%s'", 
                e.getName(), e.getRequiredType().getName(), value), requestURI, method);
        
        return AjaxResult.error(String.format("请求参数类型不匹配，参数 [%s] 要求类型为：'%s'，但输入值为：'%s'", 
            e.getName(), e.getRequiredType().getName(), value));
    }

    /**
     * 自定义验证异常 - 400
     */
    @ExceptionHandler(BindException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AjaxResult handleBindException(BindException e)
    {
        log.error("[参数验证失败] 错误信息'{}'", e.getMessage());
        String message = e.getAllErrors().get(0).getDefaultMessage();
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.BAD_REQUEST, message, null, null);
        logAuditLog("VALIDATION_ERROR", null, null, error);
        
        return AjaxResult.error(message);
    }

    /**
     * 自定义验证异常 - 400
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public AjaxResult handleMethodArgumentNotValidException(MethodArgumentNotValidException e)
    {
        log.error("[参数验证失败] 错误信息'{}'", e.getMessage());
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.BAD_REQUEST, message, null, null);
        logAuditLog("VALIDATION_ERROR", null, null, error);
        
        return AjaxResult.error(message);
    }

    /**
     * 演示模式异常 - 403
     */
    @ExceptionHandler(DemoModeException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public AjaxResult handleDemoModeException(DemoModeException e)
    {
        return AjaxResult.error("演示模式，不允许操作");
    }

    /**
     * 拦截未知的运行时异常 - 500
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public AjaxResult handleRuntimeException(RuntimeException e, HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.error("[运行时异常] 请求地址'{}', 方法'{}', 错误'{}'", requestURI, method, e.getMessage(), e);
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 
            "服务器内部错误，请稍后重试", requestURI, method);
        logAuditLog("RUNTIME_ERROR", requestURI, method, error);
        
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 系统异常 - 500
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public AjaxResult handleException(Exception e, HttpServletRequest request)
    {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        log.error("[系统异常] 请求地址'{}', 方法'{}', 错误'{}'", requestURI, method, e.getMessage(), e);
        
        Map<String, Object> error = buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 
            "服务器内部错误，请稍后重试", requestURI, method);
        logAuditLog("SYSTEM_ERROR", requestURI, method, error);
        
        return AjaxResult.error(e.getMessage());
    }

    /**
     * 记录审计日志
     */
    private void logAuditLog(String errorType, String requestURI, String method, Map<String, Object> error)
    {
        log.info("[审计日志] 错误类型'{}', 请求地址'{}', 方法'{}', 错误详情'{}'", 
            errorType, requestURI, method, error);
    }
}
