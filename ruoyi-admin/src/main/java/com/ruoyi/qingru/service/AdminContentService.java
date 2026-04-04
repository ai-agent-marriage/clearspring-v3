package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.entity.ZenQuote;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 管理后台内容服务类
 */
@Service
@Slf4j
public class AdminContentService {
    private static final Logger logger = LoggerFactory.getLogger(AdminContentService.class);

    // 物种数据（与 SpeciesService 共享数据源）
    private static final Map<Long, Species> SPECIES_MAP = new ConcurrentHashMap<>();
    private static Long nextSpeciesId = 11L;

    static {
        // 初始化示例数据
        SPECIES_MAP.put(1L, new Species(1L, "鲢鱼", "Hypophthalmichthys molitrix", 1, 0, "四大家鱼之一，滤食性鱼类", 1, new Date()));
        SPECIES_MAP.put(2L, new Species(2L, "鳙鱼", "Hypophthalmichthys nobilis", 1, 0, "胖头鱼，滤食性鱼类", 2, new Date()));
        SPECIES_MAP.put(3L, new Species(3L, "草鱼", "Ctenopharyngodon idellus", 1, 0, "草食性鱼类，四大家鱼之一", 3, new Date()));
        SPECIES_MAP.put(4L, new Species(4L, "青鱼", "Mylopharyngodon piceus", 1, 0, "肉食性鱼类，四大家鱼之一", 4, new Date()));
        SPECIES_MAP.put(5L, new Species(5L, "鲫鱼", "Carassius auratus", 1, 0, "常见淡水鱼，适应性强", 5, new Date()));
        SPECIES_MAP.put(6L, new Species(6L, "鲤鱼", "Cyprinus carpio", 1, 0, "传统食用鱼，吉祥象征", 6, new Date()));
        SPECIES_MAP.put(7L, new Species(7L, "巴西龟", "Trachemys scripta elegans", 4, 1, "外来入侵物种，禁止放生", 7, new Date()));
        SPECIES_MAP.put(8L, new Species(8L, "麻雀", "Passer montanus", 2, 0, "常见鸟类，保护动物", 8, new Date()));
        SPECIES_MAP.put(9L, new Species(9L, "鸽子", "Columba livia", 2, 0, "常见鸟类，和平象征", 9, new Date()));
        SPECIES_MAP.put(10L, new Species(10L, "兔子", "Oryctolagus cuniculus", 3, 0, "哺乳动物，繁殖力强", 10, new Date()));
    }

    // 禅理数据
    private static final Map<Long, ZenQuote> ZEN_MAP = new ConcurrentHashMap<>();
    private static Long nextZenId = 11L;

    static {
        // 初始化示例数据
        ZEN_MAP.put(1L, new ZenQuote("应无所住而生其心", "《金刚经》"));
        ZEN_MAP.put(2L, new ZenQuote("一切有为法，如梦幻泡影", "《金刚经》"));
        ZEN_MAP.put(3L, new ZenQuote("色即是空，空即是色", "《心经》"));
        ZEN_MAP.put(4L, new ZenQuote("心无挂碍，无挂碍故", "《心经》"));
        ZEN_MAP.put(5L, new ZenQuote("菩提本无树，明镜亦非台", "慧能"));
        ZEN_MAP.put(6L, new ZenQuote("本来无一物，何处惹尘埃", "慧能"));
        ZEN_MAP.put(7L, new ZenQuote("苦海无边，回头是岸", "佛教谚语"));
        ZEN_MAP.put(8L, new ZenQuote("放下屠刀，立地成佛", "佛教谚语"));
        ZEN_MAP.put(9L, new ZenQuote("诸行无常，诸法无我", "《法句经》"));
        ZEN_MAP.put(10L, new ZenQuote("涅槃寂静", "《法句经》"));
    }

    /**
     * 获取物种列表
     * @param type 类型（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 物种列表
     */
    public List<Species> getSpeciesList(Integer type, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 20;
        }
        
        logger.info("获取物种列表，type={}, pageNum={}, pageSize={}", type, pageNum, pageSize);
        
