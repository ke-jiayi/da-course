// AI服务配置
const AI_WORKER_URL = 'https://ai-proxy-worker.<your-account>.workers.dev'; // 替换为实际的Worker URL

// 发送AI请求
export async function sendAIRequest(messages: any[]) {
  try {
    const response = await fetch(AI_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    });

    if (!response.ok) {
      throw new Error('AI请求失败');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI请求错误:', error);
    throw error;
  }
}

// 发送代码纠错请求
export async function getCodeCorrection(code: string, errorMessage: string) {
  const messages = [
    {
      role: 'user',
      content: `我的代码报错了，请帮我分析错误原因：\n\n代码：\n\`\`\`python\n${code}\n\`\`\`\n\n错误信息：\n${errorMessage}`
    }
  ];

  return sendAIRequest(messages);
}

// 发送思路点拨请求
export async function getHint(question: string) {
  const messages = [
    {
      role: 'user',
      content: `我在做数据分析项目时遇到了问题，请给我一些思路点拨：\n\n问题：${question}`
    }
  ];

  return sendAIRequest(messages);
}
