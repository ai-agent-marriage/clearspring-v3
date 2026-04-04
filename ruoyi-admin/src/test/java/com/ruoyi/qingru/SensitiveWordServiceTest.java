package com.ruoyi.qingru;

import com.ruoyi.qingru.domain.SensitiveWord;
import com.ruoyi.qingru.service.ISensitiveWordService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 敏感词管理服务测试
 * 测试敏感词的增删改查功能
 */
@SpringBootTest
public class SensitiveWordServiceTest {

    @Autowired
    private ISensitiveWordService sensitiveWordService;

    /**
     * 测试获取敏感词列表成功
     */
    @Test
    public void testGetSensitiveWordList_Success() {
        List<SensitiveWord> list = sensitiveWordService.getList(1, 10);
        assertNotNull(list, "敏感词列表不应该为 null");
    }

    /**
     * 测试获取敏感词列表分页正确
     */
    @Test
    public void testGetSensitiveWordList_Pagination() {
        List<SensitiveWord> list1 = sensitiveWordService.getList(1, 5);
        List<SensitiveWord> list2 = sensitiveWordService.getList(2, 5);
        assertNotNull(list1, "第一页列表不应该为 null");
        assertNotNull(list2, "第二页列表不应该为 null");
        assertTrue(list1.size() <= 5, "第一页数量不应该超过 5");
    }

    /**
     * 测试添加敏感词成功
     */
    @Test
    public void testAddSensitiveWord_Success() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("测试敏感词");
        word.setLevel(2);
        word.setType(1);
        word.setRemark("测试备注");
        
        int result = sensitiveWordService.addSensitiveWord(word);
        assertTrue(result > 0, "添加敏感词应该返回成功");
        assertNotNull(word.getId(), "添加成功后应该生成 ID");
    }

    /**
     * 测试添加重复敏感词失败
     */
    @Test
    public void testAddSensitiveWord_Duplicate() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("已存在的敏感词");
        word.setLevel(2);
        
        // 第一次添加
        int result1 = sensitiveWordService.addSensitiveWord(word);
        assertTrue(result1 > 0, "第一次添加应该成功");
        
        // 第二次添加相同词
        SensitiveWord word2 = new SensitiveWord();
        word2.setWord("已存在的敏感词");
        word2.setLevel(1);
        
        // 应该抛出异常或返回失败
        assertThrows(RuntimeException.class, () -> {
            sensitiveWordService.addSensitiveWord(word2);
        }, "添加重复敏感词应该抛出异常");
    }

    /**
     * 测试更新敏感词成功
     */
    @Test
    public void testUpdateSensitiveWord_Success() {
        // 先添加一个敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("待更新的敏感词");
        word.setLevel(1);
        sensitiveWordService.addSensitiveWord(word);
        
        // 更新敏感词
        word.setLevel(3);
        word.setRemark("更新后的备注");
        int result = sensitiveWordService.updateSensitiveWord(word);
        assertTrue(result > 0, "更新敏感词应该返回成功");
    }

    /**
     * 测试删除敏感词成功
     */
    @Test
    public void testDeleteSensitiveWord_Success() {
        // 先添加一个敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("待删除的敏感词");
        word.setLevel(1);
        sensitiveWordService.addSensitiveWord(word);
        
        // 删除敏感词
        int result = sensitiveWordService.deleteSensitiveWordById(word.getId());
        assertTrue(result > 0, "删除敏感词应该返回成功");
    }

    /**
     * 测试批量删除敏感词成功
     */
    @Test
    public void testBatchDeleteSensitiveWord_Success() {
        // 添加多个敏感词
        Long[] ids = new Long[3];
        for (int i = 0; i < 3; i++) {
            SensitiveWord word = new SensitiveWord();
            word.setWord("批量删除测试词" + i);
            word.setLevel(1);
            sensitiveWordService.addSensitiveWord(word);
            ids[i] = word.getId();
        }
        
        // 批量删除
        int result = sensitiveWordService.deleteSensitiveWordByIds(ids);
        assertTrue(result > 0, "批量删除敏感词应该返回成功");
    }

    /**
     * 测试通过 ID 查询敏感词
     */
    @Test
    public void testGetSensitiveWordById() {
        // 先添加一个敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("查询测试词");
        word.setLevel(2);
        sensitiveWordService.addSensitiveWord(word);
        
        // 查询敏感词
        SensitiveWord queriedWord = sensitiveWordService.getSensitiveWordById(word.getId());
        assertNotNull(queriedWord, "查询结果不应该为 null");
        assertEquals("查询测试词", queriedWord.getWord(), "查询到的敏感词应该与添加的一致");
    }

    /**
     * 测试敏感词级别验证
     */
    @Test
    public void testSensitiveWordLevel() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("级别测试词");
        word.setLevel(1); // 低级别
        sensitiveWordService.addSensitiveWord(word);
        
        assertNotNull(word.getLevel(), "敏感词级别不应该为 null");
        assertTrue(word.getLevel() >= 1 && word.getLevel() <= 3, "敏感词级别应该在 1-3 之间");
    }

    /**
     * 测试敏感词类型验证
     */
    @Test
    public void testSensitiveWordType() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("类型测试词");
        word.setType(1); // 文本类型
        word.setLevel(2);
        sensitiveWordService.addSensitiveWord(word);
        
        assertNotNull(word.getType(), "敏感词类型不应该为 null");
    }

    /**
     * 测试搜索敏感词
     */
    @Test
    public void testSearchSensitiveWord() {
        // 添加一个敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("搜索测试关键词");
        word.setLevel(2);
        sensitiveWordService.addSensitiveWord(word);
        
        // 搜索敏感词
        List<SensitiveWord> list = sensitiveWordService.searchSensitiveWord("搜索", 1, 10);
        assertNotNull(list, "搜索结果不应该为 null");
        assertTrue(list.size() > 0, "应该搜索到至少一个结果");
    }
}