        List<Species> result = new ArrayList<>(SPECIES_MAP.values());
        
        // 按类型筛选
        if (type != null && type > 0) {
            final Integer filterType = type;
            result = result.stream()
                .filter(s -> s.getType().equals(filterType))
                .toList();
        }
        
        // 按 sort 排序
        result.sort(Comparator.comparing(Species::getSort));
        
        // 分页
        int fromIndex = (pageNum - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, result.size());
        if (fromIndex < result.size()) {
            return result.subList(fromIndex, toIndex);
        } else {
            return new ArrayList<>();
        }
    }

    /**
     * 新增物种
     * @param species 物种信息
     */
    @Transactional
    public void addSpecies(Species species) {
        logger.info("新增物种，name={}, type={}", species.getName(), species.getType());
        
        // 参数校验
        if (species == null || species.getName() == null || species.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("物种名称不能为空");
        }
        
        Long id = nextSpeciesId++;
        species.setId(id);
        species.setCreateTime(new Date());
        if (species.getSort() == null) {
            species.setSort(id.intValue());
        }
        if (species.getType() == null) {
            species.setType(3); // 默认为其他
        }
        if (species.getIsForbid() == null) {
            species.setIsForbid(0); // 默认可投放
        }
        
        SPECIES_MAP.put(id, species);
        logger.info("新增物种成功，id={}, name={}", id, species.getName());
    }

    /**
     * 更新物种
     * @param id 物种 ID
     * @param species 物种信息
     */
    @Transactional
    public void updateSpecies(Long id, Species species) {
        logger.info("更新物种，id={}", id);
        
        Species existing = SPECIES_MAP.get(id);
        if (existing == null) {
            throw new RuntimeException("物种不存在，id=" + id);
        }
        
        // 更新字段
        if (species.getName() != null) {
            existing.setName(species.getName());
        }
        if (species.getScientificName() != null) {
            existing.setScientificName(species.getScientificName());
        }
        if (species.getType() != null) {
            existing.setType(species.getType());
        }
        if (species.getIsForbid() != null) {
            existing.setIsForbid(species.getIsForbid());
        }
        if (species.getRemark() != null) {
            existing.setRemark(species.getRemark());
        }
        if (species.getSort() != null) {
            existing.setSort(species.getSort());
        }
        
        logger.info("更新物种成功，id={}", id);
    }

    /**
     * 删除物种
     * @param id 物种 ID
     */
    @Transactional
    public void deleteSpecies(Long id) {
        logger.info("删除物种，id={}", id);
        
        Species removed = SPECIES_MAP.remove(id);
        if (removed == null) {
            throw new RuntimeException("物种不存在，id=" + id);
        }
        
        logger.info("删除物种成功，id={}, name={}", id, removed.getName());
    }

    /**
     * 获取禅理列表
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 禅理列表
     */
    public List<ZenQuote> getZenList(Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 20;
        }
        
        logger.info("获取禅理列表，pageNum={}, pageSize={}", pageNum, pageSize);
        
        List<ZenQuote> result = new ArrayList<>(ZEN_MAP.values());
        
        // 按 ID 排序
        result.sort(Comparator.comparing(ZenQuote::getId));
        
        // 分页
        int fromIndex = (pageNum - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, result.size());
        if (fromIndex < result.size()) {
            return result.subList(fromIndex, toIndex);
        } else {
            return new ArrayList<>();
        }
    }

    /**
     * 新增禅理
     * @param zenQuote 禅理信息
     */
    @Transactional
    public void addZenQuote(ZenQuote zenQuote) {
        logger.info("新增禅理，content={}, author={}", zenQuote.getContent(), zenQuote.getAuthor());
        
        // 参数校验
        if (zenQuote == null || zenQuote.getContent() == null || zenQuote.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("禅理内容不能为空");
        }
        
        Long id = nextZenId++;
        zenQuote.setId(id);
        
        ZEN_MAP.put(id, zenQuote);
        logger.info("新增禅理成功，id={}, content={}", id, zenQuote.getContent());
    }
}
