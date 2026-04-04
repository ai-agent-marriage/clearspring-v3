package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Species;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 物种服务类
 * 提供物种信息查询
 */
@Service
public class SpeciesService {

    private static final List<Species> SPECIES_LIST = Arrays.asList(
        new Species(1L, "鲢鱼", "Hypophthalmichthys molitrix", 1, 0, "四大家鱼之一，滤食性鱼类"),
        new Species(2L, "鳙鱼", "Hypophthalmichthys nobilis", 1, 0, "胖头鱼，滤食性鱼类"),
        new Species(3L, "草鱼", "Ctenopharyngodon idellus", 1, 0, "草食性鱼类，四大家鱼之一"),
        new Species(4L, "青鱼", "Mylopharyngodon piceus", 1, 0, "肉食性鱼类，四大家鱼之一"),
        new Species(5L, "鲫鱼", "Carassius auratus", 1, 0, "常见淡水鱼，适应性强"),
        new Species(6L, "鲤鱼", "Cyprinus carpio", 1, 0, "传统食用鱼，吉祥象征"),
        new Species(7L, "巴西龟", "Trachemys scripta elegans", 4, 1, "外来入侵物种，禁止放生"),
        new Species(8L, "麻雀", "Passer montanus", 2, 0, "常见鸟类，保护动物"),
        new Species(9L, "鸽子", "Columba livia", 2, 0, "常见鸟类，和平象征"),
        new Species(10L, "兔子", "Oryctolagus cuniculus", 3, 0, "哺乳动物，繁殖力强")
    );

    /**
     * 获取物种列表
     * @param type 类型（可选）
     * @param keyword 关键词（可选）
     * @return 物种列表
     */
    public List<Species> getSpeciesList(Integer type, String keyword) {
        List<Species> result = new ArrayList<>(SPECIES_LIST);
        
        // 按类型筛选
        if (type != null && type > 0) {
            result = result.stream()
                .filter(s -> s.getType().equals(type))
                .collect(Collectors.toList());
        }
        
        // 按关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.toLowerCase();
            result = result.stream()
                .filter(s -> s.getName().contains(keyword) || 
                            s.getScientificName().toLowerCase().contains(kw))
                .collect(Collectors.toList());
        }
        
        return result;
    }

    /**
     * 获取物种详情
     * @param id 物种 ID
     * @return 物种对象
     */
    public Species getSpeciesDetail(Long id) {
        return SPECIES_LIST.stream()
            .filter(s -> s.getId().equals(id))
            .findFirst()
            .orElse(null);
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
