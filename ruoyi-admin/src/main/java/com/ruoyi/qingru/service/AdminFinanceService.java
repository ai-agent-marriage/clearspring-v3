package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.*;
import java.util.List;

/**
 * 后台财务管理服务接口
 */
public interface AdminFinanceService {
    
    /**
     * 获取财务统计
     * @return 财务统计数据
     */
    FinanceStats getStats();
    
    /**
     * 获取订单财务列表
     * @param status 订单状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 订单财务列表
     */
    List<FinanceOrder> getOrders(Integer status, Integer pageNum, Integer pageSize);
    
    /**
     * 获取结算列表
     * @param status 结算状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 结算列表
     */
    List<FinanceSettlement> getSettlements(Integer status, Integer pageNum, Integer pageSize);
    
    /**
     * 确认结算
     * @param settlementId 结算 ID
     */
    void settle(Long settlementId);
    
    /**
     * 获取发票列表
     * @param status 发票状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 发票列表
     */
    List<Invoice> getInvoices(Integer status, Integer pageNum, Integer pageSize);
    
    /**
     * 更新发票状态
     * @param id 发票 ID
     * @param status 发票状态
     */
    void updateInvoice(Long id, Integer status);
    
    /**
     * 导出财务数据
     * @param type 导出类型 1-Excel 2-CSV
     * @return 导出的文件字节数组
     */
    byte[] exportFinance(Integer type);
    
    /**
     * 获取营收数据
     * @return 营收数据
     */
    RevenueData getRevenue();
}
