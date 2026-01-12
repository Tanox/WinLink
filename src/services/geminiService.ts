import { AiAnalysisResult } from '../types';
import { analysisHistoryService } from './analysisHistoryService';

/**
 * 分析应用程序文件夹的安全性
 * @param folderPath 应用程序文件夹路径
 * @param folderName 应用程序文件夹名称
 * @param useCache 是否使用缓存的分析结果
 * @returns AI 分析结果
 */
export const analyzeFolderSafety = async (
  folderPath: string,
  folderName: string,
  useCache: boolean = true
): Promise<AiAnalysisResult> => {
  // 检查是否有缓存的分析结果
  if (useCache) {
    const recentAnalysis = analysisHistoryService.getRecentAnalysis(folderPath);
    if (recentAnalysis && analysisHistoryService.hasValidAnalysis(folderPath)) {
      return recentAnalysis.analysis;
    }
  }

  // 使用离线分析功能
  const analysisResult = getOfflineAnalysis(folderPath, folderName);

  // 计算安全评分（0-100）
  let safetyScore = 70; // 默认评分
  if (analysisResult.riskLevel === 'low') {
    safetyScore = 90;
  } else if (analysisResult.riskLevel === 'medium') {
    safetyScore = 60;
  } else if (analysisResult.riskLevel === 'high') {
    safetyScore = 30;
  }

  // 保存到历史记录
  analysisHistoryService.addAnalysis(folderPath, folderName, analysisResult, safetyScore);

  return analysisResult;
};

/**
 * 批量分析多个应用程序文件夹的安全性
 * @param folders 文件夹信息数组
 * @param onProgress 进度回调函数
 * @returns AI 分析结果数组
 */
export const batchAnalyzeFolderSafety = async (
  folders: Array<{ id: string; name: string; path: string }>,
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<Array<{ id: string; analysis: AiAnalysisResult }>> => {
  const analysisPromises = folders.map(async (folder, index) => {
    const analysis = await analyzeFolderSafety(folder.path, folder.name);
    
    // 调用进度回调
    if (onProgress) {
      const progress = Math.round(((index + 1) / folders.length) * 100);
      onProgress(progress, index + 1, folders.length);
    }
    
    return { id: folder.id, analysis };
  });

  return Promise.all(analysisPromises);
};

/**
 * 获取分析历史
 * @param folderPath 文件夹路径（可选）
 * @returns 分析历史记录
 */
export const getAnalysisHistory = (
  folderPath?: string
): Array<{ folderPath: string; folderName: string; analysis: AiAnalysisResult; timestamp: string; safetyScore: number }> => {
  return analysisHistoryService.getHistory(folderPath);
};

/**
 * 清除分析历史
 * @param folderPath 文件夹路径（可选，不提供则清除所有）
 */
export const clearAnalysisHistory = (
  folderPath?: string
): void => {
  analysisHistoryService.clearHistory(folderPath);
};

/**
 * 获取离线分析结果（基于本地规则）
 * @param folderPath 应用程序文件夹路径
 * @param folderName 应用程序文件夹名称
 * @returns 离线分析结果
 */
export const getOfflineAnalysis = (
  folderPath: string,
  folderName: string
): AiAnalysisResult => {
  // 基于本地规则的简单分析
  const systemFolders = [
    'Windows',
    'System32',
    'SysWOW64',
    'Program Files',
    'Program Files (x86)',
    'AppData\\Local\\Microsoft',
    'AppData\\Roaming\\Microsoft'
  ];

  const isSystemFolder = systemFolders.some(systemFolder => 
    folderPath.toLowerCase().includes(systemFolder.toLowerCase())
  );

  if (isSystemFolder) {
    return {
      riskLevel: 'high',
      confidence: 0.8,
      recommendations: [
        '不建议迁移系统文件夹',
        '系统文件夹迁移可能导致系统不稳定',
        '如果必须迁移，请先创建完整备份'
      ],
      warnings: [
        '该文件夹可能包含系统关键文件',
        '迁移后可能导致系统服务无法正常运行',
        '可能包含硬编码路径'
      ],
      safeToMove: false
    };
  }

  // 基于文件夹名称的简单分析
  const highRiskKeywords = ['system', 'windows', 'microsoft', 'service', 'driver'];
  const mediumRiskKeywords = ['program', 'appdata', 'local', 'roaming'];

  const folderLower = folderName.toLowerCase();
  const pathLower = folderPath.toLowerCase();

  for (const keyword of highRiskKeywords) {
    if (folderLower.includes(keyword) || pathLower.includes(keyword)) {
      return {
        riskLevel: 'high',
        confidence: 0.7,
        recommendations: [
          '不建议迁移此文件夹',
          '可能包含系统关键文件',
          '迁移前请创建完整备份'
        ],
        warnings: [
          '该文件夹可能包含系统相关文件',
          '迁移后可能导致应用程序无法正常运行'
        ],
        safeToMove: false
      };
    }
  }

  for (const keyword of mediumRiskKeywords) {
    if (folderLower.includes(keyword) || pathLower.includes(keyword)) {
      return {
        riskLevel: 'medium',
        confidence: 0.6,
        recommendations: [
          '迁移前请创建备份',
          '确保应用程序支持文件夹迁移',
          '迁移后测试应用程序是否正常运行'
        ],
        warnings: [
          '该文件夹可能包含应用程序配置文件',
          '迁移后可能需要重新配置应用程序'
        ],
        safeToMove: true
      };
    }
  }

  // 默认低风险结果
  return {
    riskLevel: 'low',
    confidence: 0.5,
    recommendations: [
      '可以安全迁移此文件夹',
      '迁移前创建备份',
      '迁移后测试应用程序是否正常运行'
    ],
    warnings: [],
    safeToMove: true
  };
};
