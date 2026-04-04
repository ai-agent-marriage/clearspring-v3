package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Species;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 物种服务类
 * 提供物种信息管理
 */
@Slf4j
@Service
public class SpeciesService {

    // 使用 ConcurrentHashMap 模拟数据库存储
    private static final Map<Long, Species> SPECIES_MAP = new ConcurrentHashMap<>();
    private static Long nextId = 11L;

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

    /**
     * 获取物种列表（支持筛选和分页）
     * @param type 类型（可选）
     * @param isForbid 是否禁止（可选）
     * @param keyword 关键词（可选）
     * @param pageNum 页码（可选，默认 1）
     * @param pageSize 每页数量（可选，默认 10）
     * @return 物种列表
     */
    public List<Species> getSpeciesList(Integer type, Integer isForbid, String keyword, Integer pageNum, Integer pageSize) {
        List<Species> result = new ArrayList<>(SPECIES_MAP.values());
        
        // 按类型筛选
        if (type != null && type > 0) {
            result = result.stream()
                .filter(s -> s.getType().equals(type))
                .collect(Collectors.toList());
        }
        
        // 按是否禁止筛选
        if (isForbid != null) {
            result = result.stream()
                .filter(s -> s.getIsForbid().equals(isForbid))
                .collect(Collectors.toList());
        }
        
        // 按关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            result = result.stream()
                .filter(s -> s.getName().contains(kw) || 
                            s.getScientificName().toLowerCase().contains(kw.toLowerCase()) ||
                            (s.getRemark() != null && s.getRemark().contains(kw)))
                .collect(Collectors.toList());
        }
        
        // 按 sort 排序
        result.sort(Comparator.comparing(Species::getSort));
        
        // 分页
        if (pageNum != null && pageNum > 0 && pageSize != null && pageSize > 0) {
            int fromIndex = (pageNum - 1) * pageSize;
            int toIndex = Math.min(fromIndex + pageSize, result.size());
            if (fromIndex < result.size()) {
                result = result.subList(fromIndex, toIndex);
            } else {
                result = new ArrayList<>();
            }
        }
        
        return result;
    }

    /**
     * 获取物种详情
     * @param id 物种 ID
     * @return 物种对象
     */
    public Species getSpeciesDetail(Long id) {
        return SPECIES_MAP.get(id);
    }

    /**
     * 新增物种
     * @param species 物种信息
     * @return 新增的物种 ID
     */
    @Transactional
    public Long addSpecies(Species species) {
        // 参数校验
        if (species == null || species.getName() == null || species.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("物种名称不能为空");
        }
        
        Long id = nextId++;
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
        log.info("新增物种成功，id: {}, name: {}, type: {}", id, species.getName(), species.getType());
        return id;
    }

    /**
     * 更新物种
     * @param id 物种 ID
     * @param species 物种信息
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateSpecies(Long id, Species species) {
        Species existing = SPECIES_MAP.get(id);
        if (existing == null) {
            log.warn("更新物种失败，物种不存在，id: {}", id);
            return false;
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
        
        log.info("更新物种成功，id: {}", id);
        return true;
    }

    /**
     * 删除物种
     * @param id 物种 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteSpecies(Long id) {
        Species removed = SPECIES_MAP.remove(id);
        if (removed != null) {
            log.info("删除物种成功，id: {}, name: {}", id, removed.getName());
            return true;
        }
        log.warn("删除物种失败，物种不存在，id: {}", id);
        return false;
    }

    /**
     * 获取所有分类
     * @return 分类列表
     */
    public List<Map<String, Object>> getCategories() {
        List<Map<String, Object>> categories = new ArrayList<>();
        categories.add(createCategory(0, "全部"));
        categories.add(createCategory(1, "鱼类"));
        categories.add(createCategory(2, "鸟类"));
        categories.add(createCategory(3, "哺乳类"));
        categories.add(createCategory(4, "爬行类"));
        categories.add(createCategory(5, "两栖类"));
        return categories;
    }

    private Map<String, Object> createCategory(Integer id, String name) {
        Map<String, Object> category = new HashMap<>();
        category.put("id", id);
        category.put("name", name);
        return category;
    }
}
