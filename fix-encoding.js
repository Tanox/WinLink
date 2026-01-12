import fs from 'fs';
import path from 'path';

// 修复文件编码和行尾序列
function fixFile(filePath) {
  console.log(`修复文件: ${filePath}`);
  try {
    // 读取文件内容，使用 'utf8' 编码
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 转换行尾为 CRLF
    content = content.replace(/\r?\n/g, '\r\n');
    
    // 写入文件，使用 UTF-8 编码（无 BOM）
    fs.writeFileSync(filePath, content, {
      encoding: 'utf8',
      flag: 'w'
    });
    
    console.log('  修复完成');
  } catch (error) {
    console.error(`  修复失败: ${error.message}`);
  }
  console.log('');
}

// 验证文件编码和行尾序列
function verifyFile(filePath) {
  console.log(`验证文件: ${path.basename(filePath)}`);
  try {
    // 检查文件编码（是否有 BOM）
    const buffer = fs.readFileSync(filePath);
    const hasBom = buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
    console.log(`  编码: ${hasBom ? 'UTF-8 with BOM' : 'UTF-8 (正确)'}`);
    
    // 检查行尾序列
    const content = fs.readFileSync(filePath, 'utf8');
    const hasLF = /\n/.test(content);
    const hasCR = /\r/.test(content);
    if (hasLF && !hasCR) {
      console.log('  行尾: LF');
    } else if (hasCR && hasLF) {
      console.log('  行尾: CRLF (正确)');
    } else if (hasCR && !hasLF) {
      console.log('  行尾: CR');
    } else {
      console.log('  行尾: 无');
    }
  } catch (error) {
    console.error(`  验证失败: ${error.message}`);
  }
  console.log('');
}

// 主函数
function main() {
  // 直接使用相对路径
  const openspecDir = './openspec';
  
  // 获取所有 markdown 文件
  const mdFiles = fs.readdirSync(openspecDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(openspecDir, file));
  
  // 修复所有文件
  console.log('=== 修复文件 ===');
  mdFiles.forEach(fixFile);
  
  // 验证修复结果
  console.log('=== 验证结果 ===');
  mdFiles.forEach(verifyFile);
  
  console.log('=== 完成 ===');
}

// 运行主函数
main();
